import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { SkillQuestionCard } from "@/components/SkillQuestionCard";
import { RaffleMobileCTA } from "@/components/RaffleMobileCTA";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { BrandBadge, GlassCard, GradientText } from "@/lib/styles";

export default async function RaffleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raffle = await fetchRaffleBySlug(slug);

  if (!raffle) notFound();

  function formatGBPFromPence(pence: number) {
    if (pence < 100) return `${pence}p`;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(pence / 100);
  }

  const ticketPriceFormatted = formatGBPFromPence(raffle.ticketPricePence);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[20vh] min-h-[240px] w-full overflow-hidden bg-brand-midnight">
        {raffle.heroImageUrl && (
          <Image
            src={raffle.heroImageUrl}
            alt={raffle.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60 blur-[2px] scale-110"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-white via-brand-midnight/40 to-transparent" />
        
        <Container className="relative h-full flex flex-col justify-end pb-6">
          <BrandBadge className="mb-3 self-start">Entries Open</BrandBadge>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-brand-midnight sm:text-4xl md:text-5xl lg:text-6xl wrap-break-word">
            {raffle.title}
          </h1>
          <div className="mt-3 flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-brand-midnight/60">
            <div className="flex items-center gap-2">
              <span className="text-brand-secondary">Just</span>
              <span className="text-lg text-brand-midnight">{ticketPriceFormatted}</span>
              <span>per entry</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-4 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-8">
            {/* Main Image Card */}
            <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-xl">
              <div className="relative aspect-16/10">
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
                  <div className="h-full w-full bg-black/5" />
                )}
              </div>
            </div>

            {/* About Section */}
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-brand-midnight">
                About this <GradientText>Raffle</GradientText>
              </h2>
              <div className="mt-6 prose prose-sm max-w-none text-brand-midnight/70">
                <p className="text-base sm:text-lg leading-relaxed">
                  Get ready for your chance to win this incredible {raffle.title}. 
                  This competition is skill-based, meaning you'll need to answer 
                  the question correctly to be entered into the draw.
                </p>
                
                <div className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2">
                  <div className="rounded-2xl bg-brand-accent p-6">
                    <h4 className="font-bold uppercase tracking-wider text-brand-secondary text-xs mb-2">Guaranteed Draw</h4>
                    <p className="text-sm font-medium text-brand-midnight">This draw will take place regardless of ticket sales. No extensions, ever.</p>
                  </div>
                  <div className="rounded-2xl bg-brand-accent p-6">
                    <h4 className="font-bold uppercase tracking-wider text-brand-secondary text-xs mb-2">Instant Confirmation</h4>
                    <p className="text-sm font-medium text-brand-midnight">Receive your ticket numbers via email immediately after a successful entry.</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* FAQ / Rules Placeholder */}
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl font-black uppercase tracking-tight text-brand-midnight">
                Competition <GradientText>Rules</GradientText>
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  "Entrants must be 18 years or older.",
                  "Open to residents of the United Kingdom only.",
                  "Correct answer to the skill question is required for entry.",
                  "Draw will be conducted live on our social media channels.",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-brand-midnight/60">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center text-brand-secondary text-[10px] font-bold">
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
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-midnight/40 mb-2">
                Tickets Sold
              </div>
              <div className="text-3xl font-black text-brand-midnight">
                -- <span className="text-lg text-brand-midnight/20">/ --</span>
              </div>
              <div className="mt-4 h-2 w-full bg-brand-accent rounded-full overflow-hidden">
                <div className="h-full bg-brand-secondary w-[15%] rounded-full shadow-[0_0_10px_rgba(0,112,224,0.3)]" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-midnight/60">
                  5 people entered in the last hour
                </p>
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
                Drawing in: 2 days, 14 hours
              </p>
            </GlassCard>
          </div>
        </div>
      </Container>

      {/* Mobile Floating CTA */}
      <RaffleMobileCTA ticketPriceFormatted={ticketPriceFormatted} />
    </div>
  );
}
