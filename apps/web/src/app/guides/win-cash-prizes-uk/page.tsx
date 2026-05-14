import type { Metadata } from "next";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/json-ld";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { getGuide } from "@/lib/seo/guides-data";

const GUIDE = getGuide("win-cash-prizes-uk");

export const metadata: Metadata = {
  title: GUIDE.metaTitle,
  description: GUIDE.metaDescription,
  alternates: { canonical: `/guides/${GUIDE.slug}` },
  openGraph: {
    title: GUIDE.metaTitle,
    description: GUIDE.metaDescription,
    url: `/guides/${GUIDE.slug}`,
    type: "article",
    publishedTime: GUIDE.datePublished,
    modifiedTime: GUIDE.dateModified,
  },
};

const FAQS: FaqItem[] = [
  {
    question: "How can I win cash prizes online in the UK?",
    answer:
      "The most accessible legal route is to enter UK skill-based prize competitions that offer cash as the headline prize. You answer a skill question, buy one or more tickets (or enter for free by post), and you are entered into the draw. Winners receive 100% of the prize value tax-free.",
  },
  {
    question: "Are cash prizes really tax-free in the UK?",
    answer:
      "Yes. UK prize competition and raffle winnings are not classed as earned income by HMRC, so you do not pay income tax or National Insurance on the prize itself. See our dedicated tax guide for the detail and edge cases.",
  },
  {
    question: "What are the odds compared to the National Lottery?",
    answer:
      "Vastly better. National Lottery odds of winning the jackpot are around 1 in 45 million. A UK prize competition with a 5,000-ticket cap gives a maximum of 1 in 5,000 odds per ticket — a far smaller jackpot, but odds many orders of magnitude better.",
  },
  {
    question: "Do I have to be a UK resident?",
    answer:
      "Almost all UK competition operators restrict entry to UK residents aged 18 or over. Always check the Terms and Conditions of the specific competition before you enter.",
  },
  {
    question: "How are winners paid?",
    answer:
      "Cash prizes are paid by bank transfer once the operator has verified the winner's identity. Reputable operators publish their payout process in their Terms and Conditions and confirm payment within a defined window after the draw.",
  },
];

const KEY_TAKEAWAYS = [
  {
    label: "How it works",
    value:
      "Enter UK skill-based prize competitions that have cash as the prize. Answer the skill question, buy tickets or use free postal entry, and you're in the draw.",
  },
  {
    label: "Tax position",
    value:
      "100% tax-free at the point of winning. HMRC does not treat one-off prize winnings as earned income.",
  },
  {
    label: "Odds vs lottery",
    value:
      "A 5,000-ticket UK competition gives up to 1 in 5,000 per ticket — vastly better odds than the National Lottery (~1 in 45m), with a smaller jackpot.",
  },
  {
    label: "Choose well",
    value:
      "Pick operators with a UK company number, fixed draw dates, free postal entry, a ticket cap, transparent draw verification, and named past winners.",
  },
];

