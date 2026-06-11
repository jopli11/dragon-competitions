import { Container } from "@/components/Container";
import { BrandSectionHeading } from "@/lib/styles";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";
import { TrustpilotBanner } from "@/components/TrustpilotBanner";
import { getTrustpilotSummary } from "@/lib/trustpilot";
import { HomeCountdown } from "@/components/HomeCountdown";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import dynamic from "next/dynamic";
import { RaffleCard } from "@/components/RaffleCard";
import { BrandLinkButton } from "@/lib/styles";
import { FloatingPaymentPrompt } from "@/components/FloatingPaymentPrompt";
import {
  JsonLd,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo/json-ld";

export const revalidate = 10;

const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const WinnersSection = dynamic(() => import("@/components/WinnersSection").then(m => m.WinnersSection));

export default async function Home() {
  const [raffles, stats, trustpilot] = await Promise.all([
    fetchLiveRaffles(),
    getAllRaffleStats(),
    getTrustpilotSummary()
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

  // Find the raffle ending soonest for the countdown (exclude awaitingDraw raffles)
  const activeRaffles = raffles.filter(r => r.status !== "awaitingDraw");
  const nextEndingRaffle = [...activeRaffles].sort((a, b) =>
    new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
  )[0];

  // Order the competitions grid by soonest-ending first. Sold-out / awaiting-draw
  // raffles (whose end time has effectively passed) are pushed to the end.
  const sortedRaffles = [...raffles].sort((a, b) => {
    const aAwait = a.status === "awaitingDraw" ? 1 : 0;
    const bAwait = b.status === "awaitingDraw" ? 1 : 0;
    if (aAwait !== bAwait) return aAwait - bAwait;
    return new Date(a.endAt).getTime() - new Date(b.endAt).getTime();
  });

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        id="schema-home-webpage"
        schema={buildWebPageSchema({
          url: "/",
          name: "Coast Competitions UK · Win Incredible Prizes & Cash",
          description:
            "Enter Coast Competitions UK for your chance to win tax-free cash, luxury cars, and the latest tech. Skill-based UK prize competitions with transparent live draws and guaranteed winners.",
        })}
      />
      {raffles.length > 0 ? (
        <JsonLd
          id="schema-home-itemlist"
          schema={buildItemListSchema(raffles)}
        />
      ) : null}
      <FloatingPaymentPrompt />

      {/* Thin Trustpilot trust strip — first thing visitors see, above the hero. */}
      {trustpilot ? <TrustpilotBanner data={trustpilot} /> : null}

      <BrandHeroCarousel slides={carouselSlides} />

      <HomeCountdown
        endAt={nextEndingRaffle?.endAt}
        title={nextEndingRaffle?.title}
        slug={nextEndingRaffle?.slug}
      />


      <Container className="pt-6 pb-20">
        <div className="text-center">
          <BrandSectionHeading>Current Competitions</BrandSectionHeading>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium uppercase tracking-widest text-brand-midnight/60">
            Choose your prize, test your skill, and take your shot at winning big.
          </p>
        </div>

        <div className="mt-12 grid gap-6 px-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
          {sortedRaffles.map((raffle) => (
            <RaffleCard
              key={raffle.id}
              raffle={raffle}
              initialTicketsSold={stats[raffle.slug]?.ticketsSold || 0}
              variant="compact"
            />
          ))}
        </div>

        {raffles.length === 0 && (
          <div className="mt-20 text-center">
            <p className="text-sm font-bold text-brand-midnight/40 uppercase tracking-widest">
              No live competitions yet.
            </p>
            <p className="mt-2 text-xs text-brand-midnight/30">
              Check back soon for epic prizes!
            </p>
          </div>
        )}

        {raffles.length > 3 && (
          <div className="mt-12 text-center">
            <BrandLinkButton
              href="/raffles"
              variant="outline"
              size="lg"
              title="Filter and browse all live Coast Competitions UK prize draws"
            >
              Filter Competitions
            </BrandLinkButton>
          </div>
        )}
      </Container>

      <HowItWorks />
      <WinnersSection />
    </div>
  );
}
