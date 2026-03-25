import { adminDb } from "@/lib/firebase/admin";

export async function getAdminStats() {
  try {
    // 1. Get Active Raffles count from Firestore
    const rafflesSnapshot = await adminDb.collection("raffles").get();
    const activeRaffles = rafflesSnapshot.size;
    const raffles: any[] = [];
    rafflesSnapshot.forEach(doc => {
      const data = doc.data();
      raffles.push({
        id: doc.id,
        ...data,
        endAt: data.endAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // 2. Get Total Revenue from Orders
    const ordersSnapshot = await adminDb.collection("orders").get();
    let totalRevenuePence = 0;
    const orders: any[] = [];

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
      // amountTotal is already the full order total in pence
      totalRevenuePence += data.amountTotal || 0;
      orders.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      });
    });

    // 3. Get Pending Draws
    const pendingDrawsSnapshot = await adminDb
      .collection("raffles")
      .where("drawStatus", "==", "pending")
      .get();
    const pendingDraws = pendingDrawsSnapshot.size;

    // Sort orders by date descending
    const sortedOrders = orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // 4. Get Winners
    const winners: any[] = [];
    // Simplified query to avoid requiring a composite index immediately
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
          prize: data.title,
          date: data.drawnAt?.toDate?.()?.toLocaleDateString("en-GB") || "Unknown",
          ticket: data.winningTicketNumber
        });
      }
    });

    return {
      activeRaffles,
      totalRevenuePence,
      pendingDraws,
      recentOrders: sortedOrders.slice(0, 10),
      raffles: raffles,
      winners: winners,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
