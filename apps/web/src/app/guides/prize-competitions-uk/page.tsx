import type { Metadata } from "next";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/json-ld";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { getGuide } from "@/lib/seo/guides-data";

const GUIDE = getGuide("prize-competitions-uk");

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
    question: "What is a UK prize competition?",
    answer:
      "A UK prize competition is a draw where entrants pay (or enter free by post) to win a defined prize, and where a skill question or a free entry route puts the competition outside the legal definition of a lottery under the Gambling Act 2005.",
  },
  {
    question: "How are prize competitions different from lotteries?",
    answer:
      "Lotteries rely wholly on chance and require a Gambling Commission licence to run commercially. Prize competitions include a skill element — or run a free entry route alongside the paid route — which exempts them from the lottery definition and lets them run without a gambling licence.",
  },
  {
    question: "What kinds of prizes do UK competitions usually offer?",
    answer:
      "The most common categories are cash prizes (often advertised as 'tax-free cash'), cars, holidays, technology bundles (phones, consoles, laptops), watches, and lifestyle experiences. The maximum prize value is whatever the operator chooses to offer.",
  },
  {
    question: "Are my entries refundable?",
    answer:
      "Generally no. The Consumer Contracts Regulations 2013 right of cancellation does not apply to competition entries because they are time-bound, lottery-style transactions. Always read the operator's refund policy before entering.",
  },
  {
    question: "How do I spot a scam or unreliable operator?",
    answer:
      "Red flags include: no UK company number on the site, no postal address, no published Terms and Conditions, no free postal entry route, vague or 'TBC' draw dates that keep moving, and an absence of named past winners or verifiable results. Legitimate operators publish all of these.",
  },
];

const KEY_TAKEAWAYS = [
  {
    label: "What it is",
    value:
      "A UK prize competition is a paid-entry draw with a skill question and a free postal entry route, making it legal under the Gambling Act 2005.",
  },
  {
    label: "Not a lottery",
    value:
      "Lotteries rely wholly on chance and require a Gambling Commission licence. Competitions don't, because of the skill or free entry exemption.",
  },
  {
    label: "Typical prizes",
    value:
      "Cash (tax-free), cars, holidays, tech bundles, watches, and lifestyle experiences. There is no legal maximum.",
  },
  {
    label: "How to choose",
    value:
      "Look for a UK company number, postal address, published T&Cs, free postal entry, transparent draws, and named past winners.",
  },
];

