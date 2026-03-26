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
 * GET /api/admin/export-tickets?raffleSlug=xxx
 *
 * Returns a plain-text list of valid ticket numbers for a raffle.
 * Used for live draws — ticket numbers only, no PII.
 */
export async function GET(req: NextRequest) {
  const adminEmail = await verifyAdmin(req);
  if (!adminEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raffleSlug = req.nextUrl.searchParams.get("raffleSlug");
  if (!raffleSlug) {
    return NextResponse.json({ error: "Missing raffleSlug parameter" }, { status: 400 });
  }

  try {
    const raffleDoc = await adminDb.collection("raffles").doc(raffleSlug).get();
    if (!raffleDoc.exists) {
      return NextResponse.json({ error: "Raffle not found" }, { status: 404 });
    }

    const raffleData = raffleDoc.data()!;
    const totalTickets = raffleData.ticketsSold || 0;

    if (totalTickets === 0) {
      return NextResponse.json({ error: "No tickets sold for this raffle" }, { status: 400 });
    }

    // Collect all voided/refunded ticket numbers to exclude
    const excludedTickets = new Set<number>();

    // Check individual tickets sub-collection for voided tickets
    const voidedTickets = await adminDb
      .collection("raffles")
      .doc(raffleSlug)
      .collection("tickets")
      .where("status", "==", "voided")
      .get();

    voidedTickets.docs.forEach((doc) => {
      excludedTickets.add(parseInt(doc.id, 10));
    });

    // Check orders for refunded ones and exclude their ticket ranges
    const refundedOrders = await adminDb
      .collection("orders")
      .where("raffleSlug", "==", raffleSlug)
      .get();

    refundedOrders.docs.forEach((doc) => {
      const data = doc.data();
      const isRefunded =
        data.status === "refunded" ||
        data.status === "refunded_oversold" ||
        data.status === "refunded_pass_reuse";

      if (isRefunded && data.ticketRange) {
        for (let i = data.ticketRange.start; i <= data.ticketRange.end; i++) {
          excludedTickets.add(i);
        }
      }
    });

    // Generate the valid ticket list
    const validTickets: number[] = [];
    for (let i = 1; i <= totalTickets; i++) {
      if (!excludedTickets.has(i)) {
        validTickets.push(i);
      }
    }

    const csvContent = validTickets.join("\n");
    const filename = `${raffleSlug}-tickets-${Date.now()}.txt`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting tickets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
