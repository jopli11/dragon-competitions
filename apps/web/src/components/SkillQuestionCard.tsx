"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function SkillQuestionCard({
  question,
  options,
}: {
  question: string;
  options: string[];
}) {
  const [selected, setSelected] = useState<number | null>(null);

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
            <motion.button
              key={opt}
              type="button"
              onClick={() => setSelected(idx)}
              whileTap={{ scale: 0.98 }}
              className={[
                "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition-colors",
                active
                  ? "border-foreground/20 bg-foreground/5"
                  : "border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10",
              ].join(" ")}
            >
              <span className="font-medium">{opt}</span>
              <span
                className={[
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/30",
                ].join(" ")}
                aria-hidden="true"
              >
                {active ? "✓" : ""}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-foreground/60">
        You must answer correctly to proceed to checkout. (We’ll connect this to
        server-side verification next.)
      </p>

      <button
        type="button"
        disabled={selected === null}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </section>
  );
}

