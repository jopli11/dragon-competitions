import { db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export interface UserOrder {
  id: string;
  raffleSlug: string;
  quantity: number;
  amountTotal: number;
  ticketRange?: { start: number; end: number };
  createdAt: string;
  status: string;
}

export interface UserWin {
  raffleId: string;
  raffleTitle: string;
  winningTicketNumber: number;
  drawnAt: string;
}

// Statuses that represent checkout sessions the user never paid for. They
// should be excluded from the dashboard so they don't appear permanently as
// "Processing" (or any other noise) after the user moves on.
const HIDDEN_ORDER_STATUSES = new Set([
  "abandoned",
  "cancelled",
  "declined",
]);

export async function getUserOrders(email: string) {
  if (!db) {
    console.error("Firestore not initialized on client");
    return [];
  }

  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("email", "==", email),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          raffleSlug: data.raffleSlug,
          quantity: data.quantity ?? 0,
          amountTotal: data.amountTotal ?? data.amountPence ?? 0,
          ticketRange: data.ticketRange ?? undefined,
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() ||
            new Date().toISOString(),
          status: data.status ?? "unknown",
        } as UserOrder;
      })
      .filter((order) => !HIDDEN_ORDER_STATUSES.has(order.status));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getUserWins(email: string) {
  if (!db) {
    console.error("Firestore not initialized on client");
    return [];
  }

  try {
    const rafflesRef = collection(db, "raffles");
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
      } as UserWin;
    });
  } catch (error) {
    console.error("Error fetching user wins:", error);
    return [];
  }
}
