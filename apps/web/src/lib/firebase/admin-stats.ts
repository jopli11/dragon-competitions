import { adminDb } from "@/lib/firebase/admin";

export async function getAdminStats() {
  try {
    // 1. Get Active Raffles count from Firestore
    // Note: We're assuming Firestore has raffle docs with status mirrored or we just count all docs in 'raffles'
    const rafflesSnapshot = await adminDb.collection("raffles").get();
    const activeRaffles = rafflesSnapshot.size;

    // 2. Get Total Revenue from Orders
    const ordersSnapshot = await adminDb.collection("orders").get();
    let totalRevenuePence = 0;
    const orders: any[] = [];

    ordersSnapshot.forEach((doc) => {
      const data = doc.data();
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
    ).slice(0, 10);

    return {
      activeRaffles,
      totalRevenuePence,
      pendingDraws,
      recentOrders: sortedOrders,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
