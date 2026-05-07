"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { BrandButton } from "@/lib/styles";
import { useRaffleStats } from "@/lib/firebase/use-raffle-stats";

const OptionButton = styled.button<{ active: boolean; isWrong: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  border: 2px solid
    ${({ active, isWrong }) =>
      isWrong && active
        ? "#ef4444"
        : active
        ? "#35B1AB"
        : "rgba(14, 126, 139, 0.1)"};
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  background-color: ${({ active, isWrong }) =>
    isWrong && active
      ? "rgba(239, 68, 68, 0.05)"
      : active
      ? "rgba(53, 177, 171, 0.05)"
      : "white"};
  color: #232F3E;

  &:hover {
    border-color: ${({ active }) => (active ? "#35B1AB" : "rgba(53, 177, 171, 0.3)")};
    background-color: ${({ active }) => (active ? "" : "rgba(53, 177, 171, 0.02)")};
  }
`;

const QuestionHeading = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #232F3E;
  letter-spacing: -0.01em;
`;

const SliderRoot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  touch-action: none;
  width: 100%;
  height: 20px;
`;

const SliderTrack = styled.div`
  background-color: rgba(14, 126, 139, 0.1);
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 6px;
`;

const SliderRange = styled.div<{ width: string }>`
  position: absolute;
  background: linear-gradient(90deg, #0E7E8B 0%, #35B1AB 100%);
  border-radius: 9999px;
  height: 100%;
  width: ${({ width }) => width};
`;

const SliderThumb = styled.input`
  appearance: none;
  width: 100%;
  height: 6px;
  background: transparent;
  position: absolute;
  cursor: pointer;
  margin: 0;
  z-index: 2;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #0E7E8B;
    box-shadow: 0 4px 10px rgba(14, 126, 139, 0.3);
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #0E7E8B;
    box-shadow: 0 4px 10px rgba(14, 126, 139, 0.3);
    cursor: pointer;
    transition: transform 0.1s ease;
  }
`;

// Choose 3 round bulk quantities that scale with remaining tickets and prize value.
// Returns unique ascending values, each clamped to available stock.
function getBulkTiers(maxPurchase: number, maxSuggestedPurchase = maxPurchase): number[] {
  const effectiveMax = Math.min(maxPurchase, maxSuggestedPurchase);
  if (effectiveMax < 2) return [];

  const tierLadders: number[][] = [
    [25, 100, 250],
    [10, 50, 150],
    [5, 25, 75],
    [5, 25, 50],
    [5, 15, 40],
    [3, 10, 25],
    [3, 5, 15],
    [2, 5, 10],
    [2, 3, 5],
  ];
  const ladder = tierLadders.find(([, , top]) => top <= effectiveMax);
  const tiers = ladder ?? [2, Math.max(2, Math.floor(effectiveMax / 2)), effectiveMax];
  const clamped = tiers.map((t) => Math.min(t, effectiveMax, maxPurchase));
  return Array.from(new Set(clamped)).sort((a, b) => a - b);
}

function parsePrizeValuePence(title: string): number | null {
  const match = title.match(/£\s*([\d,]+(?:\.\d{1,2})?)\s*([km])?/i);
  if (!match) return null;

  const amount = Number.parseFloat(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount)) return null;

  const suffix = match[2]?.toLowerCase();
  const multiplier = suffix === "m" ? 1_000_000 : suffix === "k" ? 1_000 : 1;
  return Math.round(amount * multiplier * 100);
}

function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return fallback;
}

export function SkillQuestionCard({
  raffleTitle,
  question,
  options,
  slug,
  ticketPricePence,
  maxTickets,
  ticketsSold,
}: {
  raffleTitle: string;
  question: string;
  options: string[];
  slug: string;
  ticketPricePence: number;
  maxTickets: number;
  ticketsSold: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [quizPassId, setQuizPassId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const { stats: liveStats } = useRaffleStats(slug, { ticketsSold });
  const currentTicketsSold = liveStats.ticketsSold;

  const remainingTickets = Math.max(0, maxTickets - currentTicketsSold);
  const maxPurchase = remainingTickets;
  const prizeValuePence = parsePrizeValuePence(raffleTitle);
  const valueAwareMaxPurchase =
    prizeValuePence && ticketPricePence > 0
      ? Math.min(maxPurchase, Math.max(1, Math.floor(prizeValuePence / ticketPricePence)))
      : maxPurchase;

  useEffect(() => {
    const savedPass = sessionStorage.getItem(`quiz_pass_${slug}`);
    if (savedPass) {
      setQuizPassId(savedPass);
    }
  }, [slug]);

  useEffect(() => {
    setQuantity((currentQuantity) =>
      Math.min(Math.max(1, currentQuantity), Math.max(1, maxPurchase))
    );
  }, [maxPurchase]);

  async function handleContinue() {
    if (selected === null || loading) return;

    setLoading(true);
    setError(null);
    setIsWrong(false);

    try {
      const res = await fetch(`/api/raffles/${slug}/check-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerIndex: selected }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (data.isCorrect) {
        setQuizPassId(data.quizPassId);
        sessionStorage.setItem(`quiz_pass_${slug}`, data.quizPassId);
      } else {
        setIsWrong(true);
        setError("Incorrect answer. Please try again.");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!quizPassId || loading) return;

    const { auth: firebaseAuth } = await import("@/lib/firebase/client");
    const user = firebaseAuth?.currentUser;
    if (!user) {
      router.push(`/login?redirect=/raffles/${slug}`);
      return;
    }

    setLoading(true);
    setCheckoutLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          slug,
          quantity,
          quizPassId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      const isTestMode =
        (process.env.NEXT_PUBLIC_DNA_ENV || "test") === "test";

      // Apple Pay is gated behind an env flag because it requires the
      // apple-developer-merchantid-domain-association file from DNA.
      // Set NEXT_PUBLIC_DNA_APPLE_PAY=enabled once the file is deployed.
      const applePayEnabled =
        process.env.NEXT_PUBLIC_DNA_APPLE_PAY === "enabled";

      const paymentMethods = [
        { name: window.DNAPayments.paymentMethods.BankCard },
        { name: window.DNAPayments.paymentMethods.GooglePay },
      ];
      if (applePayEnabled) {
        paymentMethods.splice(1, 0, {
          name: window.DNAPayments.paymentMethods.ApplePay,
        });
      }

      window.DNAPayments.configure({
        isTestMode,
        paymentMethods,
        events: {
          opened: () => {
            setCheckoutLoading(false);
          },
          paid: () => {
            window.DNAPayments.closePaymentWidget();
            router.push(
              `/raffles/${slug}/success?invoiceId=${data.invoiceId}`
            );
          },
          declined: () => {
            setError("Payment declined. Please try again.");
            window.DNAPayments.closePaymentWidget();
            setLoading(false);
            setCheckoutLoading(false);
          },
          cancelled: () => {
            setLoading(false);
            setCheckoutLoading(false);
          },
        },
      });

      const origin = window.location.origin;

      window.DNAPayments.openPaymentIframeWidget({
        invoiceId: data.invoiceId,
        amount: parseFloat(data.amount),
        currency: data.currency,
        description: `Tickets for ${data.raffleTitle}`,
        paymentSettings: {
          terminalId: data.terminalId,
          returnUrl: `${origin}/raffles/${slug}/success?invoiceId=${data.invoiceId}`,
          failureReturnUrl: `${origin}/raffles/${slug}?payment=failed`,
          callbackUrl: `${origin}/api/webhooks/dna`,
          failureCallbackUrl: `${origin}/api/webhooks/dna`,
        },
        customerDetails: {
          email: data.email,
          accountDetails: { accountId: user.uid },
          billingAddress: { country: "GB" },
        },
        auth: data.auth,
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err, "Failed to create checkout session");
      const msg = errorMessage.toLowerCase();
      if (
        msg.includes("expired") ||
        msg.includes("invalid") ||
        msg.includes("used")
      ) {
        sessionStorage.removeItem(`quiz_pass_${slug}`);
        setQuizPassId(null);
        setError(
          "Your quiz session has ended. Please answer the question again to continue."
        );
      } else {
        setError(errorMessage);
      }
      setLoading(false);
      setCheckoutLoading(false);
    }
  }

  function formatGBP(pence: number) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(pence / 100);
  }

  const totalPricePence = quantity * ticketPricePence;
  const sliderPercentage = maxPurchase <= 1 ? 100 : ((quantity - 1) / (maxPurchase - 1)) * 100;
  const bulkTiers = getBulkTiers(maxPurchase, valueAwareMaxPurchase);

  if (quizPassId && remainingTickets === 0) {
    return (
      <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-brand text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Sold Out</h2>
        <p className="mt-2 text-sm text-brand-midnight/50">All tickets for this competition have been sold. Check back for future competitions!</p>
      </section>
    );
  }

  if (quizPassId) {
    return (
      <>
      {checkoutLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-9990 flex items-center justify-center bg-brand-midnight/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="mx-4 flex max-w-sm flex-col items-center gap-5 rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary" />
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-brand-midnight">
                Preparing Secure Checkout
              </p>
              <p className="mt-2 text-xs font-medium text-brand-midnight/60">
                Opening DNA Payments. This usually takes a few seconds.
              </p>
            </div>
          </div>
        </div>
      )}
      <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-brand">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-green-600">
            ✓ Correct!
          </h2>
          <button 
            onClick={() => {
              sessionStorage.removeItem(`quiz_pass_${slug}`);
              setQuizPassId(null);
            }}
            className="text-[10px] font-bold uppercase tracking-widest text-brand-midnight/30 hover:text-brand-midnight"
          >
            Change Answer
          </button>
        </div>
        
        <div className="mt-8">
          <div className="flex items-end justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-widest text-brand-midnight/40">
              Select Quantity
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (isNaN(val)) setQuantity(1);
                  else setQuantity(Math.min(maxPurchase, Math.max(1, val)));
                }}
                className="w-16 rounded-lg border-2 border-brand-accent bg-brand-accent/30 px-2 py-1 text-center text-lg font-black text-brand-midnight focus:border-brand-primary focus:outline-none"
              />
              <span className="text-xs font-bold text-brand-midnight/40">Tickets</span>
            </div>
          </div>

          <SliderRoot className="mt-6">
            <SliderTrack>
              <SliderRange width={`${sliderPercentage}%`} />
            </SliderTrack>
            <SliderThumb
              type="range"
              min="1"
              max={maxPurchase}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
          </SliderRoot>

          <div className="mt-4 flex justify-between text-[10px] font-bold text-brand-midnight/30 uppercase tracking-tighter">
            <span>1 Ticket</span>
            <span>{maxPurchase} Max</span>
          </div>

          {bulkTiers.length > 0 && (
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">
                Quick Select
              </p>
              <div className="grid grid-cols-3 gap-2">
                {bulkTiers.map((tier, idx) => {
                  const isActive = quantity === tier;
                  const isTopTier = idx === bulkTiers.length - 1 && bulkTiers.length > 1;
                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setQuantity(tier)}
                      className={`relative rounded-xl border-2 px-2 py-3 text-center transition-all ${
                        isActive
                          ? "border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10"
                          : "border-brand-primary/10 bg-white hover:border-brand-primary/30 hover:bg-brand-primary/2"
                      }`}
                      aria-label={`Select ${tier} tickets for ${formatGBP(tier * ticketPricePence)}`}
                    >
                      {isTopTier && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-secondary px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-white shadow-sm">
                          Best Odds
                        </span>
                      )}
                      <div className={`text-lg font-black tracking-tight ${isActive ? "text-brand-primary" : "text-brand-midnight"}`}>
                        {tier}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-midnight/50">
                        {formatGBP(tier * ticketPricePence)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-midnight p-6 text-center text-white shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Total Price</p>
          <div className="mt-1 text-4xl font-black tracking-tighter">
            {formatGBP(totalPricePence)}
          </div>
          <p className="mt-1 text-[10px] font-medium text-white/60 uppercase tracking-widest">
            {quantity} {quantity === 1 ? 'Entry' : 'Entries'} @ {formatGBP(ticketPricePence)}
          </p>
        </div>

        {error && (
          <p className="mt-4 text-xs font-medium text-red-500 text-center">{error}</p>
        )}

        <BrandButton
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          fullWidth
          size="lg"
          className="mt-6"
        >
          {loading ? "Preparing checkout..." : "Proceed to Payment"}
        </BrandButton>
      </section>
      </>
    );
  }

  return (
    <section
      id="skill-question"
      className="rounded-3xl border border-black/5 bg-white p-8 shadow-brand"
    >
      <QuestionHeading>Skill question</QuestionHeading>
      <p className="mt-2 text-sm text-foreground/70">{question}</p>

      <div className="mt-6 grid gap-3">
        {options.map((opt, idx) => {
          const active = selected === idx;
          return (
            <OptionButton
              key={opt}
              type="button"
              active={active}
              isWrong={isWrong}
              onClick={() => {
                setSelected(idx);
                setIsWrong(false);
                setError(null);
              }}
            >
              <span className="font-medium">{opt}</span>
              <span
                className={[
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border-2",
                  active
                    ? isWrong
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-brand-secondary bg-brand-secondary text-white"
                    : "border-brand-primary/10",
                ].join(" ")}
                aria-hidden="true"
              >
                {active ? (isWrong ? "✕" : "✓") : ""}
              </span>
            </OptionButton>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-xs font-medium text-red-500 text-center">{error}</p>
      )}

      <p className="mt-6 text-[11px] font-medium text-foreground/50 text-center uppercase tracking-wider">
        You must answer correctly to proceed to checkout.
      </p>

      <BrandButton
        type="button"
        onClick={handleContinue}
        disabled={selected === null || loading}
        fullWidth
        size="lg"
        className="mt-6"
      >
        {loading ? "Checking..." : "Continue"}
      </BrandButton>
    </section>
  );
}
