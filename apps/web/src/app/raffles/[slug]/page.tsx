import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { SkillQuestionCard } from "@/components/SkillQuestionCard";
import { RaffleMobileCTA } from "@/components/RaffleMobileCTA";
import { fetchRaffleBySlug } from "@/lib/contentful/raffles";
import { getRaffleStats } from "@/lib/firebase/raffle-stats";
import { BrandBadge, GlassCard, GradientText } from "@/lib/styles";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Metadata } from "next";

const RICH_TEXT_OPTIONS = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="text-lg font-bold mt-6 mb-2 text-brand-midnight">{children}</h3>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a href={node.data.uri} className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raffle = await fetchRaffleBySlug(slug);

  if (!raffle) return { title: "Raffle Not Found" };

  return {
    title: raffle.title,
    description: `Win ${raffle.title} with Coast Competitions. Answer the skill question and enter now for just £${(raffle.ticketPricePence / 100).toFixed(2)}!`,
    openGraph: {
      title: `${raffle.title} · Coast Competitions`,
      description: `Win ${raffle.title} with Coast Competitions.`,
      images: raffle.heroImageUrl ? [{ url: raffle.heroImageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: raffle.title,
      description: `Win ${raffle.title} with Coast Competitions.`,
      images: raffle.heroImageUrl ? [raffle.heroImageUrl] : [],
    },
  };
}

export default async function RaffleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [raffle, stats] = await Promise.all([
    fetchRaffleBySlug(slug),
    getRaffleStats(slug)
  ]);

  if (!raffle) notFound();

  function formatGBPFromPence(pence: number) {
    if (pence < 100) return `${pence}p`;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(pence / 100);
  }

  const ticketPriceFormatted = formatGBPFromPence(raffle.ticketPricePence);
  const progress = Math.min(100, Math.max(2, (stats.ticketsSold / 5000) * 100));

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
            <div className="overflow-hidden rounded-4xl border border-black/5 bg-white shadow-xl">
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
              
              {/* Gallery Thumbnails */}
              {raffle.galleryImageUrls && raffle.galleryImageUrls.length > 0 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-brand-accent/20">
                  {[raffle.heroImageUrl, ...raffle.galleryImageUrls].filter(Boolean).map((url, i) => (
                    <div key={i} className="relative h-20 aspect-video shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={url!}
                        alt={`${raffle.title} gallery ${i}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About Section */}
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-brand-midnight">
                About this <GradientText>Raffle</GradientText>
              </h2>
              <div className="mt-6 prose prose-sm max-w-none text-brand-midnight/70">
                {raffle.raffleDescription ? (
                  <div className="text-base leading-relaxed">
                    {documentToReactComponents(raffle.raffleDescription, RICH_TEXT_OPTIONS)}
                  </div>
                ) : (
                  <p className="text-base sm:text-lg leading-relaxed">
                    Get ready for your chance to win this incredible {raffle.title}. 
                    This competition is skill-based, meaning you'll need to answer 
                    the question correctly to be entered into the draw.
                  </p>
                )}
                
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

                {raffle.prizeDetails && (
                  <div className="mt-12">
                    <h3 className="text-lg font-black uppercase tracking-tight text-brand-midnight mb-4">
                      Prize <GradientText>Details</GradientText>
                    </h3>
                    <div className="text-base leading-relaxed">
                      {documentToReactComponents(raffle.prizeDetails, RICH_TEXT_OPTIONS)}
                    </div>
                  </div>
                )}
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
                {stats.ticketsSold} <span className="text-lg text-brand-midnight/20">/ 5000</span>
              </div>
              <div className="mt-4 h-2 w-full bg-brand-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-secondary rounded-full shadow-[0_0_10px_rgba(0,112,224,0.3)]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-midnight/60">
                  Real-time entry tracking active
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>

      {/* Mobile Floating CTA */}
      <RaffleMobileCTA ticketPriceFormatted={ticketPriceFormatted} />
    </div>
  );
}
