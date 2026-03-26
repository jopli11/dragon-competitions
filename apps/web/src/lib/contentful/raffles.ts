import { cache } from "react";
import type { Entry, EntrySkeletonType } from "contentful";
import { getContentfulPublicClient } from "@/lib/contentful/publicClient";
import { getContentfulAdminClient } from "@/lib/contentful/adminClient";

type RaffleStatus = "draft" | "live" | "awaitingDraw" | "ended";
type DrawType = "auto" | "live";

type RaffleEntryFields = {
  title: string;
  slug: string;
  status: RaffleStatus;
  drawType?: DrawType;
  isReoccurring?: boolean;
  maxTickets: number;
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
  endAt: string;
  ticketPricePence: number;
  heroImageUrl?: string;
};

export type RaffleDetail = RaffleSummary & {
  startAt: string;
  skillQuestion: string;
  answerOptions: string[];
  raffleDescription?: any;
  prizeDetails?: any;
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
  return {
    id: entry.sys.id,
    title: fields.title,
    slug: fields.slug,
    status: fields.status,
    drawType: fields.drawType || "auto",
    isReoccurring: !!fields.isReoccurring,
    maxTickets: fields.maxTickets || 5000,
    endAt: fields.endAt,
    ticketPricePence: fields.ticketPricePence,
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
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    ticketPricePence: 18,
    skillQuestion: "What is the capital of France?",
    answerOptions: ["London", "Paris", "Berlin"],
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
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    ticketPricePence: 18,
    skillQuestion: "Which company makes the Model S?",
    answerOptions: ["Ford", "Tesla", "BMW"],
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
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    ticketPricePence: 18,
    skillQuestion: "Who manufactures the PlayStation?",
    answerOptions: ["Microsoft", "Sony", "Nintendo"],
    heroImageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop",
  }
];

export const fetchLiveRaffles = cache(async (): Promise<RaffleSummary[]> => {
  const client = getContentfulPublicClient();
  if (!client) {
    // Return mock data if Contentful is not configured
    return MOCK_RAFFLES.map(({ skillQuestion, answerOptions, startAt, ...rest }) => rest);
  }

  const query = {
    content_type: "raffle",
    "fields.status": "live",
    "fields.endAt[gte]": new Date().toISOString(),
    order: ["fields.endAt"],
    select: [
      "sys.id",
      "fields.title",
      "fields.slug",
      "fields.status",
      "fields.drawType",
      "fields.isReoccurring",
      "fields.maxTickets",
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
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await client.getEntries<RaffleSkeleton>(query as any);

  const entry = res.items[0];
  if (!entry) return null;

  const fields = entry.fields as unknown as RaffleEntryFields;
  const summary = toSummary(entry);
  return {
    ...summary,
    startAt: fields.startAt,
    skillQuestion: fields.skillQuestion,
    answerOptions: fields.answerOptions,
    raffleDescription: fields.raffleDescription,
    prizeDetails: fields.prizeDetails,
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
  const client = getContentfulAdminClient();
  if (!client) {
    console.error("Admin client not initialized - check CONTENTFUL_SERVER_TOKEN");
    return null;
  }

  const query = {
      content_type: "raffle",
      "fields.slug": slug,
      limit: 1,
    };

    console.log(`Fetching correct answer for slug: ${slug} using Admin Client`);
    const adminClient = getContentfulAdminClient();
    if (!adminClient) {
      console.error("Admin client not initialized - check CONTENTFUL_SERVER_TOKEN");
      return null;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await adminClient.getEntries<RaffleSkeleton>(query as any);
      const entry = res.items[0];
      if (!entry) {
        console.error(`No raffle entry found for slug: ${slug}`);
        return null;
      }

      const fields = entry.fields as unknown as { correctAnswerIndex: number };
      if (process.env.NODE_ENV !== "production") {
        console.log(`Correct answer index found: ${fields.correctAnswerIndex}`);
      }
      return fields.correctAnswerIndex;
    } catch (cfError: any) {
      console.error("Contentful API call failed:", cfError.message, cfError.stack);
      throw cfError;
    }
}

