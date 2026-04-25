import { Container } from "@/components/Container";
import { GradientText, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";

const winners = [
  {
    prize: "Easter Giveaway",
    winner: "Jess Cox",
    date: "April 24, 2026",
    quote: "Winning the Easter competition on Coast Competitions was such an amazing experience! The staff are very friendly and were quick at responding. I'll definitely be entering their competitions again. Thank you so much.",
    image: "/winners/1/jess-cox-easter-giveaway-main.jpg",
    secondaryImage: "/winners/1/jess-cox-easter-giveaway-secondary.jpg",
    instagramUrl: "https://www.instagram.com/p/DWrmfKfDLxB/?hl=en",
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
                <div className="absolute top-6 right-6 z-20 bg-[#00b67a] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                  <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Winner
                </div>
                {winner.secondaryImage && (
                  <div className="absolute bottom-6 left-6 z-20 h-24 w-24 overflow-hidden rounded-3xl border-4 border-white bg-white shadow-2xl sm:h-32 sm:w-32">
                    <Image
                      src={winner.secondaryImage}
                      alt={`${winner.winner} with Easter Giveaway prize`}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                )}
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
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40 tracking-widest mb-1">Winner Announced</span>
                    <span className="text-lg font-bold text-brand-midnight">{winner.date}</span>
                  </div>
                  <a
                    href={winner.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center rounded-full bg-brand-secondary px-6 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-brand-secondary/90"
                  >
                    View Instagram Post
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
