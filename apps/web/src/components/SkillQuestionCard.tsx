"use client";

import { useState } from "react";
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
        ? "#e5531a"
        : "rgba(31, 42, 51, 0.1)"};
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  background-color: ${({ active, isWrong }) =>
    isWrong && active
      ? "rgba(239, 68, 68, 0.05)"
      : active
      ? "rgba(229, 83, 26, 0.05)"
      : "white"};
  color: #1f2a33;

  &:hover {
    border-color: ${({ active }) => (active ? "#e5531a" : "rgba(229, 83, 26, 0.3)")};
    background-color: ${({ active }) => (active ? "" : "rgba(229, 83, 26, 0.02)")};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ active, isWrong }) =>
      isWrong && active
        ? "rgba(239, 68, 68, 0.1)"
        : active
        ? "rgba(229, 83, 26, 0.1)"
        : "#161616"};
    color: #f6f2ed;
    border-color: ${({ active, isWrong }) =>
      isWrong && active
        ? "#ef4444"
        : active
        ? "#e5531a"
        : "rgba(255, 255, 255, 0.1)"};
  }
`;

const QuestionHeading = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2a33;
  letter-spacing: -0.01em;
  @media (prefers-color-scheme: dark) {
    color: #f6f2ed;
  }
`;

export function SkillQuestionCard({
  question,
  options,
  slug,
}: {
  question: string;
  options: string[];
  slug: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [quizPassId, setQuizPassId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

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

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setError(err.message);
      setLoading(false);
    }
  }

  if (quizPassId) {
    return (
      <section className="rounded-3xl border border-black/5 bg-white p-8 shadow-brand dark:border-white/10 dark:bg-[#161616]">
        <h2 className="text-lg font-bold tracking-tight text-green-600 dark:text-green-500">
          ✓ Correct Answer!
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          How many tickets would you like to purchase?
        </p>

        <div className="mt-8 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black/10 text-xl font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            -
          </button>
          <span className="text-3xl font-bold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-black/10 text-xl font-bold hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            +
          </button>
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
          className="mt-8"
        >
          {loading ? "Preparing checkout..." : "Buy tickets now"}
        </BrandButton>
      </section>
    );
  }

  return (
    <section
      id="skill-question"
      className="rounded-3xl border border-black/5 bg-white p-8 shadow-brand dark:border-white/10 dark:bg-[#161616]"
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
                      : "border-dragon-orange bg-dragon-orange text-white"
                    : "border-black/10 dark:border-white/10",
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

