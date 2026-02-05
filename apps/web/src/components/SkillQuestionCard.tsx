"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";

const OptionButton = styled.button<{ active: boolean; isWrong: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 1rem;
  border: 1px solid
    ${({ active, isWrong }) =>
      isWrong && active
        ? "rgba(239, 68, 68, 0.5)"
        : active
        ? "rgba(0, 0, 0, 0.2)"
        : "rgba(0, 0, 0, 0.1)"};
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  background-color: ${({ active, isWrong }) =>
    isWrong && active
      ? "rgba(239, 68, 68, 0.05)"
      : active
      ? "rgba(0, 0, 0, 0.05)"
      : "transparent"};

  &:hover {
    background-color: ${({ active }) => (active ? "" : "rgba(0, 0, 0, 0.05)")};
  }

  @media (prefers-color-scheme: dark) {
    border-color: ${({ active, isWrong }) =>
      isWrong && active
        ? "rgba(239, 68, 68, 0.5)"
        : active
        ? "rgba(255, 255, 255, 0.2)"
        : "rgba(255, 255, 255, 0.15)"};
    background-color: ${({ active, isWrong }) =>
      isWrong && active
        ? "rgba(239, 68, 68, 0.05)"
        : active
        ? "rgba(255, 255, 255, 0.05)"
        : "transparent"};

    &:hover {
      background-color: ${({ active }) =>
        active ? "" : "rgba(255, 255, 255, 0.1)"};
    }
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
      <section className="rounded-3xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
        <h2 className="text-base font-semibold tracking-tight text-green-600 dark:text-green-500">
          ✓ Correct Answer!
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          How many tickets would you like to purchase?
        </p>

        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            -
          </button>
          <span className="text-xl font-semibold tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(100, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
          >
            +
          </button>
        </div>

        {error && (
          <p className="mt-4 text-xs font-medium text-red-500">{error}</p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Preparing checkout..." : "Buy tickets now"}
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
      <h2 className="text-base font-semibold tracking-tight">
        Skill question
      </h2>
      <p className="mt-2 text-sm text-foreground/70">{question}</p>

      <div className="mt-5 grid gap-3">
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
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                  active
                    ? isWrong
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-foreground bg-foreground text-background"
                    : "border-foreground/30",
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
        <p className="mt-4 text-xs font-medium text-red-500">{error}</p>
      )}

      <p className="mt-5 text-xs text-foreground/60">
        You must answer correctly to proceed to checkout.
      </p>

      <button
        type="button"
        onClick={handleContinue}
        disabled={selected === null || loading}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Checking..." : "Continue"}
      </button>
    </section>
  );
}

