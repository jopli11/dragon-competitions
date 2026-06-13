"use client";

import Link from "next/link";
import Image from "next/image";
import { BrandButtonLabel } from "@/lib/styles";
import { useRaffleStats } from "@/lib/firebase/use-raffle-stats";
import { getEffectivePrice } from "@/lib/pricing";
import { CountdownPill } from "@/components/CountdownPill";
import type { RaffleSummary } from "@/lib/contentful/raffles";

interface RaffleCardProps {
  raffle: RaffleSummary;
  initialTicketsSold: number;
  variant?: "default" | "compact";
}

function formatGBPFromPence(pence: number) {
  if (pence === 0) return "Free";
  if (pence < 100) return `${pence}p`;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

function formatShortDate(dateString: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  }).format(new Date(dateString));
}

function getDiscountRibbonLabel(
  raffle: RaffleSummary,
  pricing: ReturnType<typeof getEffectivePrice>,
) {
  if (!pricing.isDiscounted) return null;
  return raffle.discountLabel || (pricing.isFree ? "FREE ENTRY" : `-${pricing.discountPercent}% OFF`);
}

function DiscountRibbon({ label }: { label: string }) {
  return (
    <div className="pointer-events-none absolute top-5 -right-13 z-20 w-44 rotate-35 bg-amber-500 py-1.5 text-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg ring-1 ring-white/30">
      {label}
    </div>
  );
}

function PriceLine({
  originalPricePence,
  effectivePricePence,
  isFree,
  hasDiscount,
}: {
  originalPricePence: number;
  effectivePricePence: number;
  isFree: boolean;
  hasDiscount: boolean;
}) {
  if (isFree) {
    return <span className="text-green-600">FREE TO ENTER</span>;
  }

  if (hasDiscount) {
    return (
      <>
        <span className="mr-1 text-brand-midnight/30 line-through">
          {formatGBPFromPence(originalPricePence)}
        </span>
        <span className="text-brand-secondary">
          {formatGBPFromPence(effectivePricePence)}
        </span>
      </>
    );
  }

  return (
    <span className="text-brand-secondary">
      {formatGBPFromPence(originalPricePence)}
    </span>
  );
}

