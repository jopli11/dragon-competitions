"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { GlassCard, BrandButton } from "@/lib/styles";

type DrawResult = {
  id: string;
  title: string;
  winner: string;
  date: string;
  rawDate: number;
  ticket: number | string | undefined;
  image: string;
  audit: { seed: string; totalTickets: number } | null;
  isLiveDraw: boolean;
};

interface DrawResultsListProps {
  results: DrawResult[];
}

const ITEMS_PER_PAGE = 6;

export function DrawResultsList({ results }: DrawResultsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [drawTypeFilter, setDrawTypeFilter] = useState<"all" | "auto" | "live">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "30" | "90">("all");

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    // Filter by draw type
    if (drawTypeFilter === "auto") {
      filtered = filtered.filter((r) => !r.isLiveDraw);
    } else if (drawTypeFilter === "live") {
      filtered = filtered.filter((r) => r.isLiveDraw);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = Date.now();
      const days = parseInt(dateFilter);
      const cutoff = now - days * 24 * 60 * 60 * 1000;
      filtered = filtered.filter((r) => r.rawDate >= cutoff);
    }

    return filtered;
  }, [results, drawTypeFilter, dateFilter]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/50 backdrop-blur-sm p-4 rounded-3xl border border-brand-primary/5">
        <div className="flex gap-2 p-1 bg-brand-midnight/5 rounded-2xl">
          {(["all", "auto", "live"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setDrawTypeFilter(type);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                drawTypeFilter === type
                  ? "bg-white text-brand-midnight shadow-sm"
                  : "text-brand-midnight/40 hover:text-brand-midnight/60"
              }`}
            >
              {type === "all" ? "All Draws" : type === "auto" ? "Auto Draws" : "Live Draws"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 p-1 bg-brand-midnight/5 rounded-2xl">
          {(["all", "30", "90"] as const).map((period) => (
            <button
              key={period}
              onClick={() => {
                setDateFilter(period);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                dateFilter === period
                  ? "bg-white text-brand-midnight shadow-sm"
                  : "text-brand-midnight/40 hover:text-brand-midnight/60"
              }`}
            >
              {period === "all" ? "All Time" : `Last ${period} Days`}
            </button>
          ))}
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            No results match your filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-12 grid-cols-1">
            {paginatedResults.map((result) => (
              <GlassCard key={result.id} className="overflow-hidden border-brand-primary/10 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-0">
                  <div className="relative aspect-video lg:aspect-auto">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-midnight/80 via-brand-midnight/20 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <span className={`text-[10px] font-black text-brand-accent uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm ${result.isLiveDraw ? "bg-amber-500/30" : "bg-brand-secondary/20"}`}>
                        {result.isLiveDraw ? "Live Draw Result" : "Official Result"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-2">
                        {result.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8 sm:p-12 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-brand-primary/5 pb-10">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Winner</span>
                        <span className="text-xl font-black text-brand-midnight break-all">{result.winner}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Winning Ticket</span>
                        <span className="text-2xl font-black text-brand-secondary">#{result.ticket}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Draw Date</span>
                        <span className="text-xl font-black text-brand-midnight">{result.date}</span>
                      </div>
                    </div>

                    {result.isLiveDraw ? (
                      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-brand-midnight">Live Draw</h4>
                        </div>
                        <p className="text-sm text-brand-midnight/60 font-medium">
                          This winner was selected during a live draw event. The winning ticket was picked in real-time using an independent random number generator.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-brand-accent/30 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-brand-midnight">Provably Fair Verification</h4>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Draw Seed (SHA-256)</span>
                            <div className="bg-white border border-brand-primary/5 rounded-xl p-3 font-mono text-[10px] sm:text-xs text-brand-midnight/70 break-all shadow-inner">
                              {result.audit?.seed || "Pending verification..."}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Total Eligible Tickets</span>
                              <div className="text-lg font-black text-brand-midnight">
                                {result.audit?.totalTickets || "0"}
                              </div>
                            </div>
                            <div>
                              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Verification Logic</span>
                              <div className="text-xs font-bold text-brand-midnight/60 italic">
                                (parseInt(Seed, 16) % TotalTickets) + 1 = #{result.ticket}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-16">
              <BrandButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </BrandButton>
              <span className="text-xs font-black uppercase tracking-widest text-brand-midnight/40">
                Page {currentPage} of {totalPages}
              </span>
              <BrandButton
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </BrandButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
