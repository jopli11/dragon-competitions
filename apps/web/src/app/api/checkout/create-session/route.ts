import { NextResponse } from "next/server";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { adminDb, adminAuth, admin } from "@/lib/firebase/admin";
import {
  getCheckoutAccessToken,
  penceToDnaAmount,
  getTerminalId,
} from "@/lib/dna/client";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Invalid token: missing email" },
        { status: 401 }
      );
    }

    const { slug, quantity, quizPassId } = await request.json();

    if (!slug || !quantity || !quizPassId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid ticket quantity" },
        { status: 400 }
      );
    }

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
        { error: "Quiz pass already used" },
        { status: 403 }
      );
    }

    if (passData?.expiresAt.toDate() < new Date()) {
      return NextResponse.json(
        { error: "Quiz pass expired" },
        { status: 403 }
      );
    }

    const raffle = await fetchRaffleBySlug(slug);
    if (!raffle || raffle.status !== "live") {
      return NextResponse.json(
        { error: "Raffle not found or not live" },
        { status: 404 }
      );
    }

    const raffleRef = adminDb.collection("raffles").doc(slug);
    const raffleDoc = await raffleRef.get();
    const ticketsSold = raffleDoc.exists
      ? raffleDoc.data()?.ticketsSold || 0
      : 0;
    const maxTickets = raffle.maxTickets || 5000;

    if (ticketsSold + quantity > maxTickets) {
      return NextResponse.json(
        {
          error:
            "Not enough tickets remaining. Please try a smaller quantity or check back later.",
        },
        { status: 400 }
      );
    }

    const amountPence = raffle.ticketPricePence * quantity;
    const invoiceId = crypto.randomUUID();

    await adminDb.collection("orders").doc(invoiceId).set({
      raffleSlug: slug,
      quizPassId,
      quantity,
      amountPence,
      email: userEmail,
      uid: decodedToken.uid,
      status: "pending",
      provider: "dna",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const dnaAuth = await getCheckoutAccessToken({ invoiceId, amountPence });

    return NextResponse.json({
      invoiceId,
      amount: penceToDnaAmount(amountPence),
      currency: "GBP",
      terminalId: getTerminalId(),
      auth: {
        access_token: dnaAuth.access_token,
        expires_in: dnaAuth.expires_in,
        scope: dnaAuth.scope,
        token_type: dnaAuth.token_type,
      },
      raffleTitle: raffle.title,
      heroImageUrl: raffle.heroImageUrl || null,
      email: userEmail,
      slug,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
