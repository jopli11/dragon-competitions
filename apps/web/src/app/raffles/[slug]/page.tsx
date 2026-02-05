import Image from "next/image";
import { notFound } from "next/navigation";
import { AnimatedIn } from "@/components/AnimatedIn";
import { Container } from "@/components/Container";
import { Countdown } from "@/components/Countdown";
import { SkillQuestionCard } from "@/components/SkillQuestionCard";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { isContentfulConfigured } from "@/lib/contentful/publicClient";

function formatGBPFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(pence / 100);
}

export default async function RaffleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isContentfulConfigured()) {
    return (
      <Container className="py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Raffle</h1>
        <p className="mt-3 max-w-2xl text-sm text-foreground/70">
          Contentful isn’t configured yet. Add `CONTENTFUL_SPACE_ID` and
          `CONTENTFUL_PUBLIC_TOKEN` in <code className="rounded bg-black/5 px-1.5 py-0.5 text-[0.85em] dark:bg-white/10">.env.local</code>.
        </p>
      </Container>
    );
  }

  const { slug } = params;
  const raffle = await fetchRaffleBySlug(slug);
  if (!raffle) notFound();

  return (
    <div className="py-10">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <AnimatedIn>
              <p className="text-xs font-medium text-foreground/60">
                Tickets from {formatGBPFromPence(raffle.ticketPricePence)}
              </p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                {raffle.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/70">
                <div>
                  Ends in <Countdown endAt={raffle.endAt} />
                </div>
                <div className="h-1 w-1 rounded-full bg-foreground/30" />
                <div>Tickets sold: coming soon</div>
              </div>
            </AnimatedIn>

            <AnimatedIn delay={0.08} className="mt-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/10">
                {raffle.heroImageUrl ? (
                  <Image
                    src={raffle.heroImageUrl}
                    alt={raffle.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : null}
              </div>
            </AnimatedIn>

            <AnimatedIn delay={0.12} className="mt-8">
              <section className="rounded-3xl border border-black/5 bg-background p-6 shadow-sm dark:border-white/10">
                <h2 className="text-base font-semibold tracking-tight">
                  About this raffle
                </h2>
                <p className="mt-2 text-sm text-foreground/70">
                  CMS-driven prize details, FAQs, cash alternative copy, and
                  rules will render here next.
                </p>
              </section>
            </AnimatedIn>
          </div>

          <AnimatedIn delay={0.1} className="lg:sticky lg:top-24">
            <SkillQuestionCard
              question={raffle.skillQuestion}
              options={raffle.answerOptions}
            />
          </AnimatedIn>
        </div>
      </Container>
    </div>
  );
}

