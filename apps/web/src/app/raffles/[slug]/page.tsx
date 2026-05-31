import { notFound } from "next/navigation";
import { fetchRaffleBySlug, getEffectivePrice } from "@/lib/contentful/raffles";
import { getRaffleStats } from "@/lib/firebase/raffle-stats";
import { Metadata } from "next";
import { RaffleDetailClient } from "./RaffleDetailClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  JsonLd,
  buildWebPageSchema,
  SITE_URL,
} from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";
export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raffle = await fetchRaffleBySlug(slug);

  if (!raffle) return { title: "Competition Not Found" };

  const pricing = getEffectivePrice(raffle);
  const entryPriceDescription = pricing.isFree
    ? "free entry"
    : `just £${(pricing.effectivePence / 100).toFixed(2)}`;

  return {
    title: raffle.title,
    description: `Win ${raffle.title} with Coast Competitions. Answer the skill question and enter now for ${entryPriceDescription}!`,
    openGraph: {
      title: `${raffle.title} · Coast Competitions`,
      description: `Win ${raffle.title} with Coast Competitions.`,
      images: raffle.heroImageUrl ? [{ url: raffle.heroImageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: raffle.title,
      description: `Win ${raffle.title} with Coast Competitions.`,
      images: raffle.heroImageUrl ? [raffle.heroImageUrl] : [],
    },
  };
}

export default async function RaffleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [raffle, stats] = await Promise.all([
    fetchRaffleBySlug(slug),
    getRaffleStats(slug)
  ]);

  if (!raffle) notFound();

  const raffleUrl = `/raffles/${slug}`;
  const breadcrumbItems = [
    { label: "Current Competitions", href: "/raffles" },
    { label: raffle.title, href: raffleUrl },
  ];

  return (
    <>
      <JsonLd
        id={`schema-raffle-webpage-${slug}`}
        schema={buildWebPageSchema({
          url: raffleUrl,
          name: `${raffle.title} · Coast Competitions`,
          description: `Win ${raffle.title} with Coast Competitions — a UK skill-based prize competition with a guaranteed live draw and no extensions.`,
          breadcrumbId: `${SITE_URL}${raffleUrl}#breadcrumb`,
        })}
      />
      <RaffleDetailClient
        raffle={raffle}
        initialStats={stats}
        slug={slug}
        breadcrumbs={<Breadcrumbs items={breadcrumbItems} variant="dark" />}
      />
    </>
  );
}
