import Link from "next/link";
import { Container } from "@/components/Container";

export default function Home() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(1000px_500px_at_50%_0%,color-mix(in_oklab,var(--foreground)_10%,transparent),transparent)]" />

      <Container className="relative py-16 sm:py-20">
        <div>
          <p className="text-sm font-medium text-foreground/70">
            UK skill-based competitions
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Win epic prizes with a simple skill question.
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-foreground/75 sm:text-lg">
            Choose a raffle, answer the question correctly, and buy as many
            tickets as you like. Transparent draws, clear rules, and optional
            cash alternatives where available.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/raffles"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Browse raffles
            </Link>
            <Link
              href="/faqs"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium text-foreground transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-background/60 p-6 shadow-sm dark:border-white/10">
            <p className="text-sm font-semibold">1) Pick a raffle</p>
            <p className="mt-2 text-sm text-foreground/70">
              Each competition has its own ticket price, prize details, and
              countdown.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-background/60 p-6 shadow-sm dark:border-white/10">
            <p className="text-sm font-semibold">2) Answer correctly</p>
            <p className="mt-2 text-sm text-foreground/70">
              UK skill question gate with up to three possible answers.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-background/60 p-6 shadow-sm dark:border-white/10">
            <p className="text-sm font-semibold">3) Buy tickets</p>
            <p className="mt-2 text-sm text-foreground/70">
              Pay securely, get a confirmation email, and keep an eye on tickets
              sold.
            </p>
          </div>
        </div>

        <div className="mt-14 rounded-3xl border border-black/5 bg-foreground/3 p-8 dark:border-white/10 dark:bg-white/6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Raffles are coming next
              </h2>
              <p className="mt-1 text-sm text-foreground/70">
                Next up: CMS-driven raffles, live ticket counts, and checkout.
              </p>
            </div>
            <Link
              href="/raffles"
              className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Go to raffles
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
