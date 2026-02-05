import { NextResponse } from "next/server";
import { fetchRaffleCorrectAnswer } from "@/lib/contentful/raffles";
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { answerIndex } = await request.json();

    if (typeof answerIndex !== "number") {
      return NextResponse.json(
        { error: "Invalid answer index" },
        { status: 400 }
      );
    }

    // 1. Fetch the correct answer from Contentful (Server-side only)
    const correctAnswerIndex = await fetchRaffleCorrectAnswer(slug);

    if (correctAnswerIndex === null) {
      return NextResponse.json(
        { error: "Raffle not found or question not configured" },
        { status: 404 }
      );
    }

    const isCorrect = answerIndex === correctAnswerIndex;

    if (!isCorrect) {
      return NextResponse.json({ isCorrect: false });
    }

    // 2. If correct, create a short-lived quiz pass in Firestore
    // This pass will be required by the Stripe checkout session creation
    const passRef = adminDb.collection("quizPasses").doc();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await passRef.set({
      raffleSlug: slug,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(expiresAt),
      used: false,
    });

    return NextResponse.json({
      isCorrect: true,
      quizPassId: passRef.id,
    });
  } catch (error) {
    console.error("Error checking answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
