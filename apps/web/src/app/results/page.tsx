import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import Image from "next/image";

const mockResults = [
  {
    id: "1",
    title: "Tesla Model S Plaid",
    winner: "John D.",
    date: "Feb 1, 2026",
    ticket: "12845",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "£10,000 Cash",
    winner: "Sarah M.",
    date: "Jan 28, 2026",
    ticket: "88231",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "PS5 Bundle",
    winner: "Mike R.",
    date: "Jan 25, 2026",
    ticket: "44102",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
  },
];

export default function DrawResultsPage() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] py-16 sm:py-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <BrandSectionHeading>Draw <GradientText>Results</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium text-lg">
            Transparency is our priority. Our official record of every 
            guaranteed draw and lucky winner.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {mockResults.map((result) => (
            <div key={result.id} className="bg-white rounded-4xl overflow-hidden border border-brand-primary/10 shadow-lg transition-all duration-400 hover:-translate-y-2 hover:shadow-2xl hover:border-brand-secondary/30">
              <div className="relative aspect-video">
                <Image
                  src={result.image}
                  alt={result.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-midnight/80 via-brand-midnight/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest bg-brand-secondary/20 px-2 py-0.5 rounded backdrop-blur-sm">
                    Official Result
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                    {result.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between border-b border-brand-primary/5 pb-4">
                  <span className="text-xs font-bold uppercase text-brand-midnight/40">Winner</span>
                  <span className="font-black text-brand-midnight">{result.winner}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40">Draw Date</span>
                    <span className="text-sm font-bold text-brand-midnight">{result.date}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40">Winning Ticket</span>
                    <span className="text-sm font-black text-brand-secondary">#{result.ticket}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
