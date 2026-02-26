# Coast Competitions — Complete Platform Reference

> **Last updated:** 12 February 2026
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
| **Framework** | Next.js (App Router) | 16.1.6 | Server-side rendering, routing, API routes |
| **UI Library** | React | 19.2.3 | Component-based UI |
| **Language** | TypeScript | 5.x | Type safety |
| **Database** | Firebase Firestore | 12.8.0 (client) / 13.6.1 (admin) | NoSQL database for orders, tickets, quiz passes, draw state |
| **CMS** | Contentful | 11.10.3 | Raffle content, images, FAQs, settings |
| **Payments** | Stripe | 20.3.0 | Checkout sessions, webhooks |
| **Email** | Postmark | 4.0.5 | Transactional emails (purchase confirmation, winner notification) |
| **Auth** | Firebase Authentication | (bundled) | User authentication (infrastructure ready) |
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
│   │   │   │   ├── admin/            # Admin dashboard (placeholder)
│   │   │   │   ├── contact/          # Contact form
│   │   │   │   ├── faqs/             # FAQ accordion
│   │   │   │   ├── privacy/          # Privacy policy
│   │   │   │   ├── terms/            # Terms & conditions
│   │   │   │   ├── raffles/          # Raffles listing + detail + success
│   │   │   │   ├── results/          # Draw results
│   │   │   │   ├── winners/          # Winners gallery
│   │   │   │   └── api/              # API routes
│   │   │   │       ├── checkout/create-session/
│   │   │   │       ├── raffles/[slug]/check-answer/
│   │   │   │       └── webhooks/stripe/
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── AnimatedIn.tsx
│   │   │   │   ├── BrandHeroCarousel.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── Countdown.tsx
│   │   │   │   ├── HomeCountdown.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── RaffleMobileCTA.tsx
│   │   │   │   ├── SiteFooter.tsx
│   │   │   │   ├── SiteHeader.tsx
│   │   │   │   ├── SkillQuestionCard.tsx
│   │   │   │   ├── TrustpilotBadge.tsx
│   │   │   │   └── WinnersSection.tsx
│   │   │   └── lib/                  # Utility libraries & service clients
│   │   │       ├── contentful/       # Contentful CMS clients & queries
│   │   │       ├── firebase/         # Firebase client & admin SDK
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
| `endAt` | Timestamp | When the raffle closes |
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

### Firestore Security Rules

| Collection | Read | Write |
|-----------|------|-------|
| `raffles` | Public | Admin SDK only |
| `raffles/{id}/entries` | Denied | Admin SDK only |
| `orders` | Authenticated owner only (`request.auth.uid == resource.data.userId`) | Admin SDK only |
| `quizPasses` | Denied | Admin SDK only |

---

## 5. Content Management (Contentful CMS)

All competition content is managed in Contentful. Non-technical team members can create, edit, and publish raffles without developer involvement.