export function RaffleCard({ raffle, initialTicketsSold, variant = "default" }: RaffleCardProps) {
  const { stats: liveStats } = useRaffleStats(raffle.slug, { ticketsSold: initialTicketsSold });
  const currentTicketsSold = liveStats.ticketsSold;
  const pricing = getEffectivePrice(raffle);
  
  const maxTickets = raffle.maxTickets || 5000;
  const progress = Math.min(100, Math.max(2, (currentTicketsSold / maxTickets) * 100));
  const isSoldOut = currentTicketsSold >= maxTickets;
  const isAwaitingDraw = raffle.status === "awaitingDraw";
  const showDiscount = pricing.isDiscounted && !isSoldOut && !isAwaitingDraw;
  const discountRibbonLabel = showDiscount ? getDiscountRibbonLabel(raffle, pricing) : null;
  // Show a live countdown pill (in the info section) on enterable raffles.
  const showCountdown = !isAwaitingDraw && !isSoldOut;
  const ctaLabel = isAwaitingDraw
    ? "View Details"
    : isSoldOut
      ? "View Results"
      : pricing.isFree
        ? "Claim Free Entry"
        : pricing.isDiscounted
          ? `Enter Now (${pricing.discountPercent}% Off)`
          : "Enter Now";

  if (variant === "compact") {
    const compactStatusLabel = isAwaitingDraw ? 'Awaiting Draw' : isSoldOut ? 'Sold Out' : 'Entries Open';
    return (
      <div
        className={`group flex flex-col overflow-hidden rounded-2xl border border-brand-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl sm:rounded-4xl ${isAwaitingDraw ? 'border-amber-300/40' : isSoldOut ? 'opacity-80 grayscale-[0.5]' : ''}`}
      >
        <Link href={`/raffles/${raffle.slug}`} className="flex h-full flex-col">
          <div className="relative aspect-11/6 overflow-hidden bg-brand-accent">
            {discountRibbonLabel && <DiscountRibbon label={discountRibbonLabel} />}
            {raffle.heroImageUrl ? (
              <Image
                src={raffle.heroImageUrl}
                alt={raffle.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-brand-accent" />
            )}
            {/* Status + countdown overlay the image so the body stays compact at 2-up on mobile */}
            <span className={`absolute left-2 top-2 rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-md sm:left-3 sm:top-3 sm:px-2 sm:py-1 sm:text-[10px] ${isAwaitingDraw ? 'bg-amber-500' : isSoldOut ? 'bg-red-500' : 'bg-brand-secondary/90'}`}>
              {compactStatusLabel}
            </span>
            {showCountdown && (
              <CountdownPill
                endAt={raffle.endAt}
                className="absolute right-2 top-2 sm:right-3 sm:top-3"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col p-3 sm:p-6">
            <h3 className="line-clamp-2 min-h-[2.25rem] text-sm font-bold leading-tight tracking-tight text-brand-midnight sm:min-h-0 sm:text-lg">
              {raffle.title}
            </h3>
            <div className="mt-2 flex flex-col gap-0.5 text-[10px] font-bold uppercase text-brand-midnight/40 sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 shrink-0 rounded-full ${isAwaitingDraw ? 'bg-amber-500 animate-pulse' : isSoldOut ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                <span>{isAwaitingDraw ? 'Draw Pending' : `${currentTicketsSold} / ${maxTickets} Sold`}</span>
              </div>
              {!isAwaitingDraw && (
                <span>Ends: {formatShortDate(raffle.endAt)}</span>
              )}
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-brand-accent">
              <div
                className={`h-full ${isAwaitingDraw ? 'bg-amber-500' : 'bg-brand-secondary'}`}
                style={{ width: `${isAwaitingDraw ? 100 : progress}%` }}
              />
            </div>
            <div className="mt-3 text-center sm:mt-6">
              {isAwaitingDraw ? (
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 sm:text-xs">
                  Live draw coming soon
                </p>
              ) : (
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-midnight/60 sm:text-xs">
                  {pricing.isFree ? (
                    <PriceLine
                      originalPricePence={raffle.ticketPricePence}
                      effectivePricePence={pricing.effectivePence}
                      isFree={pricing.isFree}
                      hasDiscount={pricing.isDiscounted}
                    />
                  ) : (
                    <>
                      Just{" "}
                      <PriceLine
                        originalPricePence={raffle.ticketPricePence}
                        effectivePricePence={pricing.effectivePence}
                        isFree={pricing.isFree}
                        hasDiscount={pricing.isDiscounted}
                      />{" "}
                      per entry
                    </>
                  )}
                </p>
              )}
              <BrandButtonLabel fullWidth className="mt-2 sm:mt-4" variant={isAwaitingDraw || isSoldOut ? "outline" : "primary"}>
                {ctaLabel}
              </BrandButtonLabel>
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
        <div className="relative aspect-11/6 overflow-hidden bg-brand-accent">
          {discountRibbonLabel && <DiscountRibbon label={discountRibbonLabel} />}
          {raffle.heroImageUrl ? (
            <Image
              src={raffle.heroImageUrl}
              alt={raffle.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <Image
              src="/placeholder.png"
              alt={raffle.title}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-50"
            />
          )}
        </div>
        <div className="p-8">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span className={`rounded-lg px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg ${isAwaitingDraw ? 'bg-amber-500' : isSoldOut ? 'bg-red-500' : 'bg-brand-secondary/90'}`}>
              {isAwaitingDraw ? 'Awaiting Live Draw' : isSoldOut ? 'Sold Out' : 'Entries Open'}
            </span>
            {showCountdown && <CountdownPill endAt={raffle.endAt} />}
          </div>
          <h3 className="text-lg font-black tracking-tight text-brand-midnight leading-tight min-h-14 line-clamp-2">
            {raffle.title}
          </h3>
          <div className="mt-4 flex items-center justify-between text-[11px] font-extrabold text-brand-midnight/40 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${isAwaitingDraw ? 'bg-amber-500 animate-pulse' : isSoldOut ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
              <span>{isAwaitingDraw ? 'Sold Out · Draw Pending' : `${currentTicketsSold} / ${maxTickets} Sold`}</span>
            </div>
            {!isAwaitingDraw && (
              <span>Ends: {formatShortDate(raffle.endAt)}</span>
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
                {pricing.isFree ? (
                  <PriceLine
                    originalPricePence={raffle.ticketPricePence}
                    effectivePricePence={pricing.effectivePence}
                    isFree={pricing.isFree}
                    hasDiscount={pricing.isDiscounted}
                  />
                ) : (
                  <>
                    Just{" "}
                    <PriceLine
                      originalPricePence={raffle.ticketPricePence}
                      effectivePricePence={pricing.effectivePence}
                      isFree={pricing.isFree}
                      hasDiscount={pricing.isDiscounted}
                    />{" "}
                    per entry
                  </>
                )}
              </p>
            )}
            <BrandButtonLabel fullWidth variant={isAwaitingDraw || isSoldOut ? "outline" : "primary"}>
              {ctaLabel}
            </BrandButtonLabel>
          </div>
        </div>
      </Link>
    </div>
  );
}