export default function PrizeCompetitionsGuidePage() {
  return (
    <GuideLayout
      guide={GUIDE}
      keyTakeaways={KEY_TAKEAWAYS}
      intro={
        <p>
          UK prize competitions have become one of the most popular ways to win
          cash, cars and luxury items online — but the legal mechanics behind
          them aren&apos;t always well explained. This guide unpacks what a
          prize competition actually is, how it differs from a lottery or a
          raffle, what prizes you can expect, and how to spot a legitimate
          operator before you enter.
        </p>
      }
      faqs={FAQS}
      body={
        <>
          <h2>What is a UK prize competition?</h2>
          <p>
            A <strong>prize competition</strong> is a draw where:
          </p>
          <ul>
            <li>Entrants pay an entry fee to take part (the &ldquo;paid route&rdquo;), OR</li>
            <li>Enter for free by post (the &ldquo;free postal entry route&rdquo;),</li>
            <li>
              The operator awards one or more defined prizes to the winning
              entrant(s) on a specific draw date.
            </li>
          </ul>
          <p>
            What sets a prize competition apart from a lottery is a{" "}
            <strong>skill question</strong> — a multiple-choice question of
            enough difficulty to filter out chance entries — or the presence of
            a <strong>free entry route</strong> that mirrors the paid route.
            Either of these takes the draw outside the legal definition of a
            lottery and means the operator does not need a Gambling Commission
            licence.
          </p>
          <p>
            For the full legal explanation, see our separate guide:{" "}
            <Link href="/guides/are-prize-competitions-legal-uk">
              Are prize competitions legal in the UK?
            </Link>
          </p>

          <h2>How prize competitions differ from lotteries and raffles</h2>
          <p>
            The three terms are often used interchangeably in casual
            conversation, but they have specific legal meanings in the UK:
          </p>

          <h3>Lottery</h3>
          <p>
            Wholly chance-based. Pay to enter, prizes allocated randomly. Must
            be licensed by the Gambling Commission unless it qualifies as a
            small &ldquo;exempt&rdquo; lottery (e.g. a workplace fundraiser).
            The National Lottery is the largest UK example.
          </p>

          <h3>Raffle</h3>
          <p>
            In strict legal terms a raffle is a <em>type</em> of lottery — a
            small-scale chance-based draw, traditionally run for charity at
            events. Modern online &ldquo;raffles&rdquo; that include a skill
            question or a free entry route are actually prize competitions
            under UK law, even if the operator markets them as &ldquo;raffles&rdquo;
            because the word is more familiar to entrants.
          </p>

          <h3>Prize competition</h3>
          <p>
            Paid-entry draw with either a skill element or a free entry route.
            Not classed as gambling. Does not require a licence. This is what
            sites like Coast Competitions, Best of the Best, and similar
            operators run.
          </p>

          <h2>The typical UK competition formats</h2>
          <p>
            Most paid UK prize competitions in 2026 follow one of two formats:
          </p>

          <h3>Ticket-based competitions</h3>
          <p>
            The operator sets a fixed maximum number of tickets (e.g. 5,000)
            and a fixed entry price per ticket. Entrants buy one or more
            tickets, answer the skill question, and are entered into the draw
            against everyone else who answered correctly. The competition ends
            either when the timer expires or when all tickets are sold —
            whichever comes first.
          </p>
          <p>
            Ticket-based formats make the odds transparent: if there are 5,000
            tickets and you buy 10, your maximum possible odds are 10 in
            5,000.
          </p>

          <h3>Open-ended timed competitions</h3>
          <p>
            The operator sets a closing date but not a ticket cap. Anyone can
            buy as many entries as they want until the timer runs out, then
            the draw happens. This format is more common on small
            social-media-based promotions and is generally less attractive
            because the odds aren&apos;t bounded.
          </p>

          <h2>What kinds of prizes are typical?</h2>
          <p>
            UK competition operators tend to specialise in a few prize
            categories:
          </p>
          <ul>
            <li>
              <strong>Cash prizes</strong> — often advertised as &ldquo;tax-free
              cash&rdquo; (correctly — see our{" "}
              <Link href="/guides/are-competition-winnings-tax-free-uk">
                tax guide
              </Link>
              ). Common values range from £500 to £100,000+.
            </li>
            <li>
              <strong>Cars</strong> — usually with a cash alternative for those
              who don&apos;t want the vehicle. This is a signature category in
              the UK competition niche.
            </li>
            <li>
              <strong>Holidays and experiences</strong> — luxury hotel stays,
              cruises, F1 weekends, supercar driving days.
            </li>
            <li>
              <strong>Technology bundles</strong> — iPhones, gaming PCs,
              consoles, AV setups.
            </li>
            <li>
              <strong>Watches and jewellery</strong> — Rolex, Omega, and other
              high-end brands.
            </li>
          </ul>
          <p>
            There is no legal maximum prize value for a UK prize competition.
            Operators choose what to offer based on their cost of acquiring the
            prize and the entry pricing.
          </p>

          <h2>How to spot a legitimate UK operator</h2>
          <p>
            Before you enter any UK prize competition, do this five-point
            check:
          </p>
          <ol>
            <li>
              <strong>Company number</strong> — a legitimate operator displays
              its UK Companies House number (e.g. &ldquo;Company No. 17087259&rdquo;).
              You can verify any company at{" "}
              <a
                href="https://find-and-update.company-information.service.gov.uk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Companies House
              </a>
              .
            </li>
            <li>
              <strong>Registered postal address</strong> — published in the
              footer or Terms &amp; Conditions. The free postal entry route is
              sent to this address.
            </li>
            <li>
              <strong>Full Terms &amp; Conditions</strong> — naming the
              promoter, age restrictions, draw mechanism, prize details, and
              the free postal entry instructions.
            </li>
            <li>
              <strong>Transparent draws</strong> — either live (broadcast on
              social media) or auditable (a published random seed and ticket
              total you can re-run yourself).
            </li>
            <li>
              <strong>Named past winners</strong> — with verifiable proof
              (Instagram tags, photos, hand-overs). If a site has been running
              for months but cannot point to any winners, treat it with
              caution.
            </li>
          </ol>

          <h2>How Coast Competitions fits</h2>
          <p>
            Coast Competitions (COAST COMPETITIONS LTD, UK Companies House
            #17087259, Ogmore-By-Sea, Wales) runs ticket-based UK prize
            competitions across cash, cars, tech and experiences. Every
            competition publishes its skill question, ticket cap, exact prize
            specification, draw date and free postal entry route.
          </p>
          <p>
            Browse the current line-up on the{" "}
            <Link href="/raffles">live competitions page</Link>, or check past
            results on the{" "}
            <Link href="/results">draw results page</Link>.
          </p>

          <h2>Summary</h2>
          <p>
            A UK prize competition is a paid-entry draw that uses a skill
            question or a free postal entry route to operate legally outside
            the gambling licensing regime. The legitimate operators publish
            their company details, terms, free entry instructions and past
            winners. Verify all five before you enter — and then enjoy the
            draws that meet the bar.
          </p>
        </>
      }
    />
  );
}
