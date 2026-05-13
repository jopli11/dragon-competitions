"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const DISMISS_KEY = "coast-business-prompt-dismissed";

export function FloatingBusinessPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(DISMISS_KEY) === "true";
    if (!dismissed) {
      setIsVisible(true);
      track("business_prompt_view");
    }
  }, []);

  const dismiss = () => {
    track("business_prompt_dismiss");
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-sm md:inset-x-auto md:bottom-8 md:right-8 md:mx-0 md:w-auto"
      aria-label="Run a giveaway with Coast Competitions"
    >
      <div className="relative rounded-2xl border border-brand-secondary/20 bg-white/95 p-4 pr-10 shadow-[0_20px_60px_rgba(14,126,139,0.18)] backdrop-blur md:rounded-3xl md:p-5 md:pr-12 md:max-w-sm">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold leading-none text-brand-midnight/45 transition-colors hover:bg-brand-midnight/5 hover:text-brand-midnight"
          aria-label="Dismiss business enquiry prompt"
        >
          &times;
        </button>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-primary md:text-xs">
          For Business
        </p>
        <p className="mt-2 text-sm font-black uppercase tracking-tight text-brand-midnight md:text-base">
          Local business looking to run a giveaway or raffle?
        </p>
        <p className="mt-2 text-xs font-medium leading-relaxed text-brand-midnight/65 md:text-sm">
          Use our platform to reach local people and create real social media
          engagement.
        </p>
        <Link
          href="/partners"
          onClick={() => track("business_prompt_click")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-brand-secondary hover:-translate-y-0.5 active:translate-y-0"
        >
          Enquire now
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
