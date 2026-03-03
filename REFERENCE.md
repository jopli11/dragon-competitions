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
| Contact Form Backend | **Complete** | Integrated with Postmark & Server Actions |
| Live vs Auto Draw Flag | **Complete** | Contentful model update & Function logic |
| Branded Email Templates | **Not started** | Basic HTML currently used |
| Sitemap & robots.txt | **Not started** | — |
| Provably Fair Verification Page | **Pending** | Needs to expose Seed/Logic to users |
| Reoccurring Raffle Logic | **Pending** | Auto-relisting functionality |
| Postmark Configuration | **Pending** | Domain verification & API keys needed |
| Stripe Production Setup | **Pending** | Blocked by Business Bank Account |

---

## 24. Remaining Build Items — Road to Launch

### Tier 1: CRITICAL — Must Have Before Launch

#### 1. Branded Email Templates
**What:** Create professional HTML templates with Coast branding in Postmark.

#### 2. Sitemap & robots.txt
**What:** Auto-generated SEO files for search engine indexing.

#### 3. Provably Fair Page (Draw Results)
**What:** A page explaining the CSPRNG model and allowing users to verify past draws using the stored Seed and Ticket Count.

#### 4. Logo Refresh
**What:** Update the site logo to the final version approved by stakeholders.

#### 5. Postmark Configuration & Domain Verification
**What:** Input the production Postmark API key and verify the `coastcompetitions.co.uk` sender domain via DNS.
**Why:** Critical for email deliverability.

#### 6. Stripe Production Setup
**What:** Switch from test mode to live production keys and connect a verified business bank account.
**Why:** Blocked until company incorporation is finalized.

### Tier 2: HIGH PRIORITY — Post-Launch Polish

#### 7. Reoccurring Raffle Logic
**What:** Implement the automated re-listing of raffles when they end or fill up.

#### 8. Real Winners & Results Data
**What:** Connect the Results and Winners pages to actual Firestore draw data.
**How:** Query the `raffles` collection for `drawStatus == "completed"`.

---

*This reference document covers every feature, integration, data model, user flow, and business rule in the Coast Competitions platform as of 12 February 2026.*
