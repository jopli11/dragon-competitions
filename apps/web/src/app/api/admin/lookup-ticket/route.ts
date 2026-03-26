import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

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
 * GET /api/admin/lookup-ticket?raffleSlug=xxx&ticketNumber=123
 *
 * Looks up the owner of a specific ticket number for a raffle.
 * Admin-only — used after a live draw to identify the winner privately.
 */
export async function GET(req: NextRequest) {
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raffleSlug = req.nextUrl.searchParams.get("raffleSlug");
  const ticketNumberStr = req.nextUrl.searchParams.get("ticketNumber");

  if (!raffleSlug || !ticketNumberStr) {
    return NextResponse.json({ error: "Missing raffleSlug or ticketNumber parameter" }, { status: 400 });
  }

  const ticketNumber = parseInt(ticketNumberStr, 10);
  if (isNaN(ticketNumber) || ticketNumber < 1) {
    return NextResponse.json({ error: "Invalid ticket number" }, { status: 400 });
  }

  try {
    // 1. Check individual tickets sub-collection
    const ticketDoc = await adminDb
      .collection("raffles")
      .doc(raffleSlug)
      .collection("tickets")
      .doc(ticketNumber.toString())
      .get();

    if (ticketDoc.exists) {
      const data = ticketDoc.data()!;
      return NextResponse.json({
        found: true,
        ticketNumber,
        email: data.email,
        orderId: data.orderId,
        status: data.status || "valid",
      });
    }

    // 2. Check orders with ticket ranges (for large orders > 100 tickets)
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
      return NextResponse.json({
        found: true,
        ticketNumber,
        email: orderData.email,
        orderId: matchingOrder.id,
        status: orderData.status || "valid",
      });
    }

    return NextResponse.json({
      found: false,
      ticketNumber,
      message: "No owner found for this ticket number",
    });
  } catch (error: any) {
    console.error("Error looking up ticket:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
