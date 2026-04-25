import { adminDb } from "@/lib/firebase/admin";

type TimestampLike = {
  toDate: () => Date;
};

function isTimestampLike(value: unknown): value is TimestampLike {
  return (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  );
}

function serializeFirestoreValue(value: unknown): unknown {
  if (isTimestampLike(value)) {
    return value.toDate().toISOString();
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const nested: Record<string, unknown> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      nested[key] = serializeFirestoreValue(nestedValue);
    }
    return nested;
  }

  return value;
}

function serializeFirestoreDoc(doc: FirebaseFirestore.QueryDocumentSnapshot): Record<string, unknown> {
  const data = doc.data();
  const result: Record<string, unknown> = { id: doc.id };
  for (const [key, value] of Object.entries(data)) {
    result[key] = serializeFirestoreValue(value);
  }
  return result;
}

export async function getAdminStats() {
  try {
    const [rafflesSnapshot, completedOrdersSnapshot, ordersSnapshot] = await Promise.all([
      adminDb.collection("raffles").get(),
      adminDb.collection("orders").where("status", "==", "completed").get(),
      adminDb.collection("orders")
        .orderBy("createdAt", "desc")
        .limit(200)
        .get(),
    ]);

    const raffles = rafflesSnapshot.docs.map(serializeFirestoreDoc);
    const activeRaffles = rafflesSnapshot.size;
    const totalRevenuePence = completedOrdersSnapshot.docs.reduce((sum, doc) => {
      const amount = doc.data().amountTotal;
      return sum + (typeof amount === "number" ? amount : 0);
    }, 0);
    const orders = ordersSnapshot.docs.map(serializeFirestoreDoc);

    let pendingDraws = 0;
    const winners: Array<Record<string, unknown>> = [];

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
      recentOrders: orders.slice(0, 10),
      orders,
      raffles,
      winners,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
}
