import type { Metadata } from "next";
import Link from "next/link";
import type { FaqItem } from "@/lib/seo/json-ld";
import { GuideLayout } from "@/components/guides/GuideLayout";
import { getGuide } from "@/lib/seo/guides-data";

const GUIDE = getGuide("are-competition-winnings-tax-free-uk");

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
    question: "Do I pay income tax on competition winnings in the UK?",
    answer:
      "No. HMRC does not treat one-off prize competition or raffle winnings as earned income, so you do not pay income tax on the prize itself. You also do not pay National Insurance on it.",
  },
  {
    question: "Are cash prizes treated differently to physical prizes?",
    answer:
      "No, the income tax treatment is the same. A £20,000 cash prize and a £20,000 car are both received tax-free at the point of winning. The market value of a non-cash prize is simply what you would have paid for it on the open market.",
  },
  {
    question: "Do I have to declare competition winnings to HMRC?",
    answer:
      "There is no requirement to declare a one-off prize win on a Self Assessment return because it is not income. If you later earn interest on the prize money or receive dividends from shares bought with it, those secondary earnings are taxable in the usual way.",
  },
  {
    question: "What about inheritance tax if I leave winnings to my family?",
    answer:
      "Competition winnings become part of your estate as soon as you receive them. If your estate exceeds the inheritance tax nil-rate band (£325,000 for the 2025-26 tax year) when you die, inheritance tax can apply to the estate as a whole at the standard rate. This is the same as for any other personal asset.",
  },
  {
    question: "If I gift my winnings to someone, do they pay tax?",
    answer:
      "A pure gift is not taxed in the recipient's hands. However, if you die within seven years of the gift, the value may be brought back into your estate for inheritance tax purposes under the 'potentially exempt transfer' rules. Always check with a qualified tax adviser for large gifts.",
  },
];

const KEY_TAKEAWAYS = [
  {
    label: "Short answer",
    value:
      "Yes — UK prize competition and raffle winnings are not subject to income tax. HMRC does not classify them as earned income.",
  },
  {
    label: "What you keep",
    value:
      "100% of the prize value at the point of winning. A £10,000 cash prize is £10,000 in your hand, with no tax deducted at source.",
  },
  {
    label: "Where tax can still apply",
    value:
      "Interest earned on winnings (if you save them), dividends from shares bought with them, and inheritance tax if the prize is still in your estate at death.",
  },
  {
    label: "Reporting",
    value:
      "There is no requirement to declare a one-off prize win on a Self Assessment return — but secondary earnings on the winnings are taxable in the usual way.",
  },
];