export default function WinCashPrizesGuidePage() {
  return (
    <GuideLayout
      guide={GUIDE}
      keyTakeaways={KEY_TAKEAWAYS}
      intro={
        <p>
          Winning cash prizes online in the UK doesn&apos;t have to mean chasing
          long-odds lottery jackpots. UK skill-based prize competitions offer
          much better per-ticket odds, fully tax-free winnings, and a regulated
          legal framework — provided you choose your operator carefully. Here
          is how to do it well.
        </p>
      }
      faqs={FAQS}
      body={
        <>
          <h2>The legitimate online routes to UK cash prizes</h2>
          <p>
            There are essentially four legitimate ways to win cash prizes
            online in the UK:
          </p>
          <ol>
            <li>
              <strong>Skill-based prize competitions</strong> with a cash prize
              (the main subject of this guide).
            </li>
            <li>
              <strong>The National Lottery</strong> and its sub-products —
              licensed, regulated, very low odds, very high jackpots.
            </li>
            <li>
              <strong>Licensed society lotteries</strong> — charity-run, lower
              jackpots than the National Lottery, better odds.
            </li>
            <li>
              <strong>Premium Bonds</strong> from NS&amp;I — your stake is
              never at risk, but the expected &ldquo;return&rdquo; is the
              monthly prize draw.
            </li>
          </ol>
          <p>
            This guide focuses on option 1, which sits at a sweet spot of
            decent odds, meaningful prizes, and a clean tax position.
          </p>

          <h2>Why UK cash prize competitions are tax-free</h2>
          <p>
            HMRC does not treat one-off prize competition or raffle winnings as
            earned income. That means:
          </p>
          <ul>
            <li>You receive 100% of the headline prize.</li>
            <li>Nothing is deducted at source by the operator.</li>
            <li>You do not declare the prize on a Self Assessment return.</li>
            <li>You do not pay National Insurance on it.</li>
          </ul>
          <p>
            This is the same treatment that applies to National Lottery
            winnings and Premium Bond prizes. For the full position — including
            the secondary tax events (interest on savings, inheritance, gifts)
            — read the companion guide:{" "}
            <Link href="/guides/are-competition-winnings-tax-free-uk">
              Are competition winnings tax-free in the UK?
            </Link>
          </p>

          <h2>How the odds actually compare</h2>
          <p>
            One of the biggest practical advantages of UK skill-based cash
            competitions over traditional lotteries is the odds-per-ticket
            ratio. Some illustrative numbers:
          </p>
          <ul>
            <li>
              <strong>National Lottery Lotto jackpot</strong> — approximately{" "}
              <strong>1 in 45,057,474</strong> per line.
            </li>
            <li>
              <strong>EuroMillions jackpot</strong> — approximately{" "}
              <strong>1 in 139,838,160</strong> per line.
            </li>
            <li>
              <strong>UK competition with 5,000 ticket cap</strong> — up to{" "}
              <strong>1 in 5,000</strong> per ticket.
            </li>
            <li>
              <strong>UK competition with 1,000 ticket cap</strong> — up to{" "}
              <strong>1 in 1,000</strong> per ticket.
            </li>
          </ul>
          <p>
            The jackpot is much smaller — typically a few thousand pounds up to
            six figures rather than millions — but the per-ticket probability
            of winning is many orders of magnitude better. For most entrants,
            this is the more honest expected-value trade-off.
          </p>

          <h2>How to choose a competition</h2>
          <p>
            Not every UK cash competition is run to the same standard. Use
            this checklist before entering:
          </p>

          <h3>1. Verify the operator</h3>
          <p>
            Look for a UK Companies House number displayed on the site (you
            can verify any company at{" "}
            <a
              href="https://find-and-update.company-information.service.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Companies House
            </a>
            ), and a registered postal address. Both should appear in the
            footer or Terms.
          </p>

          <h3>2. Check the ticket cap and entry price</h3>
          <p>
            A capped ticket count means bounded odds. Multiply your tickets by
            the inverse of the cap to get your maximum probability. If a
            competition has no published cap, you can&apos;t calculate your
            odds — and that should make you cautious.
          </p>

          <h3>3. Confirm a hard draw date</h3>
          <p>
            Reputable operators publish a fixed draw date and commit to it
            regardless of ticket sales. If the date keeps moving, walk away.
            Coast Competitions, for example, runs a strict &ldquo;no
            extensions&rdquo; policy — the timer hitting zero triggers the
            draw, whether 100 or 5,000 tickets were sold.
          </p>

          <h3>4. Look for transparent draw verification</h3>
          <p>
            Either a live broadcast draw (recorded on the operator&apos;s
            social channels) or an auditable CSPRNG-based draw with a published
            seed and ticket count. Both are valid. If neither is offered,
            you&apos;re trusting the operator&apos;s word with no way to
            verify.
          </p>

          <h3>5. See evidence of past winners</h3>
          <p>
            Real photos, real Instagram tags, real bank-transfer confirmations
            from named winners. The Coast Competitions{" "}
            <Link href="/winners">winners page</Link> is an example — every
            winner has a verifiable story attached.
          </p>

          <h2>Practical tips for entrants</h2>
          <ul>
            <li>
              <strong>Set a monthly budget.</strong> Treat it as entertainment
              spend, not investment.
            </li>
            <li>
              <strong>Spread across several competitions</strong> rather than
              buying maximum tickets in one.
            </li>
            <li>
              <strong>Read the Terms before you enter</strong> — especially
              the eligibility, draw date, and prize-claim windows.
            </li>
            <li>
              <strong>Use the free postal entry route</strong> for any
              competition where the prize is large and the cost of a postcard
              is rounding error. It&apos;s a legal route, not a courtesy
              route.
            </li>
            <li>
              <strong>Keep your confirmation emails</strong> — they are your
              proof of entry and ticket allocation.
            </li>
            <li>
              If you ever feel your entries are becoming a problem, the UK
              charity{" "}
              <a
                href="https://www.begambleaware.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                BeGambleAware
              </a>{" "}
              provides free confidential support.
            </li>
          </ul>

          <h2>How Coast Competitions runs its cash prizes</h2>
          <p>
            Coast Competitions runs ticket-based UK cash and prize competitions
            with:
          </p>
          <ul>
            <li>Published company number (Companies House #17087259).</li>
            <li>Fixed ticket caps and entry prices, displayed before purchase.</li>
            <li>Hard draw dates that do not move.</li>
            <li>Free postal entry route published in the Terms.</li>
            <li>
              CSPRNG draws with the random seed and total ticket count
              published in the audit trail on each result.
            </li>
            <li>Named, verifiable past winners.</li>
          </ul>
          <p>
            You can see the current cash and prize line-up on the{" "}
            <Link href="/raffles">live competitions page</Link>.
          </p>

          <h2>Summary</h2>
          <p>
            UK skill-based prize competitions are a legitimate and tax-free
            route to winning cash prizes online. The odds per ticket are much
            better than traditional lotteries, the jackpots are smaller but
            meaningful, and the legal framework — the Gambling Act 2005 skill
            and free-entry exemptions — is well established. Choose operators
            that meet the five trust signals above, set a sensible budget, and
            enter for fun.
          </p>
        </>
      }
    />
  );
}
