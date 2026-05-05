"use client";

import { useEffect, useState } from "react";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";

const DISMISS_KEY = "coast-payment-prompt-dismissed";

export function FloatingPaymentPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(sessionStorage.getItem(DISMISS_KEY) !== "true");
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-sm md:inset-x-auto md:bottom-8 md:right-8 md:mx-0 md:w-auto"
      aria-label="Fast checkout payment options"
    >
      <div className="payment-float-prompt relative rounded-2xl border border-brand-secondary/20 bg-white/95 p-3 pr-10 shadow-[0_20px_60px_rgba(14,126,139,0.18)] backdrop-blur md:rounded-3xl md:p-4 md:pr-12">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-lg font-bold leading-none text-brand-midnight/45 transition-colors hover:bg-brand-midnight/5 hover:text-brand-midnight"
          aria-label="Dismiss payment options"
        >
          &times;
        </button>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brand-primary md:text-xs">
          Fast secure checkout
        </p>
        <p className="mt-1 text-xs font-bold text-brand-midnight md:text-sm">
          Pay quickly with card, Google Pay or Apple Pay.
        </p>
        <div className="mt-2 md:mt-3">
          <PaymentMethodBadges compact />
        </div>
      </div>
    </aside>
  );
}
