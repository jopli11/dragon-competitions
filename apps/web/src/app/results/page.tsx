import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import { getCompletedDraws } from "@/lib/firebase/raffle-stats";
import { fetchEndedRaffles } from "@/lib/contentful/raffles";
import { DrawResultsList } from "@/components/DrawResultsList";

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

        <DrawResultsList results={displayResults} />

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