### Content Type: `raffle`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Short text | Yes | Competition title (e.g. "Win a BMW M4") |
| `slug` | Short text | Yes | URL-friendly identifier (e.g. `win-a-bmw-m4`). Must match pattern `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `status` | Short text | Yes | One of: `"draft"`, `"live"`, `"ended"` |
| `startAt` | Date/time | Yes | When the competition opens |
| `endAt` | Date/time | Yes | When the competition closes |
| `heroImage` | Asset link | Yes | Main competition image |
| `galleryImages` | Asset array | No | Additional images (min 600x400) |
| `ticketPricePence` | Integer | Yes | Price per ticket in pence (1–1,000,000) |
| `skillQuestion` | Short text | Yes | The skill question users must answer |
| `answerOptions` | Text array | Yes | 2–3 possible answers |
| `correctAnswerIndex` | Integer | Yes | Index of correct answer (0, 1, or 2). **Server-only — never sent to the client** |
| `raffleDescription` | Rich text | No | Detailed competition description |
| `prizeDetails` | Rich text | No | Prize specification |
| `cashAlternativeEnabled` | Boolean | No | Whether a cash alternative is offered |
| `cashAlternativeAmountPence` | Integer | No | Cash alternative value in pence |
| `cashAlternativeCopy` | Rich text | No | Cash alternative description |
| `perRaffleFaqs` | Entry array | No | Links to `faqItem` entries |
| `pricingRules` | Rich text | No | Pricing/discount information |
| `termsAndConditions` | Rich text | No | Competition-specific T&Cs |

### Content Type: `faqItem`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `question` | Short text | Yes | FAQ question |
| `answer` | Rich text | Yes | FAQ answer |

### Content Type: `globalSettings`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `internalName` | Short text | Yes | Internal identifier |
| `supportEmail` | Short text | No | Support email (validated) |
| `globalLegalCopy` | Rich text | No | Site-wide legal copy |

### Contentful Access Patterns

- **Public Client** (`publicClient.ts`): Uses Content Delivery API token. Returns all raffle fields **except** `correctAnswerIndex`. Used for browsing and display.
- **Admin Client** (`adminClient.ts`): Uses Content Management API token. Returns **all** fields including `correctAnswerIndex`. Used only server-side for answer validation.

### Data Fetching Functions (`raffles.ts`)

| Function | Returns | Access | Description |
|----------|---------|--------|-------------|
| `fetchLiveRaffles()` | `RaffleSummary[]` | Public | All raffles with status "live", cached with React `cache()` |
| `fetchRaffleBySlug(slug)` | `RaffleDetail \| null` | Public | Full raffle details (no correct answer) |
| `fetchRaffleCorrectAnswer(slug)` | `number` | Admin only | Correct answer index for validation |

If Contentful is not configured, all functions fall back to **mock data** so development works without external services. Mock data includes three sample raffles: "£20,000 Tax Free Cash", "Tesla Model S Plaid", and "PS5 Ultimate Bundle".

---

## 6. Complete User Journey

### Step-by-Step Flow

#### 1. Landing on the Site
The user arrives at the homepage and sees:
- A **hero carousel** showcasing up to 3 live competitions (dynamically fetched from Contentful, with images linking to raffle pages)
- A **countdown timer** widget (currently shows static placeholder values — needs to be connected to the next ending raffle)
- A **Trustpilot-style trust badge** (TrustScore 4.9, 1,248 reviews)
- A **"Current Competitions" grid** showing up to 4 live raffles with title, hero image, price, end date, and "Enter Now" buttons
- A **"How It Works" explainer** section (6 steps: Register → Pick Competition → Answer Question → Secure Checkout → No Extensions → Watch Draw)
- A **Recent Winners** section showing winner cards with quotes, ticket numbers, and verified badges

#### 2. Browsing Competitions (`/raffles`)
The raffles listing page (Server Component) fetches all live competitions from Contentful and displays them in a responsive grid. Each card shows:
- Hero image with "Entries Open" badge
- Competition title
- Ticket price (formatted from pence, e.g. "18p")
- End date
- A progress bar (ticket sales — currently placeholder at 10%)
- An "Enter Now" button

#### 3. Viewing a Competition (`/raffles/[slug]`)
The raffle detail page (Server Component with `notFound()` handling) loads the full competition from Contentful and displays:
- **Blurred hero banner** with the competition image
- **"Entries Open" badge** and ticket price
- **Main image card** — full-resolution hero image
- **About section** — describing the raffle with "Guaranteed Draw" and "Instant Confirmation" feature cards
- **Competition Rules** — numbered list of entry requirements
- **Skill question card** (sticky sidebar on desktop)
- **Ticket sales stats** (placeholder — shows "-- / --" and "5 people entered in the last hour")
- **Mobile floating CTA** — fixed bottom bar with price and "Enter Now" button (on mobile only)

#### 4. Answering the Skill Question
When the user selects an answer:
1. The `SkillQuestionCard` component sends a POST request to `/api/raffles/[slug]/check-answer` with the selected `answerIndex`
2. The server fetches the correct answer from Contentful using the **admin client** (so the answer is never exposed to the browser)
3. If **incorrect**: the user sees a red error state and can retry
4. If **correct**: the server creates a **quiz pass** in Firestore (valid for 15 minutes) and returns the `quizPassId`
5. The `quizPassId` is stored in the browser's `sessionStorage`
6. The skill question card transitions to show a **ticket quantity selector** (1–100 tickets) with +/- buttons

#### 5. Selecting Tickets & Checking Out
1. The user selects how many tickets they want (1–100)
2. Clicking "Buy tickets now" triggers a POST request to `/api/checkout/create-session` with the `slug`, `quantity`, and `quizPassId`
3. The server validates the quiz pass and raffle, then creates a **Stripe Checkout Session**
4. The user is **redirected to Stripe's hosted checkout page**

#### 6. Payment & Fulfillment
1. The user completes payment on Stripe's checkout page
2. Stripe sends a `checkout.session.completed` webhook to `/api/webhooks/stripe`
3. The webhook handler performs an **atomic Firestore transaction**:
   - Allocates sequential ticket numbers
   - Creates an order document
   - Marks the quiz pass as used
   - Creates individual ticket documents
4. A **purchase confirmation email** is sent via Postmark

#### 7. Success Page (`/raffles/[slug]/success`)
After payment, Stripe redirects the user to the success page showing a confirmation message, a note about the email, and links to browse more competitions.

#### 8. The Automated Draw
When a competition's `endAt` time passes:
1. A Firebase Cloud Function (`scheduledDraw`) runs **every minute** and checks for ended raffles
2. For each ended raffle: performs a **cryptographically secure draw** using `crypto.randomBytes(32)`
3. Updates the raffle document with winner info and audit trail
4. Sends a **winner notification email** via Postmark

---

## 7. Pages & Routes

### Public Pages

| Route | Component Type | Description | Data Source |
|-------|---------------|-------------|-------------|
| `/` | Server | Homepage — hero carousel (from CMS), countdown, trust badge, raffle grid, how it works, winners | Contentful (live raffles) |
| `/raffles` | Server | Live competitions listing grid | Contentful (live raffles) |
| `/raffles/[slug]` | Server | Competition detail with skill question and checkout | Contentful (raffle by slug) |
| `/raffles/[slug]/success` | Server | Post-payment confirmation page | None (static) |
| `/about` | Server | Company story, stats, features, CTA | Static content |
| `/contact` | Server | Contact form, email, hours, social links | Static content |
| `/faqs` | Client | Accordion FAQ — 3 categories, 9 questions | Hardcoded FAQs |
| `/results` | Client | Recent draw results gallery | Mock data |
| `/winners` | Client | Winners gallery with verified badges | Mock data |
| `/privacy` | Server | Privacy policy (5 sections) | Static content |
| `/terms` | Server | Terms & conditions (5 sections) | Static content |
| `/admin` | Server | Admin dashboard (placeholder) | None (placeholder) |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/raffles/[slug]/check-answer` | POST | Validates skill question answer, issues quiz pass |
| `/api/checkout/create-session` | POST | Creates Stripe Checkout session |
| `/api/webhooks/stripe` | POST | Handles Stripe payment webhooks |

