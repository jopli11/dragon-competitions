import { cache } from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import { getContentfulPublicClient } from "@/lib/contentful/publicClient";
import { adminGetEntries } from "@/lib/contentful/adminClient";
import { getEffectivePrice } from "@/lib/pricing";

export { getEffectivePrice } from "@/lib/pricing";

type RaffleStatus = "draft" | "live" | "awaitingDraw" | "ended";
type DrawType = "auto" | "live";

type RaffleEntryFields = {
  title: string;
  slug: string;
  status: RaffleStatus;
  drawType?: DrawType;
  isReoccurring?: boolean;
  maxTickets: number;
  discountActive?: boolean;
  discountPercent?: number;
  discountLabel?: string;
  freeEntryMaxPerUser?: number;
  startAt: string;
  endAt: string;
  ticketPricePence: number;
  skillQuestion: string;
  answerOptions: string[];
  heroImage?: {
    fields?: {
      title?: string;
      file?: { url?: string };
    };
  };
  raffleDescription?: any;
  prizeDetails?: any;
  cashAlternativeEnabled?: boolean;
  cashAlternativeAmountPence?: number;
  cashAlternativeCopy?: any;
  perRaffleFaqs?: {
    fields?: {
      question?: string;
      answer?: any;
    };
  }[];
  pricingRules?: any;
  termsAndConditions?: any;
  galleryImages?: {
    fields?: {
      title?: string;
      file?: { url?: string };
    };
  }[];
  winnerDisplayName?: string;
  winnerTicketNumber?: number;
  drawDate?: string;
};

type RaffleSkeleton = EntrySkeletonType<RaffleEntryFields, "raffle">;

export type RaffleSummary = {
  id: string;
  title: string;
  slug: string;
  status: RaffleStatus;
  drawType: DrawType;
  isReoccurring: boolean;
  maxTickets: number;
  discountActive: boolean;
  discountPercent: number;
  discountLabel?: string;
  freeEntryMaxPerUser: number;
  endAt: string;
  ticketPricePence: number;
  effectivePricePence: number;
  isFreeEntry: boolean;
  heroImageUrl?: string;
};

export type RaffleDetail = RaffleSummary & {
  startAt: string;
  skillQuestion: string;
  answerOptions: string[];
  raffleDescription?: any;
  prizeDetails?: any;
  cashAlternativeEnabled: boolean;
  cashAlternativeAmountPence?: number;
  cashAlternativeCopy?: any;
  perRaffleFaqs: {
    question: string;
    answer?: any;
  }[];
  pricingRules?: any;
  termsAndConditions?: any;
  galleryImageUrls?: string[];
};

export type EndedRaffleSummary = {
  id: string;
  title: string;
  slug: string;
  heroImageUrl?: string;
  drawType: DrawType;
  winnerDisplayName?: string;
  winnerTicketNumber?: number;
  drawDate?: string;
};

function toUrlMaybe(url?: string) {
  if (!url) return undefined;
  return url.startsWith("//") ? `https:${url}` : url;
}

function toSummary(entry: Entry<RaffleSkeleton>): RaffleSummary {
  // Contentful typings can represent localized fields; we normalize to our expected shape.
  const fields = entry.fields as unknown as RaffleEntryFields;
  const pricing = getEffectivePrice(fields);
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    status: fields.status,
    drawType: fields.drawType || "auto",
    isReoccurring: !!fields.isReoccurring,
    maxTickets: fields.maxTickets || 5000,
    discountActive: !!fields.discountActive,
    discountPercent: pricing.discountPercent,
    discountLabel: fields.discountLabel,
    freeEntryMaxPerUser: fields.freeEntryMaxPerUser || 1,
    endAt: fields.endAt,
    ticketPricePence: fields.ticketPricePence,
    effectivePricePence: pricing.effectivePence,
    isFreeEntry: pricing.isFree,
    heroImageUrl: toUrlMaybe(fields.heroImage?.fields?.file?.url),
  };
}

const MOCK_RAFFLES: RaffleDetail[] = [
  {
    id: "mock-1",
    title: "£20,000 Tax Free Cash",
    slug: "win-20000-cash",
    status: "live",
    drawType: "auto",
    isReoccurring: false,
    maxTickets: 5000,
    discountActive: false,
    discountPercent: 0,
    freeEntryMaxPerUser: 1,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    ticketPricePence: 18,
    effectivePricePence: 18,
    isFreeEntry: false,
    skillQuestion: "What is the capital of France?",
    answerOptions: ["London", "Paris", "Berlin"],
    cashAlternativeEnabled: false,
    perRaffleFaqs: [],
    heroImageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "mock-2",
    title: "Tesla Model S Plaid",
    slug: "tesla-model-s",
    status: "live",
    drawType: "live",
    isReoccurring: false,
    maxTickets: 1000,
    discountActive: false,
    discountPercent: 0,
    freeEntryMaxPerUser: 1,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    ticketPricePence: 18,
    effectivePricePence: 18,
    isFreeEntry: false,
    skillQuestion: "Which company makes the Model S?",
    answerOptions: ["Ford", "Tesla", "BMW"],
    cashAlternativeEnabled: false,
    perRaffleFaqs: [],
    heroImageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "mock-3",
    title: "PS5 Ultimate Bundle",
    slug: "ps5-bundle",
    status: "live",
    drawType: "auto",
    isReoccurring: true,
    maxTickets: 2500,
    discountActive: false,
    discountPercent: 0,
    freeEntryMaxPerUser: 1,
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    ticketPricePence: 18,
    effectivePricePence: 18,
    isFreeEntry: false,
    skillQuestion: "Who manufactures the PlayStation?",
    answerOptions: ["Microsoft", "Sony", "Nintendo"],
    cashAlternativeEnabled: false,
    perRaffleFaqs: [],
    heroImageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop",
  }
];

