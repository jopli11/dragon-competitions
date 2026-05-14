"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/seo/json-ld";

export function GuideFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="mt-6 list-none space-y-3 pl-0">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <li
            key={faq.question}
            className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
              isOpen
                ? "border-brand-primary/30 shadow-lg"
                : "border-brand-primary/5 shadow-sm"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-base font-black uppercase tracking-tight text-brand-midnight">
                {faq.question}
              </span>
              <span
                aria-hidden
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${
                  isOpen
                    ? "rotate-180 bg-brand-primary text-white"
                    : "bg-brand-accent text-brand-midnight"
                }`}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 4L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 text-sm leading-relaxed text-brand-midnight/70">
                  {faq.answer}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
