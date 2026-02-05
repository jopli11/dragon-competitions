import { createClient, type ContentfulClientApi } from "contentful";
import { getOptionalEnv } from "@/lib/env";

type PublicClient = ContentfulClientApi<undefined>;

let cached: PublicClient | null | undefined;

export function getContentfulPublicClient(): PublicClient | null {
  if (cached !== undefined) return cached;

  const space = getOptionalEnv("CONTENTFUL_SPACE_ID");
  const environment = getOptionalEnv("CONTENTFUL_ENVIRONMENT") || "master";
  const accessToken = getOptionalEnv("CONTENTFUL_PUBLIC_TOKEN");

  if (!space || !accessToken) {
    cached = null;
    return cached;
  }

  cached = createClient({
    space,
    environment,
    accessToken,
  });

  return cached;
}

export function isContentfulConfigured() {
  return getContentfulPublicClient() !== null;
}

