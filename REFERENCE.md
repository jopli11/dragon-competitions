# Dragon Competitions — Complete Platform Reference

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

---

## 1. Platform Overview

**Dragon Competitions** is a UK-based, skill-based competition and raffle platform. Users browse live competitions, answer a skill-based question to prove eligibility, purchase tickets via Stripe, and are automatically entered into a transparent, cryptographically audited draw when the competition ends.

### What Makes It Different

- **Skill-based entry** — UK law requires a skill element to distinguish competitions from gambling. Every user must correctly answer a question before they can purchase tickets.
- **Transparent draws** — Winners are selected using a cryptographically secure random number generator. The seed and total ticket count are stored as an audit trail.
- **Automated everything** — Draws run automatically via a scheduled Firebase Cloud Function. Confirmation and winner emails are sent instantly via Postmark.
- **CMS-driven** — All competition content (titles, images, questions, pricing, FAQs) is managed in Contentful, so the team can launch and manage competitions without touching code.

### Core Value Proposition

1. Browse competitions with prizes (cars, tech, cash, watches)
2. Answer a simple skill question
3. Buy tickets (from £0.99 upward)
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
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── layout.tsx        # Root layout (header, footer, metadata)
│   │   │   │   ├── globals.css       # Tailwind + theme variables
│   │   │   │   ├── about/            # About page
│   │   │   │   ├── admin/            # Admin dashboard
│   │   │   │   ├── contact/          # Contact form
│   │   │   │   ├── faqs/             # FAQ accordion
│   │   │   │   ├── privacy/          # Privacy policy
│   │   │   │   ├── terms/            # Terms & conditions
│   │   │   │   ├── raffles/          # Raffles listing + detail + success
│   │   │   │   ├── results/          # Draw results
│   │   │   │   ├── winners/          # Winners gallery
│   │   │   │   └── api/              # API routes
│   │   │   │       ├── checkout/create-session/    # Stripe session creation
│   │   │   │       ├── raffles/[slug]/check-answer/ # Skill question validation
│   │   │   │       └── webhooks/stripe/            # Stripe webhook handler
│   │   │   ├── components/           # Reusable React components
│   │   │   │   ├── AnimatedIn.tsx
│   │   │   │   ├── BrandHeroCarousel.tsx
│   │   │   │   ├── Container.tsx
│   │   │   │   ├── Countdown.tsx
│   │   │   │   ├── HowItWorks.tsx
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
│   │   │       ├── styles.ts         # Emotion styled components
│   │   │       ├── env.ts            # Environment variable helpers
│   │   │       └── emotion-registry.tsx # Emotion SSR setup
│   │   ├── contentful/               # CMS migrations & docs
│   │   ├── public/                   # Static assets
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
Tracks raffle state, ticket counters, and draw results.

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
Purchase records.

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

All competition content is managed in Contentful. The team can create, edit, and publish raffles without developer involvement.

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
| `fetchLiveRaffles()` | `RaffleSummary[]` | Public | All raffles with status "live" |
| `fetchRaffleBySlug(slug)` | `RaffleDetail \| null` | Public | Full raffle details (no correct answer) |
| `fetchRaffleCorrectAnswer(slug)` | `number` | Admin only | Correct answer index for validation |

If Contentful is not configured, all functions fall back to **mock data** so development works without external services.

---

## 6. Complete User Journey

### Step-by-Step Flow

#### 1. Landing on the Site
The user arrives at the homepage and sees:
- A hero carousel showcasing featured competitions
- A countdown timer for the next big draw
- A Trustpilot-style trust badge (4.9/5, 1,248 reviews)
- Category filter buttons (Auto Draw, Instant Wins, Car & Bike, Tax Free Cash, Tech & Watch, Ending Soon)
- A grid of competition cards
- A "How It Works" explainer section (6 steps)
- A recent winners gallery

#### 2. Browsing Competitions (`/raffles`)
The raffles listing page fetches all live competitions from Contentful and displays them in a responsive grid. Each card shows:
- Hero image
- Competition title
- Ticket price (formatted from pence, e.g. "£0.99")
- End date
- A progress bar (tickets sold — currently placeholder)
- A link to the detail page

