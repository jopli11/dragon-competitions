"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import { BrandButton } from "@/lib/styles";

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

export function SkillQuestionCard({
  question,
  options,
  slug,
  ticketPricePence,
  maxTickets,
  ticketsSold,
}: {
  question: string;
  options: string[];
  slug: string;
  ticketPricePence: number;
  maxTickets: number;
  ticketsSold: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [quizPassId, setQuizPassId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const remainingTickets = Math.max(0, maxTickets - ticketsSold);
  const maxPurchase = remainingTickets;

  useEffect(() => {
    const savedPass = sessionStorage.getItem(`quiz_pass_${slug}`);
    if (savedPass) {
      setQuizPassId(savedPass);
    }
  }, [slug]);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!quizPassId || loading) return;

    // Check if user is logged in
    const { auth: firebaseAuth } = await import("@/lib/firebase/client");
    if (!firebaseAuth?.currentUser) {
      router.push(`/login?redirect=/raffles/${slug}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { auth: firebaseAuth } = await import("@/lib/firebase/client");
      const user = firebaseAuth?.currentUser;
      if (!user) {
        router.push(`/login?redirect=/raffles/${slug}`);
        return;
      }

      const idToken = await user.getIdToken();

      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
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

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      const msg = err.message.toLowerCase();
      if (msg.includes("expired") || msg.includes("invalid") || msg.includes("used")) {
        sessionStorage.removeItem(`quiz_pass_${slug}`);
        setQuizPassId(null);
        setError("Your quiz session has ended. Please answer the question again to continue.");
      } else {
        setError(err.message);
      }
      setLoading(false);
    }
  }

  function formatGBP(pence: number) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(pence / 100);
  }

  const totalPricePence = quantity * ticketPricePence;
  const sliderPercentage = ((quantity - 1) / (maxPurchase - 1)) * 100;

  if (quizPassId) {
    return (
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
