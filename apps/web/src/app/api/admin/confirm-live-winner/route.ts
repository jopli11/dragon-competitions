import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

async function verifyAdmin(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.split("Bearer ")[1]);
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
 * Independently resolves the true owner of a ticket by querying Firestore.
 * Never trusts client-supplied email — always performs server-side lookup.
 */
async function resolveTicketOwner(
  raffleSlug: string,
  ticketNumber: number
): Promise<{ email: string; orderId: string; status: string } | null> {
  const ticketDoc = await adminDb
    .collection("raffles")
    .doc(raffleSlug)
    .collection("tickets")
    .doc(ticketNumber.toString())
    .get();

  if (ticketDoc.exists) {
    const data = ticketDoc.data()!;
    return { email: data.email, orderId: data.orderId, status: data.status || "valid" };
  }

  const ordersSnapshot = await adminDb
    .collection("orders")
    .where("raffleSlug", "==", raffleSlug)
    .get();

  const matchingOrder = ordersSnapshot.docs.find((doc) => {
    const range = doc.data().ticketRange;
    return range && range.start <= ticketNumber && range.end >= ticketNumber;
  });

  if (matchingOrder) {
    const orderData = matchingOrder.data();
    return { email: orderData.email, orderId: matchingOrder.id, status: orderData.status || "valid" };
  }

  return null;
}

/**
 * POST /api/admin/confirm-live-winner
 *
 * Securely records a live-draw winner in Firestore. All winner data is
 * verified server-side — the client only supplies the raffle slug and
 * winning ticket number. The actual owner email is resolved from Firestore,
 * never trusted from the request body.
 *
 * Body: { raffleSlug, ticketNumber }
 */
export async function POST(req: NextRequest) {
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { raffleSlug, ticketNumber } = body;

  if (!raffleSlug || ticketNumber === undefined || ticketNumber === null) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ticketNum = Number(ticketNumber);
  if (!Number.isInteger(ticketNum) || ticketNum < 1) {
    return NextResponse.json({ error: "Invalid ticket number" }, { status: 400 });
  }

  try {
    // === STEP 1: Validate raffle state ===
    const raffleRef = adminDb.collection("raffles").doc(raffleSlug);
    const raffleDoc = await raffleRef.get();

    if (!raffleDoc.exists) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    const raffleData = raffleDoc.data()!;

    if (raffleData.drawStatus === "completed") {
      return NextResponse.json({ error: "This raffle already has a confirmed winner" }, { status: 409 });
    }

    if (raffleData.drawType !== "live") {
      return NextResponse.json(
        { error: "Only live-draw raffles can have winners confirmed manually" },
        { status: 400 }
      );
    }

    const maxTickets = raffleData.maxTickets || 0;
    const ticketsSold = raffleData.ticketsSold || 0;

    if (ticketsSold < maxTickets) {
      return NextResponse.json(
        { error: "Cannot confirm a winner before all tickets are sold" },
        { status: 400 }
      );
    }

    if (ticketNum > ticketsSold) {
      return NextResponse.json(
        { error: `Ticket #${ticketNum} is outside the valid range (1-${ticketsSold})` },
        { status: 400 }
      );
    }

    // === STEP 2: Server-side ticket ownership verification ===
    const owner = await resolveTicketOwner(raffleSlug, ticketNum);

    if (!owner) {
      return NextResponse.json({ error: "Could not verify ticket ownership" }, { status: 400 });
    }

    if (owner.status === "voided" || owner.status === "refunded") {
      return NextResponse.json(
        { error: "This ticket has been voided or refunded and is not eligible" },
        { status: 400 }
      );
    }

    // Block admins from confirming their own email as the winner
    if (owner.email.toLowerCase() === adminEmail.toLowerCase()) {
      return NextResponse.json(
        { error: "Administrators cannot confirm themselves as winners" },
        { status: 403 }
      );
    }

    // === STEP 3: Atomic transaction to prevent race conditions ===
    await adminDb.runTransaction(async (tx) => {
      const freshRaffleDoc = await tx.get(raffleRef);
      const freshData = freshRaffleDoc.data();

      if (freshData?.drawStatus === "completed") {
        throw new Error("ALREADY_COMPLETED");
      }

      tx.update(raffleRef, {
        drawStatus: "completed",
        winnerEmail: owner.email,
        winningTicketNumber: ticketNum,
        drawnAt: FieldValue.serverTimestamp(),
        drawType: "live",
        title: raffleData.title || raffleSlug,
        confirmedBy: adminEmail,
      });

      // Write a separate audit document for full traceability
      const auditRef = adminDb.collection("draw_audit").doc(`${raffleSlug}_live`);
      tx.set(auditRef, {
        raffleSlug,
        drawType: "live",
        winnerEmail: owner.email,
        winningTicketNumber: ticketNum,
        winnerOrderId: owner.orderId,
        confirmedBy: adminEmail,
        confirmedAt: FieldValue.serverTimestamp(),
        totalTicketsSold: ticketsSold,
        maxTickets,
      });
    });

    console.log(
      `[LIVE DRAW CONFIRMED] Raffle: ${raffleSlug}, Ticket: #${ticketNum}, ` +
      `Winner: ${owner.email}, Confirmed by: ${adminEmail}`
    );

    return NextResponse.json({
      success: true,
      message: `Winner confirmed: ticket #${ticketNum}`,
    });
  } catch (error: any) {
    if (error.message === "ALREADY_COMPLETED") {
      return NextResponse.json({ error: "This raffle already has a confirmed winner" }, { status: 409 });
    }
    console.error("Error confirming live winner:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
