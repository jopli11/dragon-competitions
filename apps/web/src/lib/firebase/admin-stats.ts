import { adminDb } from "@/lib/firebase/admin";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";

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
    // Fan out all independent fetches in parallel. Contentful gives us the
    // authoritative `maxTickets`/`endAt` for raffles that don't yet have any
    // orders (and therefore lack a Firestore mirror).
    const [
      rafflesSnapshot,
      completedOrdersSnapshot,
      ordersSnapshot,
      liveRaffles,
    ] = await Promise.all([
      adminDb.collection("raffles").get(),
      adminDb.collection("orders").where("status", "==", "completed").get(),
      adminDb.collection("orders")
        .orderBy("createdAt", "desc")
        .limit(500)
        .get(),
      fetchLiveRaffles().catch((err) => {
        console.error("Failed to fetch Contentful raffles for admin stats:", err);
        return [];
      }),
    ]);

    const fsRafflesById = new Map<string, Record<string, unknown>>();
    for (const doc of rafflesSnapshot.docs) {
      fsRafflesById.set(doc.id, serializeFirestoreDoc(doc));
    }

    // Merge Contentful raffles in by slug so the admin sees every live raffle
    // (even free-entry-only ones that have never received an order).
    const mergedRafflesById = new Map<string, Record<string, unknown>>(fsRafflesById);
    for (const r of liveRaffles) {
      const existing = mergedRafflesById.get(r.slug) || { id: r.slug };
      mergedRafflesById.set(r.slug, {
        ...existing,
        slug: r.slug,
        title: existing.title || r.title,
        status: existing.status || r.status,
        endAt: existing.endAt || r.endAt,
        maxTickets:
          (existing.maxTickets as number | undefined) ?? r.maxTickets,
        isFreeEntry: r.isFreeEntry,
        drawType: existing.drawType || r.drawType,
        isReoccurring:
          (existing.isReoccurring as boolean | undefined) ?? r.isReoccurring,
      });
    }

    const raffles = Array.from(mergedRafflesById.values());
    const activeRaffles = liveRaffles.length || rafflesSnapshot.size;
    // Revenue must reflect real money only — DNA sandbox orders are flagged
    // `isTestOrder: true` at creation time and excluded here.
    const totalRevenuePence = completedOrdersSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      if (data.isTestOrder === true) return sum;
      const amount = data.amountTotal;
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
