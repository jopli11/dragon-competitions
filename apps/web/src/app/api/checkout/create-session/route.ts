import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { adminDb } from "@/lib/firebase/admin";
import { getRequiredEnv } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const { slug, quantity, quizPassId } = await request.json();

    if (!slug || !quantity || !quizPassId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (quantity < 1 || quantity > 100) {
      return NextResponse.json(
        { error: "Invalid ticket quantity" },
        { status: 400 }
      );
    }

    // 1. Verify the quiz pass in Firestore
    const passRef = adminDb.collection("quizPasses").doc(quizPassId);
    const passDoc = await passRef.get();

    if (!passDoc.exists) {
      return NextResponse.json(
        { error: "Invalid quiz pass" },
        { status: 403 }
      );
    }

    const passData = passDoc.data();
    if (passData?.raffleSlug !== slug || passData?.used) {
      return NextResponse.json(
        { error: "Quiz pass already used or invalid for this raffle" },
        { status: 403 }
      );
    }

    if (passData?.expiresAt.toDate() < new Date()) {
      return NextResponse.json(
        { error: "Quiz pass expired" },
        { status: 403 }
      );
    }

    // 2. Fetch raffle details from Contentful to get the price
    const raffle = await fetchRaffleBySlug(slug);
    if (!raffle || raffle.status !== "live") {
      return NextResponse.json(
        { error: "Raffle not found or not live" },
        { status: 404 }
      );
    }

    // 3. Create Stripe Checkout Session
    const baseUrl = getRequiredEnv("NEXT_PUBLIC_BASE_URL");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Tickets for ${raffle.title}`,
              description: `Skill-based competition entry - ${quantity} ticket(s)`,
              images: raffle.heroImageUrl ? [raffle.heroImageUrl] : [],
            },
            unit_amount: raffle.ticketPricePence,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/raffles/${slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/raffles/${slug}`,
      metadata: {
        raffleSlug: slug,
        quizPassId: quizPassId,
        quantity: quantity.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
