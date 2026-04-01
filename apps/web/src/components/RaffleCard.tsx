"use client";

import Link from "next/link";
import Image from "next/image";
import { BrandButton } from "@/lib/styles";
import { useRaffleStats } from "@/lib/firebase/use-raffle-stats";

interface RaffleCardProps {
  raffle: any;
  initialTicketsSold: number;
  formatGBPFromPence: (pence: number) => string;
  variant?: "default" | "compact";
}

export function RaffleCard({ raffle, initialTicketsSold, formatGBPFromPence, variant = "default" }: RaffleCardProps) {
  const { stats: liveStats } = useRaffleStats(raffle.slug, { ticketsSold: initialTicketsSold });
  const currentTicketsSold = liveStats.ticketsSold;
  
  const maxTickets = raffle.maxTickets || 5000;
  const progress = Math.min(100, Math.max(2, (currentTicketsSold / maxTickets) * 100));
  const isSoldOut = currentTicketsSold >= maxTickets;
  const isAwaitingDraw = raffle.status === "awaitingDraw";

  if (variant === "compact") {
    return (
      <div
        className={`group overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${isAwaitingDraw ? 'border-amber-300/40' : isSoldOut ? 'opacity-80 grayscale-[0.5]' : ''}`}
      >
        <Link href={`/raffles/${raffle.slug}`} className="block">
          <div className="relative aspect-4/3 overflow-hidden">
            <div className={`absolute top-3 left-3 z-10 rounded-lg px-2 py-1 text-[10px] font-bold text-white uppercase ${isAwaitingDraw ? 'bg-amber-500' : isSoldOut ? 'bg-red-500' : 'bg-brand-secondary/90'}`}>
              {isAwaitingDraw ? 'Awaiting Live Draw' : isSoldOut ? 'Sold Out' : 'Entries Open'}
            </div>
            {raffle.heroImageUrl ? (
              <Image
                src={raffle.heroImageUrl}
                alt={raffle.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-brand-accent" />
            )}
          </div>
          <div className="p-6 bg-white">
            <h3 className="text-lg font-bold tracking-tight text-brand-midnight">
              {raffle.title}
            </h3>
            <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-brand-midnight/40 uppercase">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${isAwaitingDraw ? 'bg-amber-500 animate-pulse' : isSoldOut ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                <span>{isAwaitingDraw ? 'Sold Out · Draw Pending' : `${currentTicketsSold} / ${maxTickets} Sold`}</span>
              </div>
              {!isAwaitingDraw && (
                <span>Ends: {new Date(raffle.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
              )}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-accent">
              <div
                className={`h-full ${isAwaitingDraw ? 'bg-amber-500' : 'bg-brand-secondary'}`}
                style={{ width: `${isAwaitingDraw ? 100 : progress}%` }}
              />
            </div>
            <div className="mt-6 text-center">
              {isAwaitingDraw ? (
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                  Live draw coming soon
                </p>
              ) : (
                <p className="text-xs font-bold text-brand-midnight/60 uppercase tracking-widest">
                  Just <span className="text-brand-secondary">{formatGBPFromPence(raffle.ticketPricePence)}</span> per entry
                </p>
              )}
              <BrandButton fullWidth className="mt-4" variant={isAwaitingDraw || isSoldOut ? "outline" : "primary"}>
                {isAwaitingDraw ? "View Details" : isSoldOut ? "View Results" : "Enter Now"}
              </BrandButton>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`group overflow-hidden rounded-[2.5rem] border border-brand-primary/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${isAwaitingDraw ? 'border-amber-300/40' : isSoldOut ? 'opacity-80 grayscale-[0.5]' : ''}`}
    >
      <Link href={`/raffles/${raffle.slug}`} className="block">
        <div className="relative aspect-4/3 overflow-hidden">
          <div className={`absolute top-4 left-4 z-10 rounded-lg px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg ${isAwaitingDraw ? 'bg-amber-500' : isSoldOut ? 'bg-red-500' : 'bg-brand-secondary/90'}`}>
            {isAwaitingDraw ? 'Awaiting Live Draw' : isSoldOut ? 'Sold Out' : 'Entries Open'}
          </div>
          {raffle.heroImageUrl ? (
            <Image
              src={raffle.heroImageUrl}
              alt={raffle.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <Image
              src="/placeholder.png"
              alt={raffle.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-50"
            />
          )}
        </div>
        <div className="p-8">
          <h3 className="text-lg font-black tracking-tight text-brand-midnight leading-tight min-h-14 line-clamp-2">
            {raffle.title}
          </h3>
          <div className="mt-4 flex items-center justify-between text-[11px] font-extrabold text-brand-midnight/40 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${isAwaitingDraw ? 'bg-amber-500 animate-pulse' : isSoldOut ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
              <span>{isAwaitingDraw ? 'Sold Out · Draw Pending' : `${currentTicketsSold} / ${maxTickets} Sold`}</span>
            </div>
            {!isAwaitingDraw && (
              <span>Ends: {new Date(raffle.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
            )}
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-accent/50 border border-brand-primary/5">
            <div
              className={`h-full rounded-full ${isAwaitingDraw ? 'bg-amber-500' : 'bg-brand-secondary shadow-[0_0_8px_rgba(0,112,224,0.4)]'}`}
              style={{ width: `${isAwaitingDraw ? 100 : progress}%` }}
            />
          </div>
          <div className="mt-8 text-center">
            {isAwaitingDraw ? (
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
                Live draw coming soon
              </p>
            ) : (
              <p className="text-[10px] font-black text-brand-midnight/50 uppercase tracking-[0.2em] mb-4">
                Just <span className="text-brand-secondary">{formatGBPFromPence(raffle.ticketPricePence)}</span> per entry
              </p>
            )}
            <BrandButton fullWidth variant={isAwaitingDraw || isSoldOut ? "outline" : "primary"}>
              {isAwaitingDraw ? "View Details" : isSoldOut ? "View Results" : "Enter Now"}
            </BrandButton>
          </div>
        </div>
      </Link>
    </div>
  );
}
