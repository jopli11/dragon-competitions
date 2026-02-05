import type { Entry, EntrySkeletonType } from "contentful";
import { getContentfulPublicClient } from "@/lib/contentful/publicClient";
import { getContentfulAdminClient } from "@/lib/contentful/adminClient";

type RaffleStatus = "draft" | "live" | "ended";

type RaffleEntryFields = {
  title: string;
  slug: string;
  status: RaffleStatus;
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
};

type RaffleSkeleton = EntrySkeletonType<RaffleEntryFields, "raffle">;

export type RaffleSummary = {
  id: string;
  title: string;
  slug: string;
  status: RaffleStatus;
  endAt: string;
  ticketPricePence: number;
  heroImageUrl?: string;
};

export type RaffleDetail = RaffleSummary & {
  startAt: string;
  skillQuestion: string;
  answerOptions: string[];
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
    startAt: new Date().toISOString(),
    endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    ticketPricePence: 18,
    skillQuestion: "Who manufactures the PlayStation?",
    answerOptions: ["Microsoft", "Sony", "Nintendo"],
    heroImageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop",
  }
];

export async function fetchLiveRaffles(): Promise<RaffleSummary[]> {
  const client = getContentfulPublicClient();
  if (!client) {
    // Return mock data if Contentful is not configured
    return MOCK_RAFFLES.map(({ skillQuestion, answerOptions, startAt, ...rest }) => rest);
  }

  const query = {
    content_type: "raffle",
    "fields.status": "live",
    order: ["fields.endAt"],
    select: [
      "sys.id",
      "fields.title",
      "fields.slug",
      "fields.status",
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
}

export async function fetchRaffleBySlug(
  slug: string,
): Promise<RaffleDetail | null> {
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
  };
}

export async function fetchRaffleCorrectAnswer(
  slug: string,
): Promise<number | null> {
  const client = getContentfulAdminClient();
  if (!client) {
    // Return mock correct answer (index 1 for Paris/Tesla/Sony)
    return 1;
  }

  const query = {
    content_type: "raffle",
    "fields.slug": slug,
    limit: 1,
    select: "fields.correctAnswerIndex",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await client.getEntries<RaffleSkeleton>(query as any);
  const entry = res.items[0];
  if (!entry) return null;

  const fields = entry.fields as unknown as { correctAnswerIndex: number };
  return fields.correctAnswerIndex;
}

