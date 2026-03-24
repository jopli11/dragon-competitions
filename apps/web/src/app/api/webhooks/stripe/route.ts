import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { adminDb, admin } from "@/lib/firebase/admin";
import { getRequiredEnv } from "@/lib/env";
import Stripe from "stripe";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { sendPurchaseConfirmation } from "@/lib/postmark/client";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getRequiredEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 0. Idempotency Check
  const eventRef = adminDb.collection("processed_events").doc(event.id);
  const eventDoc = await eventRef.get();

  if (eventDoc.exists) {
    console.log(`Duplicate event ${event.id} received, skipping.`);
    return NextResponse.json({ received: true, duplicate: true });
  }

  // Create the event record with status "processing"
  await eventRef.set({
    status: "processing",
    type: event.type,
    receivedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // Audit Log
  await adminDb.collection("webhook_events").add({
    eventId: event.id,
    type: event.type,
    status: "processing",
    receivedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { raffleSlug, quizPassId, quantity: quantityStr } = session.metadata || {};
    const quantity = parseInt(quantityStr || "0", 10);

    if (!raffleSlug || !quizPassId || quantity <= 0) {
      console.error("Missing metadata in checkout session");
      await eventRef.update({ status: "failed", error: "Missing metadata" });
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      // Update event record with metadata
      await eventRef.update({
        metadata: {
          raffleSlug,
          quizPassId,
          quantity,
          sessionId: session.id,
        }
      });

      // Fetch raffle from Contentful to get the endAt date and maxTickets
      const contentfulRaffle = await fetchRaffleBySlug(raffleSlug);
      const maxTickets = contentfulRaffle?.maxTickets || 5000;

      // Use a Firestore transaction to allocate ticket numbers and create the order
      const result = await adminDb.runTransaction(async (transaction) => {
        const raffleRef = adminDb.collection("raffles").doc(raffleSlug);
        const raffleDoc = await transaction.get(raffleRef);

        let ticketsSold = 0;
        let nextTicketNumber = 1;
        if (raffleDoc.exists) {
          const data = raffleDoc.data();
          ticketsSold = data?.ticketsSold || 0;
          nextTicketNumber = data?.nextTicketNumber || 1;
        }

        // Layer 2: Atomic Cap Check
        if (ticketsSold + quantity > maxTickets) {
          return { error: "oversold", maxTickets, ticketsSold };
        }

        const ticketStart = nextTicketNumber;
        const ticketEnd = nextTicketNumber + quantity - 1;

        // 1. Update raffle counters and mirror endAt from Contentful
        const updateData: any = {
          nextTicketNumber: ticketEnd + 1,
          ticketsSold: admin.firestore.FieldValue.increment(quantity),
          drawStatus: "pending", // Ensure it's pending so the draw function finds it
          drawType: contentfulRaffle?.drawType || "auto",
          isReoccurring: !!contentfulRaffle?.isReoccurring,
          maxTickets: maxTickets, // Mirror maxTickets as well
        };

        // Mirror the endAt date if we have it and it's not already set
        if (contentfulRaffle?.endAt && (!raffleDoc.exists || !raffleDoc.data()?.endAt)) {
          updateData.endAt = admin.firestore.Timestamp.fromDate(new Date(contentfulRaffle.endAt));
        }

        transaction.set(raffleRef, updateData, { merge: true });

        // 2. Create the order
        const orderRef = adminDb.collection("orders").doc(session.id);
        transaction.set(orderRef, {
          raffleSlug,
          email: session.customer_details?.email,
          quantity,
          amountTotal: session.amount_total,
          currency: session.currency,
          ticketRange: { start: ticketStart, end: ticketEnd },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          stripePaymentIntentId: session.payment_intent,
          quizPassId,
          status: "completed",
        });

        // 3. Mark quiz pass as used
        const passRef = adminDb.collection("quizPasses").doc(quizPassId);
        transaction.update(passRef, { used: true });

        // 4. Create individual ticket entries (optional, but good for quick lookups)
        for (let i = ticketStart; i <= ticketEnd; i++) {
          const ticketRef = raffleRef.collection("tickets").doc(i.toString());
          transaction.set(ticketRef, {
            ticketNumber: i,
            orderId: session.id,
            email: session.customer_details?.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        return { success: true, ticketRange: { start: ticketStart, end: ticketEnd } };
      });

      // Handle Oversold Case (Layer 3: Auto-Refund)
      if (result.error === "oversold") {
        console.warn(`Raffle ${raffleSlug} oversold! Refunding session ${session.id}.`);
        
        // 1. Trigger Stripe Refund
        if (session.payment_intent) {
          await stripe.refunds.create({
            payment_intent: session.payment_intent as string,
            reason: "requested_by_customer", // Best fit for automated out-of-stock
            metadata: {
              reason: "oversold",
              raffleSlug,
              quantity: quantity.toString(),
            }
          });
        }

        // 2. Update status in Firestore
        await eventRef.update({ status: "oversold_refunded" });
        await adminDb.collection("orders").doc(session.id).set({
          raffleSlug,
          email: session.customer_details?.email,
          quantity,
          amountTotal: session.amount_total,
          status: "refunded_oversold",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ received: true, status: "oversold_refunded" });
      }

      // Update event status to completed
      await eventRef.update({ status: "completed", processedAt: admin.firestore.FieldValue.serverTimestamp() });

      // 5. Send confirmation email (outside transaction)
      if (contentfulRaffle && session.customer_details?.email && result.success) {
        try {
          await sendPurchaseConfirmation({
            to: session.customer_details.email,
            raffleTitle: contentfulRaffle.title,
            ticketRange: result.ticketRange,
            orderId: session.id,
          });
        } catch (emailErr) {
          console.error("Failed to send confirmation email, but tickets were allocated:", emailErr);
        }
      }

      console.log(`Successfully processed order for raffle ${raffleSlug}`);
    } catch (err: any) {
      console.error(`Webhook processing failed: ${err.message}`);
      await eventRef.update({ status: "failed", error: err.message });
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { quizPassId } = session.metadata || {};
    if (quizPassId) {
      // Mark quiz pass as expired/unused if session was never completed
      await adminDb.collection("quizPasses").doc(quizPassId).update({
        status: "expired_checkout",
        expiredAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    await eventRef.update({ status: "completed_expired", sessionId: session.id });
    console.log(`Checkout session ${session.id} expired.`);
  } else if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      // Find the order associated with this payment intent
      const ordersSnapshot = await adminDb
        .collection("orders")
        .where("stripePaymentIntentId", "==", paymentIntentId)
        .limit(1)
        .get();

      if (!ordersSnapshot.empty) {
        const orderDoc = ordersSnapshot.docs[0];
        const orderData = orderDoc.data();
        const raffleSlug = orderData.raffleSlug;
        const { start, end } = orderData.ticketRange || {};

        await adminDb.runTransaction(async (transaction) => {
          // 1. Mark order as refunded
          transaction.update(orderDoc.ref, { status: "refunded", refundedAt: admin.firestore.FieldValue.serverTimestamp() });

          // 2. Void individual tickets
          if (raffleSlug && start !== undefined && end !== undefined) {
            for (let i = start; i <= end; i++) {
              const ticketRef = adminDb.collection("raffles").doc(raffleSlug).collection("tickets").doc(i.toString());
              transaction.update(ticketRef, { status: "voided", voidedAt: admin.firestore.FieldValue.serverTimestamp() });
            }
          }
        });
        console.log(`Order ${orderDoc.id} and its tickets have been voided due to refund.`);
      }
    }
    await eventRef.update({ status: "completed_refunded" });
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    console.warn(`Payment failed for PaymentIntent ${paymentIntent.id}: ${paymentIntent.last_payment_error?.message}`);
    await eventRef.update({ status: "completed_failed", error: paymentIntent.last_payment_error?.message });
  } else {
    // Unhandled event type
    await eventRef.update({ status: "ignored", type: event.type });
  }

  return NextResponse.json({ received: true });
}
