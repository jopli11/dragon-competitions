---
name: trustpilot-integration
description: How/why Trustpilot is wired into the web app, and the plan constraint behind it
metadata:
  type: project
---

Trustpilot on coastcompetitions.com (re-introduced 2026-06-08).

- Business Unit ID `6a00d44ce2f8797bd79abbbd` (verified live). Config in `apps/web/src/lib/trustpilot.ts`.
- **Plan constraint:** the free Trustpilot plan only grants the **Review Collector** TrustBox. All *display* widgets (review carousel, micro-combo/star) return "BusinessUnit does not have access to that trustbox" and require a **paid** plan.
- Because of that, the live **score** (homepage + footer) is rendered **on-brand** by `TrustpilotScore.tsx` from data fetched via `getTrustpilotSummary()` — it hits the Review Collector's public `trustbox-data` JSON endpoint (the only one accessible), cached/revalidated hourly. This is a deliberate, user-approved mild ToS gray area (Trustpilot puts display behind paid widgets). The endpoint 403s without a browser User-Agent header.
- That endpoint exposes score + review **count** only, NOT review **text**. So "latest reviews" text is NOT shown — it needs a paid plan.
- The official Review Collector widget (token in config) is placed on the order success page to grow reviews.
- **If they upgrade to a paid Trustpilot plan:** switch homepage/footer to the official display widgets — `TRUSTPILOT_TEMPLATES.reviewCarousel` / `microCombo` are kept dormant in config and `TrustpilotWidget.tsx` is ready; the bootstrap script is already in the root layout.

**Why:** the user wanted live auto-updating score + latest reviews on homepage and a score in the footer.
**How to apply:** score is live now; revisit for review *text* only after a paid upgrade.
