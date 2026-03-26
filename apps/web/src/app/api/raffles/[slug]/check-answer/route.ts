import { NextResponse } from "next/server";
import { fetchRaffleCorrectAnswer } from "@/lib/contentful/raffles";
import { adminDb, admin } from "@/lib/firebase/admin";
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

    // 0. Rate Limiting (Simple Firestore-based)
    // In a real production app, use Redis or a specialized rate limiter
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    const rateLimitRef = adminDb.collection("rateLimits").doc(`quiz_${slug}_${ip.replace(/\./g, "_")}`);
    const rateLimitDoc = await rateLimitRef.get();
    const now = Date.now();

    if (rateLimitDoc.exists) {
      const data = rateLimitDoc.data();
      if (data?.blockedUntil?.toMillis() > now) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again in 10 minutes." },
          { status: 429 }
        );
      }

      const attempts = data?.attempts || 0;
      const lastAttempt = data?.lastAttempt?.toMillis() || 0;

      // Reset if last attempt was more than 10 mins ago
      if (now - lastAttempt > 10 * 60 * 1000) {
        await rateLimitRef.set({
          attempts: 1,
          lastAttempt: Timestamp.now(),
        });
      } else if (attempts >= 5) {
        // Block for 10 minutes
        const blockedUntil = new Date(now + 10 * 60 * 1000);
        await rateLimitRef.update({
          blockedUntil: Timestamp.fromDate(blockedUntil),
        });
        return NextResponse.json(
          { error: "Too many attempts. Please try again in 10 minutes." },
          { status: 429 }
        );
      } else {
        await rateLimitRef.update({
          attempts: admin.firestore.FieldValue.increment(1),
          lastAttempt: Timestamp.now(),
        });
      }
    } else {
      await rateLimitRef.set({
        attempts: 1,
        lastAttempt: Timestamp.now(),
      });
    }

    // 1. Fetch the correct answer from Contentful (Server-side only)
    const correctAnswerIndex = await fetchRaffleCorrectAnswer(slug);

    if (correctAnswerIndex === null) {
      return NextResponse.json(
        { error: "Raffle not found or question not configured" },
        { status: 404 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`Correct answer check for ${slug}: ${answerIndex} vs ${correctAnswerIndex}`);
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
    } catch (error: any) {
      console.error("Error checking answer:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}
