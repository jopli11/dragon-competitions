# Contentful setup

This folder contains Contentful migrations for the Dragon Competitions content model.

## 1) Create a Contentful space + environment
- Create a Space in Contentful.
- Use the default environment (`master`) or create your own.

## 2) Create tokens
- **Delivery API token** (public): used to fetch public raffle content.
- **Server-only token**: used for server-side reads of protected fields (e.g. `correctAnswerIndex`).
- **Management token**: used only to run migrations (schema changes).

Put them in `.env.local` (use `.env.example` as a template).

## 3) Run the migration
From `apps/web`:

```bash
npm run contentful:migrate
```

### Notes
- The migration creates content types: `raffle`, `faqItem`, `globalSettings`.
- `correctAnswerIndex` must never be returned to the browser. We’ll only read it from server-side code.

