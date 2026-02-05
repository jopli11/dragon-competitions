import { createClient, type ContentfulClientApi } from "contentful";
import { getOptionalEnv } from "@/lib/env";

type AdminClient = ContentfulClientApi<undefined>;

let cached: AdminClient | null | undefined;

export function getContentfulAdminClient(): AdminClient | null {
  if (cached !== undefined) return cached;

  const space = getOptionalEnv("CONTENTFUL_SPACE_ID");
  const environment = getOptionalEnv("CONTENTFUL_ENVIRONMENT") || "master";
  const accessToken = getOptionalEnv("CONTENTFUL_SERVER_TOKEN");

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