export default function TaxGuidePage() {
  return (
    <GuideLayout
      guide={GUIDE}
      keyTakeaways={KEY_TAKEAWAYS}
      intro={
        <p>
          One of the most common questions from UK competition entrants is also
          one of the simplest to answer:{" "}
          <strong>no, you don&apos;t pay tax on the prize itself</strong>. This
          guide explains why, what HMRC&apos;s position is, and the handful of
          situations where tax can still apply downstream.
        </p>
      }
      faqs={FAQS}
      disclaimer={
        <p>
          This article is general information about the UK tax treatment of
          prize competition winnings as of {GUIDE.dateModified.slice(0, 4)}. It
          is not personal tax advice. Rates, allowances and rules change every
          tax year — always check the current{" "}
          <a
            href="https://www.gov.uk/income-tax/how-you-pay-income-tax"
            target="_blank"
            rel="noopener noreferrer"
          >
            HMRC guidance
          </a>{" "}
          and speak to a qualified tax adviser if your circumstances are
          complex.
        </p>
      }
      body={
        <>
          <h2>The short answer</h2>
          <p>
            <strong>
              UK prize competition and raffle winnings are not subject to
              income tax.
            </strong>{" "}
            HMRC does not treat a one-off prize win as earned income, which
            means:
          </p>
          <ul>
            <li>You receive 100% of the prize at the point of winning.</li>
            <li>Tax is not deducted at source by the competition operator.</li>
            <li>
              You do not have to declare the prize win on a Self Assessment
              return.
            </li>
            <li>You do not pay National Insurance on it.</li>
          </ul>
          <p>
            This applies whether the prize is cash, a car, a holiday, an
            experience, or any other physical item — the income tax treatment
            is identical.
          </p>

          <h2>Why winnings aren&apos;t classed as income</h2>
          <p>
            UK income tax applies to <em>earned</em> income (wages, salary,
            self-employment profits), pension income, savings interest,
            dividends, rental income, and certain trading profits. A prize won
            in a competition or raffle does not fall into any of those
            categories.
          </p>
          <p>
            HMRC&apos;s long-standing position — confirmed across multiple
            Business Income Manual entries and tribunal decisions — is that a
            casual one-off win is not the result of an organised trade or
            profession on the entrant&apos;s part. You did not provide a
            service; you simply paid an entry fee and won. As such, it is{" "}
            <strong>not taxable income</strong>.
          </p>
          <p>
            The same principle is why UK National Lottery winnings, premium
            bond prizes, and Trading 212 / Freetrade fractional-share prize
            draws are also tax-free at the point of receipt.
          </p>

          <h2>Where tax can still apply</h2>
          <p>
            While the prize itself is tax-free, what you do with it afterwards
            can create taxable events. There are three to be aware of.
          </p>

          <h3>1. Interest on prize money</h3>
          <p>
            If you win a cash prize and put it in a savings account, any
            interest you earn is taxable in the normal way. You can use your{" "}
            <strong>Personal Savings Allowance</strong> (£1,000 for basic-rate
            taxpayers, £500 for higher-rate, £0 for additional-rate in the
            2025-26 tax year) and any tax-free ISA wrapper to shelter interest.
          </p>

          <h3>2. Dividends and capital gains</h3>
          <p>
            If you invest a cash prize in shares, funds or property, any
            dividends, interest distributions, or capital gains on disposal are
            taxable under the standard rules. The capital gains tax annual
            exempt amount is £3,000 for the 2025-26 tax year.
          </p>

          <h3>3. Inheritance tax</h3>
          <p>
            Competition winnings form part of your estate as soon as you
            receive them. If your total estate exceeds the inheritance tax
            nil-rate band (<strong>£325,000</strong> for the 2025-26 tax year)
            when you die, inheritance tax can apply to the estate as a whole at
            the standard 40% rate above the threshold.
          </p>
          <p>
            The Residence Nil-Rate Band of up to £175,000 can apply on top if
            you are leaving a main home to direct descendants. Read HMRC&apos;s{" "}
            <a
              href="https://www.gov.uk/inheritance-tax"
              target="_blank"
              rel="noopener noreferrer"
            >
              inheritance tax overview
            </a>{" "}
            for the current rules.
          </p>

          <h2>What about gifting winnings?</h2>
          <p>
            A pure gift is not taxed in the recipient&apos;s hands. The
            recipient does not pay income tax or any kind of &ldquo;gift
            tax&rdquo; on receiving money from you.
          </p>
          <p>
            However, if you make a substantial gift and die within{" "}
            <strong>seven years</strong>, the gift may be brought back into
            your estate for inheritance tax purposes as a{" "}
            <em>potentially exempt transfer</em>. There are tapered reliefs
            depending on how long you survive after the gift, and there are
            annual gift exemptions (£3,000 per tax year, plus smaller-gift and
            wedding exemptions).
          </p>
          <p>
            For any significant gift from prize winnings — especially anything
            close to or above the IHT nil-rate band — speak to a qualified
            adviser before making it.
          </p>

          <h2>Non-cash prizes: how is the value worked out?</h2>
          <p>
            For income tax purposes the question doesn&apos;t arise — the prize
            isn&apos;t taxable. But for inheritance tax, capital gains tax (if
            you later sell the prize), or insurance purposes, the value of a
            non-cash prize is its{" "}
            <strong>open-market value at the date you received it</strong>.
          </p>
          <p>
            Coast Competitions publishes the open-market value of every prize
            on the relevant{" "}
            <Link href="/raffles">competition page</Link>, and most legitimate
            operators do the same.
          </p>

          <h2>Are there special rules for big wins?</h2>
          <p>
            No. There is no UK threshold above which prize winnings become
            taxable as income. A £100 win and a £1,000,000 win are treated
            identically for income tax purposes — both are received tax-free.
          </p>
          <p>
            Practically, very large wins do tend to attract more scrutiny on
            the <em>secondary</em> tax events (interest on savings, capital
            gains on investments, inheritance tax planning), and the operator
            may require additional identity verification before paying out
            under anti-money-laundering rules. The prize itself, however, is
            never the taxable event.
          </p>

          <h2>Summary</h2>
          <p>
            UK prize competition and raffle winnings are{" "}
            <strong>tax free</strong> at the point of winning. You do not pay
            income tax, National Insurance, or any kind of withholding tax on
            the prize. Tax can still apply downstream — on interest, on
            dividends, on capital gains, and on inheritance — but those are
            secondary events you can plan for.
          </p>
          <p>
            To put the rules into practice, browse our{" "}
            <Link href="/raffles">live UK prize competitions</Link>, or read
            the companion guide:{" "}
            <Link href="/guides/are-prize-competitions-legal-uk">
              Are prize competitions legal in the UK?
            </Link>
          </p>
        </>
      }
    />
  );
}
