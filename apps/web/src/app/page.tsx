import { Container } from "@/components/Container";
import { BrandSectionHeading } from "@/lib/styles";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";
// import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { HomeCountdown } from "@/components/HomeCountdown";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import dynamic from "next/dynamic";
import { RaffleCard } from "@/components/RaffleCard";
import { BrandLinkButton } from "@/lib/styles";

export const revalidate = 10;

const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const WinnersSection = dynamic(() => import("@/components/WinnersSection").then(m => m.WinnersSection));

export default async function Home() {
  const [raffles, stats] = await Promise.all([
    fetchLiveRaffles(),
    getAllRaffleStats()
  ]);
  
  // Prepare slides for the hero carousel from live raffles
  const carouselSlides = raffles.length > 0 
    ? raffles.slice(0, 3).map(r => ({
        id: r.id,
        image: r.heroImageUrl || "/placeholder.png",
        link: `/raffles/${r.slug}`,
        title: r.title,
      }))
    : [{
        id: "placeholder",
        image: "/placeholder.png",
        link: "/raffles",
        title: "New Competitions Coming Soon",
      }];

  // Take only the first 4 for the landing page grid
  const featuredRaffles = raffles.slice(0, 4);

  // Find the raffle ending soonest for the countdown (exclude awaitingDraw raffles)
  const activeRaffles = raffles.filter(r => r.status !== "awaitingDraw");
  const nextEndingRaffle = [...activeRaffles].sort((a, b) => 
    new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
  )[0];

  return (
    <div className="min-h-screen bg-white">
      <BrandHeroCarousel slides={carouselSlides} />

      <HomeCountdown endAt={nextEndingRaffle?.endAt} />

      {/* <div className="mt-6">
        <TrustpilotBadge />
      </div> */}

      <Container className="pt-6 pb-20">
        <div className="text-center">
          <BrandSectionHeading>Current Competitions</BrandSectionHeading>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          {featuredRaffles.map((r) => (
            <RaffleCard 
              key={r.id}
              raffle={r}
              initialTicketsSold={stats[r.slug]?.ticketsSold || 0}
            />
          ))}
        </div>

        {featuredRaffles.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-sm font-bold text-brand-midnight/40 uppercase tracking-widest">
              No live competitions yet.
            </p>
            <p className="mt-2 text-xs text-brand-midnight/30">
              Check back soon for epic prizes!
            </p>
          </div>
        )}

        {raffles.length > 4 && (
          <div className="mt-12 text-center">
            <BrandLinkButton href="/raffles" variant="outline" size="lg">
              View All Competitions
            </BrandLinkButton>
          </div>
        )}
      </Container>

      <HowItWorks />
      <WinnersSection />
    </div>
  );
}
