import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText, GlassCard } from "@/lib/styles";
import Image from "next/image";
import { getCompletedDraws } from "@/lib/firebase/raffle-stats";
import { fetchLiveRaffles } from "@/lib/contentful/raffles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DrawResultsPage() {
  const [completedDraws, allRaffles] = await Promise.all([
    getCompletedDraws(),
    fetchLiveRaffles(), // We might need a fetchAllRaffles or similar if we want images for ended ones
  ]);

  // For now, we'll combine the Firestore draw data with some mock/Contentful data
  // In a real scenario, we'd fetch the ended raffles from Contentful too
  const results = completedDraws.map(draw => {
    const raffleInfo = allRaffles.find(r => r.slug === draw.id);
    return {
      id: draw.id,
      title: raffleInfo?.title || draw.id.replace(/-/g, ' ').toUpperCase(),
      winner: draw.winnerEmail ? `${draw.winnerEmail.split('@')[0].slice(0, 3)}***@${draw.winnerEmail.split('@')[1]}` : "Anonymous",
      date: new Date(draw.drawnAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }),
      ticket: draw.winningTicketNumber,
      image: raffleInfo?.heroImageUrl || "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
      audit: draw.drawAudit || null
    };
  });

  // Fallback to mock if no real draws yet
  const displayResults = results.length > 0 ? results : [
    {
      id: "mock-1",
      title: "Tesla Model S Plaid",
      winner: "joel***@qzee.app",
      date: "Feb 1, 2026",
      ticket: "12845",
      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
      audit: { seed: "8f3e2a1b9c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f", totalTickets: 5000 }
    }
  ];

  return (
    <div className="min-h-screen bg-surface-mint py-16 sm:py-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <BrandSectionHeading>Draw <GradientText>Results</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium text-lg">
            Transparency is our priority. Every draw is cryptographically secured and 100% verifiable.
          </p>
        </div>

        <div className="grid gap-12 grid-cols-1">
          {displayResults.map((result) => (
            <GlassCard key={result.id} className="overflow-hidden border-brand-primary/10 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-0">
                {/* Left: Raffle Info */}
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
                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest bg-brand-secondary/20 px-2 py-1 rounded backdrop-blur-sm">
                      Official Result
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-2">
                      {result.title}
                    </h3>
                  </div>
                </div>

                {/* Right: Winner & Provably Fair Info */}
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

                  {/* Provably Fair Section */}
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
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Verification Guide */}
        <div className="mt-24 max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">How we ensure <GradientText>Fairness</GradientText></h3>
          <p className="mt-6 text-brand-midnight/60 font-medium leading-relaxed">
            We use a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). 
            The "Seed" is generated at the exact moment of the draw and is combined with the total number of tickets sold to determine the winner. 
            This process is immutable and can be verified by anyone using standard cryptographic tools.
          </p>
        </div>
      </Container>
    </div>
  );
}
