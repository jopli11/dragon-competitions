import { NextResponse } from "next/server";
import { adminDb, adminAuth, admin } from "@/lib/firebase/admin";

type CancelReason = "cancelled" | "declined";

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

    const { invoiceId, reason } = (await request.json()) as {
      invoiceId?: string;
      reason?: CancelReason;
    };

    if (!invoiceId || typeof invoiceId !== "string") {
      return NextResponse.json(
        { error: "Missing invoiceId" },
        { status: 400 }
      );
    }

    const normalisedReason: CancelReason =
      reason === "declined" ? "declined" : "cancelled";

    const orderRef = adminDb.collection("orders").doc(invoiceId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const order = orderDoc.data()!;

    // Only the owner can cancel their own order.
    if (order.uid !== decodedToken.uid) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Only pending orders can be cancelled — never overwrite a terminal status
    // such as "completed", "failed", or a refunded status.
    if (order.status !== "pending") {
      return NextResponse.json({ ok: true, alreadyTerminal: true });
    }

    const newStatus =
      normalisedReason === "declined" ? "declined" : "cancelled";

    await orderRef.update({
      status: newStatus,
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      cancelledReason: normalisedReason,
    });

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (error) {
    console.error("Error cancelling checkout order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
