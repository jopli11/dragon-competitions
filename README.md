# Dragon Competitions

A high-performance, skill-based raffle platform built with Next.js, Firebase, and Contentful.

## 🚀 Project Overview

Dragon Competitions is a UK-based competition website where users win prizes by answering skill-based questions. The platform features CMS-driven raffle management, secure DNA Payments checkout (card, Apple Pay, Google Pay), and automated winner selection via Firebase Cloud Functions.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Emotion CSS, Tailwind CSS 4
- **CMS**: Contentful (Raffle details, FAQs, Legal text)
- **Backend**: Firebase (Firestore, Cloud Functions 2, Authentication)
- **Payments**: DNA Payments (Checkout Lightbox, Webhooks — Card, Apple Pay, Google Pay)
- **Email**: Postmark (Transactional emails)
- **Monorepo**: npm Workspaces (`apps/web`, `apps/functions`)

## 📋 Current Status & Roadmap

### ✅ Completed
- [x] **Monorepo Scaffold**: Root-level development scripts and workspace linking.
- [x] **CMS Integration**: Contentful schema defined and fetching logic implemented.
- [x] **Skill Gate**: Server-side verification of answers before allowing entry.
- [x] **Payment Flow**: DNA Payments Checkout (Lightbox) integration with webhook fulfillment.
- [x] **Automation**: Scheduled Cloud Function for automated, auditable winner draws.
- [x] **Email System**: Postmark client for purchase and winner notifications.
- [x] **Best Practices**: Integrated Vercel React Best Practices for performance.

### ⏳ Remaining Tasks
- [ ] **Configuration**: Set up third-party API keys (see Environment Variables).
- [ ] **Admin Dashboard**: Build out the internal UI for monitoring orders and raffles.
- [ ] **UI Polish**: Finalize design based on reference images and accessibility standards.
- [ ] **Deployment**: Configure CI/CD and deploy to production.

## 🔑 Environment Variables

To run this project, you will need to collect the following variables from your third-party accounts. Create an `.env.local` file in `apps/web/`.

### Contentful (CMS)
- `CONTENTFUL_SPACE_ID`: Your Space ID.
- `CONTENTFUL_PUBLIC_TOKEN`: Content Delivery API (CDA) token.
- `CONTENTFUL_ADMIN_TOKEN`: Content Management API (CMA) token (for migrations).
- `CONTENTFUL_ENVIRONMENT`: (Optional) Defaults to `master`.

### DNA Payments
- `DNA_CLIENT_ID`: Client ID provided by DNA Payments.
- `DNA_CLIENT_SECRET`: Client Secret provided by DNA Payments.
- `DNA_TERMINAL_ID`: Terminal ID provided by DNA Payments.
- `DNA_ENV`: `test` or `live` (selects OAuth, API, and widget script URLs).
- `NEXT_PUBLIC_DNA_ENV`: `test` or `live` (client-side — loads the correct DNA widget script).

### Firebase (Database & Auth)
- `FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `FIREBASE_CLIENT_EMAIL`: Service account email.
- `FIREBASE_PRIVATE_KEY`: Service account private key.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Public API key for client-side SDK.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your project's auth domain.

### Postmark (Email)
- `POSTMARK_SERVER_TOKEN`: Your Postmark server API token.
- `POSTMARK_FROM_EMAIL`: The verified sender email address.

## 🛠 Development

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
1. Clone the repo.
2. Run `npm install` in the root.
3. Configure your `.env.local` based on `.env.example`.

### Commands
- `npm run dev`: Start the development server from the root.
- `npm run build`: Build the entire project.
- `npm run lint`: Run linting across all workspaces.
- `npm run contentful:migrate`: Run CMS schema migrations.

## 🛡 Security & Best Practices
- **Skill-Based Entry**: All entries are gated by a server-side check to comply with UK law.
- **Atomic Transactions**: Firestore transactions ensure ticket numbers are never duplicated.
- **Performance**: Follows Vercel's React Best Practices (see `AGENTS.md`).
