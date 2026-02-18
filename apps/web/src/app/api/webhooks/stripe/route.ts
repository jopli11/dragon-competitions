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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { raffleSlug, quizPassId, quantity: quantityStr } = session.metadata || {};
    const quantity = parseInt(quantityStr || "0", 10);

    if (!raffleSlug || !quizPassId || quantity <= 0) {
      console.error("Missing metadata in checkout session");
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      // Use a Firestore transaction to allocate ticket numbers and create the order
      await adminDb.runTransaction(async (transaction) => {
        const raffleRef = adminDb.collection("raffles").doc(raffleSlug);
        const raffleDoc = await transaction.get(raffleRef);

        let nextTicketNumber = 1;
        if (raffleDoc.exists) {
          nextTicketNumber = raffleDoc.data()?.nextTicketNumber || 1;
        }

        const ticketStart = nextTicketNumber;
        const ticketEnd = nextTicketNumber + quantity - 1;

        // 1. Update raffle counters
        transaction.set(
          raffleRef,
          {
            nextTicketNumber: ticketEnd + 1,
            ticketsSold: admin.firestore.FieldValue.increment(quantity),
          },
          { merge: true }
        );

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
      });

      // 5. Send confirmation email (outside transaction)
      const [raffle, orderDoc] = await Promise.all([
        fetchRaffleBySlug(raffleSlug),
        adminDb.collection("orders").doc(session.id).get(),
      ]);

      if (raffle && session.customer_details?.email) {
        const orderData = orderDoc.data();
        if (orderData) {
          await sendPurchaseConfirmation({
            to: session.customer_details.email,
            raffleTitle: raffle.title,
            ticketRange: orderData.ticketRange,
            orderId: session.id,
          });
        }
      }

      console.log(`Successfully processed order for raffle ${raffleSlug}`);
    } catch (err: any) {
      console.error(`Transaction failed: ${err.message}`);
      return NextResponse.json({ error: "Transaction failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