#### 3. Viewing a Competition (`/raffles/[slug]`)
The raffle detail page loads the full competition from Contentful and displays:
- **Hero section** with the main image
- **About section** with the rich text description
- **Competition rules** and terms
- **Skill question card** (sidebar on desktop, inline on mobile)
  - The question text
  - 2–3 answer options as buttons
  - A floating "Answer & Enter" CTA on mobile

#### 4. Answering the Skill Question
When the user selects an answer:
1. The `SkillQuestionCard` component sends a POST request to `/api/raffles/[slug]/check-answer` with the selected `answerIndex`
2. The server fetches the correct answer from Contentful using the **admin client** (so the answer is never exposed to the browser)
3. If **incorrect**: the user sees an error message and can try again
4. If **correct**: the server creates a **quiz pass** in Firestore (valid for 15 minutes) and returns the `quizPassId`
5. The `quizPassId` is stored in the browser's `sessionStorage`
6. The skill question card transitions to show a **ticket quantity selector** (1–100 tickets)

#### 5. Selecting Tickets & Checking Out
1. The user selects how many tickets they want (1–100)
2. Clicking "Buy Tickets" triggers a POST request to `/api/checkout/create-session` with the `slug`, `quantity`, and `quizPassId`
3. The server validates:
   - The quiz pass exists, hasn't been used, hasn't expired, and matches the raffle
   - The raffle is still live in Contentful
   - The quantity is within bounds (1–100)
4. The server creates a **Stripe Checkout Session** with:
   - Product name = raffle title
   - Unit price = `ticketPricePence` from Contentful
   - Quantity = user's selection
   - Metadata: `raffleSlug`, `quizPassId`, `quantity`
   - Success URL: `/raffles/[slug]/success?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `/raffles/[slug]`
5. The user is **redirected to Stripe's hosted checkout page**

#### 6. Payment & Fulfillment
1. The user completes payment on Stripe's checkout page
2. Stripe sends a `checkout.session.completed` webhook to `/api/webhooks/stripe`
3. The webhook handler verifies the Stripe signature, then performs an **atomic Firestore transaction**:
   - Reads the raffle's `nextTicketNumber`
   - Allocates sequential ticket numbers (e.g. tickets 42–46 for a 5-ticket purchase)
   - Increments `nextTicketNumber` and `ticketsSold` on the raffle document
   - Creates an **order** document with email, quantity, amount, ticket range, Stripe payment intent ID
   - Marks the **quiz pass** as used
   - Creates individual **ticket** documents in the raffle's tickets subcollection
4. A **purchase confirmation email** is sent via Postmark with:
   - The raffle title
   - The ticket numbers assigned
   - The order ID

#### 7. Success Page (`/raffles/[slug]/success`)
After payment, Stripe redirects the user to the success page showing:
- A confirmation message ("Entry confirmed!")
- A note that a confirmation email has been sent
- Links to browse more competitions or return home

#### 8. The Automated Draw
When a competition's `endAt` time passes:
1. A Firebase Cloud Function (`scheduledDraw`) runs **every minute** and queries Firestore for raffles where `endAt <= now` and `drawStatus == "pending"`
2. For each ended raffle:
   - If **no tickets were sold**: marks as completed with `drawResult: "no_tickets_sold"`
   - If tickets exist: performs a **cryptographically secure draw**:
     1. Generates a random seed using `crypto.randomBytes(32)`
     2. Calculates the winning ticket: `(randomNumber % totalTickets) + 1`
     3. Looks up the winning ticket in Firestore to get the winner's email and order ID
     4. Updates the raffle document with `drawStatus: "completed"`, `winningTicketNumber`, `winnerEmail`, `winnerOrderId`, `drawnAt`, and `drawAudit`
     5. Sends a **winner notification email** via Postmark

#### 9. Viewing Results
- **Results page** (`/results`): Shows recent draw results with prize images, winner names, dates, and winning ticket numbers
- **Winners page** (`/winners`): A gallery of past winners with verified badges
- *(Both currently use placeholder/mock data)*

---

## 7. Pages & Routes

### Public Pages

| Route | Component Type | Description | Data Source |
|-------|---------------|-------------|-------------|
| `/` | Client | Homepage — hero carousel, countdown, categories, raffle cards, how it works, winners | Hardcoded placeholders |
| `/raffles` | Server | Live competitions listing grid | Contentful (live raffles) |
| `/raffles/[slug]` | Client | Competition detail with skill question and checkout | Contentful (raffle by slug) |
| `/raffles/[slug]/success` | Server | Post-payment confirmation page | None (static) |
| `/about` | Client | Company story, stats, features, CTA | Static content |
| `/contact` | Client | Contact form, email, hours, social links | Static content |
| `/faqs` | Client | Accordion FAQ — 3 categories, 9 questions | Hardcoded FAQs |
| `/results` | Client | Recent draw results gallery | Mock data |
| `/winners` | Client | Winners gallery with verified badges | Mock data |
| `/privacy` | Client | Privacy policy (5 sections) | Static content |
| `/terms` | Client | Terms & conditions (5 sections) | Static content |
| `/admin` | Server | Admin dashboard (placeholder) | None (placeholder) |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/raffles/[slug]/check-answer` | POST | Validates skill question answer, issues quiz pass |
| `/api/checkout/create-session` | POST | Creates Stripe Checkout session |
| `/api/webhooks/stripe` | POST | Handles Stripe payment webhooks |