### Layout Structure

The root layout (`layout.tsx`) wraps all pages with:
- `SiteHeader` — sticky white header with Coast Competitions logo + text mark, navigation links, login button, "Enter Now" CTA, mobile hamburger overlay
- `SiteFooter` — dark navy footer with logo, quick links, support links, social icons, 18+ and BeGambleAware badges
- Emotion CSS registry for server-side style injection
- Nunito Sans font loaded via Google Fonts

---

## 8. API Endpoints

### POST `/api/raffles/[slug]/check-answer`

**Purpose:** Validates whether the user's answer to the skill question is correct.

**Request Body:**
```json
{ "answerIndex": 0 }
```

**Success Response (correct answer):**
```json
{ "isCorrect": true, "quizPassId": "abc123def456" }
```

**Success Response (wrong answer):**
```json
{ "isCorrect": false }
```

**How It Works:**
1. Extracts `slug` from the URL and `answerIndex` from the body
2. Calls `fetchRaffleCorrectAnswer(slug)` using the Contentful **admin client**
3. Compares the user's answer to the correct answer
4. If correct, creates a quiz pass in Firestore (15-minute expiry, `used: false`)
5. Returns the `quizPassId` to the client

---

### POST `/api/checkout/create-session`

**Purpose:** Creates a Stripe Checkout session so the user can pay for tickets.

**Request Body:**
```json
{ "slug": "win-a-bmw-m4", "quantity": 5, "quizPassId": "abc123def456" }
```

**Success Response:**
```json
{ "url": "https://checkout.stripe.com/c/pay/cs_test_..." }
```

**Validation Steps:**
1. Checks all required fields are present
2. Validates quantity is between 1 and 100
3. Fetches the quiz pass from Firestore and verifies it exists, hasn't been used, matches the raffle slug, and hasn't expired
4. Fetches the raffle from Contentful and verifies it's live
5. Creates a Stripe Checkout Session with the raffle's ticket price and the user's quantity
6. Returns the Stripe checkout URL for redirect

---

### POST `/api/webhooks/stripe`

**Purpose:** Handles Stripe webhook events after payment completion.

**Handled Event:** `checkout.session.completed`

**Process:**
1. Verifies the webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Extracts metadata: `raffleSlug`, `quizPassId`, `quantity`
3. Runs an **atomic Firestore transaction** that allocates tickets, creates order, marks quiz pass used, creates individual ticket docs
4. Sends a purchase confirmation email via Postmark

---

## 9. Components Reference

### `BrandHeroCarousel`
Auto-advancing hero carousel. Receives dynamic `slides` array as props (from Contentful data). Each slide has image, title, and link to raffle page. 5-second auto-advance with dot navigation. Responsive: 16:9 on mobile, 21:9 on desktop.

### `SiteHeader`
Sticky white header with Coast Competitions logo (`/logo.png`) + "Coast / Competitions" text mark. Navigation: Current Competitions, Draw Results, About Us, Winners. Login link (goes to `/login` — not yet implemented). "Enter Now" CTA button. Mobile hamburger overlay with full-screen navigation.

