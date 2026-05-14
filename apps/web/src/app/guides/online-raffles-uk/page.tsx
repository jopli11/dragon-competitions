import type { Metadata } from "next";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/json-ld";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { getGuide } from "@/lib/seo/guides-data";

const GUIDE = getGuide("online-raffles-uk");

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
    question: "Are online raffles legal in the UK?",
    answer:
      "Most paid online 'raffles' in the UK are technically prize competitions, not raffles in the strict legal sense. They run legally without a gambling licence because they include a skill question and/or a free postal entry route. True chance-based raffles run by an unlicensed commercial operator would be unlawful.",
  },
  {
    question: "What is the difference between an online raffle and a prize competition?",
    answer:
      "Legally: a raffle is a chance-only draw (a type of small lottery) and requires either a licence or a small-society/incidental exemption. A prize competition uses a skill question or a free entry route to fall outside the lottery definition. Operators often use 'raffle' as marketing language even when the product is legally a prize competition.",
  },
  {
    question: "How does the free postal entry route work?",
    answer:
      "You send a postcard with your name, address, date of birth, and the competition slug or reference to the operator's published registered address. The operator must treat your postal entry as equivalent to a paid entry, judged on the same skill question and competing for the same prize.",
  },
  {
    question: "How is the winner picked?",
    answer:
      "Reputable operators use one of two methods. Automated draws use a cryptographically secure random number generator (CSPRNG) and publish the random seed and total ticket count so anyone can re-run the calculation. Live draws are broadcast on social media using an independent random number generator. Either way, you should be able to verify the outcome.",
  },
  {
    question: "What should I check before entering an online raffle?",
    answer:
      "The operator's UK Companies House number, registered postal address, full Terms and Conditions, published free entry route, a definite draw date that does not move, and visible past winners. If any of those are missing, treat the draw with caution.",
  },
];

const KEY_TAKEAWAYS = [
  {
    label: "Are they legal?",
    value:
      "Yes — when a skill question or free postal entry route is in place. Most paid UK 'online raffles' are technically prize competitions under the Gambling Act 2005.",
  },
  {
    label: "Free entry",
    value:
      "Every legitimate operator publishes a free postal entry route. Posting a postcard counts as an entry for the same prize on the same skill question.",
  },
  {
    label: "Transparent draws",
    value:
      "Automated draws use a CSPRNG and publish the seed + ticket total. Live draws are broadcast on social. You should be able to verify the result.",
  },
  {
    label: "How to choose",
    value:
      "Company number, registered address, T&Cs, free entry route, fixed draw date, and named past winners. All five, every time.",
  },
];

