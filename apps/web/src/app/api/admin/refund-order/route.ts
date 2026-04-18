import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, admin } from "@/lib/firebase/admin";
import { refundTransaction } from "@/lib/dna/client";
import { sendRefundConfirmation } from "@/lib/postmark/client";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";

export const dynamic = "force-dynamic";

async function verifyAdmin(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(
      authHeader.split("Bearer ")[1]
    );
    const email = decoded.email;
    if (!email) return null;

    const adminDoc = await adminDb.collection("admin_users").doc(email).get();
    if (!adminDoc.exists || adminDoc.data()?.isAdmin !== true) return null;

    return email;
  } catch {
    return null;
  }
}

/**
 * POST /api/admin/refund-order
 *
 * Refunds a completed order via DNA Payments, voids its tickets,
 * decrements raffle ticketsSold, and emails the customer.
 *
 * Body: { orderId, reason? }
 */
export async function POST(req: NextRequest) {
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { orderId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { orderId, reason } = body;
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderData = orderDoc.data()!;

    if (orderData.status !== "completed") {
      return NextResponse.json(
        { error: `Cannot refund order with status "${orderData.status}"` },
        { status: 400 }
      );
    }

    if (!orderData.dnaTransactionId) {
      return NextResponse.json(
        { error: "Order has no DNA transaction ID — cannot refund" },
        { status: 400 }
      );
    }

    const amountPence: number =
      orderData.amountTotal ?? orderData.amountPence ?? 0;
    const quantity: number = orderData.quantity ?? 0;
    const { raffleSlug, ticketRange, email } = orderData as {
      raffleSlug: string;
      ticketRange?: { start: number; end: number };
      email?: string;
    };

    // 1. Process refund through DNA first. If this fails, we abort
    // before changing any local state.
    const refundResult = await refundTransaction({
      transactionId: orderData.dnaTransactionId,
      amountPence,
      reason: reason || `Admin refund by ${adminEmail}`,
    });

    if (!refundResult.success) {
      return NextResponse.json(
        { error: `DNA refund failed: ${refundResult.message}` },
        { status: 502 }
      );
    }

    // 2. Atomically update order, void tickets, and decrement raffle.ticketsSold
    const start = ticketRange?.start;
    const end = ticketRange?.end;
    const hasIndividualTickets =
      raffleSlug &&
      start !== undefined &&
      end !== undefined &&
      end - start + 1 <= 100;

    await adminDb.runTransaction(async (transaction) => {
      transaction.update(orderRef, {
        status: "refunded",
        refundedAt: admin.firestore.FieldValue.serverTimestamp(),
        refundedBy: adminEmail,
        refundReason: reason || null,
        dnaRefundId: refundResult.id,
      });

      if (raffleSlug && quantity > 0) {
        const raffleRef = adminDb.collection("raffles").doc(raffleSlug);
        transaction.update(raffleRef, {
          ticketsSold: admin.firestore.FieldValue.increment(-quantity),
        });
      }

      if (hasIndividualTickets) {
        for (let i = start!; i <= end!; i++) {
          const ticketRef = adminDb
            .collection("raffles")
            .doc(raffleSlug)
            .collection("tickets")
            .doc(i.toString());
          transaction.update(ticketRef, {
            status: "voided",
            voidedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    });

    // 3. Email confirmation (non-blocking — we don't fail the refund
    // if email sending breaks)
    if (email) {
      try {
        const contentfulRaffle = await fetchRaffleBySlug(raffleSlug);
        await sendRefundConfirmation({
          to: email,
          raffleTitle: contentfulRaffle?.title || raffleSlug,
          ticketRange: ticketRange ?? null,
          orderId,
          amountPence,
          currency: orderData.currency || "GBP",
        });
      } catch (emailErr) {
        console.error(
          "Refund processed, but failed to send confirmation email:",
          emailErr
        );
      }
    }

    console.log(
      `[ADMIN REFUND] Order: ${orderId}, Raffle: ${raffleSlug}, ` +
        `Amount: ${amountPence}p, Refunded by: ${adminEmail}, ` +
        `DNA refund ID: ${refundResult.id}`
    );

    return NextResponse.json({
      success: true,
      message: `Order refunded successfully`,
      orderId,
      dnaRefundId: refundResult.id,
      amountRefundedPence: amountPence,
      ticketsVoided: hasIndividualTickets,
    });
  } catch (error: any) {
    console.error("Error processing admin refund:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