### Layout Structure

The root layout (`layout.tsx`) wraps all pages with:
- `SiteHeader` — sticky navigation with logo, links, login button, CTA
- `SiteFooter` — links, social icons, age restriction badges (18+, BeGambleAware)
- Emotion CSS registry for server-side style injection
- Geist Sans and Geist Mono fonts
- Global metadata: title template `"%s · Dragon Competitions"`

---

## 8. API Endpoints

### POST `/api/raffles/[slug]/check-answer`

**Purpose:** Validates whether the user's answer to the skill question is correct.

**Request Body:**
```json
{
  "answerIndex": 0
}
```

**Success Response (correct answer):**
```json
{
  "isCorrect": true,
  "quizPassId": "abc123def456"
}
```

**Success Response (wrong answer):**
```json
{
  "isCorrect": false
}
```

**How It Works:**
1. Extracts `slug` from the URL and `answerIndex` from the body
2. Calls `fetchRaffleCorrectAnswer(slug)` using the Contentful **admin client** (which has access to the `correctAnswerIndex` field)
3. Compares the user's answer to the correct answer
4. If correct, creates a quiz pass in Firestore with:
   - `raffleSlug`: the raffle's slug
   - `createdAt`: current timestamp
   - `expiresAt`: 15 minutes from now
   - `used`: false
5. Returns the `quizPassId` to the client

**Security:** The correct answer index is fetched via the admin/server token and **never** sent to the client.

---

### POST `/api/checkout/create-session`

**Purpose:** Creates a Stripe Checkout session so the user can pay for tickets.

**Request Body:**
```json
{
  "slug": "win-a-bmw-m4",
  "quantity": 5,
  "quizPassId": "abc123def456"
}
```

