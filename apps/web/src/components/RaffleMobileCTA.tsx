"use client";

import { Container } from "@/components/Container";
import { BrandButton } from "@/lib/styles";

interface RaffleMobileCTAProps {
  ticketPriceFormatted: string;
  ticketsSold: number;
  maxTickets: number;
}

export function RaffleMobileCTA({
  ticketPriceFormatted,
  ticketsSold,
  maxTickets,
}: RaffleMobileCTAProps) {
  const scrollToQuestion = () => {
    const el = document.getElementById("skill-question");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const ratio = maxTickets > 0 ? ticketsSold / maxTickets : 0;
  const barWidth = Math.min(100, Math.max(2, ratio * 100));
  const percentLabel = Math.round(ratio * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-primary/10 bg-white/80 p-4 backdrop-blur-lg lg:hidden">
      <Container className="min-w-0">
        {/* Live ticket progress — kept on the always-visible bar so entrants
            never have to scroll to the bottom to gauge scarcity. */}
        <div className="mb-2.5">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-brand-midnight/50">
            <span>
              {ticketsSold.toLocaleString()} / {maxTickets.toLocaleString()} sold
            </span>
            <span className="text-brand-secondary">{percentLabel}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-accent">
            <div
              className="h-full rounded-full bg-brand-secondary"
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0 shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-midnight/40">
              Ticket Price
            </p>
            <p className="text-lg font-black text-brand-midnight">
              {ticketPriceFormatted}
            </p>
          </div>
          <div className="min-w-0 flex-1">
            <BrandButton fullWidth onClick={scrollToQuestion}>
              Enter Now
            </BrandButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
