import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";
import { isContentfulConfigured } from "@/lib/contentful/publicClient";
import { BrandButton, BrandSectionHeading } from "@/lib/styles";

function formatGBPFromPence(pence: number) {
  if (pence < 100) return `${pence}p`;
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
      <div className="text-center">
        <BrandSectionHeading>Current Competitions</BrandSectionHeading>
        <p className="mt-3 text-sm font-medium text-foreground/50 uppercase tracking-widest">
          Answer correctly, pick your quantity, and win big.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {raffles.map((r) => (
          <div
            key={r.id}
            className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#161616]"
          >
            <Link href={`/raffles/${r.slug}`} className="block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute top-3 left-3 z-10 rounded-lg bg-dragon-orange/90 px-2 py-1 text-[10px] font-bold text-white uppercase">
                  Entries Open
                </div>
                {r.heroImageUrl ? (
                  <Image
                    src={r.heroImageUrl}
                    alt={r.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold tracking-tight text-charcoal-navy dark:text-white">
                  {r.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-charcoal-navy/40 uppercase dark:text-white/40">
                  <span>Tickets sold: coming soon</span>
                  <span>Ends: {new Date(r.endAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <div
                    className="h-full bg-dragon-orange"
                    style={{ width: "10%" }}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs font-bold text-charcoal-navy/60 uppercase tracking-widest dark:text-white/60">
                    Just <span className="text-dragon-orange">{formatGBPFromPence(r.ticketPricePence)}</span> per entry
                  </p>
                  <BrandButton fullWidth className="mt-4">
                    Enter Now
                  </BrandButton>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {raffles.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
            No live raffles yet.
          </p>
          <p className="mt-2 text-xs text-foreground/30">
            Check back soon for epic prizes!
          </p>
        </div>
      ) : null}
    </Container>
  );
}

