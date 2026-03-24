import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import { isContentfulConfigured } from "@/lib/contentful/publicClient";
import { BrandButton, BrandSectionHeading, GradientText } from "@/lib/styles";

function formatGBPFromPence(pence: number) {
  if (pence < 100) return `${pence}p`;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export default async function RafflesPage() {
  const [raffles, stats] = await Promise.all([
    fetchLiveRaffles(),
    getAllRaffleStats()
  ]);

  return (
    <div className="min-h-screen bg-surface-mint py-16">
      <Container>
        <div className="text-center">
          <BrandSectionHeading className="text-brand-midnight!">
            Current <GradientText>Competitions</GradientText>
          </BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Answer correctly, pick your quantity, and win big.
          </p>
        </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {raffles.map((r) => {
          const raffleStats = stats[r.slug] || { ticketsSold: 0 };
          const maxTickets = r.maxTickets || 5000;
          const progress = Math.min(100, Math.max(2, (raffleStats.ticketsSold / maxTickets) * 100));
          const isSoldOut = raffleStats.ticketsSold >= maxTickets;

          return (
            <div
              key={r.id}
              className={`group overflow-hidden rounded-4xl border border-brand-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${isSoldOut ? 'opacity-80 grayscale-[0.5]' : ''}`}
            >
              <Link href={`/raffles/${r.slug}`} className="block">
                <div className="relative aspect-4/3 overflow-hidden">
                  <div className={`absolute top-3 left-3 z-10 rounded-lg px-2 py-1 text-[10px] font-bold text-white uppercase ${isSoldOut ? 'bg-red-500' : 'bg-brand-secondary/90'}`}>
                    {isSoldOut ? 'Sold Out' : 'Entries Open'}
                  </div>
                  {r.heroImageUrl ? (
                    <Image
                      src={r.heroImageUrl}
                      alt={r.title}
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
                  {r.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-brand-midnight/40 uppercase">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${isSoldOut ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                    <span>{raffleStats.ticketsSold} / {maxTickets} Sold</span>
                  </div>
                  <span>Ends: {new Date(r.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
                </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-brand-accent">
                    <div
                      className="h-full bg-brand-secondary"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="text-xs font-bold text-brand-midnight/60 uppercase tracking-widest">
                      Just <span className="text-brand-secondary">{formatGBPFromPence(r.ticketPricePence)}</span> per entry
                    </p>
                    <BrandButton fullWidth className="mt-4" variant={isSoldOut ? "outline" : "primary"}>
                      {isSoldOut ? "View Results" : "Enter Now"}
                    </BrandButton>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {raffles.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            No live raffles yet.
          </p>
          <p className="mt-2 text-xs text-foreground/30">
            Check back soon for epic prizes!
          </p>
        </div>
      ) : null}
    </Container>
    </div>
  );
}
