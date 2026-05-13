#!/usr/bin/env node
// One-off cleanup script for test orders left over from the DNA sandbox.
//
// Usage:
//   node scripts/mark-test-orders.mjs                # dry run (default)
//   node scripts/mark-test-orders.mjs --apply        # actually mark orders
//   node scripts/mark-test-orders.mjs --before 2026-05-13 --apply
//   node scripts/mark-test-orders.mjs --apply --delete   # destructively wipe them
//
// Flags:
//   --apply          Required to perform writes; default is dry run.
//   --before <date>  Only target orders with createdAt < this ISO date.
//   --delete         Hard-delete instead of marking isTestOrder=true.
//
// Requires the same env vars as the Next.js server:
//   FIREBASE_PROJECT_ID
//   FIREBASE_CLIENT_EMAIL
//   FIREBASE_PRIVATE_KEY_B64  (or FIREBASE_PRIVATE_KEY)
// These are loaded automatically from apps/web/.env.local when present.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadDotEnvLocal() {
  try {
    const envPath = resolve(__dirname, "..", ".env.local");
    const raw = readFileSync(envPath, "utf-8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const [, key, rawValue] = m;
      if (process.env[key]) continue;
      const value = rawValue.replace(/^"([\s\S]*)"$/, "$1").replace(/^'([\s\S]*)'$/, "$1");
      process.env[key] = value;
    }
  } catch {
    // .env.local optional — env may already be exported in the shell.
  }
}

function parsePrivateKey() {
  const b64 = process.env.FIREBASE_PRIVATE_KEY_B64;
  if (b64) {
    try {
      return Buffer.from(b64, "base64").toString("utf-8");
    } catch {
      // fall through
    }
  }
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  if (!raw) return undefined;
  return raw
    .replace(/\\n/g, "\n")
    .replace(/^"([\s\S]*)"$/, "$1")
    .replace(/^'([\s\S]*)'$/, "$1")
    .trim();
}

function parseArgs(argv) {
  const args = { apply: false, before: null, delete: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--apply") args.apply = true;
    else if (a === "--delete") args.delete = true;
    else if (a === "--before") {
      const value = argv[++i];
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        console.error(`Invalid --before date: ${value}`);
        process.exit(1);
      }
      args.before = d;
    }
  }
  return args;
}

async function main() {
  loadDotEnvLocal();

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = parsePrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    console.error(
      "Missing Firebase Admin credentials. Need FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY_B64 (or FIREBASE_PRIVATE_KEY)."
    );
    process.exit(1);
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  const db = admin.firestore();
  const args = parseArgs(process.argv.slice(2));

  console.log(
    `Mode: ${args.apply ? (args.delete ? "DELETE" : "MARK isTestOrder=true") : "DRY RUN"}` +
      (args.before ? ` (before ${args.before.toISOString()})` : "")
  );

  let query = db.collection("orders");
  if (args.before) {
    query = query.where("createdAt", "<", admin.firestore.Timestamp.fromDate(args.before));
  }

  const snapshot = await query.get();
  const candidates = snapshot.docs.filter((doc) => {
    const data = doc.data();
    // Already flagged — skip.
    if (data.isTestOrder === true) return false;
    return true;
  });

  console.log(`Found ${snapshot.size} orders, ${candidates.length} candidates to process.`);

  if (!candidates.length) {
    console.log("Nothing to do.");
    process.exit(0);
  }

  let revenueWiped = 0;
  for (const doc of candidates) {
    const data = doc.data();
    if (data.status === "completed" && typeof data.amountTotal === "number") {
      revenueWiped += data.amountTotal;
    }
  }
  console.log(
    `If applied, ~£${(revenueWiped / 100).toFixed(2)} of "revenue" will stop counting in admin stats.`
  );

  if (!args.apply) {
    console.log("Dry run complete. Re-run with --apply to commit changes.");
    process.exit(0);
  }

  const BATCH_SIZE = 400;
  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const slice = candidates.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const doc of slice) {
      if (args.delete) {
        batch.delete(doc.ref);
      } else {
        batch.update(doc.ref, { isTestOrder: true });
      }
    }
    await batch.commit();
    console.log(`Processed ${Math.min(i + BATCH_SIZE, candidates.length)} / ${candidates.length}`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
