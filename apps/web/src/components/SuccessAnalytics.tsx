"use client";

import { useEffect } from "react";
import { track, trackOnce, type AnalyticsEvent } from "@/lib/analytics";

type SuccessStatus = "paid" | "failed" | "refunded_oversold";

const EVENT_BY_STATUS: Record<SuccessStatus, AnalyticsEvent> = {
  paid: "purchase_completed",
  failed: "purchase_failed",
  refunded_oversold: "purchase_refunded_oversold",
};

export function SuccessAnalytics({
  status,
  invoiceId,
}: {
  status: SuccessStatus;
  invoiceId: string;
}) {
  useEffect(() => {
    trackOnce(EVENT_BY_STATUS[status], invoiceId);
  }, [status, invoiceId]);

  return null;
}

export function TrustpilotReviewLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("trustpilot_review_click")}
      className={className}
    >
      {children}
    </a>
  );
}
