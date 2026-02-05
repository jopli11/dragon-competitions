import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { SkillQuestionCard } from "@/components/SkillQuestionCard";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { isContentfulConfigured } from "@/lib/contentful/publicClient";
import { BrandBadge, GlassCard, GradientText } from "@/lib/styles";

function formatGBPFromPence(pence: number) {
  if (pence < 100) return `${pence}p`;
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
    <div className="min-h-screen bg-[#f6f2ed] pb-20">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[400px] w-full overflow-hidden bg-charcoal-navy">
        {raffle.heroImageUrl && (
          <Image
            src={raffle.heroImageUrl}
            alt={raffle.title}
            fill
            priority
            className="object-cover opacity-60 blur-[2px] scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f2ed] via-charcoal-navy/40 to-transparent" />
        
        <Container className="relative h-full flex flex-col justify-end pb-12">
          <BrandBadge className="mb-4">Entries Open</BrandBadge>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-charcoal-navy sm:text-5xl md:text-6xl">
            {raffle.title}
          </h1>
          <div className="mt-4 flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-charcoal-navy/60">
            <div className="flex items-center gap-2">
              <span className="text-dragon-orange">Just</span>
              <span className="text-xl text-charcoal-navy">{formatGBPFromPence(raffle.ticketPricePence)}</span>
              <span>per entry</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-8">
            {/* Main Image Card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-[#161616]">
              <div className="relative aspect-[16/10]">
                {raffle.heroImageUrl ? (
                  <Image
                    src={raffle.heroImageUrl}
                    alt={raffle.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                )}
              </div>
            </div>

            {/* About Section */}
            <GlassCard>
              <h2 className="text-2xl font-black uppercase tracking-tight text-charcoal-navy dark:text-white">
                About this <GradientText>Raffle</GradientText>
              </h2>
              <div className="mt-6 prose prose-sm max-w-none text-charcoal-navy/70 dark:text-white/70">
                <p className="text-lg leading-relaxed">
                  Get ready for your chance to win this incredible {raffle.title}. 
                  This competition is skill-based, meaning you'll need to answer 
                  the question correctly to be entered into the draw.
                </p>
                
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-charcoal-navy/5 p-6 dark:bg-white/5">
                    <h4 className="font-bold uppercase tracking-wider text-dragon-orange text-xs mb-2">Guaranteed Draw</h4>
                    <p className="text-sm font-medium">This draw will take place regardless of ticket sales. No extensions, ever.</p>
                  </div>
                  <div className="rounded-2xl bg-charcoal-navy/5 p-6 dark:bg-white/5">
                    <h4 className="font-bold uppercase tracking-wider text-dragon-orange text-xs mb-2">Instant Confirmation</h4>
                    <p className="text-sm font-medium">Receive your ticket numbers via email immediately after a successful entry.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* FAQ / Rules Placeholder */}
            <GlassCard>
              <h2 className="text-xl font-black uppercase tracking-tight text-charcoal-navy dark:text-white">
                Competition <GradientText>Rules</GradientText>
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Entrants must be 18 years or older.",
                  "Open to residents of the United Kingdom only.",
                  "Correct answer to the skill question is required for entry.",
                  "Draw will be conducted live on our social media channels.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-charcoal-navy/60 dark:text-white/60">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-dragon-orange/10 flex items-center justify-center text-dragon-orange text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <SkillQuestionCard
              slug={raffle.slug}
              question={raffle.skillQuestion}
              options={raffle.answerOptions}
            />
            
            <GlassCard className="text-center py-8">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal-navy/40 dark:text-white/40 mb-2">
                Tickets Sold
              </div>
              <div className="text-3xl font-black text-charcoal-navy dark:text-white">
                -- <span className="text-lg text-charcoal-navy/20">/ --</span>
              </div>
              <div className="mt-4 h-2 w-full bg-charcoal-navy/5 rounded-full overflow-hidden dark:bg-white/5">
                <div className="h-full bg-dragon-orange w-[15%] rounded-full shadow-[0_0_10px_rgba(229,83,26,0.5)]" />
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-dragon-orange">
                Drawing in: 2 days, 14 hours
              </p>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
}