**Success Response:**
```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Validation Steps:**
1. Checks all required fields are present
2. Validates quantity is between 1 and 100
3. Fetches the quiz pass from Firestore and verifies:
   - It exists
   - It hasn't been used (`used === false`)
   - It matches the raffle slug
   - It hasn't expired (< 15 minutes old)
4. Fetches the raffle from Contentful and verifies it's live
5. Creates a Stripe Checkout Session with the raffle's ticket price and the user's quantity
6. Returns the Stripe checkout URL for redirect

---

### POST `/api/webhooks/stripe`

**Purpose:** Handles Stripe webhook events after payment completion.

**Trigger:** Stripe sends this automatically after a successful checkout.

**Handled Event:** `checkout.session.completed`

**Process:**
1. Verifies the webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Extracts metadata: `raffleSlug`, `quizPassId`, `quantity`
3. Runs an **atomic Firestore transaction**:
   - Reads the raffle document to get `nextTicketNumber`
   - Allocates ticket numbers: `start = nextTicketNumber`, `end = nextTicketNumber + quantity - 1`
   - Updates the raffle: `nextTicketNumber += quantity`, `ticketsSold += quantity`
   - Creates an order document in `orders/`
   - Marks the quiz pass as `used: true`
   - Creates individual ticket documents in `raffles/{slug}/tickets/`
4. Sends a purchase confirmation email via Postmark

**Response:**
```json
{
  "received": true
}
```

---

## 9. Components Reference

### `BrandHeroCarousel`
**Purpose:** Auto-advancing hero carousel on the homepage.
- Cycles through 3 slides every 5 seconds
- Each slide has an image, title, subtitle, and CTA link
- Dot navigation at the bottom
- Responsive aspect ratios: 16:9 on mobile, 21:9 on desktop
- Overlay gradient for text readability

### `SiteHeader`
**Purpose:** Sticky site-wide navigation bar.
- Logo linking to homepage
- Navigation links: Current Competitions, Draw Results, About, Winners
- Login button (links to `/login` — not yet implemented)
- "Enter Now" CTA button
- Mobile hamburger menu with full-screen overlay
- Prevents body scroll when mobile menu is open

### `SiteFooter`
**Purpose:** Site-wide footer.
- Dragon Competitions logo and description
- Quick Links: Current Competitions, Draw Results, Winners, About
- Support Links: FAQs, Contact Us, Terms & Conditions, Privacy Policy
- Social media icons: Facebook, Instagram, Twitter
- Age restriction badges: 18+ and BeGambleAware
- Copyright notice

### `SkillQuestionCard`
**Purpose:** The core interactive component — handles the skill question and checkout flow.
- **Props:** `question` (string), `options` (string array), `slug` (string)
- **States:**
  1. **Question mode** — Displays the question with answer buttons
  2. **Loading** — Shows spinner while validating answer
  3. **Wrong answer** — Error message, user can retry
  4. **Correct answer** — Shows ticket quantity selector (1–100) and "Buy Tickets" button
  5. **Checkout loading** — Spinner while creating Stripe session
- **Session persistence:** Stores `quizPassId` in `sessionStorage` so it survives page refreshes (within the 15-minute window)
- **API calls:**
  - `POST /api/raffles/[slug]/check-answer` — on answer submission
  - `POST /api/checkout/create-session` — on "Buy Tickets" click

### `Countdown`
**Purpose:** Live countdown timer to a raffle's end date.
- **Props:** `endAt` (ISO date string)
- Updates every second via `setInterval`
- Displays: days, hours, minutes, seconds
- Shows "Ended" when the countdown reaches zero

### `HowItWorks`
**Purpose:** 6-step explainer section showing how the platform works.
- Steps: Register → Pick a Competition → Answer a Question → Secure Checkout → No Extensions → Watch the Draw
- Dark-themed with gradient backgrounds and step numbers

### `WinnersSection`
**Purpose:** Recent winners showcase on the homepage.
- 4 winner cards with images, prize names, winner names, dates, ticket numbers
- Verified badges
- Hover effects
- Currently uses mock data

### `TrustpilotBadge`
**Purpose:** Trust indicator widget.
- Displays "TrustScore 4.9" with 5 stars and "1,248 reviews"
- Static/hardcoded values

### `Container`
**Purpose:** Responsive max-width wrapper.
- Centered content with horizontal padding
- Used throughout the site for consistent layout

### `AnimatedIn`
**Purpose:** Animation wrapper for scroll-triggered animations.
- Props: `children`, `delay?`, `className?`
- Currently renders children statically (animation logic placeholder)

---

## 10. Skill Question System

The skill question system is the legal backbone of Dragon Competitions. Under UK law, competitions must include a genuine element of skill to differentiate them from gambling.

### How It Works

1. **Question creation** — Each raffle in Contentful has a `skillQuestion`, `answerOptions` (2–3 options), and `correctAnswerIndex` (0, 1, or 2)
2. **Client display** — The `SkillQuestionCard` component renders the question and options. The correct answer index is **never** included in the client-side data
3. **Server validation** — When the user selects an answer, it's sent to `/api/raffles/[slug]/check-answer`. The server fetches the correct answer from Contentful using the admin client and compares
4. **Quiz pass** — If correct, a quiz pass is created in Firestore with a 15-minute expiry. The `quizPassId` is returned to the client and stored in `sessionStorage`
5. **Checkout gate** — The `/api/checkout/create-session` endpoint requires a valid, unexpired, unused quiz pass. Users cannot purchase tickets without first answering correctly

### Security Measures

- The `correctAnswerIndex` field in Contentful is **only accessible via the admin/server token**
- The public Contentful client strips this field from responses
- Quiz passes expire after **15 minutes** to prevent stockpiling
- Quiz passes are **single-use** — marked as `used: true` after checkout
- Each quiz pass is tied to a specific raffle slug

---

## 11. Payment & Checkout (Stripe)

### Integration Overview

Dragon Competitions uses **Stripe Checkout** (hosted payment page) for secure, PCI-compliant payments. No card details ever touch the Dragon Competitions servers.

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

### Payment Flow

```
User answers correctly ──> Gets quizPassId
         │
