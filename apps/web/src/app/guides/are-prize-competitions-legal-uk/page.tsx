import type { Metadata } from "next";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/json-ld";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { getGuide } from "@/lib/seo/guides-data";

const GUIDE = getGuide("are-prize-competitions-legal-uk");

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
    question: "Are skill-based prize competitions legal in the UK?",
    answer:
      "Yes. Under the Gambling Act 2005, a competition that requires a genuine element of skill, knowledge or judgement to win — and that does not rely wholly on chance — is not classed as a lottery and does not require a gambling licence. It is a legal 'prize competition'.",
  },
  {
    question: "What makes a competition 'skill-based' in the eyes of UK law?",
    answer:
      "Schedule 2 of the Gambling Act 2005 says the skill element has to be sufficient to either prevent a significant proportion of people from entering, or prevent a significant proportion of those who do enter from receiving a prize. In practice, that means the question must be hard enough to filter out random guessers — not trivia anyone could answer.",
  },
  {
    question: "What is the 'free entry route' and why does it matter?",
    answer:
      "Section 339 of the Gambling Act 2005 allows an operator to run a draw-based promotion legally without a licence if there is a free entry route — a way to enter without paying — that is just as easy as the paid route, and the prize is the same. This is why every legitimate UK 'paid' competition also publishes a free postal entry address.",
  },
  {
    question: "Do I need to be a UK resident to enter a UK prize competition?",
    answer:
      "Most UK competition operators restrict entry to UK residents aged 18 or over for regulatory and tax reasons. The operator's Terms and Conditions are the authoritative source — always read them before entering.",
  },
  {
    question: "How can I tell if a UK competition operator is legitimate?",
    answer:
      "Check for: a UK registered company number on the website, a published postal address, clear Terms and Conditions that name the promoter, a free postal entry route, a transparent draw mechanism (live or auditable), and published past winners. The Gambling Commission's website lists operators it regulates.",
  },
];

const KEY_TAKEAWAYS = [
  {
    label: "Short answer",
    value:
      "Yes — UK prize competitions are legal under the Gambling Act 2005 when they include a genuine skill element OR a free entry route.",
  },
  {
    label: "Why",
    value:
      "Section 14 and Schedule 2 of the Act distinguish skill-based competitions from lotteries, which require a Gambling Commission licence.",
  },
  {
    label: "Free entry rule",
    value:
      "Every legitimate operator publishes a no-cost postal entry route (Gambling Act s.339). That makes the paid route legally valid.",
  },
  {
    label: "Who regulates this",
    value:
      "Skill-based competitions are not licensed by the Gambling Commission — but the Commission publishes guidance on the legal boundary line.",
  },
];

