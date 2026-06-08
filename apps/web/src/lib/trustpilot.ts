export const TRUSTPILOT_REVIEW_URL =
  "https://uk.trustpilot.com/review/coastcompetitions.com";

/**
 * Trustpilot "Business Unit ID" for coastcompetitions.com.
 * Verified live via Trustpilot's widget data endpoint (returns
 * displayName "Coast Competitions", identifyingName "coastcompetitions.com").
 */
export const TRUSTPILOT_BUSINESS_UNIT_ID = "6a00d44ce2f8797bd79abbbd";

/** Locale used by the TrustBox widgets / data endpoint. */
export const TRUSTPILOT_LOCALE = "en-GB";

/**
 * Public token for the Review Collector TrustBox (from the Trustpilot
 * dashboard → Integrations → TrustBox). Required by that one widget.
 */
export const TRUSTPILOT_REVIEW_COLLECTOR_TOKEN =
  "7842e259-0b3a-469f-9bd8-d97771af639d";

/**
 * Official TrustBox template IDs (public, stable Trustpilot constants).
 *
 * NOTE: on our current (free) plan, only `reviewCollector` is accessible.
 * The display widgets (carousel/micro) require a paid plan — they are kept
 * here so they can be switched on later without code changes. Until then we
 * render the score on-brand from `getTrustpilotSummary()` below.
 */
export const TRUSTPILOT_TEMPLATES = {
  /** CTA that invites customers to leave a review (free plan). */
  reviewCollector: "56278e9abfbbba0bdcd568bc",
  /** Rotating carousel of latest reviews (PAID plan — currently dormant). */
  reviewCarousel: "53aa8912dec7e10d38f59f36",
  /** Compact stars + "TrustScore | reviews" (PAID plan — currently dormant). */
  microCombo: "5419b6a8b0d04a076446a9ad",
} as const;

export type TrustpilotSummary = {
  /** Numeric TrustScore, e.g. 4.0. */
  trustScore: number;
  /** Star rating (0–5), e.g. 4.0. */
  stars: number;
  /** Total number of reviews. */
  numberOfReviews: number;
  /** Human label for the score, e.g. "Great" / "Excellent". */
  starsString: string;
  /** Public Trustpilot profile URL. */
  profileUrl: string;
  /** Direct "leave a review" URL. */
  evaluateUrl: string;
};

/**
 * Fetch the live TrustScore + review count for our business unit.
 *
 * Uses the public widget data endpoint that powers the Review Collector
 * TrustBox (the one our plan can access). Returns `null` on any failure so
 * callers can hide the badge gracefully. Cached/revalidated hourly so the
 * score auto-updates without a deploy.
 */
export async function getTrustpilotSummary(): Promise<TrustpilotSummary | null> {
  const url =
    `https://widget.trustpilot.com/trustbox-data/${TRUSTPILOT_TEMPLATES.reviewCollector}` +
    `?businessUnitId=${TRUSTPILOT_BUSINESS_UNIT_ID}&locale=${TRUSTPILOT_LOCALE}`;

  try {
    const res = await fetch(url, {
      headers: {
        // The endpoint 403s requests without a browser-like User-Agent.
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      // Auto-update hourly.
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const data = await res.json();
    const bu = data?.businessUnit ?? data?.businessEntity;
    if (!bu || typeof bu.trustScore !== "number") return null;

    return {
      trustScore: bu.trustScore,
      stars: typeof bu.stars === "number" ? bu.stars : bu.trustScore,
      numberOfReviews: bu.numberOfReviews?.total ?? 0,
      starsString: data.starsString ?? "",
      profileUrl: data?.links?.profileUrl ?? TRUSTPILOT_REVIEW_URL,
      evaluateUrl:
        data?.links?.evaluateUrl ??
        "https://uk.trustpilot.com/evaluate/coastcompetitions.com",
    };
  } catch {
    return null;
  }
}