User selects quantity ──> POST /api/checkout/create-session
         │
Server validates quiz pass ──> Creates Stripe Checkout Session
         │
User redirected to Stripe ──> Completes payment
         │
Stripe fires webhook ──> POST /api/webhooks/stripe
         │
Server fulfills order ──> Allocates tickets, sends email
         │
User redirected to success page
```

### Webhook Security

- Stripe signs every webhook with a secret
- The server verifies the signature using `STRIPE_WEBHOOK_SECRET` before processing
- Only the `checkout.session.completed` event is handled

---

## 12. Ticket Allocation System

### How Tickets Are Numbered

Tickets are allocated **sequentially** using an atomic Firestore transaction to prevent race conditions and duplicate numbers.

### The Atomic Transaction

When the Stripe webhook fires:

1. **Read** the raffle document to get `nextTicketNumber` (starts at 1)
2. **Calculate** the ticket range:
   - `startTicket = nextTicketNumber`
   - `endTicket = nextTicketNumber + quantity - 1`
3. **Update** the raffle document:
   - `nextTicketNumber = endTicket + 1`
   - `ticketsSold += quantity`
4. **Create** the order document with `ticketRange: { start, end }`
5. **Mark** the quiz pass as used
6. **Create** individual ticket documents (one per ticket) in the `raffles/{slug}/tickets/` subcollection

### Why Atomic Transactions Matter

- Firestore transactions ensure that if two payments complete at the same instant, they will **never** receive the same ticket numbers
- If any step fails, the entire transaction rolls back
- This guarantees every ticket number is unique and sequential

---

## 13. Automated Draw System

### Firebase Cloud Function: `scheduledDraw`

The draw runs automatically — no human intervention needed.

**Schedule:** Every 1 minute via Google Cloud Pub/Sub

**Logic:**
1. Query Firestore for raffles where `endAt <= now` AND `drawStatus == "pending"`
2. For each qualifying raffle:
   - **No tickets sold?** → Mark as completed with `drawResult: "no_tickets_sold"`
   - **Tickets exist?** → Perform the draw:
     1. Generate 32 bytes of cryptographically secure randomness (`crypto.randomBytes`)
     2. Convert to a number and calculate: `winningTicket = (randomNumber % totalTickets) + 1`
     3. Look up the winning ticket in the `tickets` subcollection
     4. Update the raffle document with winner information
     5. Send winner notification email

### Audit Trail

Every draw stores:
- `drawAudit.seed` — The hex-encoded random seed used
- `drawAudit.totalTickets` — The total number of tickets in the pool
- `drawnAt` — Exact timestamp of the draw
- `winningTicketNumber` — The selected ticket

This allows any draw to be independently verified.

---

## 14. Email Notifications (Postmark)

### Email Types

#### 1. Purchase Confirmation
**Triggered by:** Stripe webhook after successful payment
**Sent to:** The buyer's email address
**Contains:**
- Raffle title
- Ticket numbers (range, e.g. "42–46")
- Order ID
- Thank you message

#### 2. Winner Notification
**Triggered by:** Scheduled draw Cloud Function
**Sent to:** The winner's email address
**Contains:**
- Congratulations message
- Winning ticket number
- Prize details
- Next steps

### Configuration

- **From address:** `noreply@dragoncompetitions.co.uk` (configurable via `POSTMARK_FROM_EMAIL`)
- **Format:** Both HTML and plain text versions
- **Fallback:** If Postmark is not configured, a warning is logged but the system continues

---

## 15. Authentication & Security

### Current State

- **Firebase Authentication** is configured (both client and admin SDKs) but **no login UI** is implemented yet
- The `SiteHeader` has a "Login" link pointing to `/login`, but this page doesn't exist
- The admin dashboard has no authentication gate

### Security Measures Already in Place

| Feature | Implementation |
|---------|---------------|
| Skill question answers | Never sent to client; validated server-side only |
| Quiz passes | 15-minute expiry, single-use, raffle-specific |
| Stripe webhooks | Signature verification with `STRIPE_WEBHOOK_SECRET` |
| Ticket allocation | Atomic Firestore transactions prevent duplicates |
| Firestore rules | Public read only on `raffles`; orders restricted to authenticated owners |
| Firebase Admin SDK | All sensitive writes go through server-side admin SDK |
| Draw integrity | Cryptographically secure random number generation with audit trail |

### Firestore Security Rules Summary

```
raffles/{raffleId}          → Allow read (public), deny write (admin SDK only)
raffles/{id}/entries/{eid}  → Deny all (private)
orders/{orderId}            → Allow read if auth.uid == data.userId
quizPasses/{passId}         → Deny all (internal only)
```

---

## 16. Styling & Design System

### Theme Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `dragon-orange` | `#e5531a` | Primary brand color, CTAs, accents |
| `charcoal-navy` | `#1f2a33` | Dark backgrounds, text |
| `warm-off-white` | `#f6f2ed` | Light backgrounds |
| `dragon-red` | `#c43a12` | Secondary accent, errors |