### `SiteFooter`
Dark navy (`#232F3E`) footer. Coast Competitions logo + description. Quick Links and Support links. Facebook, Instagram, Twitter social icons. 18+ and BeGambleAware compliance badges. Dynamic copyright year.

### `SkillQuestionCard`
The core interactive component — handles the skill question and checkout flow. Props: `question`, `options` (string array), `slug`. States: question mode → loading → wrong answer (retry) → correct answer → quantity selector → checkout. Stores `quizPassId` in `sessionStorage`. Makes API calls to check-answer and create-session endpoints.

### `HomeCountdown`
Countdown widget on the homepage with branded teal gradient background. Currently shows **static placeholder values** (0 days, 12 hours, 34 mins, 08 secs). Includes "Next Draw / Ending Soon" label. Needs to be connected to the actual nearest ending raffle.

### `Countdown`
Generic countdown timer component. Takes `endAt` (ISO date string) prop. Updates every second. Shows days, hours, minutes, seconds. Displays "Ended" when countdown reaches zero. Used on raffle detail pages.

### `RaffleMobileCTA`
Fixed bottom bar visible only on mobile (`lg:hidden`). Shows ticket price and "Enter Now" button. Smooth-scrolls to the skill question section when tapped.

### `HowItWorks`
6-step process explainer section. Light background with teal accent cards. Steps: Register → Pick Competition → Answer Question → Secure Checkout → No Extensions → Watch Draw. Each card has an icon, step number, title, and description.

### `WinnersSection`
Recent winners showcase. 2 winner cards with prize images, names, quotes, ticket numbers, dates, and verified badges. Currently uses mock data. Links to `/winners` for full gallery.

### `TrustpilotBadge`
Trust indicator widget. Displays "TrustScore 4.9" with 5 stars and "1,248 reviews". Static/hardcoded values.

### `Container`
Responsive max-width wrapper with horizontal padding. Used throughout the site for consistent layout.

### `AnimatedIn`
Animation wrapper. Props: `children`, `delay?`, `className?`. Currently renders children statically (animation logic placeholder).

---

## 10. Skill Question System

The skill question system is the legal backbone of Coast Competitions. Under UK law, competitions must include a genuine element of skill.

### How It Works

1. **Question creation** — Each raffle in Contentful has a `skillQuestion`, `answerOptions` (2–3 options), and `correctAnswerIndex`
2. **Client display** — The `SkillQuestionCard` renders the question and options. The correct answer is **never** included in client-side data
3. **Server validation** — Answer sent to `/api/raffles/[slug]/check-answer`. Server fetches correct answer via admin Contentful client
4. **Quiz pass** — If correct, a quiz pass is created in Firestore with 15-minute expiry
5. **Checkout gate** — The checkout endpoint requires a valid, unexpired, unused quiz pass

### Security Measures

- `correctAnswerIndex` only accessible via admin/server token
- Quiz passes expire after 15 minutes
- Quiz passes are single-use
- Each quiz pass is tied to a specific raffle slug

---

## 11. Payment & Checkout (Stripe)

### Integration Overview

Coast Competitions uses **Stripe Checkout** (hosted payment page). No card details ever touch Coast Competitions servers.

**Note:** Stripe integration is code-complete but not yet active. The company is awaiting incorporation before setting up a Stripe account with a business bank account. In the meantime, the system can operate in Stripe test mode for demo competitions.

### Checkout Session Configuration

| Parameter | Value |
|-----------|-------|
| Mode | `payment` (one-time) |
| Product name | Raffle title from Contentful |
| Unit amount | `ticketPricePence` from Contentful |
| Currency | GBP |
| Quantity | User's selection (1–100) |
| Success URL | `/raffles/[slug]/success?session_id={CHECKOUT_SESSION_ID}` |
| Cancel URL | `/raffles/[slug]` |
| Metadata | `raffleSlug`, `quizPassId`, `quantity` |

---

## 12. Ticket Allocation System

Tickets are allocated **sequentially** using an atomic Firestore transaction to prevent race conditions and duplicate numbers.

When the Stripe webhook fires:
1. **Read** the raffle document to get `nextTicketNumber` (starts at 1)
2. **Calculate** the range: `start = nextTicketNumber`, `end = nextTicketNumber + quantity - 1`
3. **Update** the raffle: `nextTicketNumber = end + 1`, `ticketsSold += quantity`
4. **Create** order document with `ticketRange: { start, end }`
5. **Mark** quiz pass as used
6. **Create** individual ticket documents in `raffles/{slug}/tickets/` subcollection

Firestore transactions guarantee no duplicate ticket numbers even under concurrent purchases.

---

## 13. Automated Draw System

### Firebase Cloud Function: `scheduledDraw`

**Schedule:** Every 1 minute via Google Cloud Pub/Sub

