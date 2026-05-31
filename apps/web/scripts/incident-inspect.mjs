#!/usr/bin/env node
// READ-ONLY incident diagnostic. Inspects the affected raffles + their draw
// audit so we can see the true Firestore state before any cleanup writes.
//
//   node scripts/incident-inspect.mjs
//
// Loads creds from apps/web/.env.local (same as the Next server).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDotEnvLocal() {
  try {
    const raw = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const [, key, rawValue] = m;
      if (process.env[key]) continue;
      process.env[key] = rawValue
        .replace(/^"([\s\S]*)"$/, "$1")
        .replace(/^'([\s\S]*)'$/, "$1");
    }
  } catch {}
}

function parsePrivateKey() {
  const b64 = process.env.FIREBASE_PRIVATE_KEY_B64;
  if (b64) {
    try { return Buffer.from(b64, "base64").toString("utf-8"); } catch {}
  }
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  return raw ? raw.replace(/\\n/g, "\n").replace(/^"([\s\S]*)"$/, "$1").trim() : undefined;
}

loadDotEnvLocal();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: parsePrivateKey(),
  }),
});

const db = admin.firestore();
const fmt = (ts) => (ts?.toDate ? ts.toDate().toISOString() : ts ?? null);
const now = Date.now();

const all = await db.collection("raffles").get();
console.log(`\n===== ALL RAFFLES SAFETY SCAN (now=${new Date().toISOString()}) =====`);
for (const doc of all.docs) {
  const d = doc.data();
  const endMs = d.endAt?.toDate ? d.endAt.toDate().getTime() : null;
  const expired = endMs != null && endMs <= now;
  const danger = d.drawStatus === "pending" && expired && !d.drawnAt && d.drawType !== "live";
  console.log(`${danger ? "⚠️ DANGER" : "  ok    "} ${doc.id.padEnd(28)} drawStatus=${String(d.drawStatus).padEnd(10)} drawType=${String(d.drawType).padEnd(5)} drawn=${d.drawnAt ? "Y" : "n"} sold=${d.ticketsSold}/${d.maxTickets} endAt=${fmt(d.endAt)}`);
}

const SLUGS = ["100-cash-raffle", "250-cash-raffle"];
for (const slug of SLUGS) {
  const snap = await db.collection("raffles").doc(slug).get();
  console.log(`\n================ raffles/${slug} ================`);
  if (!snap.exists) { console.log("  (does not exist)"); continue; }
  const d = snap.data();
  console.log({
    drawStatus: d.drawStatus,
    drawType: d.drawType,
    isReoccurring: d.isReoccurring,
    ticketsSold: d.ticketsSold,
    nextTicketNumber: d.nextTicketNumber,
    maxTickets: d.maxTickets,
    endAt: fmt(d.endAt),
    drawnAt: fmt(d.drawnAt),
    winningTicketNumber: d.winningTicketNumber,
    winnerEmail: d.winnerEmail,
    winnerOrderId: d.winnerOrderId,
    winnerProfileSource: d.winnerProfileSource,
    contentfulArchived: d.contentfulArchived,
    drawAudit: d.drawAudit,
  });

  const audit = await db.collection("draw_audit").doc(`${slug}_auto`).get();
  console.log(`  draw_audit/${slug}_auto:`, audit.exists ? audit.data() : "(none)");
}

console.log(`\nServer time now: ${new Date().toISOString()}`);
process.exit(0);
