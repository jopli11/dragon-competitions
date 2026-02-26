import { serverDb } from "@/lib/firebase/server-client";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export async function getRaffleStats(slug: string) {
  try {
    const raffleRef = doc(serverDb, "raffles", slug);
    const raffleDoc = await getDoc(raffleRef);
    if (!raffleDoc.exists()) {
      return { ticketsSold: 0 };
    }
    return {
      ticketsSold: raffleDoc.data()?.ticketsSold || 0,
    };
  } catch (error) {
    console.error(`Error fetching raffle stats for ${slug}:`, error);
    return { ticketsSold: 0 };
  }
}

export async function getAllRaffleStats() {
  try {
    const rafflesRef = collection(serverDb, "raffles");
    const snapshot = await getDocs(rafflesRef);
    const stats: Record<string, { ticketsSold: number }> = {};
    snapshot.forEach(doc => {
      stats[doc.id] = {
        ticketsSold: doc.data().ticketsSold || 0,
      };
    });
    return stats;
  } catch (error) {
    console.error("Error fetching all raffle stats:", error);
    return {};
  }
}
