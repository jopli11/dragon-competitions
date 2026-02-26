import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";
import Link from "next/link";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { HomeCountdown } from "@/components/HomeCountdown";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import dynamic from "next/dynamic";

const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const WinnersSection = dynamic(() => import("@/components/WinnersSection").then(m => m.WinnersSection));

function formatGBPFromPence(pence: number) {
  if (pence < 100) return `${pence}p`;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(pence / 100);
}

export default async function Home() {
  const [raffles, stats] = await Promise.all([
    fetchLiveRaffles(),
    getAllRaffleStats()
  ]);
  
  // Prepare slides for the hero carousel from live raffles
  const carouselSlides = raffles.slice(0, 3).map(r => ({
    id: r.id,
    image: r.heroImageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop",
    link: `/raffles/${r.slug}`,
    title: r.title,
  }));

  // Take only the first 4 for the landing page grid
  const featuredRaffles = raffles.slice(0, 4);

  // Find the raffle ending soonest for the countdown
  const nextEndingRaffle = [...raffles].sort((a, b) => 
    new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
  )[0];

  return (
    <div className="min-h-screen bg-white">
      <BrandHeroCarousel slides={carouselSlides} />

      <HomeCountdown endAt={nextEndingRaffle?.endAt} />

      <div className="mt-6">
        <TrustpilotBadge />
      </div>

      <Container className="pt-6 pb-20">
        <div className="text-center">
          <BrandSectionHeading>Current Competitions</BrandSectionHeading>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          {featuredRaffles.map((r) => {
            const raffleStats = stats[r.slug] || { ticketsSold: 0 };
            const progress = Math.min(100, Math.max(2, (raffleStats.ticketsSold / 5000) * 100)); // Using 5000 as a default target for now

            return (
              <div
                key={r.id}
                className="group overflow-hidden rounded-[2.5rem] border border-brand-primary/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <Link href={`/raffles/${r.slug}`} className="block">
                  <div className="relative aspect-4/3 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 rounded-lg bg-brand-secondary/90 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                      Entries Open
                    </div>
                    {r.heroImageUrl ? (
                      <Image
                        src={r.heroImageUrl}
                        alt={r.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full w-full bg-brand-accent" />
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-black tracking-tight text-brand-midnight leading-tight min-h-14 line-clamp-2">
                      {r.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-[11px] font-extrabold text-brand-midnight/40 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>{raffleStats.ticketsSold} Sold</span>
                      </div>
                      <span>Ends: {new Date(r.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-accent/50 border border-brand-primary/5">
                      <div
                        className="h-full bg-brand-secondary rounded-full shadow-[0_0_8px_rgba(0,112,224,0.4)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-8 text-center">
                      <p className="text-[10px] font-black text-brand-midnight/50 uppercase tracking-[0.2em] mb-4">
                        Just <span className="text-brand-secondary">{formatGBPFromPence(r.ticketPricePence)}</span> per entry
                      </p>
                      <BrandButton fullWidth>
                        Enter Now
                      </BrandButton>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {featuredRaffles.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-sm font-bold text-brand-midnight/40 uppercase tracking-widest">
              No live raffles yet.
            </p>
            <p className="mt-2 text-xs text-brand-midnight/30">
              Check back soon for epic prizes!
            </p>
          </div>
        )}

        {raffles.length > 4 && (
          <div className="mt-12 text-center">
            <Link href="/raffles">
              <BrandButton variant="outline" size="lg">
                View All Competitions
              </BrandButton>
            </Link>
          </div>
        )}
      </Container>

      <HowItWorks />
      <WinnersSection />
    </div>
  );
}
