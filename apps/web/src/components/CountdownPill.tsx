"use client";

import { useEffect, useState } from "react";

/**
 * Small "time remaining" pill shown in the top-right corner of a raffle card.
 * Ticks every second and shows the two most significant units:
 *   4d 16h  →  16h 05m  →  12m 30s  →  Ending
 * Renders nothing once the raffle has ended.
 */
export function CountdownPill({
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

  let label = "··";
  if (mounted && !ended) {
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    if (days > 0) label = `${days}d ${pad(hours)}h`;
    else if (hours > 0) label = `${hours}h ${pad(minutes)}m`;
    else label = `${minutes}m ${pad(seconds)}s`;
  } else if (ended) {
    label = "Ending";
  }

  return (
    <div
      className={`pointer-events-none inline-flex items-center gap-1.5 rounded-full bg-brand-midnight/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg ring-1 ring-white/15 backdrop-blur ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 opacity-90"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      <span className="tabular-nums">{label}</span>
    </div>
  );
}