export const fetchLiveRaffles = cache(async (): Promise<RaffleSummary[]> => {
  const client = getContentfulPublicClient();
  if (!client) {
    // Return mock data if Contentful is not configured
    return MOCK_RAFFLES.map((raffle) => ({
      id: raffle.id,
      title: raffle.title,
      slug: raffle.slug,
      status: raffle.status,
      drawType: raffle.drawType,
      isReoccurring: raffle.isReoccurring,
      maxTickets: raffle.maxTickets,
      discountActive: raffle.discountActive,
      discountPercent: raffle.discountPercent,
      discountLabel: raffle.discountLabel,
      freeEntryMaxPerUser: raffle.freeEntryMaxPerUser,
      endAt: raffle.endAt,
      ticketPricePence: raffle.ticketPricePence,
      effectivePricePence: raffle.effectivePricePence,
      isFreeEntry: raffle.isFreeEntry,
      heroImageUrl: raffle.heroImageUrl,
    }));
  }

  const query = {
    content_type: "raffle",
    "fields.status[in]": "live,awaitingDraw",
    order: ["-sys.createdAt"],
    select: [
      "sys.id",
      "sys.createdAt",
      "fields.title",
      "fields.slug",
      "fields.status",
      "fields.drawType",
      "fields.isReoccurring",
      "fields.maxTickets",
      "fields.discountActive",
      "fields.discountPercent",
      "fields.discountLabel",
      "fields.freeEntryMaxPerUser",
      "fields.endAt",
      "fields.ticketPricePence",
      "fields.heroImage",
    ].join(","),
  };

  // NOTE: The Contentful SDK typings are strict about query keys.
  // We intentionally keep runtime-safe keys and relax only the type here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await client.getEntries<RaffleSkeleton>(query as any);

  return res.items.map(toSummary);
});

export const fetchRaffleBySlug = cache(async (
  slug: string,
): Promise<RaffleDetail | null> => {
  const client = getContentfulPublicClient();
  if (!client) {
    // Return mock data if Contentful is not configured
    return MOCK_RAFFLES.find((r) => r.slug === slug) || null;
  }

  const query = {
    content_type: "raffle",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await client.getEntries<RaffleSkeleton>(query as any);

  const entry = res.items[0];
  if (!entry) return null;

  const fields = entry.fields as unknown as RaffleEntryFields;
  const summary = toSummary(entry);
  const perRaffleFaqs: RaffleDetail["perRaffleFaqs"] = (fields.perRaffleFaqs || [])
    .reduce<RaffleDetail["perRaffleFaqs"]>((items, faq) => {
      const question = faq.fields?.question;
      if (!question) return items;
      items.push({ question, answer: faq.fields?.answer });
      return items;
    }, []);

  return {
    ...summary,
    startAt: fields.startAt,
    skillQuestion: fields.skillQuestion,
    answerOptions: fields.answerOptions,
    raffleDescription: fields.raffleDescription,
    prizeDetails: fields.prizeDetails,
    cashAlternativeEnabled: !!fields.cashAlternativeEnabled,
    cashAlternativeAmountPence: fields.cashAlternativeAmountPence,
    cashAlternativeCopy: fields.cashAlternativeCopy,
    perRaffleFaqs,
    pricingRules: fields.pricingRules,
    termsAndConditions: fields.termsAndConditions,
    galleryImageUrls: fields.galleryImages?.map(img => toUrlMaybe(img.fields?.file?.url)).filter(Boolean) as string[],
  };
});

export const fetchEndedRaffles = cache(async (): Promise<EndedRaffleSummary[]> => {
  const client = getContentfulPublicClient();
  if (!client) {
    return [];
  }

  const query = {
    content_type: "raffle",
    "fields.status": "ended",
    order: ["-fields.drawDate", "-sys.updatedAt"],
    select: [
      "sys.id",
      "fields.title",
      "fields.slug",
      "fields.drawType",
      "fields.heroImage",
      "fields.discountActive",
      "fields.discountPercent",
      "fields.discountLabel",
      "fields.freeEntryMaxPerUser",
      "fields.winnerDisplayName",
      "fields.winnerTicketNumber",
      "fields.drawDate",
    ].join(","),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await client.getEntries<RaffleSkeleton>(query as any);

  return res.items.map((entry) => {
    const fields = entry.fields as unknown as RaffleEntryFields;
    return {
      id: entry.sys.id,
      title: fields.title,
      slug: fields.slug,
      heroImageUrl: toUrlMaybe(fields.heroImage?.fields?.file?.url),
      drawType: fields.drawType || "auto",
      winnerDisplayName: fields.winnerDisplayName,
      winnerTicketNumber: fields.winnerTicketNumber,
      drawDate: fields.drawDate,
    };
  });
});

export async function fetchRaffleCorrectAnswer(
  slug: string,
): Promise<number | null> {
  try {
    const result = await adminGetEntries({
      content_type: "raffle",
      "fields.slug": slug,
      limit: 1,
    });

    if (!result || result.items.length === 0) {
      console.error(`No raffle entry found for slug: ${slug}`);
      return null;
    }

    const fields = result.items[0].fields as Record<string, any>;
    const correctAnswerIndex = fields.correctAnswerIndex;

    if (process.env.NODE_ENV !== "production") {
      console.log(`Correct answer index found: ${correctAnswerIndex}`);
    }

    return typeof correctAnswerIndex === "number" ? correctAnswerIndex : null;
  } catch (cfError: any) {
    console.error("Contentful API call failed:", cfError.message);
    throw cfError;
  }
}