**Logic:**
1. Query Firestore for raffles where `endAt <= now` AND `drawStatus == "pending"`
2. For each qualifying raffle:
   - **No tickets sold?** → Mark completed with `drawResult: "no_tickets_sold"`
   - **Tickets exist?** → Perform cryptographic draw:
     1. Generate 4 bytes of cryptographically secure randomness (`crypto.randomBytes(4)`)
     2. Calculate winning ticket: `(randomNumber % totalTickets) + 1`
     3. Look up winning ticket in subcollection
     4. Update raffle with winner info and audit trail
     5. Send winner notification email via Postmark

### Audit Trail

Every draw stores: `drawAudit.seed` (hex-encoded random bytes), `drawAudit.totalTickets`, `drawnAt` timestamp, and `winningTicketNumber`.

---

## 14. Email Notifications (Postmark)

### Email Types

#### 1. Purchase Confirmation
- **Trigger:** Stripe webhook after successful payment
- **To:** Buyer's email address
- **Contains:** Raffle title, ticket numbers (range), order ID

#### 2. Winner Notification
- **Trigger:** Scheduled draw Cloud Function
- **To:** Winner's email address
- **Contains:** Congratulations, winning ticket number, next steps

### Configuration

- **From address:** Configurable via `POSTMARK_FROM_EMAIL` (needs updating to Coast Competitions domain)
- **Format:** Both HTML and plain text versions
- **Fallback:** If Postmark not configured, warning logged and system continues

### Missing: Admin Notification

