import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText, GlassCard } from "@/lib/styles";
import Image from "next/image";
import { getCompletedDraws } from "@/lib/firebase/raffle-stats";
import { fetchEndedRaffles } from "@/lib/contentful/raffles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type DrawResult = {
  id: string;
  title: string;
  winner: string;
  date: string;
  rawDate: number;
  ticket: number | string | undefined;
  image: string;
  audit: { seed: string; totalTickets: number } | null;
  isLiveDraw: boolean;
};

export default async function DrawResultsPage() {
  const [completedDraws, endedRaffles] = await Promise.all([
    getCompletedDraws(),
    fetchEndedRaffles(),
  ]);

  const endedBySlug = new Map(endedRaffles.map((r) => [r.slug, r]));
  const firestoreBySlug = new Map(completedDraws.map((d) => [d.id, d]));

  const results: DrawResult[] = [];
  const seenSlugs = new Set<string>();

  // Merge auto-draw results (Firestore has the audit trail, Contentful has the images)
  for (const draw of completedDraws) {
    seenSlugs.add(draw.id);
    const contentfulEntry = endedBySlug.get(draw.id);

    results.push({
      id: draw.id,
      title: contentfulEntry?.title || draw.id.replace(/-/g, " ").toUpperCase(),
      winner: draw.winnerEmail
        ? `${draw.winnerEmail.split("@")[0].slice(0, 3)}***@${draw.winnerEmail.split("@")[1]}`
        : contentfulEntry?.winnerDisplayName || "Anonymous",
      date: new Date(draw.drawnAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      rawDate: new Date(draw.drawnAt).getTime(),
      ticket: draw.winningTicketNumber,
      image:
        contentfulEntry?.heroImageUrl ||
        "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
      audit: draw.drawAudit || null,
      isLiveDraw: false,
    });
  }

  // Add live-draw results from Contentful that aren't already in Firestore
  for (const entry of endedRaffles) {
    if (seenSlugs.has(entry.slug)) continue;
    if (!entry.winnerDisplayName) continue; // Not yet drawn

    results.push({
      id: entry.slug,
      title: entry.title,
      winner: entry.winnerDisplayName,
      date: entry.drawDate
        ? new Date(entry.drawDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "—",
      rawDate: entry.drawDate ? new Date(entry.drawDate).getTime() : 0,
      ticket: entry.winnerTicketNumber,
      image:
        entry.heroImageUrl ||
        "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
      audit: null,
      isLiveDraw: true,
    });
  }

  const displayResults = results.sort((a, b) => b.rawDate - a.rawDate);

  return (
    <div className="min-h-screen bg-surface-mint py-16 sm:py-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <BrandSectionHeading>Draw <GradientText>Results</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium text-lg">
            Transparency is our priority. Every draw is cryptographically secured and 100% verifiable.
          </p>
        </div>

        {displayResults.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">
              No draw results yet.
            </p>
            <p className="mt-2 text-xs text-foreground/30">
              Results will appear here once competitions are drawn.
            </p>
          </div>
        ) : (
          <div className="grid gap-12 grid-cols-1">
            {displayResults.map((result) => (
              <GlassCard key={result.id} className="overflow-hidden border-brand-primary/10 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-0">
                  <div className="relative aspect-video lg:aspect-auto">
                    <Image
                      src={result.image}
                      alt={result.title}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-brand-midnight/80 via-brand-midnight/20 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                      <span className={`text-[10px] font-black text-brand-accent uppercase tracking-widest px-2 py-1 rounded backdrop-blur-sm ${result.isLiveDraw ? "bg-amber-500/30" : "bg-brand-secondary/20"}`}>
                        {result.isLiveDraw ? "Live Draw Result" : "Official Result"}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-2">
                        {result.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8 sm:p-12 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-brand-primary/5 pb-10">
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Winner</span>
                        <span className="text-xl font-black text-brand-midnight break-all">{result.winner}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Winning Ticket</span>
                        <span className="text-2xl font-black text-brand-secondary">#{result.ticket}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Draw Date</span>
                        <span className="text-xl font-black text-brand-midnight">{result.date}</span>
                      </div>
                    </div>

                    {result.isLiveDraw ? (
                      <div className="bg-amber-50 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-brand-midnight">Live Draw</h4>
                        </div>
                        <p className="text-sm text-brand-midnight/60 font-medium">
                          This winner was selected during a live draw event. The winning ticket was picked in real-time using an independent random number generator.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-brand-accent/30 rounded-3xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-brand-midnight">Provably Fair Verification</h4>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Draw Seed (SHA-256)</span>
                            <div className="bg-white border border-brand-primary/5 rounded-xl p-3 font-mono text-[10px] sm:text-xs text-brand-midnight/70 break-all shadow-inner">
                              {result.audit?.seed || "Pending verification..."}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Total Eligible Tickets</span>
                              <div className="text-lg font-black text-brand-midnight">
                                {result.audit?.totalTickets || "0"}
                              </div>
                            </div>
                            <div>
                              <span className="block text-[9px] font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Verification Logic</span>
                              <div className="text-xs font-bold text-brand-midnight/60 italic">
                                (parseInt(Seed, 16) % TotalTickets) + 1 = #{result.ticket}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Verification Guide */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">How we ensure <GradientText>Fairness</GradientText></h3>
          <p className="mt-6 text-brand-midnight/60 font-medium leading-relaxed">
            We use a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) for automated draws. 
            The &ldquo;Seed&rdquo; is generated at the exact moment of the draw and is combined with the total number of tickets sold to determine the winner. 
            Live draws are conducted in real-time using an independent random number generator, ensuring full transparency.
          </p>
        </div>
      </Container>
    </div>
  );
}
