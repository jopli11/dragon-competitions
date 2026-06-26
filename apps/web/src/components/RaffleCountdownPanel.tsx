"use client";

import { useEffect, useState } from "react";

/**
 * Prominent "time remaining" panel for the raffle detail page.
 *
 * Drives urgency by showing a live Days / Hours / Mins / Secs countdown plus the
 * explicit end date. Designed to sit at the top of the buy sidebar so the user
 * sees exactly how long they have before scrolling.
 *
 * Accessibility:
 *  - Dark brand-midnight panel + white text clears WCAG AA contrast (≥ 4.5:1).
 *  - The ticking digits are aria-hidden — announcing a value every second is a
 *    screen-reader anti-pattern. A visually-hidden sentence carries the real,
 *    human-readable deadline instead ("Competition closes on …").
 */
export function RaffleCountdownPanel({
  endAt,
  className = "",
}: {
  endAt: string;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    setMounted(true);
    const tick = () => setDistance(new Date(endAt).getTime() - Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endAt]);

  const ended = mounted && distance <= 0;

  const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

  const pad = (n: number) => String(n).padStart(2, "0");

  // Soon = under 24h left: switch the accent to amber to reinforce urgency.
  const isUrgent = mounted && !ended && distance < 1000 * 60 * 60 * 24;

  const endDateLabel = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(endAt));

  const units: Array<{ value: number; label: string; show: boolean }> = [
    { value: days, label: "Days", show: true },
    { value: hours, label: "Hrs", show: true },
    { value: minutes, label: "Mins", show: true },
    { value: seconds, label: "Secs", show: true },
  ];

  return (
    <div
      className={`overflow-hidden rounded-3xl bg-brand-midnight text-white shadow-xl ring-1 ring-white/10 ${className}`}
    >
      <div className="px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-3.5 w-3.5 ${isUrgent ? "text-amber-400" : "text-brand-secondary"}`}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/70">
            {ended ? "Closing — drawing soon" : isUrgent ? "Ending soon — closes in" : "Entries close in"}
          </span>
        </div>

        {ended ? (
          <p className="mt-3 text-center text-lg font-black uppercase tracking-tight">
            Time&apos;s up
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2" aria-hidden="true">
            {units.map((u, i) => (
              <div key={u.label} className="flex flex-col items-center">
                <div
                  className={`flex h-14 w-full items-center justify-center rounded-2xl bg-white/5 ring-1 ring-inset ${
                    isUrgent && i >= 2 ? "ring-amber-400/40" : "ring-white/10"
                  }`}
                >
                  <span className="text-2xl font-black tabular-nums leading-none">
                    {mounted ? (u.label === "Days" ? u.value : pad(u.value)) : "--"}
                  </span>
                </div>
                <span className="mt-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {u.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-wider text-white/60">
          {ended ? "Winner drawn shortly" : <>Ends {endDateLabel}</>}
        </p>
      </div>

      {/* Accessible, non-ticking deadline for screen readers. */}
      <p className="sr-only">
        {ended
          ? "Entries for this competition have closed. The winner will be drawn shortly."
          : `This competition closes on ${endDateLabel}.`}
      </p>
    </div>
  );
}
