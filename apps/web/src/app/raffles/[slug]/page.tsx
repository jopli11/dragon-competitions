import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { getRaffleStats } from "@/lib/firebase/raffle-stats";
import { Metadata } from "next";
import { RaffleDetailClient } from "./RaffleDetailClient";

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

  return {
    title: raffle.title,
    description: `Win ${raffle.title} with Coast Competitions. Answer the skill question and enter now for just £${(raffle.ticketPricePence / 100).toFixed(2)}!`,
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

  return (
    <RaffleDetailClient 
      raffle={raffle} 
      initialStats={stats} 
      slug={slug} 
    />
  );
}
