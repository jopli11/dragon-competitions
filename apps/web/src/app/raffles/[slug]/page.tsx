import Image from "next/image";
import Link from "next/link";
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

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  if (!raffle) return { title: "Competition Not Found" };

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
  const maxTickets = raffle.maxTickets || 5000;
  const progress = Math.min(100, Math.max(2, (stats.ticketsSold / maxTickets) * 100));
  const isSoldOut = stats.ticketsSold >= maxTickets;
  const isAwaitingDraw = raffle.status === "awaitingDraw";
  const isEnded = raffle.status === "ended";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": raffle.title,
    "description": raffle.raffleDescription || `Win ${raffle.title} with Coast Competitions.`,
    "image": raffle.heroImageUrl,
    "offers": {
      "@type": "Offer",
      "price": raffle.ticketPricePence / 100,
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "validThrough": raffle.endAt,
    },
    "brand": {
      "@type": "Brand",
      "name": "Coast Competitions"
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          <BrandBadge className={`mb-3 self-start ${isAwaitingDraw ? 'bg-amber-500 text-white' : isEnded ? 'bg-gray-500 text-white' : isSoldOut ? 'bg-red-500 text-white' : ''}`}>
            {isAwaitingDraw ? 'Awaiting Live Draw' : isEnded ? 'Draw Complete' : isSoldOut ? 'Sold Out' : 'Entries Open'}
          </BrandBadge>
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
                About this <GradientText>Competition</GradientText>
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
            {isAwaitingDraw ? (
              <GlassCard className="p-8 text-center border-amber-500/20 bg-amber-50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Awaiting Live Draw</h3>
                <p className="mt-2 text-sm text-brand-midnight/60">
                  All tickets have been sold! The winner will be selected during a live draw event. Follow us on social media so you don&apos;t miss it.
                </p>
                <div className="mt-6">
                  <p className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest mb-3">Follow us for the live draw</p>
                  <div className="flex justify-center gap-3">
                    {[
                      { name: "Facebook", href: "#", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 11.127 8.812 13.22v-9.357H5.445v-3.863h3.367V9.121c0-3.322 2.022-5.14 4.99-5.14 1.42 0 2.905.254 2.905.254v3.193h-1.636c-1.647 0-2.16 1.023-2.16 2.071v2.488h3.6l-.576 3.863h-3.024v9.357C20.344 23.2 24 18.062 24 12.073z"/></svg> },
                      { name: "Instagram", href: "#", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.774 4.919 4.851.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.075-1.664 4.703-4.919 4.85-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.775-4.919-4.851-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.075 1.664-4.704 4.919-4.85 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
                      { name: "TikTok", href: "#", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
                    ].map((social) => (
                      <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-colors hover:bg-amber-500 hover:text-white" title={social.name}>
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ) : isEnded ? (
              <GlassCard className="p-8 text-center border-gray-300/30 bg-gray-50">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Draw Complete</h3>
                <p className="mt-2 text-sm text-brand-midnight/60">
                  This competition has been drawn. Check the results page to see the winner.
                </p>
                <Link href="/results" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-8 text-sm font-bold text-background transition-colors hover:bg-foreground/90">
                  View Draw Results
                </Link>
              </GlassCard>
            ) : !isSoldOut ? (
              <SkillQuestionCard
                slug={raffle.slug}
                question={raffle.skillQuestion}
                options={raffle.answerOptions}
                ticketPricePence={raffle.ticketPricePence}
                maxTickets={maxTickets}
                ticketsSold={stats.ticketsSold}
              />
            ) : (
              <GlassCard className="p-8 text-center border-red-500/20 bg-red-500/5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Competition Closed</h3>
                <p className="mt-2 text-sm text-brand-midnight/60">
                  This competition has reached its maximum ticket limit and is now closed for entries.
                </p>
                <Link href="/raffles" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90">
                  View Other Competitions
                </Link>
              </GlassCard>
            )}
            
            <GlassCard className="text-center py-8">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-midnight/40 mb-2">
                Tickets Sold
              </div>
              <div className="text-3xl font-black text-brand-midnight">
                {stats.ticketsSold} <span className="text-lg text-brand-midnight/20">/ {maxTickets}</span>
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