### Styled Components (Emotion)

| Component | Description |
|-----------|-------------|
| `BrandButton` | Primary button with variants (`primary`, `secondary`, `outline`) and sizes (`sm`, `md`, `lg`) |
| `BrandLinkButton` | Link-styled version of `BrandButton` |
| `BrandCard` | Card with hover effects and shadows |
| `BrandBadge` | Orange badge pill |
| `BrandSectionHeading` | Section heading with consistent typography |
| `GlassCard` | Glassmorphism-style card with backdrop blur |
| `GradientText` | Text with gradient color effect |

### Fonts

- **Geist Sans** — Primary font for all body and heading text
- **Geist Mono** — Monospace font for code or technical content

### CSS Approach

- **Tailwind CSS 4** for utility classes
- **Emotion CSS-in-JS** for styled components and dynamic styles
- Custom CSS variables in `globals.css` for theme tokens

---

## 17. SEO & Metadata

### Current Implementation

- **Root layout metadata:**
  - Title: `"Dragon Competitions"`
  - Title template: `"%s · Dragon Competitions"` (pages can override the `%s` portion)
  - Description: `"Skill-based UK competition raffles with transparent draws and fast entry."`

### Not Yet Implemented

- Per-page Open Graph and Twitter Card metadata
- Dynamic metadata for individual raffle pages
- `sitemap.xml` generation
- `robots.txt`
- Structured data (JSON-LD)
- Canonical URLs

---

## 18. Admin Dashboard

### Current State: Placeholder

The admin page at `/admin` currently shows:
- **Stats cards** (all showing placeholder values):
  - Active Raffles: `--`
  - Total Revenue: `£0.00`
  - Pending Draws: `--`
- **Recent Orders table** (empty state)

### Not Yet Implemented

- Authentication/authorization gate
- Real data fetching from Firestore
- Raffle management (create, edit, end)
- Order management
- Draw management
- User management
- Revenue analytics

---

## 19. Firebase Cloud Functions

### `apps/functions/src/index.ts`

#### `scheduledDraw`

