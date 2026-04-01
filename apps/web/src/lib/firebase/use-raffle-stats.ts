"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./client";

export interface RaffleStats {
  ticketsSold: number;
}

export function useRaffleStats(slug: string, initialStats?: RaffleStats) {
  const [stats, setStats] = useState<RaffleStats>(initialStats || { ticketsSold: 0 });
  const [loading, setLoading] = useState(!initialStats);

  useEffect(() => {
    if (!db || !slug) {
      setLoading(false);
      return;
    }

    // Set up the real-time listener
    const raffleRef = doc(db, "raffles", slug);
    
    const unsubscribe = onSnapshot(
      raffleRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStats({
            ticketsSold: data.ticketsSold || 0,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error(`Error in raffle stats listener for ${slug}:`, error);
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [slug]);

  return { stats, loading };
}
