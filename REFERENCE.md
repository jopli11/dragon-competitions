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
11. [Payment & Checkout (Stripe)](#11-payment--checkout-stripe)
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

---

## 1. Platform Overview

**Coast Competitions** is a UK-based, skill-based competition and raffle platform. Users browse live competitions, answer a skill-based question to prove eligibility, purchase tickets via Stripe, and are automatically entered into a transparent, cryptographically audited draw when the competition ends.

### What Makes It Different

- **Skill-based entry** — UK law requires a skill element to distinguish competitions from gambling. Every user must correctly answer a question before they can purchase tickets.
- **Transparent draws** — Winners are selected using a cryptographically secure random number generator. The seed and total ticket count are stored as an audit trail.
- **Automated everything** — Draws run automatically via a scheduled Firebase Cloud Function. Confirmation and winner emails are sent instantly via Postmark.
- **CMS-driven** — All competition content (titles, images, questions, pricing, FAQs) is managed in Contentful, so the team can launch and manage competitions without touching code.
- **No extensions, ever** — Every draw happens on the stated date regardless of ticket sales. This builds trust and gives entrants better odds.

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
| Stripe Production Hardening | **Complete** | Idempotency, atomic cap, auto-refunds |
| Branded Email Templates | **Not started** | Basic HTML currently used |
| Stripe Production Setup | **Pending** | Needs account creation & bank connection |

---

## 24. Remaining Build Items — Road to Launch

### CRITICAL: Firebase Functions Configuration
The following environment variables **MUST** be set in the Firebase Functions config (`firebase functions:config:set`) before the system can process draws or re-list raffles:
- `CONTENTFUL_MANAGEMENT_TOKEN`: Personal Access Token for the Contentful Management API (Required for **Reoccurring Raffles**).
- `CONTENTFUL_SPACE_ID`: Your Contentful Space ID.
- `CONTENTFUL_ENVIRONMENT`: (Optional) Defaults to `master`.
- `POSTMARK_SERVER_TOKEN`: API key for transactional emails.
- `POSTMARK_FROM_EMAIL`: The verified sender email (e.g., `noreply@coastcompetitions.co.uk`).
- `ADMIN_NOTIFICATION_EMAIL`: Where admin draw alerts are sent.

### Tier 1: CRITICAL — Must Have Before Launch

#### 1. Branded Email Templates
**What:** Create professional HTML templates with Coast branding in Postmark.

#### 2. Logo Refresh
**What:** Update the site logo to the final version approved by stakeholders.

#### 3. Stripe Production Setup
**What:** Create the production Stripe account, complete KYC, and connect the new business bank account.
**Status:** Bank account is ready, account setup pending.

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

*This reference document covers every feature, integration, data model, user flow, and business rule in the Coast Competitions platform as of 3 March 2026.*
