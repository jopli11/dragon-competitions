import { Container } from "@/components/Container";
import { GradientText, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";

const winners = [
  {
    prize: "Tesla Model S Plaid",
    winner: "Michael Walker",
    date: "January 21, 2026",
    ticket: "282262",
    quote: "I've been entering for 6 months and finally my number came up! The team at Dragon were amazing and the car is even better in person.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
    hasVideo: true,
  },
  {
    prize: "BMW M5 Competition",
    winner: "Louise St Louie",
    date: "January 20, 2026",
    ticket: "282262",
    quote: "Absolutely life changing. I never thought I'd actually win, but here I am with my dream car. Thank you Dragon Competitions!",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop",
    hasVideo: false,
  },
  {
    prize: "£15,000 Tax Free Cash",
    winner: "Danny Hales",
    date: "January 19, 2026",
    ticket: "286004",
    quote: "The cash alternative was exactly what my family needed right now. The process was so fast and transparent.",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1200&auto=format&fit=crop",
    hasVideo: true,
  },
];

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-24">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <BrandSectionHeading>The <GradientText>Hall of Fame</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium text-lg">
            Meet our lucky winners and hear their life-changing stories. 
            Real people, real prizes, real winners.
          </p>
        </div>

        <div className="grid gap-12 sm:gap-24 grid-cols-1">
          {winners.map((winner, i) => (
            <div key={i} className="group grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-white rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden border border-brand-primary/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-brand hover:border-brand-secondary/20">
              <div className="relative h-[300px] lg:h-full min-h-[400px]">
                <Image
                  src={winner.image}
                  alt={winner.winner}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {winner.hasVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                    <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-secondary shadow-2xl transition-transform duration-300 hover:scale-110" aria-label="Play testimonial video">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="absolute top-6 right-6 z-20 bg-[#00b67a] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Winner
                </div>
              </div>
              
              <div className="p-8 sm:p-16 flex flex-col justify-center bg-white">
                <div className="mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary mb-2 block">
                    Winner Story
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-brand-midnight uppercase tracking-tighter mt-1">
                    {winner.winner}
                  </h3>
                  <p className="text-brand-secondary font-bold text-base mt-2">
                    Won: {winner.prize}
                  </p>
                </div>

                <blockquote className="text-xl sm:text-2xl font-semibold text-brand-midnight leading-relaxed italic relative mb-10 pl-4 sm:pl-8">
                  <span className="absolute -top-4 -left-2 text-6xl text-brand-secondary opacity-10 font-serif">"</span>
                  {winner.quote}
                </blockquote>

                <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pt-10 border-t border-brand-primary/5">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40 tracking-widest mb-1">Draw Date</span>
                    <span className="text-lg font-bold text-brand-midnight">{winner.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40 tracking-widest mb-1">Winning Ticket</span>
                    <span className="text-lg font-black text-brand-secondary">#{winner.ticket}</span>
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