Currently, **admins are NOT notified** when a draw completes or when a winner is selected. This needs to be added — see [Section 23](#23-remaining-build-items--road-to-launch).

---

## 15. Authentication & Security

### Current State

- **Firebase Authentication** is configured (both client and admin SDKs) but **no login/register UI** exists
- `SiteHeader` has a "Login" link pointing to `/login` — this page doesn't exist yet
- Admin dashboard has no authentication gate

### Security Already in Place

| Feature | Implementation |
|---------|---------------|
| Skill question answers | Never sent to client; validated server-side only |
| Quiz passes | 15-minute expiry, single-use, raffle-specific |
| Stripe webhooks | Signature verification with `STRIPE_WEBHOOK_SECRET` |
| Ticket allocation | Atomic Firestore transactions prevent duplicates |
| Firestore rules | Public read only on `raffles`; orders restricted to authenticated owners |
| Firebase Admin SDK | All sensitive writes go through server-side admin SDK |
| Draw integrity | Cryptographically secure random number generation with audit trail |

---

## 16. Styling & Design System

### Brand Identity

**Coast Competitions** uses a clean, modern coastal theme with teal/mint tones that evoke trust and premium quality.

### Theme Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#0E7E8B` | Primary brand teal — buttons, links, accents |
| `brand-secondary` | `#35B1AB` | Secondary teal — hover states, highlights, badges |
| `brand-accent` | `#D6F5E9` | Soft mint — backgrounds, feature cards |
| `brand-midnight` | `#232F3E` | Dark navy — text, footer, headings |
| `brand-coral` | `#FF7F50` | Coral accent — special highlights |
| `surface` | `#F8F9FA` | Light gray surface |
| `surface-mint` | `#F0F8F6` | Mint-tinted surface |
| `text-mid` | `#708090` | Mid-tone body text |

### Gradient

Primary gradient: `linear-gradient(135deg, #0E7E8B 0%, #35B1AB 100%)` — used on buttons, countdown, CTA sections.

### Styled Components (Emotion)

| Component | Description |
|-----------|-------------|
| `BrandButton` | Pill button with variants (`primary`, `secondary`, `outline`) and sizes (`sm`, `md`, `lg`). Gradient primary, hover lift. |
| `BrandLinkButton` | Link-styled version of BrandButton |
| `BrandCard` | Card with teal-tinted border, hover lift and scale |
| `BrandBadge` | Teal badge pill |
| `BrandSectionHeading` | Section heading — bold, uppercase, tracking-tight |
| `GlassCard` | Clean white card with subtle teal shadow |
| `GradientText` | Text with brand teal gradient fill |

### Typography

- **Primary font:** Nunito Sans (Google Fonts) — loaded via `next/font/google`
- **Weights used:** 600 (semibold), 700 (bold), 800 (extrabold), 900 (black)
- **Style:** Heavy uppercase headings, tight tracking, generous weight for impact

### Assets

- `/logo.png` — Coast Competitions logo mark
- `/wavelogo.png` — Wave variant of the logo

---

## 17. SEO & Metadata

### Current Implementation

- **Root layout metadata:**
  - Title: `"Coast Competitions"`
  - Title template: `"%s · Coast Competitions"`
  - Description: `"Skill-based UK competition raffles with transparent draws and fast entry."`

### Not Yet Implemented

- Per-page Open Graph and Twitter Card metadata
- Dynamic metadata for individual raffle pages (title, image, description from Contentful)
- `sitemap.xml` generation
- `robots.txt`
- Structured data (JSON-LD) — especially for products/offers
- Canonical URLs

---

## 18. Admin Dashboard

### Current State: Placeholder

The admin page at `/admin` shows:
- Stats cards (Active Raffles: `--`, Total Revenue: `£0.00`, Pending Draws: `--`)
- Recent Orders table (empty)
- No authentication, no data fetching, no functionality

---

## 19. Firebase Cloud Functions

### `scheduledDraw`

| Property | Value |
|----------|-------|
| Type | Scheduled (Pub/Sub) |
| Schedule | Every 1 minute |
| Runtime | Node.js |
| Dependencies | Firebase Admin SDK, Postmark |

Queries ended raffles, performs cryptographic draw, updates Firestore, sends winner email.

---

## 20. Environment Configuration

### Required Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Site URL (default: `http://localhost:3000`) |
| `STRIPE_SECRET_KEY` | Stripe secret API key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature secret |

### Contentful (CMS)

| Variable | Description |
|----------|-------------|
| `CONTENTFUL_SPACE_ID` | Contentful space identifier |
| `CONTENTFUL_ENVIRONMENT` | Environment (default: `master`) |
| `CONTENTFUL_PUBLIC_TOKEN` | Content Delivery API token (public) |
| `CONTENTFUL_SERVER_TOKEN` | Content Management API token (server-only) |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Management API token (for migrations) |

### Firebase

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Public Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Public project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Postmark (Email)

| Variable | Description |
|----------|-------------|
| `POSTMARK_SERVER_TOKEN` | Postmark API token |
| `POSTMARK_FROM_EMAIL` | Verified sender (needs updating to Coast Competitions domain) |

### Graceful Fallbacks

- **Contentful** not configured → mock raffle data (3 sample raffles)
- **Firebase** not configured → placeholder values
- **Postmark** not configured → warning logged, system continues
- **Stripe** not configured → checkout creation will fail

---

## 21. Business Rules & Compliance

### UK Competition Law Compliance

Coast Competitions operates as a **skill-based competition**, not a lottery or gambling product.

1. **Skill element required** — Every entrant must correctly answer a question before purchasing tickets. Enforced server-side.
2. **Transparent draws** — Cryptographically secure randomness with full audit trail.
3. **Age restriction** — 18+ and BeGambleAware badges displayed in footer.
4. **No extensions** — Draws happen on the stated date regardless of ticket sales.

### Ticket Rules

| Rule | Value |
|------|-------|
| Minimum purchase | 1 ticket |
| Maximum purchase | 100 tickets per transaction |
| Ticket numbering | Sequential, globally unique per raffle |
| Ticket price range | 1p–£10,000 (configurable in Contentful) |

### Quiz Pass Rules

| Rule | Value |
|------|-------|
| Validity period | 15 minutes |
| Usage | Single-use only |
| Scope | Tied to a specific raffle slug |

---

## 22. Feature Status Tracker

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage with dynamic hero carousel | **Complete** | Pulls live raffles from Contentful |
| Homepage raffle grid | **Complete** | Shows up to 4 live raffles from CMS |
| Raffle listing page | **Complete** | Server Component, Contentful data |
| Raffle detail page | **Complete** | Server Component, notFound() handling |
| Skill question validation | **Complete** | Server-side, secure |
| Quiz pass system | **Complete** | 15-min expiry, single-use |
| Stripe Checkout integration | **Code complete** | Awaiting company incorporation for live Stripe |
| Webhook fulfillment | **Complete** | Atomic ticket allocation |
| Sequential ticket numbering | **Complete** | Firestore transactions |
| Purchase confirmation email | **Complete** | Via Postmark |
| Automated draws | **Complete** | Firebase Cloud Function, every minute |
| Winner notification email | **Complete** | Via Postmark |
| Draw audit trail | **Complete** | Crypto seed + total tickets |
| About page | **Complete** | Coast Competitions branding |
| Contact page | **Complete** | Form UI only (no backend submission) |
| FAQs page | **Complete** | Hardcoded accordion |
| Privacy policy | **Complete** | Static content |
| Terms & conditions | **Complete** | Coast Competitions branding |
| Contentful CMS integration | **Complete** | Live data on homepage and raffles pages |
| Contentful migrations | **Complete** | Initial schema defined |
| Firestore security rules | **Complete** | Restrictive access |
| Coast Competitions rebrand | **Mostly complete** | Logo, colors, fonts, all pages updated. Email domains still reference old branding |
| How It Works section | **Complete** | 6-step explainer |
| Winners section (homepage) | **Complete** | Mock data |
| Mobile CTA (raffle detail) | **Complete** | Fixed bottom bar |
| Results page | **Placeholder** | Mock data |
| Winners page | **Placeholder** | Mock data |
| Admin dashboard | **Complete (Demo Mode)** | Functional UI, needs real data integration |
| Homepage countdown timer | **Placeholder** | Shows static values, not connected to real data |
| Ticket sales progress bars | **Placeholder** | Hardcoded at 10%, not connected to Firestore |
| "5 people entered" text | **Placeholder** | Static text on raffle detail |
| User authentication UI | **Complete** | Login/Register with Email/Google |
| Admin notifications (draw complete) | **Complete** | Emails sent via Postmark |
| Dynamic SEO metadata | **Not started** | Only basic root metadata |
| Sitemap generation | **Not started** | — |
| Contact form backend | **Not started** | Form prevents default, no submission |
| Rich text rendering | **Not started** | Raffle descriptions from Contentful not rendered (generic text shown) |
| Gallery images | **Not started** | Contentful field exists but not displayed |
| Per-raffle FAQs | **Not started** | Contentful field exists but not displayed |
| Cash alternative display | **Not started** | Contentful field exists but not shown |
| Free entry route | **Not started** | May be legally required under UK law |
| Cookie consent | **Not started** | Required for GDPR compliance |
| Error/loading states | **Not started** | No error.tsx, loading.tsx, or not-found.tsx pages |

---

## 23. Remaining Build Items — Road to Launch

### Tier 1: CRITICAL — Must Have Before Any Demo Competitions

These items are needed to run even test/demo competitions and receive proper notifications.

#### 1. Admin Notifications
**Status:** Complete. Admins are now notified of new orders and completed draws via email.

#### 2. Email Domain Update
**Status:** Complete. All hardcoded references updated to `coastcompetitions.co.uk`.

#### 3. Connect Homepage Countdown to Real Data
**What:** The `HomeCountdown` component shows hardcoded static values. It needs to show the actual time until the next ending competition.
**How:** Pass the `endAt` of the soonest-ending live raffle (from the Contentful data already fetched on the homepage) into the countdown component and use the existing `Countdown` component logic.

#### 4. Raffle `endAt` Mirroring in Firestore
**What:** The draw Cloud Function queries Firestore for `endAt`, but this field is only set in Contentful. There's currently no mechanism to sync `endAt` from Contentful to Firestore.
**Why:** Without this, the scheduled draw will never find raffles to draw.
**How:** Either (a) set `endAt` on the Firestore raffle document when the first ticket is sold (in the webhook), or (b) create a Contentful webhook that syncs raffle data to Firestore, or (c) have the Cloud Function query Contentful instead of Firestore.

#### 5. Email Templates
**What:** Current emails are bare-bones HTML (`<h1>`, `<p>` tags). They need proper branded templates.
**Why:** First impression for buyers and winners. Needs to look professional and match Coast Competitions branding.
**How:** Create proper HTML email templates with the Coast brand colors, logo, and styling. Consider using Postmark templates.

### Tier 2: HIGH PRIORITY — Needed Before Going Live

#### 6. User Authentication (Login/Register)
**Status:** Complete. Branded Login/Register pages implemented with Email and Google Sign-in.

#### 7. Stripe Account & Live Keys
**What:** Set up Stripe account with the incorporated company's business bank account. Switch from test keys to live keys.
**Why:** Can't accept real payments without it.
**When:** After company incorporation is complete.

#### 8. Real-Time Ticket Count Display
**What:** Raffle cards and detail pages show placeholder ticket counts. Need to read actual `ticketsSold` from Firestore.
**Why:** Social proof — showing real ticket sales encourages purchases and builds urgency.
**How:** Read Firestore raffle doc for `ticketsSold` and display as progress bar. Could use Firestore real-time listeners for live updates.

#### 9. Rich Text Rendering (Contentful)
**What:** Raffle descriptions, prize details, cash alternative copy, and per-raffle T&Cs are stored as Rich Text in Contentful but not rendered on the detail page. Currently shows generic placeholder text.
**Why:** Each competition should have unique, detailed descriptions managed by the team in Contentful.
**How:** Install `@contentful/rich-text-react-renderer` and render the rich text fields in the raffle detail page.

#### 10. Gallery Images
**What:** Contentful has a `galleryImages` field but the raffle detail page only shows the hero image.
**Why:** Multiple images showcase the prize better and increase conversion.
**How:** Fetch gallery images from Contentful and display as a carousel or lightbox gallery on the detail page.

#### 11. Per-Raffle FAQs
**What:** Contentful has `perRaffleFaqs` linking to `faqItem` entries, but these aren't displayed.
**Why:** Answers common questions about specific prizes and reduces support load.
**How:** Fetch linked FAQ items and render as an accordion on the raffle detail page.

#### 12. Contact Form Backend
**What:** The contact form has a frontend but submitting does nothing.
**How:** Create an API route that sends the form data via Postmark to the support email, with a confirmation email back to the sender.

#### 13. Cookie Consent Banner
**What:** GDPR requires explicit consent before setting non-essential cookies.
**Why:** Legal requirement for UK/EU users.
**How:** Add a cookie consent banner component that stores consent in localStorage and conditionally loads analytics/tracking.

#### 14. Error & Loading States
**What:** No `error.tsx`, `loading.tsx`, or `not-found.tsx` pages exist.
**Why:** Users hitting errors or slow loads see blank pages or browser defaults.
**How:** Create branded error boundaries, loading skeletons, and a custom 404 page.

#### 15. Dynamic SEO Metadata
**What:** Individual raffle pages need unique titles, descriptions, and Open Graph images.
**Why:** Critical for social sharing and search engine visibility.
**How:** Use Next.js `generateMetadata()` on the raffle detail page to pull title and image from Contentful.

#### 16. Sitemap & robots.txt
**What:** Auto-generated `sitemap.xml` listing all live raffles, plus a `robots.txt`.
**Why:** Helps search engines discover and index competition pages.
**How:** Use Next.js `sitemap.ts` to dynamically generate from Contentful data.

### Tier 3: IMPORTANT — Needed Soon After Launch

#### 17. Real Winners & Results Data
**What:** Winners and Results pages currently show mock data. Need to pull from Firestore draw results.
**How:** Query Firestore for completed raffles with winners. Display real winner info (anonymized names), prizes, ticket numbers, dates.

#### 18. Admin Dashboard (Functional)
**Status:** Complete (Demo Mode). The dashboard UI is fully built with stats cards, raffle management tables, and order history. It currently uses mock data because of the Firebase Admin SDK Private Key issue.
**Action Needed:** Once the Private Key is fixed, switch from `MOCK_STATS` to the `fetchAdminDashboardData` server action.

#### 19. Free Entry Route
**What:** UK competition law may require a free postal entry route as an alternative to paid entry.
**Why:** Legal compliance — some interpretations of UK law require it.
**How:** Add a free entry mechanism (postal entry form or free entry option) and document it in the T&Cs. Consult a lawyer.

#### 20. Cash Alternative Logic
**What:** Contentful has fields for cash alternative (enabled flag, amount, copy) but the frontend doesn't display or handle this.
**Why:** Winners sometimes prefer cash over the physical prize.
**How:** Display cash alternative option on raffle detail page when enabled. Handle in winner notification.

#### 21. Rate Limiting
**What:** API routes have no rate limiting.
**Why:** Prevents abuse of the answer-checking endpoint (brute-force correct answers) and checkout endpoint.
**How:** Add rate limiting middleware using an in-memory store or Redis.

### Tier 4: NICE TO HAVE — Polish & Growth

#### 22. Analytics & Tracking
Google Analytics, Facebook Pixel, or similar for tracking conversions, traffic sources, and user behavior.

#### 23. Social Media Links
Footer and contact page social links go to `#`. Need real Facebook, Instagram, Twitter/X URLs.

#### 24. Trustpilot Integration
The trust badge is hardcoded. Could integrate with actual Trustpilot API or link to a real Trustpilot profile.

#### 25. Order History / My Tickets
Authenticated users should be able to view their past orders, ticket numbers, and draw results.

#### 26. Push Notifications
Notify users when draws are happening, when they win, or when new competitions launch.

#### 27. Referral System
Refer-a-friend program to drive organic growth.

#### 28. Monitoring & Error Tracking
Sentry or similar for catching and alerting on production errors.

#### 29. Database Backup Strategy
Automated Firestore backups to prevent data loss.

#### 30. Performance Optimization
Lighthouse audit, Core Web Vitals optimization, image optimization review.

---

### Quick Summary: What's Needed for Demo Competitions

To run demo competitions today (with Stripe in test mode):

1. **Fix the Firestore `endAt` sync issue** — draws won't fire without it
2. **Add admin email notifications** — so you know when draws happen
3. **Update email domain references** — change from dragoncompetitions.co.uk
4. **Connect the homepage countdown** — to real raffle end dates
5. **Deploy Cloud Functions** — so the scheduled draw actually runs
6. **Verify Postmark sender domain** — so emails actually deliver
7. **Set up Stripe test mode** — for end-to-end testing

Everything else is either code-complete or can be iterated on after the demo phase.

---

*This reference document covers every feature, integration, data model, user flow, and business rule in the Coast Competitions platform as of 12 February 2026. Use it as the single source of truth for all content creation, tutorials, and SEO work.*
