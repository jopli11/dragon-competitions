#!/usr/bin/env node
// Sends the apology emails to the entrants who received a false "you won"
// notice during the duplicate-draw incident but are NOT the announced winners.
// Dry-run by default; pass --apply to actually send via Postmark.
//
//   node scripts/incident-apology-emails.mjs          # dry run (prints only)
//   node scripts/incident-apology-emails.mjs --apply  # send

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import postmarkPkg from "postmark";
const postmark = postmarkPkg.default ?? postmarkPkg;

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

const FROM = process.env.POSTMARK_FROM_EMAIL;
const TOKEN = process.env.POSTMARK_SERVER_TOKEN;

const RECIPIENTS = [
  { to: "danpsmo@gmail.com",            prize: "£100 Cash Prize" },
  { to: "neal.young@agverandas.co.uk",  prize: "£250 Cash Prize" },
  { to: "alexlong183@gmail.com",        prize: "£250 Cash Prize" },
];

const SUBJECT = "About the winner email we sent you — our mistake, and our apologies";

function textBody(prize) {
  return [
    "Hi there,",
    "",
    `Earlier today you received an email from us saying you'd won the ${prize}. We're really sorry, but that email was sent in error, and we want to be straight with you about what happened.`,
    "",
    "We'd extended this competition's closing time, but a technical fault in our system didn't register the new time and mistakenly fired off winner notifications before the competition had properly closed. Yours was one of them.",
    "",
    "The competition has now closed and been drawn properly, and on this occasion the prize has gone to a different ticket holder. We know that's a real disappointment after receiving that first email, and we're genuinely sorry for the confusion and the false hope it gave you.",
    "",
    "To make up for it, we'd like to offer you a free entry into a competition of your choice. Just reply to this email and we'll set it up for you.",
    "",
    "Thank you for your understanding, and again, our sincere apologies.",
    "",
    "The Coast Competitions Team",
  ].join("\n");
}

function htmlBody(prize) {
  return `
    <p>Hi there,</p>
    <p>Earlier today you received an email from us saying you'd won the <strong>${prize}</strong>. We're really sorry, but that email was sent in error, and we want to be straight with you about what happened.</p>
    <p>We'd extended this competition's closing time, but a technical fault in our system didn't register the new time and mistakenly fired off winner notifications before the competition had properly closed. Yours was one of them.</p>
    <p>The competition has now closed and been drawn properly, and on this occasion the prize has gone to a different ticket holder. We know that's a real disappointment after receiving that first email, and we're genuinely sorry for the confusion and the false hope it gave you.</p>
    <p>To make up for it, we'd like to offer you <strong>a free entry into a competition of your choice</strong>. Just reply to this email and we'll set it up for you.</p>
    <p>Thank you for your understanding, and again, our sincere apologies.</p>
    <p>The Coast Competitions Team</p>
  `;
}

console.log(`MODE: ${APPLY ? "APPLY (sending)" : "DRY RUN (no send)"}`);
console.log(`From: ${FROM}\n`);

if (APPLY && (!FROM || !TOKEN)) {
  console.error("Missing POSTMARK_FROM_EMAIL or POSTMARK_SERVER_TOKEN — aborting.");
  process.exit(1);
}

const client = APPLY ? new postmark.ServerClient(TOKEN) : null;

for (const r of RECIPIENTS) {
  console.log(`================ To: ${r.to}  (${r.prize}) ================`);
  console.log(`Subject: ${SUBJECT}`);
  console.log(textBody(r.prize));
  console.log("");
  if (APPLY) {
    const res = await client.sendEmail({
      From: FROM,
      To: r.to,
      Subject: SUBJECT,
      TextBody: textBody(r.prize),
      HtmlBody: htmlBody(r.prize),
      MessageStream: "outbound",
    });
    console.log(`  ✓ sent MessageID=${res.MessageID} To=${res.To} SubmittedAt=${res.SubmittedAt}\n`);
  }
}

console.log("Done.");
process.exit(0);
