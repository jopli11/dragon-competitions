# Coast Competitions — Complete Platform Reference

> **Last updated:** 26 February 2026
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
11. [Payment & Checkout (Stripe)](#11-payment--checkout-stripe)
12. [Ticket Allocation System](#12-ticket-allocation-system)
13. [Automated Draw System](#13-automated-draw-system)
14. [Email Notifications (Postmark)](#14-email-notifications-postmark)
15. [Authentication & Security](#15-authentication--security)
16. [Styling & Design System](#16-styling--design-system)
17. [SEO & Metadata](#17-seo--metadata)
18. [Admin Dashboard](#18-admin-dashboard)
19. [Firebase Cloud Functions](#19-firebase-cloud-functions)
20. [Environment Configuration](#20-environment-configuration)
21. [Business Rules & Compliance](#21-business-rules--compliance)
22. [Feature Status Tracker](#22-feature-status-tracker)
23. [Remaining Build Items — Road to Launch](#23-remaining-build-items--road-to-launch)

---

## 1. Platform Overview

**Coast Competitions** is a UK-based, skill-based competition and raffle platform. Users browse live competitions, answer a skill-based question to prove eligibility, purchase tickets via Stripe, and are automatically entered into a transparent, cryptographically audited draw when the competition ends.

### What Makes It Different

- **Skill-based entry** — UK law requires a skill element to distinguish competitions from gambling. Every user must correctly answer a question before they can purchase tickets.
- **Transparent draws** — Winners are selected using a cryptographically secure random number generator. The seed and total ticket count are stored as an audit trail.
- **Automated everything** — Draws run automatically via a scheduled Firebase Cloud Function. Confirmation and winner emails are sent instantly via Postmark.
- **CMS-driven** — All competition content (titles, images, questions, pricing, FAQs) is managed in Contentful, so the team can launch and manage competitions without touching code.
- **No extensions, ever** — Every draw happens on the stated date regardless of ticket sales. This builds trust and gives entrants better odds.

### Core Value Proposition

1. Browse competitions with prizes (cars, tech, cash, watches)
2. Answer a simple skill question
3. Buy tickets (from under £1 upward)
4. Get entered into a provably fair draw
5. Winner announced automatically with full transparency

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 15.1.6 | Server-side rendering, routing, API routes |
| **UI Library** | React | 19.0.0 | Component-based UI |
| **Language** | TypeScript | 5.x | Type safety |
| **Database** | Firebase Firestore | 12.8.0 (client) / 13.6.1 (admin) | NoSQL database for orders, tickets, quiz passes, draw state |
| **CMS** | Contentful | 11.10.3 | Raffle content, images, FAQs, settings |
| **Payments** | Stripe | 20.3.0 | Checkout sessions, webhooks |
| **Email** | Postmark | 4.0.5 | Transactional emails (purchase confirmation, winner notification) |
| **Auth** | Firebase Authentication | (bundled) | User authentication (Email/Password, Google Sign-in) |
| **Styling** | Emotion CSS-in-JS | 11.14.x | Styled components, CSS prop |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS framework |
| **Font** | Nunito Sans | (Google Fonts) | Primary typeface across the site |
| **Serverless** | Firebase Cloud Functions | 5.0.0 | Automated draw scheduling |
| **Hosting** | Vercel (target) | — | Next.js deployment |

### Monorepo Structure

The project uses **npm workspaces** with two packages:
- `apps/web` — The Next.js web application
- `apps/functions` — Firebase Cloud Functions for automated draws

---

## 3. Architecture & Project Structure

```
dragon-competitions/
├── apps/
│   ├── web/                          # Next.js web application
│   │   ├── src/
│   │   │   ├── app/                  # App Router (pages, layouts, API routes)
│   │   │   │   ├── page.tsx          # Homepage (Server Component, Contentful data)
│   │   │   │   ├── layout.tsx        # Root layout (header, footer, metadata)
│   │   │   │   ├── globals.css       # Tailwind + theme variables
│   │   │   │   ├── about/            # About page
│   │   │   │   ├── admin/            # Admin dashboard (Multi-tab management)
│   │   │   │   ├── contact/          # Contact form
│   │   │   │   ├── faqs/             # FAQ accordion
│   │   │   │   ├── privacy/          # Privacy policy
│   │   │   │   ├── terms/            # Terms & conditions
│   │   │   │   ├── raffles/          # Raffles listing + detail + success
│   │   │   │   ├── results/          # Draw results
│   │   │   │   ├── winners/          # Winners gallery
│   │   │   │   ├── login/            # Login page
│   │   │   │   ├── register/         # Registration page
│   │   │   │   └── api/              # API routes
│   │   │   │       ├── checkout/create-session/
│   │   │   │       ├── raffles/[slug]/check-answer/
│   │   │   │       └── webhooks/stripe/
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── AnimatedIn.tsx
│   │   │   │   ├── BrandHeroCarousel.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── CookieConsent.tsx # GDPR banner
│   │   │   │   ├── Countdown.tsx
│   │   │   │   ├── HomeCountdown.tsx # Dynamic countdown
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── RaffleMobileCTA.tsx
│   │   │   │   ├── SiteFooter.tsx
│   │   │   │   ├── SiteHeader.tsx
│   │   │   │   ├── SkillQuestionCard.tsx
│   │   │   │   ├── TrustpilotBadge.tsx
│   │   │   │   └── WinnersSection.tsx
│   │   │   └── lib/                  # Utility libraries & service clients
│   │   │       ├── contentful/       # Contentful CMS clients & queries
│   │   │       ├── firebase/         # Firebase client, admin, and stats
│   │   │       ├── stripe/           # Stripe client
│   │   │       ├── postmark/         # Email client
│   │   │       ├── styles.ts         # Emotion styled components (design system)
│   │   │       ├── env.ts            # Environment variable helpers
│   │   │       └── emotion-registry.tsx # Emotion SSR setup
│   │   ├── contentful/               # CMS migrations & docs
│   │   ├── public/                   # Static assets
│   │   │   ├── logo.png             # Coast Competitions logo
│   │   │   └── wavelogo.png         # Coast Competitions wave logo variant
│   │   ├── firestore.rules           # Firestore security rules
│   │   ├── next.config.ts            # Next.js configuration
│   │   └── package.json
│   └── functions/                    # Firebase Cloud Functions
│       ├── src/index.ts              # Scheduled draw function
│       └── package.json
├── package.json                      # Root workspace config
├── AGENTS.md                         # React best practices
└── README.md                         # Project documentation
```

### Data Flow Architecture

```
[Contentful CMS] ──(raffle content)──> [Next.js Server Components / API Routes]
                                              │
                                              ├──> [Client Components (React)]
                                              │           │
                                              │     User answers question
                                              │           │
                                              │     /api/check-answer ──> [Firestore: quizPasses]
                                              │           │
                                              │     /api/create-session ──> [Stripe Checkout]
                                              │                                    │
                                              │                              User pays
                                              │                                    │
                                              │     /api/webhooks/stripe <── [Stripe Webhook]
                                              │           │
                                              │     [Firestore Transaction]
                                              │       ├── Create order
                                              │       ├── Allocate tickets
                                              │       ├── Mirror endAt date
                                              │       ├── Mark quiz pass used
                                              │       └── Send email ──> [Postmark]
                                              │
[Firebase Cloud Functions] ──(every minute)──> [Firestore: raffles]
       │                                              │
       ├── Draw winner (crypto-random)                │
       ├── Update raffle document                     │
       └── Send winner email ──> [Postmark]           │
```

---

## 4. Database Schema

### Firestore Collections

#### `raffles/{raffleId}`
Tracks raffle state, ticket counters, and draw results. The document ID is the raffle slug from Contentful.

| Field | Type | Description |
|-------|------|-------------|
| `endAt` | Timestamp | When the raffle closes (mirrored from Contentful) |
| `drawStatus` | String | `"pending"` or `"completed"` |
| `nextTicketNumber` | Number | Next available ticket number (auto-incremented) |
| `ticketsSold` | Number | Total tickets sold |
| `winningTicketNumber` | Number | The drawn winning ticket (set after draw) |
| `winnerEmail` | String | Winner's email address (set after draw) |
| `winnerOrderId` | String | Winner's order ID (set after draw) |
| `drawnAt` | Timestamp | When the draw was performed |
| `drawAudit` | Object | `{ seed: string, totalTickets: number }` for transparency |
| `drawResult` | String | `"no_tickets_sold"` if no entries |

#### `raffles/{raffleId}/tickets/{ticketNumber}`
Individual ticket entries (subcollection).

| Field | Type | Description |
|-------|------|-------------|
| `ticketNumber` | Number | Sequential ticket number |
| `orderId` | String | Reference to the parent order |
| `email` | String | Buyer's email address |
| `createdAt` | Timestamp | When the ticket was created |

#### `orders/{orderId}`
Purchase records. The document ID is the Stripe checkout session ID.

| Field | Type | Description |
|-------|------|-------------|
| `raffleSlug` | String | Which raffle this order is for |
| `email` | String | Buyer's email |
| `quantity` | Number | Number of tickets purchased |
| `amountTotal` | Number | Total amount paid |
| `currency` | String | Payment currency (e.g. "gbp") |
| `ticketRange` | Object | `{ start: number, end: number }` |
| `createdAt` | Timestamp | Order creation time |
| `stripePaymentIntentId` | String | Stripe payment reference |
| `quizPassId` | String | The quiz pass that authorized this purchase |
| `userId` | String | Firebase Auth user ID (if authenticated) |

#### `quizPasses/{passId}`
Short-lived tokens proving the user answered correctly.

| Field | Type | Description |
|-------|------|-------------|
| `raffleSlug` | String | Which raffle the pass is for |
| `createdAt` | Timestamp | When the pass was issued |
| `expiresAt` | Timestamp | 15 minutes after creation |
| `used` | Boolean | Whether the pass has been redeemed |

#### `admin_users/{email}`
Whitelist of administrative users.

| Field | Type | Description |
|-------|------|-------------|
| `isAdmin` | Boolean | Must be `true` for dashboard access |

### Firestore Security Rules

| Collection | Read | Write |
|-----------|------|-------|
| `raffles` | Public | Admin SDK only |
| `raffles/{id}/entries` | Public | Admin SDK only |
| `orders` | Authenticated owner only (email match) | Admin SDK only |
| `quizPasses` | Denied | Admin SDK only |
| `admin_users` | Authenticated only | Denied (Console only) |

---

## 5. Content Management (Contentful CMS)

All competition content is managed in Contentful. Non-technical team members can create, edit, and publish raffles without developer involvement.

### Content Type: `raffle`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Short text | Yes | Competition title (e.g. "Win a BMW M4") |
| `slug` | Short text | Yes | URL-friendly identifier |
| `status` | Short text | Yes | One of: `"draft"`, `"live"`, `"ended"` |
| `startAt` | Date/time | Yes | When the competition opens |
| `endAt` | Date/time | Yes | When the competition closes |
| `heroImage` | Asset link | Yes | Main competition image |
| `galleryImages` | Asset array | No | Additional images |
| `ticketPricePence` | Integer | Yes | Price per ticket in pence |
| `skillQuestion` | Short text | Yes | The skill question users must answer |
| `answerOptions` | Text array | Yes | 2–3 possible answers |
| `correctAnswerIndex` | Integer | Yes | Index of correct answer (Server-only) |
| `raffleDescription` | Rich text | No | Detailed competition description |
| `prizeDetails` | Rich text | No | Prize specification |

---

## 6. Complete User Journey

### Step-by-Step Flow

#### 1. Landing on the Site
The user arrives at the homepage and sees:
- A **hero carousel** showcasing live competitions.
- A **dynamic countdown timer** counting down to the next ending raffle.
- A **Trustpilot-style trust badge**.
- A **"Current Competitions" grid** with real-time ticket sales progress bars.
- A **"How It Works" explainer**.
- A **Recent Winners** section.

#### 2. Browsing Competitions (`/raffles`)
The raffles listing page displays all live competitions with:
- Real-time ticket sales counts (e.g., "450 Sold").
- Dynamic progress bars.
- End dates.

#### 3. Viewing a Competition (`/raffles/[slug]`)
The raffle detail page loads full content from Contentful:
- **Rich Text descriptions** and prize details.
- **Image gallery** with thumbnails.
- **Sticky sidebar** with real-time sales stats and skill question.

#### 4. Answering the Skill Question
- Answer validated server-side.
- Correct answer issues a **quiz pass** in Firestore.
- Quantity selector appears upon success.

#### 5. Selecting Tickets & Checking Out
- User selects quantity (1-100).
- Redirected to **Stripe Checkout**.

#### 6. Payment & Fulfillment
- Stripe webhook triggers Firestore transaction.
- **Tickets allocated sequentially**.
- **`endAt` date mirrored** to Firestore for draw scheduling.
- Confirmation emails sent to user and admin.

#### 7. Success Page (`/raffles/[slug]/success`)
- Post-payment confirmation.

#### 8. The Automated Draw
- Cloud Function runs every minute.
- Cryptographic draw performed for ended raffles.
- Winner and Admin notified via Postmark.

---

## 7. Pages & Routes

### Public Pages

| Route | Component Type | Description | Data Source |
|-------|---------------|-------------|-------------|
| `/` | Server | Homepage | Contentful + Firestore Stats |
| `/raffles` | Server | Listing grid | Contentful + Firestore Stats |
| `/raffles/[slug]` | Server | Detail page | Contentful + Firestore Stats |
| `/login` | Client | Login page | Firebase Auth |
| `/register` | Client | Registration page | Firebase Auth |
| `/admin` | Client | Admin dashboard | Firestore (Admin protected) |

---

## 22. Feature Status Tracker

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
| Branded Email Templates | **Not started** | Basic HTML currently used |
| Contact Form Backend | **Not started** | UI only, needs Postmark integration |
| Sitemap & robots.txt | **Not started** | — |

---

## 23. Remaining Build Items — Road to Launch

### Tier 1: CRITICAL — Must Have Before Launch

#### 1. Branded Email Templates
**What:** Current emails are bare-bones HTML. They need proper branded templates.
**Why:** Critical for professional first impression.
**How:** Create HTML templates with Coast branding in Postmark.

#### 2. Contact Form Backend
**What:** Wire up the "Contact Us" form to send emails via Postmark.
**How:** Create an API route to handle form submission and email delivery.

#### 3. Sitemap & robots.txt
**What:** Auto-generated SEO files for search engine indexing.
**How:** Use Next.js dynamic sitemap generation.

### Tier 2: HIGH PRIORITY — Post-Launch Polish

#### 4. Stripe Live Keys
**What:** Switch from test mode to live production keys.
**When:** After company incorporation is finalized.

#### 5. Real Winners & Results Data
**What:** Connect the Results and Winners pages to actual Firestore draw data.
**How:** Query the `raffles` collection for `drawStatus == "completed"`.

---

*This reference document covers every feature, integration, data model, user flow, and business rule in the Coast Competitions platform as of 26 February 2026.*