| Property | Value |
|----------|-------|
| Type | Scheduled (Pub/Sub) |
| Schedule | Every 1 minute |
| Runtime | Node.js |
| Dependencies | Firebase Admin SDK, Postmark |

**What it does:**
1. Queries `raffles` collection for documents where `endAt <= now` and `drawStatus == "pending"`
2. Performs a provably fair draw for each qualifying raffle
3. Updates Firestore with winner information and audit trail
4. Sends winner notification email

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
| `CONTENTFUL_SERVER_TOKEN` | Content Management API token (server-only, for protected fields) |
| `CONTENTFUL_MANAGEMENT_TOKEN` | Management API token (for running migrations) |

### Firebase

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key (with `\n` for newlines) |
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
| `POSTMARK_FROM_EMAIL` | Verified sender (default: `noreply@dragoncompetitions.co.uk`) |

### Graceful Fallbacks

- If **Contentful** isn't configured → mock raffle data is used
- If **Firebase** isn't configured → placeholder values
- If **Postmark** isn't configured → warning logged, system continues
- If **Stripe** isn't configured → checkout creation will fail

---

## 21. Business Rules & Compliance

### UK Competition Law Compliance

Dragon Competitions operates as a **skill-based competition**, not a lottery or gambling product. This distinction is legally critical:

1. **Skill element required** — Every entrant must correctly answer a question before purchasing tickets. This is enforced server-side and cannot be bypassed.
2. **No free entry** — The platform currently requires payment. *(Note: UK law may require a free entry route — this is not yet implemented.)*
3. **Transparent draws** — Winner selection uses cryptographically secure randomness with a full audit trail.
4. **Age restriction** — The site displays 18+ and BeGambleAware badges in the footer.

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
| Storage | Firestore (server-managed) |

### Draw Rules

| Rule | Value |
|------|-------|
| Trigger | Automatic when `endAt` passes |
| Frequency check | Every 1 minute |
| Randomness | `crypto.randomBytes(32)` — cryptographically secure |
| Audit | Seed + total tickets stored for verification |
| No tickets | Raffle marked completed with `"no_tickets_sold"` |

---

## 22. Feature Status Tracker

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage with hero carousel | Complete | Uses mock data for raffle cards |
| Raffle listing (from CMS) | Complete | Fetches live raffles from Contentful |
| Raffle detail page | Complete | Full detail with skill question |
| Skill question validation | Complete | Server-side, secure |
| Quiz pass system | Complete | 15-min expiry, single-use |
| Stripe Checkout integration | Complete | Hosted checkout page |
| Webhook fulfillment | Complete | Atomic ticket allocation |
| Sequential ticket numbering | Complete | Firestore transactions |
| Purchase confirmation email | Complete | Via Postmark |
| Automated draws | Complete | Firebase Cloud Function, every minute |
| Winner notification email | Complete | Via Postmark |
| Draw audit trail | Complete | Crypto seed + total tickets |
| About page | Complete | Static content |
| Contact page | Complete | Form UI only (no backend) |
| FAQs page | Complete | Hardcoded accordion |
| Privacy policy | Complete | Static content |
| Terms & conditions | Complete | Static content |
| Results page | Complete | Mock data |
| Winners page | Complete | Mock data |
| Contentful migrations | Complete | Initial schema defined |
| Firestore security rules | Complete | Restrictive access |
| Admin dashboard | Placeholder | No real data or auth |
| User authentication UI | Not started | Firebase Auth configured but no login page |
| Real-time ticket counts | Not started | Placeholder "coming soon" |
| Dynamic SEO metadata | Not started | Only basic root metadata |
| Sitemap generation | Not started | — |
| Contact form backend | Not started | Form prevents default, no submission |
| Category filtering | Not started | Buttons render but don't filter |
| Cash alternative display | Not started | Contentful fields exist |
| Gallery images | Not started | Contentful field exists |
| Per-raffle FAQs | Not started | Contentful field exists |
| Free entry route | Not started | May be legally required |
| Analytics/tracking | Not started | — |

---

*This reference document covers every feature, integration, data model, user flow, and business rule in the Dragon Competitions platform as of 12 February 2026. Use it as the single source of truth for all content creation, tutorials, and SEO work.*
