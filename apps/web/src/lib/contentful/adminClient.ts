import { createClient as createManagementClient } from "contentful-management";
import { getOptionalEnv } from "@/lib/env";

let cachedEnvironment: any | null | undefined;

async function getEnvironment() {
  if (cachedEnvironment !== undefined) return cachedEnvironment;

  const space = getOptionalEnv("CONTENTFUL_SPACE_ID");
  const environmentId = getOptionalEnv("CONTENTFUL_ENVIRONMENT") || "master";
  const accessToken = getOptionalEnv("CONTENTFUL_SERVER_TOKEN");

  if (!space || !accessToken) {
    cachedEnvironment = null;
    return cachedEnvironment;
  }

  try {
    const client = createManagementClient({ accessToken });
    const spaceClient = await client.getSpace(space);
    cachedEnvironment = await spaceClient.getEnvironment(environmentId);
    return cachedEnvironment;
  } catch (error: any) {
    console.error("Failed to initialize Contentful Management client:", error.message);
    cachedEnvironment = null;
    return cachedEnvironment;
  }
}

/**
 * Fetches entries using the Content Management API.
 * Returns a CDA-compatible shape so callers don't need to change.
 */
export async function adminGetEntries(query: Record<string, any>) {
  const environment = await getEnvironment();
  if (!environment) return null;

  const entries = await environment.getEntries(query);

  // CMA returns fields as { fieldName: { "en-US": value } }
  // Normalize to flat shape matching CDA format
  return {
    items: entries.items.map((entry: any) => ({
      sys: entry.sys,
      fields: Object.fromEntries(
        Object.entries(entry.fields).map(([key, locales]: [string, any]) => [
          key,
          locales?.["en-US"] ?? locales,
        ])
      ),
    })),
  };
}

/**
 * @deprecated Use adminGetEntries directly. Kept for backward compatibility.
 */
export function getContentfulAdminClient(): any {
  return {
    async getEntries(query: any) {
      return adminGetEntries(query);
    },
  };
}
