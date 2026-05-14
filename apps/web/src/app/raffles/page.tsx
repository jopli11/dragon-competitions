import { Container } from "@/components/Container";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { getAllRaffleStats } from "@/lib/firebase/raffle-stats";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import { RaffleFiltersGrid } from "@/components/RaffleFiltersGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  JsonLd,
  buildItemListSchema,
  buildWebPageSchema,
  SITE_URL,
} from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";
export const revalidate = 10;

const PAGE_DESCRIPTION =
  "Browse every live Coast Competitions prize draw. UK skill-based competitions with tax-free cash, luxury cars, and tech prizes — answer the skill question and enter from as little as a few pence.";

export default async function RafflesPage() {
  const [raffles, stats] = await Promise.all([
    fetchLiveRaffles(),
    getAllRaffleStats()
  ]);

  const breadcrumbItems = [{ label: "Current Competitions", href: "/raffles" }];

  return (
    <div className="min-h-screen bg-surface-mint py-16">
      <JsonLd
        id="schema-raffles-webpage"
        schema={{
          ...buildWebPageSchema({
            url: "/raffles",
            name: "Current UK Prize Competitions · Coast Competitions",
            description: PAGE_DESCRIPTION,
            breadcrumbId: `${SITE_URL}/raffles#breadcrumb`,
          }),
          "@type": ["WebPage", "CollectionPage"],
        }}
      />
      <JsonLd
        id="schema-raffles-itemlist"
        schema={buildItemListSchema(raffles)}
      />
      <Container>
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
        <div className="text-center">
          <BrandSectionHeading className="text-brand-midnight!">
            Current <GradientText>Competitions</GradientText>
          </BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Choose your prize, test your skill, and take your shot at winning big.
          </p>
        </div>

      <RaffleFiltersGrid raffles={raffles} stats={stats} />

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