export default function OnlineRafflesGuidePage() {
  return (
    <GuideLayout
      guide={GUIDE}
      keyTakeaways={KEY_TAKEAWAYS}
      intro={
        <p>
          &ldquo;Online raffles&rdquo; is the search term most UK entrants use,
          but in 2026 the products you find under that name are almost all{" "}
          <strong>skill-based prize competitions</strong> — a different legal
          beast to a traditional raffle. This guide explains how online raffles
          work in practice, the legal mechanics that let them run, and what to
          look for before you enter.
        </p>
      }
      faqs={FAQS}
      body={
        <>
          <h2>What people mean by &ldquo;online raffle&rdquo;</h2>
          <p>
            In casual usage, an &ldquo;online raffle&rdquo; in the UK is any
            web-based draw where you pay a small amount per ticket and a winner
            is picked from the entrants. The marketing language descends from
            the village-hall raffles people grew up with — pay £1, tear off
            half a ticket, hope for the best.
          </p>
          <p>
            In <strong>legal</strong> terms, however, most paid online
            &ldquo;raffles&rdquo; in 2026 are not raffles at all. They are{" "}
            <strong>prize competitions</strong> under the Gambling Act 2005,
            because they include a skill question or a free entry route. The
            distinction matters because it determines whether the operator
            needs a Gambling Commission licence.
          </p>

          <h2>Raffle vs prize competition — the legal mechanics</h2>
          <p>
            The Gambling Act 2005 defines a <strong>lottery</strong> as a draw
            where (a) people pay to enter, (b) prizes are awarded, and (c) the
            allocation of prizes relies wholly on chance. A raffle is a small
            example of a lottery.
          </p>
          <p>
            A commercial operator cannot run a lottery without one of:
          </p>
          <ul>
            <li>
              An <strong>Operating Licence</strong> from the Gambling
              Commission (e.g. the National Lottery operator, society lottery
              operators).
            </li>
            <li>
              A specific <strong>exemption</strong> under the Act (e.g. small
              society lotteries registered with a local authority,
              workplace/residents&apos; lotteries, incidental non-commercial
              lotteries at events).
            </li>
          </ul>
          <p>
            Most online operators are commercial businesses that don&apos;t fit
            any of those exemptions. So instead of getting a lottery licence,
            they design their product to fall <em>outside</em> the lottery
            definition by adding two safeguards: a meaningful skill question
            and a free postal entry route. That moves the product into the
            &ldquo;prize competition&rdquo; category, which is unregulated by
            the Gambling Commission.
          </p>
          <p>
            For the full explanation see our companion guide:{" "}
            <Link href="/guides/are-prize-competitions-legal-uk">
              Are prize competitions legal in the UK?
            </Link>
          </p>

          <h2>How entry actually works</h2>
          <p>
            A typical online raffle journey on a reputable UK platform looks
            like this:
          </p>
          <ol>
            <li>
              Browse current draws on the operator&apos;s site and pick the
              prize you want to win.
            </li>
            <li>
              Read the skill question and answer it correctly — multiple choice
              with three or four options.
            </li>
            <li>
              Choose how many tickets you want, then check out using card,
              Apple Pay or Google Pay.
            </li>
            <li>
              Receive an email confirmation with your unique ticket numbers
              within seconds.
            </li>
            <li>
              The competition ends at the published end time or when the ticket
              cap sells out (whichever comes first) — and the draw takes place.
            </li>
            <li>
              The winner is contacted directly and the result is published on
              the operator&apos;s results page.
            </li>
          </ol>

          <h2>The free postal entry route</h2>
          <p>
            Every reputable UK online raffle operator publishes a free postal
            entry route. The exact format varies but the standard pattern is:
          </p>
          <ul>
            <li>Hand-write a postcard with your full name, address, date of birth, and the competition slug or reference.</li>
            <li>Sign and date it (the operator&apos;s T&amp;Cs specify exactly what counts as a valid entry).</li>
            <li>Post it to the operator&apos;s registered address.</li>
            <li>
              The operator processes it on receipt, allocates you a ticket
              number, and you are entered for the same prize on the same skill
              question as paid entrants.
            </li>
          </ul>
          <p>
            On Coast Competitions, the free postal entry instructions are in
            the <Link href="/terms#free-postal-entry">Terms &amp;
            Conditions</Link>. You can enter every single live competition for
            the price of a postcard and a stamp.
          </p>

          <h2>How draws actually work</h2>
          <p>
            Two draw mechanisms are common in the UK industry, and both can be
            done transparently.
          </p>

          <h3>Automated CSPRNG draws</h3>
          <p>
            When the competition ends, the operator&apos;s software generates a
            random 256-bit seed using a{" "}
            <strong>cryptographically secure pseudo-random number generator</strong>
            {" "}
            (CSPRNG) — the same class of random source used in banking and
            encryption. The seed is combined with the total ticket count to
            pick the winning ticket number.
          </p>
          <p>
            A transparent operator publishes both the seed and the total ticket
            count after the draw. You can then verify the result yourself with
            a simple modulo calculation:{" "}
            <code>winning_ticket = (seed_integer % total_tickets) + 1</code>.
            See Coast Competitions&apos; published audit trail on every
            completed draw at{" "}
            <Link href="/results">coastcompetitions.com/results</Link>.
          </p>

          <h3>Live social media draws</h3>
          <p>
            Some operators prefer to broadcast the draw live on Instagram,
            TikTok, or Facebook. A neutral random number generator (e.g.{" "}
            <a
              href="https://www.random.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              random.org
            </a>
            ) is used to pick the winning ticket on camera, and the recording
            stays on the operator&apos;s channel as evidence.
          </p>
          <p>
            Live draws have the advantage of being viscerally watchable.
            Automated draws have the advantage of being mathematically
            re-verifiable after the fact. Both are valid; the choice is the
            operator&apos;s.
          </p>

          <h2>Red flags to watch for</h2>
          <p>
            Treat any of these as warning signs before parting with money on a
            UK online raffle:
          </p>
          <ul>
            <li>No UK Companies House number on the site.</li>
            <li>No registered postal address.</li>
            <li>No published Terms and Conditions, or T&amp;Cs that don&apos;t name the promoter.</li>
            <li>No free postal entry route — this is a legal red flag, not a courtesy red flag.</li>
            <li>Draw dates that keep moving, with no commitment to a hard end.</li>
            <li>
              No published past winners, or winners listed without verifiable
              evidence (Instagram tags, photos).
            </li>
            <li>Operator name doesn&apos;t match the company on the payment receipt.</li>
          </ul>
          <p>
            If you spot any of these, walk away. There are plenty of
            legitimate operators that meet all five trust signals every time.
          </p>

          <h2>Summary</h2>
          <p>
            UK &ldquo;online raffles&rdquo; in 2026 are mostly skill-based
            prize competitions running legally under the Gambling Act 2005, via
            a combination of a skill question and a free postal entry route.
            The reputable operators publish their company details, T&amp;Cs,
            free entry instructions, and draw audit trails up front.
          </p>
          <p>
            To see this in practice, browse{" "}
            <Link href="/raffles">Coast Competitions&apos; live draws</Link>,
            or read more in the companion guides:{" "}
            <Link href="/guides/prize-competitions-uk">
              UK prize competitions explained
            </Link>{" "}
            and{" "}
            <Link href="/guides/win-cash-prizes-uk">
              how to win cash prizes online in the UK
            </Link>
            .
          </p>
        </>
      }
    />
  );
}
