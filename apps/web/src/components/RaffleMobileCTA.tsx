"use client";

import { Container } from "@/components/Container";
import { BrandButton } from "@/lib/styles";

interface RaffleMobileCTAProps {
  ticketPriceFormatted: string;
}

export function RaffleMobileCTA({ ticketPriceFormatted }: RaffleMobileCTAProps) {
  const scrollToQuestion = () => {
    const el = document.getElementById("skill-question");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-primary/10 bg-white/80 p-4 backdrop-blur-lg lg:hidden">
      <Container className="min-w-0">
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
