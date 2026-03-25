import { adminDb } from "@/lib/firebase/admin";

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
    // 1. Get Active Raffles count from Firestore
    const rafflesSnapshot = await adminDb.collection("raffles").get();
    const activeRaffles = rafflesSnapshot.size;
    const raffles = rafflesSnapshot.docs.map(serializeFirestoreDoc);

    // 2. Get Total Revenue from Orders
    const ordersSnapshot = await adminDb.collection("orders").get();
    let totalRevenuePence = 0;
    const orders = ordersSnapshot.docs.map(doc => {
      const serialized = serializeFirestoreDoc(doc);
      totalRevenuePence += serialized.amountTotal || 0;
      return serialized;
    });

    // 3. Get Pending Draws
    const pendingDrawsSnapshot = await adminDb
      .collection("raffles")
      .where("drawStatus", "==", "pending")
      .get();
    const pendingDraws = pendingDrawsSnapshot.size;

    // Sort orders by date descending
    const sortedOrders = orders.sort((a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    // 4. Get Winners
    const winners: any[] = [];
    const winnersSnapshot = await adminDb
      .collection("raffles")
      .where("drawStatus", "==", "completed")
      .get();

    winnersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.winningTicketNumber > 0) {
        winners.push({
          id: doc.id,
          name: data.winnerEmail || "Unknown",
          prize: data.title || doc.id,
          date: data.drawnAt?.toDate?.()?.toLocaleDateString("en-GB") || "Unknown",
          ticket: data.winningTicketNumber,
        });
      }
    });

    return {
      activeRaffles,
      totalRevenuePence,
      pendingDraws,
      recentOrders: sortedOrders.slice(0, 10),
      raffles,
      winners,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
