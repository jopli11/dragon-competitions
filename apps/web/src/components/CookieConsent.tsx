"use client";

import { useState, useEffect } from "react";
import { BrandButton } from "@/lib/styles";
import { Container } from "./Container";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-4xl border border-brand-primary/10 bg-white p-6 shadow-2xl md:p-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight">
                Cookie <span className="text-brand-secondary">Settings</span>
              </h3>
              <p className="mt-2 text-sm font-medium text-brand-midnight/60 leading-relaxed">
                We use cookies to enhance your experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                <Link href="/cookies" className="text-brand-primary underline hover:text-brand-secondary">
                  Cookie Policy
                </Link>{" "}
                for more info.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                onClick={handleDecline}
                className="px-6 py-3 text-xs font-black uppercase tracking-widest text-brand-midnight/40 hover:text-brand-midnight/60 transition-colors"
              >
                Decline
              </button>
              <BrandButton onClick={handleAccept} size="sm" className="px-8">
                Accept All
              </BrandButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
