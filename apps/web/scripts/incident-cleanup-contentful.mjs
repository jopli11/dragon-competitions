#!/usr/bin/env node
// Incident cleanup for Contentful. Dry-run by default; pass --apply to write.
//
//   node scripts/incident-cleanup-contentful.mjs            # dry run
//   node scripts/incident-cleanup-contentful.mjs --apply    # write + publish
//
// Actions:
//  1. £100 / £250 ended entries: set masked winner display, ticket #, draw date,
//     and sane (consistent, past) start/end dates; (re)publish so they show as
//     properly-ended competitions with the announced winner.
//  2. Delete the empty orphan entry left by a failed reoccurring clone.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import cmaPkg from "contentful-management";
const { createClient } = cmaPkg;

const APPLY = process.argv.includes("--apply");
const __dirname = dirname(fileURLToPath(import.meta.url));
try {
  const raw = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m || process.env[m[1]]) continue;
    process.env[m[1]] = m[2].replace(/^"([\s\S]*)"$/, "$1").replace(/^'([\s\S]*)'$/, "$1");
  }
} catch {}

function maskEmail(email) {
  if (!email || !email.includes("@")) return "Anonymous";
  const [local, domain] = email.split("@");
  return `${local.slice(0, 3)}***@${domain}`;
}

const L = "en-US";
const DAY = 24 * 60 * 60 * 1000;

// Winner facts pulled from Firestore earlier (raffles/<slug> + draw_audit).
const WINNERS = {
  "6lfDLq9xH3juHOVbAf2Zv4": { slug: "100-cash-raffle", email: "matthulse90@gmail.com", ticket: 8,  drawnAt: "2026-05-31T00:11:05.726Z" },
  "5Ff8KtuLZ0ZVE1iU5s6cWn": { slug: "250-cash-raffle", email: "joeloneill@hotmail.com", ticket: 17, drawnAt: "2026-05-31T05:38:17.436Z" },
};
const ORPHAN_ID = "4iXgl99hRYRoIb4O0uK7wo";

const client = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN });
const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT || "master");

console.log(`MODE: ${APPLY ? "APPLY (writing + publishing)" : "DRY RUN (no writes)"}\n`);

for (const [id, w] of Object.entries(WINNERS)) {
  const entry = await env.getEntry(id);
  const endAt = w.drawnAt;                                   // ended at the draw time (past)
  const startAt = new Date(new Date(w.drawnAt).getTime() - DAY).toISOString();
  const display = maskEmail(w.email);

  console.log(`--- ${w.slug} (${id}) ---`);
  console.log(`  status        -> ended`);
  console.log(`  winnerDisplay -> ${display}`);
  console.log(`  winnerTicket  -> #${w.ticket}`);
  console.log(`  drawDate      -> ${w.drawnAt}`);
  console.log(`  startAt       -> ${startAt}   (was ${entry.fields.startAt?.[L]})`);
  console.log(`  endAt         -> ${endAt}   (was ${entry.fields.endAt?.[L]})`);
  console.log(`  publish       -> yes\n`);

  if (APPLY) {
    entry.fields.status = { [L]: "ended" };
    entry.fields.winnerDisplayName = { [L]: display };
    entry.fields.winnerTicketNumber = { [L]: w.ticket };
    entry.fields.drawDate = { [L]: w.drawnAt };
    entry.fields.startAt = { [L]: startAt };
    entry.fields.endAt = { [L]: endAt };
    const updated = await entry.update();
    await updated.publish();
    console.log(`  ✓ updated + published ${w.slug}\n`);
  }
}

// Orphan empty entry
try {
  const orphan = await env.getEntry(ORPHAN_ID);
  const keys = Object.keys(orphan.fields || {});
  // Junk = a half-created reoccurring clone: no slug/title/status and unpublished.
  // Such an entry can never render (listing requires status + slug), so it's safe
  // to delete. We deliberately do NOT delete anything that has a slug/title/status.
  const isJunkDraft =
    !orphan.fields?.slug?.[L] &&
    !orphan.fields?.title?.[L] &&
    !orphan.fields?.status?.[L] &&
    !orphan.sys.publishedVersion;
  console.log(`--- orphan ${ORPHAN_ID} --- (fieldKeys=[${keys}], published=${!!orphan.sys.publishedVersion}, junk=${isJunkDraft})`);
  if (!isJunkDraft) {
    console.log(`  SKIP — entry has slug/title/status or is published; not deleting.\n`);
  } else if (APPLY) {
    await orphan.delete();
    console.log(`  ✓ deleted junk orphan ${ORPHAN_ID}\n`);
  } else {
    console.log(`  would delete (junk draft, no slug/title/status, unpublished)\n`);
  }
} catch (e) {
  console.log(`  orphan lookup skipped: ${e.message}\n`);
}

console.log("Done.");
process.exit(0);
