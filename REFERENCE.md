# Coast Competitions — Complete Platform Reference

> **Last updated:** 3 March 2026
> **Purpose:** Master reference for tutorials, blog posts, SEO content, and general platform documentation.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [Tech Stack](#2-tech-stack)
3. [Architecture & Project Structure](#3-architecture--project-structure)
4. [Database Schema](#4-database-schema)
5. [Content Management (Contentful CMS)](#5-content-management-contentful-cms)
6. [Complete User Journey](#6-complete-user-journey)
7. [Pages & Routes](#7-pages--routes)
8. [API Endpoints](#8-api-endpoints)
9. [Components Reference](#9-components-reference)
10. [Skill Question System](#10-skill-question-system)
11. [Payment & Checkout (DNA Payments)](#11-payment--checkout-dna-payments)
12. [Ticket Allocation System](#12-ticket-allocation-system)
13. [Automated Draw System](#13-automated-draw-system)
14. [Provably Fair System](#14-provably-fair-system)
15. [Email Notifications (Postmark)](#15-email-notifications-postmark)
16. [Authentication & Security](#16-authentication--security)
17. [Styling & Design System](#17-styling--design-system)
18. [SEO & Metadata](#18-seo--metadata)
19. [Admin Dashboard](#19-admin-dashboard)
20. [Firebase Cloud Functions](#20-firebase-cloud-functions)
21. [Environment Configuration](#21-environment-configuration)
22. [Business Rules & Compliance](#22-business-rules--compliance)
23. [Feature Status Tracker](#23-feature-status-tracker)
24. [Remaining Build Items — Road to Launch](#24-remaining-build-items--road-to-launch)
25. [Analytics Events (Crumbless)](#25-analytics-events-crumbless)

---

## 1. Platform Overview

**Coast Competitions** is a UK-based, skill-based competition and raffle platform. Users browse live competitions, answer a skill-based question to prove eligibility, purchase tickets via DNA Payments (card, Apple Pay, Google Pay), and are automatically entered into a transparent, cryptographically audited draw when the competition ends.

### What Makes It Different

- **Skill-based entry** — UK law requires a skill element to distinguish competitions from gambling. Every user must correctly answer a question before they can purchase tickets.
- **Transparent draws** — Winners are selected using a cryptographically secure random number generator. The seed and total ticket count are stored as an audit trail.
- **Automated everything** — Draws run automatically via a scheduled Firebase Cloud Function. Confirmation and winner emails are sent instantly via Postmark.
- **CMS-driven** — All competition content (titles, images, questions, pricing, FAQs) is managed in Contentful, so the team can launch and manage competitions without touching code.
- **No extensions, ever** — Every draw happens on the stated date regardless of ticket sales. This builds trust and gives entrants better odds.

---

## 11. Payment & Checkout (DNA Payments)

Coast Competitions uses **DNA Payments Checkout** (JS Lightbox / iframe) for all payments. Supported payment methods: **Card (Visa, Mastercard, Maestro, Amex)**, **Apple Pay**, and **Google Pay**. The integration is hardened for production with HMAC-SHA256 signature verification, idempotency, concurrency protection, and automated error handling.

### Payment Flow
1. User answers the skill question and selects ticket quantity.
2. Client calls `/api/checkout/create-session` which authenticates with DNA's OAuth, mints a unique `invoiceId`, persists a pending order in Firestore, and returns an access token.
3. Client opens the DNA Lightbox via `window.DNAPayments.openPaymentIframeWidget()` with card, Apple Pay, and Google Pay options.
4. On completion, DNA sends a server-to-server callback (Payment Result) to `/api/webhooks/dna`.
5. The webhook verifies the HMAC-SHA256 signature, runs an atomic Firestore transaction to allocate tickets, and sends a confirmation email via Postmark.
6. The user is redirected to the success page keyed by `invoiceId`.

### Webhook Configuration
DNA Payments must be configured to send the Payment Result callback to:
`https://www.coastcompetitions.com/api/webhooks/dna`

### Concurrency & Inventory Protection
To prevent overselling during high-traffic "last minute" rushes, the system uses a three-layer guard:
1. **Soft Check**: Pre-checkout availability check in the `create-session` API.
2. **Hard Guard**: Atomic Firestore transaction inside the webhook ensures only the first writer wins the race for the last tickets.
3. **Auto-Reversal/Refund**: If a user pays but tickets are gone (due to a race condition), the system automatically triggers a DNA reversal (pre-settlement) or refund (post-settlement) and notifies the user.

### Refunds
- **Automatic**: Oversold/pass-reuse scenarios are handled in the webhook with reversal-first, refund-fallback.
- **Admin**: The `/api/admin/refund-order` endpoint allows admins to refund completed orders via DNA's Transaction Refund API, voiding tickets in the same Firestore transaction.

---

## 12. Ticket Allocation System

Tickets are allocated sequentially starting from 1. The allocation is authoritative and happens within a Firestore transaction to ensure no two users ever receive the same ticket number.

---

## 13. Automated Draw System

### Draw Types
Raffles can be configured in Contentful with two different draw behaviors:

1. **Automatic Draw**: The system automatically picks a winner at the `endAt` time and notifies them via email.
2. **Live Draw**: The system marks the raffle as ended but **waits** for an admin to conduct a live draw (e.g., on social media). The winner is then manually recorded.

### Reoccurring Raffles
Some raffles are configured to be **reoccurring**. As soon as the ticket limit is reached or the draw is completed, the system automatically creates a new instance of the raffle with the same parameters.

---

## 14. Provably Fair System

Coast Competitions uses a **Provably Fair** model to ensure every draw is 100% transparent and tamper-proof.

### The Algorithm (CSPRNG)
We use a **Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)** provided by the Node.js `crypto` module. This is the same level of randomness used in high-stakes encryption and banking.

### How to Verify a Draw
For every completed draw, we expose the following "Audit Trail" data on the **Draw Results** page:
1. **The Seed**: A unique 64-character random hex string generated at the exact moment of the draw.
2. **Total Tickets**: The final count of eligible entries.
3. **Winning Ticket Calculation**: `(Seed_Value % Total_Tickets) + 1`.

Any user can take the Seed and the Total Ticket count and run the calculation themselves to verify that the result matches the announced winner.

---

## 23. Feature Status Tracker

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage with dynamic hero carousel | **Complete** | Pulls live raffles from Contentful |
| Dynamic Homepage Countdown | **Complete** | Counts down to soonest ending raffle |
| Real-time ticket sales display | **Complete** | Pulls `ticketsSold` from Firestore |
| Raffle `endAt` mirroring | **Complete** | Synced via Stripe webhook |
| Rich Text rendering | **Complete** | Descriptions/Prize details rendered |
| Prize Gallery Thumbnails | **Complete** | Displayed on detail pages |
| User authentication UI | **Complete** | Email/Password + Google Sign-in |
| Admin Dashboard (Multi-tab) | **Complete** | Overview, Raffles, Orders, Winners, Settings |
| GDPR Cookie Consent | **Complete** | LocalStorage-based branded banner |
| Error & Loading States | **Complete** | Custom skeletons and error boundaries |
| Dynamic SEO Metadata | **Complete** | Per-raffle titles and OG images |
| Sitemap & robots.txt | **Complete** | Auto-generated for search engines |
| Schema.org Structured Data | **Complete** | Product/Offer markup for raffles |
| Contact Form Backend | **Complete** | Integrated with Postmark & Server Actions |
| Live vs Auto Draw Flag | **Complete** | Contentful model update & Function logic |
| Provably Fair Verification Page | **Complete** | Integrated into Draw Results |
| Reoccurring Raffle Logic | **Complete** | Automated via Cloud Functions |
| Footer Compliance Update | **Complete** | Added Company No. 17087259 and address |
| Postmark Configuration | **Complete** | API keys and sender verified |
| DNA Payments Integration | **Complete** | Checkout Lightbox with Card, Apple Pay, Google Pay, HMAC signature verification, auto-reversal/refund |
| Branded Email Templates | **Not started** | Basic HTML currently used |
| DNA Payments Production Setup | **Pending** | Set DNA_ENV=live, replace test credentials, Apple domain-association file from DNA |

---

## 24. Remaining Build Items — Road to Launch

### CRITICAL: Firebase Functions Configuration
The following environment variables **MUST** be set in the Firebase Functions config (`firebase functions:config:set`) before the system can process draws or re-list raffles:
- `CONTENTFUL_MANAGEMENT_TOKEN`: Personal Access Token for the Contentful Management API (Required for **Reoccurring Raffles**).
- `CONTENTFUL_SPACE_ID`: Your Contentful Space ID.
- `CONTENTFUL_ENVIRONMENT`: (Optional) Defaults to `master`.
- `POSTMARK_SERVER_TOKEN`: API key for transactional emails.
- `POSTMARK_FROM_EMAIL`: The verified sender email (e.g., `coastcompetitionsuk@gmail.com`).
- `ADMIN_NOTIFICATION_EMAIL`: Where admin draw alerts are sent.

### Tier 1: CRITICAL — Must Have Before Launch

#### 1. Branded Email Templates
**What:** Create professional HTML templates with Coast branding in Postmark.

#### 2. Logo Refresh
**What:** Update the site logo to the final version approved by stakeholders.

#### 3. DNA Payments Production Setup
**What:** Set `DNA_ENV=live` and `NEXT_PUBLIC_DNA_ENV=live` in production, replace test credentials with live ones, commit the Apple domain-association file from DNA support, and complete final integration approval with DNA.
**Status:** Test integration complete, live credentials pending.

### Tier 2: HIGH PRIORITY — Post-Launch Polish & SEO

#### 4. Real Winners & Results Data
**What:** Connect the Results and Winners pages to actual Firestore draw data.
**How:** Query the `raffles` collection for `drawStatus == "completed"`.

#### 5. "Winner's Story" Blog / Content Automation
**What:** Implement a system to automatically generate blog posts or news updates when a winner is drawn.
**Why:** Massive SEO signal for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).

#### 6. External Backlink Strategy
**What:** Submit the site to UK competition directories (The Prize Finder, Loquax, etc.).
**Why:** High-authority backlinks are the primary driver for ranking in the UK raffle niche.

---

## 25. Analytics Events (Crumbless)

Coast Competitions uses [Crumbless](https://www.crumbless.io) for privacy-first, zero-cookie analytics. Anonymous **pageviews are tracked automatically** by the tracker script loaded in `apps/web/src/app/layout.tsx`. On top of that, we fire a curated set of **custom events** at high-value funnel and engagement moments via a typed helper.

### How to fire an event

All events go through the wrapper in `apps/web/src/lib/analytics.ts`. The `AnalyticsEvent` string-literal union is the single source of truth — TypeScript will autocomplete every legal event name and refuse anything else.

```ts
import { track } from "@/lib/analytics";

track("raffle_proceed_to_payment_click");
```

`track()` is SSR-safe (no-ops on the server), ad-block-safe (no-ops if Crumbless didn't load), and never throws. `trackOnce(event, key)` deduplicates the same event firing twice in a page-load — used for definitive conversions like `purchase_completed` on the success page.

### Why no event properties

Crumbless's `window.crumbless.track(eventName)` accepts a **single string** (max 100 chars) and has no support for properties or metadata. We therefore:
- Keep funnel event names slug-free and infer per-raffle context from the auto-tracked pageview URL (e.g. any event fired on `/raffles/iphone-15-pro` is implicitly that raffle).
- Encode the only varying dimension (filter/sort/tab) into the event name itself (e.g. `raffles_filter_free` vs `raffles_filter_discounted`).

### Conversion funnel (Skill → Checkout → Purchase)

Fired from [`apps/web/src/components/SkillQuestionCard.tsx`](apps/web/src/components/SkillQuestionCard.tsx) and the success-page client widget [`apps/web/src/components/SuccessAnalytics.tsx`](apps/web/src/components/SuccessAnalytics.tsx).

| Event | Triggered when |
|-------|----------------|
| `raffle_skill_answer_submit` | User clicks "Continue" on the skill question |
| `raffle_skill_answer_correct` | API confirms a correct answer |
| `raffle_skill_answer_incorrect` | API confirms an incorrect answer |
| `raffle_quiz_change_answer` | User clicks the "Change Answer" link to redo the quiz |
| `raffle_quick_select_quantity` | User clicks one of the bulk-tier quick-select buttons |
| `raffle_proceed_to_payment_click` | Paid path: user clicks "Proceed to Payment" |
| `raffle_free_entry_click` | Free-entry path: user clicks "Claim Free Entry" |
| `checkout_session_created` | DNA `create-session` API returned 200 |
| `checkout_session_error` | DNA `create-session` API errored (incl. expired quiz pass) |
| `dna_widget_opened` | DNA Lightbox `opened` event fired |
| `dna_payment_declined` | DNA Lightbox `declined` event fired |
| `dna_payment_cancelled` | DNA Lightbox `cancelled` event fired |
| `purchase_completed` | Server-confirmed paid order rendered on `/raffles/[slug]/success` |
| `purchase_failed` | Order rendered on success page with `status: "failed"` |
| `purchase_refunded_oversold` | Order auto-refunded due to oversell/pass-reuse on success page |
| `trustpilot_review_click` | User clicks the Trustpilot review CTA on success page |

### Discovery / browse

Fired from [`apps/web/src/components/RaffleFiltersGrid.tsx`](apps/web/src/components/RaffleFiltersGrid.tsx). Only fires on user-initiated change; the default filter (`all`) and default sort (`newest`) do not fire.

| Event | Triggered when |
|-------|----------------|
| `raffles_filter_free` | User selects the "Free entry" filter |
| `raffles_filter_discounted` | User selects the "Discounts" filter |
| `raffles_filter_ending_soon` | User selects the "Ending soon" filter |
| `raffles_filter_best_odds` | User selects the "Best odds" filter |
| `raffles_sort_ending_soon` | User chooses "Ending soonest" sort |
| `raffles_sort_price_low` | User chooses "Lowest entry price" sort |
| `raffles_sort_most_available` | User chooses "Most tickets left" sort |

### Authentication

Fired from `apps/web/src/app/login/page.tsx`, `apps/web/src/app/register/page.tsx`, and the logout handler in `apps/web/src/components/SiteHeader.tsx`.

| Event | Triggered when |
|-------|----------------|
| `auth_login_email_submit` | User submits the email/password login form |
| `auth_login_google_submit` | User clicks "Continue with Google" on login |
| `auth_login_success` | Firebase Auth returns a logged-in user (either path) |
| `auth_login_failure` | Login throws (wrong credentials, blocked popup, etc.) |
| `auth_register_email_submit` | User submits the email/password register form |
| `auth_register_google_submit` | User clicks "Continue with Google" on register |
| `auth_register_success` | Firebase Auth creates a new account (either path) |
| `auth_register_failure` | Registration throws |
| `auth_logout` | User clicks the logout button in the header |

### Engagement / misc

| Event | Triggered when | Location |
|-------|----------------|----------|
| `nav_enter_now_click` | Header "Enter Now" CTA clicked | `SiteHeader.tsx` |
| `nav_mobile_menu_open` | Hamburger menu opened | `SiteHeader.tsx` |
| `payment_prompt_dismiss` | Floating payment prompt dismissed | `FloatingPaymentPrompt.tsx` |
| `dashboard_tab_entries` | User switches to the "My Entries" tab | `dashboard/page.tsx` |
| `dashboard_tab_wins` | User switches to the "My Wins" tab | `dashboard/page.tsx` |
| `contact_form_submit` | Contact form submission begins | `contact/page.tsx` |
| `contact_form_success` | Contact form server action succeeded | `contact/page.tsx` |
| `contact_form_error` | Contact form server action failed | `contact/page.tsx` |
| `social_instagram_click` | Instagram link clicked on contact page | `contact/page.tsx` |
| `social_tiktok_click` | TikTok link clicked on contact page | `contact/page.tsx` |

### What we deliberately do NOT track

- **Slider drag events** — too noisy; quick-select tier clicks are the signal-rich proxy.
- **Per-raffle event names** (e.g. `purchase_completed_iphone_15_pro`) — would multiply event quota. Use the pageview URL breakdown in Crumbless for per-raffle conversion views instead.
- **Pageviews** — already auto-tracked.
- **DNA `paid` widget event** — replaced by the definitive, server-confirmed `purchase_completed` on the success page.
- **Form field focus / blur** — not actionable.

### Reading the funnel in the Crumbless dashboard

The skill → purchase funnel reads top-to-bottom as: `raffle_skill_answer_submit` → `raffle_skill_answer_correct` → `raffle_proceed_to_payment_click` → `checkout_session_created` → `dna_widget_opened` → `purchase_completed`. Each step's drop-off is the count delta versus the previous step. Per-raffle drop-offs are recovered by filtering the dashboard by pageview path (`/raffles/<slug>`).

---

*This reference document covers every feature, integration, data model, user flow, and business rule in the Coast Competitions platform as of 3 March 2026.*
