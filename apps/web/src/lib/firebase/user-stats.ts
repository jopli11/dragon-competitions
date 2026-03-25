import { serverDb } from "@/lib/firebase/server-client";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export interface UserOrder {
  id: string;
  raffleSlug: string;
  quantity: number;
  amountTotal: number;
  ticketRange: { start: number; end: number };
  createdAt: string;
  status: string;
}

export async function getUserOrders(email: string) {
  try {
    const ordersRef = collection(serverDb, "orders");
    const q = query(
      ordersRef,
      where("email", "==", email),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        raffleSlug: data.raffleSlug,
        quantity: data.quantity,
        amountTotal: data.amountTotal,
        ticketRange: data.ticketRange,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        status: data.status,
      } as UserOrder;
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getUserWins(email: string) {
  try {
    const rafflesRef = collection(serverDb, "raffles");
    const q = query(
      rafflesRef,
      where("winnerEmail", "==", email),
      where("drawStatus", "==", "completed"),
      orderBy("drawnAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        raffleId: doc.id,
        raffleTitle: data.title || doc.id,
        winningTicketNumber: data.winningTicketNumber,
        drawnAt: data.drawnAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error fetching user wins:", error);
    return [];
  }
}
