#!/usr/bin/env node
// READ-ONLY. Lists all Contentful "raffle" entries so we can see the true
// (extended) endAt the admin set, current status, and any orphan "Round"
// clones created by handleReoccurring during the buggy re-draws.
//
//   node scripts/incident-contentful.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import cmaPkg from "contentful-management";
const { createClient } = cmaPkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const raw = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    if (process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^"([\s\S]*)"$/, "$1").replace(/^'([\s\S]*)'$/, "$1");
  }
} catch {}

const client = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN });
const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || "master");

const entries = await env.getEntries({ content_type: "raffle", limit: 200 });
const L = "en-US";
const rows = entries.items.map((e) => ({
  id: e.sys.id,
  published: !!e.sys.publishedVersion && e.sys.version === e.sys.publishedVersion + 1,
  slug: e.fields.slug?.[L],
  title: e.fields.title?.[L],
  status: e.fields.status?.[L],
  startAt: e.fields.startAt?.[L],
  endAt: e.fields.endAt?.[L],
  winnerDisplayName: e.fields.winnerDisplayName?.[L],
  winnerTicketNumber: e.fields.winnerTicketNumber?.[L],
  drawDate: e.fields.drawDate?.[L],
}));

for (const r of rows.sort((a, b) => String(a.slug).localeCompare(String(b.slug)))) {
  console.log(JSON.stringify(r));
}
console.log(`\nTotal raffle entries: ${rows.length}`);
console.log(`Now: ${new Date().toISOString()}`);
process.exit(0);
