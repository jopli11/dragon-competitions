"use client";

import { useRef } from "react";
import { RaffleCard } from "@/components/RaffleCard";
import type { RaffleSummary } from "@/lib/contentful/raffles";

type RaffleStatsMap = Record<string, { ticketsSold: number }>;

export function HomeRaffleCarousel({
  raffles,
  stats,
}: {
  raffles: RaffleSummary[];
  stats: RaffleStatsMap;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasOverflow = raffles.length > 3;

  const scrollByCard = (direction: "previous" | "next") => {
    const element = scrollRef.current;
    if (!element) return;

    const cardWidth = element.firstElementChild?.clientWidth || 320;
    element.scrollBy({
      left: direction === "next" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
  };

  return (
    <div className="mt-12">
      {hasOverflow && (
        <div className="mb-4 flex items-center justify-between gap-4 px-4 sm:px-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-midnight/40">
            Scroll to see more live competitions
          </p>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByCard("previous")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/10 bg-white text-lg font-black text-brand-primary shadow-sm transition-colors hover:bg-brand-accent"
              aria-label="Previous competitions"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-primary/10 bg-white text-lg font-black text-brand-primary shadow-sm transition-colors hover:bg-brand-accent"
              aria-label="Next competitions"
            >
              →
            </button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:px-0 [scrollbar-width:thin] [scrollbar-color:rgba(14,126,139,0.35)_transparent]"
      >
        {raffles.map((raffle) => (
          <div
            key={raffle.id}
            className="w-[min(86vw,22rem)] shrink-0 snap-start sm:w-84 lg:w-88"
          >
            <RaffleCard
              raffle={raffle}
              initialTicketsSold={stats[raffle.slug]?.ticketsSold || 0}
              variant="compact"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
