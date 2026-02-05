import Image from "next/image";
import Link from "next/link";
import { AnimatedIn } from "@/components/AnimatedIn";
import { Container } from "@/components/Container";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { isContentfulConfigured } from "@/lib/contentful/publicClient";

function formatGBPFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export default async function RafflesPage() {
  if (!isContentfulConfigured()) {
    return (
      <Container className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Raffles</h1>
        <p className="mt-3 max-w-2xl text-sm text-foreground/70">
          Contentful isn’t configured yet. Add `CONTENTFUL_SPACE_ID`,
          `CONTENTFUL_PUBLIC_TOKEN` (and optionally `CONTENTFUL_ENVIRONMENT`) in{" "}
          <code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.85em] dark:bg-white/10">
            .env.local
          </code>{" "}
          then restart the dev server.
        </p>
      </Container>
    );
  }

  const raffles = await fetchLiveRaffles();

  return (
    <Container className="py-16">
      <AnimatedIn>
        <h1 className="text-3xl font-semibold tracking-tight">Raffles</h1>
        <p className="mt-2 text-sm text-foreground/70">
          Answer correctly, pick your ticket quantity, and enter securely.
        </p>
      </AnimatedIn>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {raffles.map((r, idx) => (
          <AnimatedIn
            key={r.id}
            delay={0.04 * idx}
            className="group overflow-hidden rounded-2xl border border-black/5 bg-background shadow-sm transition-shadow hover:shadow-md dark:border-white/10"
          >
            <Link href={`/raffles/${r.slug}`} className="block">
              <div className="relative aspect-[16/10] bg-black/5 dark:bg-white/10">
                {r.heroImageUrl ? (
                  <Image
                    src={r.heroImageUrl}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-foreground/60">
                  Tickets from {formatGBPFromPence(r.ticketPricePence)}
                </p>
                <h2 className="mt-2 text-base font-semibold tracking-tight">
                  {r.title}
                </h2>
                <p className="mt-2 text-sm text-foreground/70">
                  Ends{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(r.endAt))}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                  View details
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </AnimatedIn>
        ))}
      </div>

      {raffles.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/70">
          No live raffles yet. Publish a `raffle` entry in Contentful with
          `status = live`.
        </p>
      ) : null}
    </Container>
  );
}

