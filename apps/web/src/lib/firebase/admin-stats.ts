import { adminDb } from "@/lib/firebase/admin";
import { AggregateField } from "firebase-admin/firestore";

function serializeFirestoreDoc(doc: FirebaseFirestore.QueryDocumentSnapshot): Record<string, any> {
  const data = doc.data();
  const result: Record<string, any> = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && typeof value.toDate === "function") {
      result[key] = value.toDate().toISOString();
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested: Record<string, any> = {};
      for (const [nk, nv] of Object.entries(value)) {
        if (nv && typeof nv === "object" && typeof (nv as any).toDate === "function") {
          nested[nk] = (nv as any).toDate().toISOString();
        } else {
          nested[nk] = nv;
        }
      }
      result[key] = nested;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export async function getAdminStats() {
  try {
    const [rafflesSnapshot, revenueAgg, recentOrdersSnapshot] = await Promise.all([
      adminDb.collection("raffles").get(),
      adminDb.collection("orders").aggregate({
        totalRevenue: AggregateField.sum("amountTotal"),
      }).get(),
      adminDb.collection("orders")
        .orderBy("createdAt", "desc")
        .limit(20)
        .get(),
    ]);

    const raffles = rafflesSnapshot.docs.map(serializeFirestoreDoc);
    const activeRaffles = rafflesSnapshot.size;
    const totalRevenuePence = revenueAgg.data().totalRevenue as number || 0;
    const recentOrders = recentOrdersSnapshot.docs.map(serializeFirestoreDoc);

    let pendingDraws = 0;
    const winners: any[] = [];

    for (const doc of rafflesSnapshot.docs) {
      const data = doc.data();
      if (data.drawStatus === "pending") {
        pendingDraws++;
      }
      if (data.drawStatus === "completed" && data.winningTicketNumber > 0) {
        winners.push({
          id: doc.id,
          name: data.winnerEmail || "Unknown",
          prize: data.title || doc.id,
          date: data.drawnAt?.toDate?.()?.toLocaleDateString("en-GB") || "Unknown",
          ticket: data.winningTicketNumber,
        });
      }
    }

    return {
      activeRaffles,
      totalRevenuePence,
      pendingDraws,
      recentOrders: recentOrders.slice(0, 10),
      raffles,
      winners,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
