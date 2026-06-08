"use client";

import { useEffect, useRef } from "react";
import {
  TRUSTPILOT_BUSINESS_UNIT_ID,
  TRUSTPILOT_LOCALE,
  TRUSTPILOT_REVIEW_URL,
} from "@/lib/trustpilot";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement?: (el: HTMLElement, forceReload?: boolean) => void;
    };
  }
}

type TrustpilotWidgetProps = {
  /** TrustBox template ID — pick one from TRUSTPILOT_TEMPLATES. */
  templateId: string;
  /** Widget height, e.g. "140px" or "20px". */
  height: string;
  /** Widget width, defaults to 100%. */
  width?: string;
  /** "light" (default) or "dark" for dark backgrounds like the footer. */
  theme?: "light" | "dark";
  /** Optional star colour override (e.g. "#FFFFFF" on dark backgrounds). */
  starColor?: string;
  /** Optional text/score colour override. */
  textColor?: string;
  /** Token required by some TrustBoxes (e.g. the Review Collector). */
  token?: string;
  className?: string;
};

/**
 * Renders an official Trustpilot TrustBox widget. The bootstrap script
 * (loaded once in the root layout) auto-scans widgets at full page load;
 * for client-side route transitions we re-initialise this element via
 * `window.Trustpilot.loadFromElement` so it always renders live data.
 */
export function TrustpilotWidget({
  templateId,
  height,
  width = "100%",
  theme = "light",
  starColor,
  textColor,
  token,
  className,
}: TrustpilotWidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    const init = () => {
      if (cancelled || !el) return false;
      if (window.Trustpilot?.loadFromElement) {
        window.Trustpilot.loadFromElement(el, true);
        return true;
      }
      return false;
    };

    // The bootstrap script may not be ready on first client render; poll
    // briefly until it is, then stop.
    if (!init()) {
      const interval = setInterval(() => {
        if (init()) clearInterval(interval);
      }, 250);
      const timeout = setTimeout(() => clearInterval(interval), 10000);
      return () => {
        cancelled = true;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [templateId]);

  return (
    <div
      ref={ref}
      className={`trustpilot-widget ${className ?? ""}`}
      data-locale={TRUSTPILOT_LOCALE}
      data-template-id={templateId}
      data-businessunit-id={TRUSTPILOT_BUSINESS_UNIT_ID}
      data-style-height={height}
      data-style-width={width}
      data-theme={theme}
      {...(token ? { "data-token": token } : {})}
      {...(starColor ? { "data-star-color": starColor } : {})}
      {...(textColor ? { "data-text-color": textColor } : {})}
    >
      <a
        href={TRUSTPILOT_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Trustpilot
      </a>
    </div>
  );
}
