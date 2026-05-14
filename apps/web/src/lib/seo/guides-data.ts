// Single source of truth for the SEO/GEO guide pages under /guides.
// Each guide has a server-rendered page that emits Article + FAQPage + WebPage
// + BreadcrumbList JSON-LD; this file holds the metadata used by the hub page,
// the sitemap, and the per-guide layouts.

export type GuideSlug =
  | "are-prize-competitions-legal-uk"
  | "are-competition-winnings-tax-free-uk"
  | "prize-competitions-uk"
  | "online-raffles-uk"
  | "win-cash-prizes-uk";

export type GuideMeta = {
  slug: GuideSlug;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  keywords: string[];
  articleSection: "Legal" | "Tax" | "Explainer";
  datePublished: string;
  dateModified: string;
  relatedSlugs: GuideSlug[];
};

const TODAY = "2026-05-14";

export const GUIDES: GuideMeta[] = [
  {
    slug: "are-prize-competitions-legal-uk",
    title: "Are Prize Competitions Legal in the UK?",
    shortTitle: "Legality of UK prize competitions",
    metaTitle: "Are Prize Competitions Legal in the UK? (2026 Guide)",
    metaDescription:
      "Yes, UK skill-based prize competitions are legal under the Gambling Act 2005 when they include a genuine skill element or a free entry route. Full guide to how the law works in 2026.",
    summary:
      "How the Gambling Act 2005 separates legal skill-based prize competitions from licensed lotteries, what a genuine 'skill question' has to do, and how the free-entry route works.",
    keywords: [
      "are prize competitions legal uk",
      "uk competition law",
      "gambling act 2005 prize competitions",
      "skill based competitions uk",
      "are online raffles legal",
    ],
    articleSection: "Legal",
    datePublished: "2026-05-14",
    dateModified: TODAY,
    relatedSlugs: [
      "are-competition-winnings-tax-free-uk",
      "online-raffles-uk",
      "prize-competitions-uk",
    ],
  },
  {
    slug: "are-competition-winnings-tax-free-uk",
    title: "Are Competition Winnings Tax Free in the UK?",
    shortTitle: "Tax on competition winnings",
    metaTitle: "Are Competition Winnings Tax Free in the UK? (HMRC 2026)",
    metaDescription:
      "Prize competition and raffle winnings are not subject to UK income tax — HMRC does not treat them as earned income. Guide to the rules, edge cases, interest, and inheritance tax in 2026.",
    summary:
      "HMRC's position on prize and competition winnings, why they are not classed as income, and the few situations (interest, inheritance) where tax can still apply.",
    keywords: [
      "are competition winnings tax free uk",
      "tax on prize winnings uk",
      "hmrc competition winnings",
      "are raffle winnings taxable",
      "do you pay tax on competition prizes",
    ],
    articleSection: "Tax",
    datePublished: "2026-05-14",
    dateModified: TODAY,
    relatedSlugs: [
      "are-prize-competitions-legal-uk",
      "win-cash-prizes-uk",
      "prize-competitions-uk",
    ],
  },
  {
    slug: "prize-competitions-uk",
    title: "Prize Competitions UK: A Complete Guide",
    shortTitle: "UK prize competitions explained",
    metaTitle: "Prize Competitions UK: Complete Guide (2026)",
    metaDescription:
      "What UK prize competitions are, how they differ legally from lotteries and raffles, common prize types, and how to spot a legitimate operator. Plain-English guide for 2026.",
    summary:
      "A plain-English overview of UK prize competitions: how they work, how they differ from lotteries, what prizes are typical, and how to spot a legitimate operator before you enter.",
    keywords: [
      "prize competitions uk",
      "uk competitions",
      "best prize competitions uk",
      "how do prize competitions work",
      "uk competition sites",
    ],
    articleSection: "Explainer",
    datePublished: "2026-05-14",
    dateModified: TODAY,
    relatedSlugs: [
      "are-prize-competitions-legal-uk",
      "online-raffles-uk",
      "win-cash-prizes-uk",
    ],
  },
  {
    slug: "online-raffles-uk",
    title: "Online Raffles UK: How They Work & How to Enter",
    shortTitle: "Online raffles in the UK",
    metaTitle: "Online Raffles UK: How They Work & How to Enter (2026)",
    metaDescription:
      "What an online raffle is in the UK, how it differs legally from a prize competition, how entry and draws work, and what makes a draw transparent. 2026 guide with examples.",
    summary:
      "The difference between an online raffle and an online prize competition, how entry, free postal routes, and live draws actually work in the UK, and how to spot a transparent operator.",
    keywords: [
      "online raffles uk",
      "uk raffles",
      "are online raffles legal",
      "how do online raffles work",
      "free postal entry raffle uk",
    ],
    articleSection: "Explainer",
    datePublished: "2026-05-14",
    dateModified: TODAY,
    relatedSlugs: [
      "prize-competitions-uk",
      "are-prize-competitions-legal-uk",
      "win-cash-prizes-uk",
    ],
  },
  {
    slug: "win-cash-prizes-uk",
    title: "How to Win Cash Prizes Online in the UK",
    shortTitle: "Winning cash prizes online",
    metaTitle: "How to Win Cash Prizes Online in the UK (2026 Guide)",
    metaDescription:
      "Where to find legitimate UK cash prize competitions, how the odds compare to the National Lottery, why winnings are tax free, and practical tips for choosing competitions in 2026.",
    summary:
      "Where to find legitimate UK cash prize competitions, how the odds compare to traditional lotteries, why winnings are tax-free, and practical tips for choosing competitions sensibly.",
    keywords: [
      "win cash prizes online uk",
      "win cash uk",
      "cash prize competitions uk",
      "best uk cash competitions",
      "win tax free cash uk",
    ],
    articleSection: "Explainer",
    datePublished: "2026-05-14",
    dateModified: TODAY,
    relatedSlugs: [
      "prize-competitions-uk",
      "are-competition-winnings-tax-free-uk",
      "online-raffles-uk",
    ],
  },
];

export const GUIDES_BY_SLUG: Record<GuideSlug, GuideMeta> = GUIDES.reduce(
  (acc, guide) => {
    acc[guide.slug] = guide;
    return acc;
  },
  {} as Record<GuideSlug, GuideMeta>,
);

export function getGuide(slug: GuideSlug): GuideMeta {
  return GUIDES_BY_SLUG[slug];
}

export function getRelatedGuides(slug: GuideSlug): GuideMeta[] {
  const guide = GUIDES_BY_SLUG[slug];
  if (!guide) return [];
  return guide.relatedSlugs
    .map((s) => GUIDES_BY_SLUG[s])
    .filter(Boolean);
}
