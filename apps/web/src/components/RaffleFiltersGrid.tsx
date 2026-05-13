"use client";

import { useMemo, useState } from "react";
import { RaffleCard } from "@/components/RaffleCard";
import type { RaffleSummary } from "@/lib/contentful/raffles";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type RaffleStatsMap = Record<string, { ticketsSold: number }>;
type FilterKey = "all" | "free" | "discounted" | "ending-soon" | "best-odds";
type SortKey = "newest" | "ending-soon" | "price-low" | "most-available";

const FILTER_EVENT_BY_KEY: Record<FilterKey, AnalyticsEvent | null> = {
  all: null,
  free: "raffles_filter_free",
  discounted: "raffles_filter_discounted",
  "ending-soon": "raffles_filter_ending_soon",
  "best-odds": "raffles_filter_best_odds",
};

const SORT_EVENT_BY_KEY: Record<SortKey, AnalyticsEvent | null> = {
  newest: null,
  "ending-soon": "raffles_sort_ending_soon",
  "price-low": "raffles_sort_price_low",
  "most-available": "raffles_sort_most_available",
};

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "free", label: "Free entry" },
  { key: "discounted", label: "Discounts" },
  { key: "ending-soon", label: "Ending soon" },
  { key: "best-odds", label: "Best odds" },
];

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "ending-soon", label: "Ending soonest" },
  { key: "price-low", label: "Lowest entry price" },
  { key: "most-available", label: "Most tickets left" },
];

function getTicketsSold(stats: RaffleStatsMap, slug: string) {
  return stats[slug]?.ticketsSold || 0;
}

function getAvailability(raffle: RaffleSummary, stats: RaffleStatsMap) {
  return Math.max(0, (raffle.maxTickets || 5000) - getTicketsSold(stats, raffle.slug));
}

function isEndingSoon(raffle: RaffleSummary) {
  const endTime = new Date(raffle.endAt).getTime();
  const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return raffle.status !== "awaitingDraw" && endTime <= sevenDaysFromNow;
}

function hasGoodOdds(raffle: RaffleSummary, stats: RaffleStatsMap) {
  const maxTickets = raffle.maxTickets || 5000;
  if (maxTickets <= 0) return false;
  return getTicketsSold(stats, raffle.slug) / maxTickets <= 0.5;
}

export function RaffleFiltersGrid({
  raffles,
  stats,
}: {
  raffles: RaffleSummary[];
  stats: RaffleStatsMap;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const handleFilterChange = (key: FilterKey) => {
    if (key === activeFilter) return;
    const event = FILTER_EVENT_BY_KEY[key];
    if (event) track(event);
    setActiveFilter(key);
  };

  const handleSortChange = (key: SortKey) => {
    if (key === sortBy) return;
    const event = SORT_EVENT_BY_KEY[key];
    if (event) track(event);
    setSortBy(key);
  };

  const filteredRaffles = useMemo(() => {
    const filtered = raffles.filter((raffle) => {
      if (activeFilter === "free") return raffle.isFreeEntry;
      if (activeFilter === "discounted") return raffle.discountActive && !raffle.isFreeEntry;
      if (activeFilter === "ending-soon") return isEndingSoon(raffle);
      if (activeFilter === "best-odds") return hasGoodOdds(raffle, stats);
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "ending-soon") {
        return new Date(a.endAt).getTime() - new Date(b.endAt).getTime();
      }

      if (sortBy === "price-low") {
        return a.effectivePricePence - b.effectivePricePence;
      }

      if (sortBy === "most-available") {
        return getAvailability(b, stats) - getAvailability(a, stats);
      }

      return 0;
    });
  }, [activeFilter, raffles, sortBy, stats]);

  return (
    <>
      <div className="mt-10 rounded-3xl border border-brand-primary/10 bg-white/75 p-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-midnight/40">
              Find your perfect competition
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => handleFilterChange(filter.key)}
                    className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                      isActive
                        ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                        : "border-brand-primary/10 bg-white text-brand-midnight/55 hover:border-brand-primary/30 hover:text-brand-midnight"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex flex-col gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-brand-midnight/40 sm:min-w-56">
            Sort by
            <select
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value as SortKey)}
              className="rounded-full border border-brand-primary/10 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-brand-midnight shadow-sm outline-none transition-colors focus:border-brand-primary"
            >
              {SORTS.map((sort) => (
                <option key={sort.key} value={sort.key}>
                  {sort.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredRaffles.map((raffle) => (
          <RaffleCard
            key={raffle.id}
            raffle={raffle}
            initialTicketsSold={getTicketsSold(stats, raffle.slug)}
            variant="compact"
          />
        ))}
      </div>

      {filteredRaffles.length === 0 && raffles.length > 0 ? (
        <div className="mt-16 rounded-3xl border border-brand-primary/10 bg-white/70 p-10 text-center">
          <p className="text-sm font-black uppercase tracking-widest text-brand-midnight/50">
            No competitions match this filter.
          </p>
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className="mt-4 text-xs font-black uppercase tracking-widest text-brand-primary underline"
          >
            Show all competitions
          </button>
        </div>
      ) : null}
    </>
  );
}
