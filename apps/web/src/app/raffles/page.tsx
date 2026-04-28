import { Container } from "@/components/Container";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import { RaffleCard } from "@/components/RaffleCard";

export const dynamic = "force-dynamic";
export const revalidate = 10;

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
            Choose your prize, test your skill, and take your shot at winning big.
          </p>
        </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {raffles.map((r) => (
          <RaffleCard 
            key={r.id}
            raffle={r}
            initialTicketsSold={stats[r.slug]?.ticketsSold || 0}
            variant="compact"
          />
        ))}
      </div>

      {raffles.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            No live competitions yet.
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
