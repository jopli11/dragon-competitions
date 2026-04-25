import { adminDb } from "@/lib/firebase/admin";

export async function getRaffleStats(slug: string) {
  try {
    const raffleDoc = await adminDb.collection("raffles").doc(slug).get();
    if (!raffleDoc.exists) {
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
    const snapshot = await adminDb.collection("raffles").get();
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

export async function getCompletedDraws() {
  try {
    const snapshot = await adminDb.collection("raffles")
      .where("drawStatus", "==", "completed")
      .orderBy("drawnAt", "desc")
      .get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        winnerEmail: data.winnerEmail as string | undefined,
        winningTicketNumber: data.winningTicketNumber as number | undefined,
        drawAudit: data.drawAudit as { seed: string; totalTickets: number } | undefined,
        drawType: data.drawType as "auto" | "live" | undefined,
        drawnAt: data.drawnAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching completed draws:", error);
    return [];
  }
}
