import { NextResponse } from "next/server";
import { fetchRaffleBySlug, getEffectivePrice } from "@/lib/contentful/raffles";
import { adminDb, adminAuth, admin } from "@/lib/firebase/admin";
import { hasCompletedProfile } from "@/lib/firebase/user-profile-admin";
import { sendPurchaseConfirmation } from "@/lib/postmark/client";

class FreeEntryError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

function getFreeEntryClaimId(slug: string, uid: string) {
  return `${slug}__${uid}`;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Invalid token: missing email" },
        { status: 401 },
      );
    }

    // Backwards-compat gate: legacy users created before we collected
    // first/last/mobile must complete their profile before entering so we can
    // contact them if they win. Returns 412 so the client can route to
    // /profile/complete instead of treating it as a hard error.
    if (!(await hasCompletedProfile(decodedToken.uid))) {
      return NextResponse.json(
        {
          error: "Please complete your profile before entering.",
          needsProfile: true,
        },
        { status: 412 },
      );
    }

    const { slug, quantity, quizPassId } = await request.json();

    if (!slug || !quantity || !quizPassId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid ticket quantity" },
        { status: 400 },
      );
    }

    const raffle = await fetchRaffleBySlug(slug);
    if (!raffle || raffle.status !== "live") {
      return NextResponse.json(
        { error: "Raffle not found or not live" },
        { status: 404 },
      );
    }

    const pricing = getEffectivePrice(raffle);
    if (!pricing.isFree) {
      return NextResponse.json(
        { error: "This raffle is not configured for free entry" },
        { status: 400 },
      );
    }

    const freeEntryMaxPerUser = raffle.freeEntryMaxPerUser || 1;
    if (quantity > freeEntryMaxPerUser) {
      return NextResponse.json(
        {
          error: `Free entry is limited to ${freeEntryMaxPerUser} ${
            freeEntryMaxPerUser === 1 ? "ticket" : "tickets"
          } per user.`,
        },
        { status: 400 },
      );
    }

    const invoiceId = crypto.randomUUID();
    const orderRef = adminDb.collection("orders").doc(invoiceId);
    const raffleRef = adminDb.collection("raffles").doc(slug);
    const passRef = adminDb.collection("quizPasses").doc(quizPassId);
    const claimRef = adminDb
      .collection("freeEntryClaims")
      .doc(getFreeEntryClaimId(slug, decodedToken.uid));

    const txResult = await adminDb.runTransaction(async (transaction) => {
      const [raffleDoc, passDoc, claimDoc] = await Promise.all([
        transaction.get(raffleRef),
        transaction.get(passRef),
        transaction.get(claimRef),
      ]);

      if (!passDoc.exists) {
        throw new FreeEntryError("Invalid quiz pass", 403);
      }

      const passData = passDoc.data();
      if (passData?.raffleSlug !== slug || passData?.used) {
        throw new FreeEntryError("Quiz pass already used", 403);
      }

      const expiresAt = passData?.expiresAt?.toDate?.();
      if (!expiresAt || expiresAt < new Date()) {
        throw new FreeEntryError("Quiz pass expired", 403);
      }

      const claimedCount = claimDoc.exists
        ? claimDoc.data()?.claimedCount || 0
        : 0;

      if (claimedCount + quantity > freeEntryMaxPerUser) {
        throw new FreeEntryError(
          `Free entry is limited to ${freeEntryMaxPerUser} ${
            freeEntryMaxPerUser === 1 ? "ticket" : "tickets"
          } per user.`,
          400,
        );
      }

      let ticketsSold = 0;
      let nextTicketNumber = 1;
      if (raffleDoc.exists) {
        const data = raffleDoc.data();
        ticketsSold = data?.ticketsSold || 0;
        nextTicketNumber = data?.nextTicketNumber || 1;
      }

      const maxTickets = raffle.maxTickets || 5000;
      if (ticketsSold + quantity > maxTickets) {
        throw new FreeEntryError(
          "Not enough tickets remaining. Please try a smaller quantity or check back later.",
          400,
        );
      }

      const ticketStart = nextTicketNumber;
      const ticketEnd = nextTicketNumber + quantity - 1;

      const updateData: Record<string, unknown> = {
        nextTicketNumber: ticketEnd + 1,
        ticketsSold: admin.firestore.FieldValue.increment(quantity),
        drawStatus: "pending",
        drawType: raffle.drawType || "auto",
        isReoccurring: !!raffle.isReoccurring,
        maxTickets,
        title: raffle.title || slug,
      };

      if (raffle.endAt && (!raffleDoc.exists || !raffleDoc.data()?.endAt)) {
        updateData.endAt = admin.firestore.Timestamp.fromDate(
          new Date(raffle.endAt),
        );
      }

      transaction.set(raffleRef, updateData, { merge: true });

      transaction.set(orderRef, {
        raffleSlug: slug,
        quizPassId,
        quantity,
        amountPence: 0,
        amountTotal: 0,
        email: userEmail,
        uid: decodedToken.uid,
        ticketRange: { start: ticketStart, end: ticketEnd },
        currency: "GBP",
        status: "completed",
        provider: "free",
        paymentMethod: "free",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      transaction.update(passRef, { used: true });

      transaction.set(
        claimRef,
        {
          raffleSlug: slug,
          uid: decodedToken.uid,
          email: userEmail,
          claimedCount: admin.firestore.FieldValue.increment(quantity),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      if (quantity <= 100) {
        for (let i = ticketStart; i <= ticketEnd; i++) {
          const ticketRef = raffleRef.collection("tickets").doc(i.toString());
          transaction.set(ticketRef, {
            ticketNumber: i,
            orderId: invoiceId,
            email: userEmail,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      } else {
        console.log(
          `Large free-entry order (${quantity} tickets) detected. Skipping individual ticket document creation.`,
        );
      }

      return {
        ticketRange: { start: ticketStart, end: ticketEnd },
      };
    });

    await sendPurchaseConfirmation({
      to: userEmail,
      raffleTitle: raffle.title,
      ticketRange: txResult.ticketRange,
      orderId: invoiceId,
    });

    return NextResponse.json({
      invoiceId,
      status: "completed",
    });
  } catch (error) {
    if (error instanceof FreeEntryError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Error processing free entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
