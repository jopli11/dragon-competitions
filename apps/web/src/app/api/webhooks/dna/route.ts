import { NextResponse } from "next/server";
import { adminDb, admin } from "@/lib/firebase/admin";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { sendPurchaseConfirmation } from "@/lib/postmark/client";
import {
  verifyPaymentSignature,
  reverseOrRefund,
  dnaAmountToPence,
  type DnaPaymentResult,
} from "@/lib/dna/client";

export async function POST(request: Request) {
  let result: DnaPaymentResult;

  try {
    result = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!verifyPaymentSignature(result)) {
    console.error(
      `DNA webhook signature verification failed for transaction ${result.id}`
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const transactionId = result.id;
  const { invoiceId } = result;

  if (!transactionId || !invoiceId) {
    return NextResponse.json(
      { error: "Missing id or invoiceId" },
      { status: 400 }
    );
  }

  // Idempotency check
  const eventRef = adminDb.collection("processed_events").doc(transactionId);
  const eventDoc = await eventRef.get();

  if (eventDoc.exists) {
    const data = eventDoc.data();
    if (data?.status !== "processing") {
      console.log(
        `Duplicate event ${transactionId} with terminal status ${data?.status}, skipping.`
      );
      return NextResponse.json({ received: true, duplicate: true });
    }

    const receivedAt = data.receivedAt?.toMillis() || 0;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    if (receivedAt > fiveMinutesAgo) {
      console.log(
        `Event ${transactionId} is still being processed (received < 5 mins ago), skipping.`
      );
      return NextResponse.json({ received: true, processing: true });
    }

    console.log(
      `Event ${transactionId} was stuck in "processing" for > 5 mins, allowing retry.`
    );
  }

  await eventRef.set({
    status: "processing",
    type: result.success ? "payment_success" : "payment_failure",
    receivedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await adminDb.collection("webhook_events").add({
    eventId: transactionId,
    type: result.success ? "payment_success" : "payment_failure",
    status: "processing",
    invoiceId,
    paymentMethod: result.paymentMethod || "unknown",
    receivedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Load the pending order created in create-session
  const orderRef = adminDb.collection("orders").doc(invoiceId);
  const orderDoc = await orderRef.get();

  if (!orderDoc.exists) {
    console.error(`No pending order found for invoiceId ${invoiceId}`);
    await eventRef.update({ status: "failed", error: "No pending order" });
    return NextResponse.json(
      { error: "No pending order found" },
      { status: 400 }
    );
  }

  const pendingOrder = orderDoc.data()!;
  const { raffleSlug, quizPassId, quantity, email } = pendingOrder;

  if (!result.success) {
    await orderRef.update({
      status: "failed",
      dnaTransactionId: transactionId,
      dnaErrorCode: result.errorCode,
      dnaMessage: result.message,
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await eventRef.update({
      status: "completed_failed",
      error: result.message,
    });
    console.warn(
      `Payment failed for invoiceId ${invoiceId}: ${result.message}`
    );
    return NextResponse.json({ received: true, status: "payment_failed" });
  }

  // --- Success path ---
  try {
    await eventRef.update({
      metadata: {
        raffleSlug,
        quizPassId,
        quantity,
        invoiceId,
        dnaTransactionId: transactionId,
      },
    });

    const contentfulRaffle = await fetchRaffleBySlug(raffleSlug);
    const maxTickets = contentfulRaffle?.maxTickets || 5000;

    const txResult = await adminDb.runTransaction(async (transaction) => {
      const raffleRef = adminDb.collection("raffles").doc(raffleSlug);
      const passRef = adminDb.collection("quizPasses").doc(quizPassId);

      const [raffleDoc, passDoc] = await Promise.all([
        transaction.get(raffleRef),
        transaction.get(passRef),
      ]);

      if (!passDoc.exists || passDoc.data()?.used) {
        return { error: "pass_already_used" as const };
      }

      let ticketsSold = 0;
      let nextTicketNumber = 1;
      if (raffleDoc.exists) {
        const data = raffleDoc.data();
        ticketsSold = data?.ticketsSold || 0;
        nextTicketNumber = data?.nextTicketNumber || 1;
      }

      if (ticketsSold + quantity > maxTickets) {
        return {
          error: "oversold" as const,
          maxTickets,
          ticketsSold,
        };
      }

      const ticketStart = nextTicketNumber;
      const ticketEnd = nextTicketNumber + quantity - 1;

      const updateData: Record<string, unknown> = {
        nextTicketNumber: ticketEnd + 1,
        ticketsSold: admin.firestore.FieldValue.increment(quantity),
        drawStatus: "pending",
        drawType: contentfulRaffle?.drawType || "auto",
        isReoccurring: !!contentfulRaffle?.isReoccurring,
        maxTickets,
        title: contentfulRaffle?.title || raffleSlug,
      };

      if (
        contentfulRaffle?.endAt &&
        (!raffleDoc.exists || !raffleDoc.data()?.endAt)
      ) {
        updateData.endAt = admin.firestore.Timestamp.fromDate(
          new Date(contentfulRaffle.endAt)
        );
      }

      transaction.set(raffleRef, updateData, { merge: true });

      transaction.set(
        orderRef,
        {
          ticketRange: { start: ticketStart, end: ticketEnd },
          amountTotal: dnaAmountToPence(result.amount),
          currency: result.currency,
          dnaTransactionId: transactionId,
          paymentMethod: result.paymentMethod || "card",
          cardPanStarred: result.cardPanStarred || null,
          status: "completed",
          completedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      transaction.update(passRef, { used: true });

      if (quantity <= 100) {
        for (let i = ticketStart; i <= ticketEnd; i++) {
          const ticketRef = raffleRef
            .collection("tickets")
            .doc(i.toString());
          transaction.set(ticketRef, {
            ticketNumber: i,
            orderId: invoiceId,
            email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      } else {
        console.log(
          `Large order (${quantity} tickets) detected. Skipping individual ticket document creation.`
        );
      }

      return {
        success: true as const,
        ticketRange: { start: ticketStart, end: ticketEnd },
      };
    });

    // Handle oversold / pass-reuse — reverse or refund the already-authorised DNA txn
    if (
      txResult.error === "oversold" ||
      txResult.error === "pass_already_used"
    ) {
      console.warn(
        `Raffle ${raffleSlug} checkout failed! Reason: ${txResult.error}. Reversing/refunding DNA txn ${transactionId}.`
      );

      try {
        await reverseOrRefund({
          transactionId,
          amountPence: dnaAmountToPence(result.amount),
          reason: txResult.error,
        });
      } catch (refundErr) {
        console.error("DNA reversal/refund also failed:", refundErr);
      }

      const refundStatus =
        txResult.error === "oversold"
          ? "refunded_oversold"
          : "refunded_pass_reuse";

      await eventRef.update({ status: refundStatus });
      await orderRef.update({
        status: refundStatus,
        refundedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ received: true, status: refundStatus });
    }

    await eventRef.update({
      status: "completed",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (contentfulRaffle && email && txResult.success) {
      try {
        await sendPurchaseConfirmation({
          to: email,
          raffleTitle: contentfulRaffle.title,
          ticketRange: txResult.ticketRange,
          orderId: invoiceId,
        });
      } catch (emailErr) {
        console.error(
          "Failed to send confirmation email, but tickets were allocated:",
          emailErr
        );
      }
    }

    console.log(`Successfully processed DNA payment for raffle ${raffleSlug}`);
  } catch (err: any) {
    console.error(`DNA webhook processing failed: ${err.message}`);
    await eventRef.update({ status: "failed", error: err.message });
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