export default function LegalGuidePage() {
  return (
    <GuideLayout
      guide={GUIDE}
      keyTakeaways={KEY_TAKEAWAYS}
      intro={
        <p>
          Prize competitions are everywhere in UK marketing — from supermarket
          on-pack promotions to online platforms giving away cars and cash. The
          law that governs them is the <strong>Gambling Act 2005</strong>, and
          the line between a legal prize competition and an unlicensed lottery
          is sharper than most entrants realise.
        </p>
      }
      faqs={FAQS}
      disclaimer={
        <p>
          This article is general information about the UK legal framework for
          prize competitions and is not legal advice. If you are an operator
          designing a competition, or you are unsure whether a specific
          arrangement is lawful, you should read the{" "}
          <a
            href="https://www.gamblingcommission.gov.uk/guidance/lotteries-and-free-prize-draws/prize-competitions-and-free-draws"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gambling Commission&apos;s guidance
          </a>{" "}
          and take professional advice.
        </p>
      }
      body={
        <>
          <h2>The short answer</h2>
          <p>
            <strong>Yes</strong> — UK prize competitions are legal, provided
            they comply with the Gambling Act 2005. The crucial test is whether
            the competition is{" "}
            <em>genuinely skill-based</em> or whether it instead falls within
            the legal definition of a <em>lottery</em>, which requires a
            Gambling Commission licence to operate.
          </p>
          <p>
            In practice, two legal mechanisms allow paid-entry competitions to
            run lawfully without a gambling licence:
          </p>
          <ol>
            <li>
              They include a <strong>genuine element of skill</strong> that
              filters out chance-based entries, OR
            </li>
            <li>
              They offer a <strong>free entry route</strong> that is as easy and
              prominent as the paid route.
            </li>
          </ol>
          <p>
            Most reputable UK operators — Coast Competitions included — apply{" "}
            <strong>both</strong> mechanisms as a belt-and-braces approach.
          </p>

          <h2>The legal framework: Gambling Act 2005</h2>
          <p>
            The{" "}
            <a
              href="https://www.legislation.gov.uk/ukpga/2005/19/contents"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gambling Act 2005
            </a>{" "}
            governs all forms of gambling in Great Britain. Lotteries are a
            regulated form of gambling under the Act — you cannot run a paid
            lottery as a private commercial enterprise without a licence from
            the Gambling Commission.
          </p>
          <p>
            A <strong>lottery</strong> under the Act has three characteristics:
            (a) people pay to enter, (b) one or more prizes are awarded, and (c)
            the prizes are allocated by a process which relies wholly on
            chance. The third characteristic is the key one. The moment a
            competition introduces a meaningful skill element, it stops being a
            lottery.
          </p>

          <h3>What counts as &quot;wholly chance&quot;?</h3>
          <p>
            Schedule 2 of the Act sets out when a process is treated as relying
            wholly on chance. A skill question only takes the competition
            outside the lottery definition if it is hard enough that it can
            reasonably be expected to{" "}
            <strong>
              prevent a significant proportion of people from receiving a prize
            </strong>
            , or to{" "}
            <strong>
              prevent a significant proportion of people who wish to enter from
              doing so
            </strong>
            .
          </p>
          <p>
            That is why a serious operator will not use a question like
            &ldquo;What colour is the sky?&rdquo; — it would not filter
            anyone out and the competition would almost certainly be treated as
            an unlicensed lottery.
          </p>

          <h2>The free entry route (Section 339)</h2>
          <p>
            Section 339 of the Gambling Act provides a separate, parallel route
            to legality: a paid prize draw is not classed as a lottery if there
            is a{" "}
            <strong>
              free entry route that is just as easy to use as the paid route
            </strong>
            , and if the paid and free entrants compete for the same prize on
            the same terms.
          </p>
          <p>
            In the UK industry, the free entry route is almost always a postal
            entry: you write your name, address, date of birth and competition
            details on a postcard and post it to the operator&apos;s registered
            address. The operator must accept it as if you had paid.
          </p>
          <p>
            If you are entering a competition online, you can always find the
            free entry instructions in the operator&apos;s Terms and Conditions.
            On Coast Competitions, see our{" "}
            <Link href="/terms#free-postal-entry">free postal entry
            instructions</Link>.
          </p>

          <h2>Skill question + free entry: belt and braces</h2>
          <p>
            Because the Act&apos;s definition of &ldquo;sufficient skill&rdquo;
            can be argued in court on a case-by-case basis, most well-advised
            UK operators apply both mechanisms in parallel:
          </p>
          <ul>
            <li>
              A skill question hard enough to filter out a meaningful share of
              chance entries.
            </li>
            <li>
              A clearly published free postal entry route that mirrors the paid
              route.
            </li>
          </ul>
          <p>
            Doing both means the competition is exempt from the lottery
            definition on{" "}
            <strong>two independent grounds</strong>, which gives the operator
            and its entrants confidence that the competition is lawful even if
            the regulator were to challenge one element.
          </p>

          <h2>How Coast Competitions complies</h2>
          <p>
            Coast Competitions is run by COAST COMPETITIONS LTD (UK Companies
            House number 17087259). Every competition on the platform:
          </p>
          <ul>
            <li>
              Includes a multiple-choice skill question that must be answered
              correctly before entry is valid.
            </li>
            <li>
              Publishes a free postal entry route in the{" "}
              <Link href="/terms">Terms &amp; Conditions</Link> that is open to
              anyone, awards the same prize, and is judged on the same skill
              question.
            </li>
            <li>
              Uses a cryptographically secure random number generator (CSPRNG)
              for automated draws and publishes the seed and total ticket count
              so any entrant can re-run the calculation. See our{" "}
              <Link href="/results">draw results page</Link>.
            </li>
            <li>
              Restricts entry to UK residents aged 18 or over and publishes
              clear Terms &amp; Conditions naming the promoter and the
              registered address.
            </li>
          </ul>

          <h2>What about charity raffles and licensed lotteries?</h2>
          <p>
            Not every UK prize draw is a skill-based competition. The Gambling
            Act 2005 also provides for{" "}
            <strong>licensed lotteries</strong> — for example, the National
            Lottery (operated under a dedicated licence), society lotteries run
            by charities, and small-scale incidental lotteries. These have
            different rules and explicitly do not need a skill element because
            they hold a Commission licence.
          </p>
          <p>
            If you see a UK operator running a paid prize draw with{" "}
            <em>no</em> skill question and <em>no</em> free entry route, they
            should hold a lottery licence from the Gambling Commission — and
            you can verify any licensed operator in the{" "}
            <a
              href="https://www.gamblingcommission.gov.uk/public-register"
              target="_blank"
              rel="noopener noreferrer"
            >
              public register
            </a>
            . If they do not appear there, treat the operator with caution.
          </p>

          <h2>Summary</h2>
          <p>
            UK skill-based prize competitions are legal under the Gambling Act
            2005 when they include either a genuine skill element or a free
            entry route — and the safest operators apply both. The Gambling
            Commission does not licence skill-based competitions because they
            are not classified as gambling.
          </p>
          <p>
            If you want to see the rules applied in practice, browse our{" "}
            <Link href="/raffles">live UK prize competitions</Link>, read our{" "}
            <Link href="/terms">Terms &amp; Conditions</Link>, or learn more in
            our companion guide:{" "}
            <Link href="/guides/are-competition-winnings-tax-free-uk">
              Are competition winnings tax free in the UK?
            </Link>
          </p>
        </>
      }
    />
  );
}
