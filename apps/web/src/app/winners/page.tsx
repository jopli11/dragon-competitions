"use client";

import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { GradientText, BrandSectionHeading, GlassCard } from "@/lib/styles";
import Image from "next/image";

const WinnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const WinnerCard = styled(GlassCard)`
  padding: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    border-color: rgba(229, 83, 26, 0.2);
  }
`;

const VerifiedBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  background: #00b67a;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 10px rgba(0, 182, 122, 0.3);

  svg {
    width: 10px;
    height: 10px;
  }
`;

const winners = [
  {
    prize: "Win This MK8 VW Golf GTI or This MK8 VW Golf GTD & £1,000 Cash *YOU CHOOSE*",
    winner: "Michael Walker",
    date: "January 21, 2026",
    ticket: "282262",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "BMW M5 Competition",
    winner: "Louise St Louie",
    date: "January 20, 2026",
    ticket: "282262",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "JCW Mini GP2",
    winner: "Triston Upton",
    date: "January 19, 2026",
    ticket: "82047",
    image: "https://images.unsplash.com/photo-1619330091138-ec1aaaf53688?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "Nissan 370Z Nismo",
    winner: "Danny Hales",
    date: "January 19, 2026",
    ticket: "286004",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "Tesla Model S Plaid",
    winner: "John D.",
    date: "Jan 15, 2026",
    ticket: "12845",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "£10,000 Cash",
    winner: "Sarah M.",
    date: "Jan 12, 2026",
    ticket: "88231",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
  },
];

export default function WinnersPage() {
  return (
    <div className="min-h-screen bg-[#f6f2ed] py-16">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Our <GradientText>Winners</GradientText></BrandSectionHeading>
          <p className="mt-4 text-charcoal-navy/60 font-medium uppercase tracking-widest text-sm">
            Join our growing list of winners. Your name could be next!
          </p>
        </div>

        <WinnersGrid>
          {winners.map((winner, i) => (
            <WinnerCard key={i}>
              <div className="relative aspect-[4/3]">
                <VerifiedBadge>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </VerifiedBadge>
                <Image
                  src={winner.image}
                  alt={winner.winner}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-sm font-black text-dragon-red uppercase leading-tight min-h-[2.5rem] flex items-center justify-center">
                  {winner.prize}
                </h3>
                <div className="mt-4 pt-4 border-t border-black/5">
                  <span className="block text-[10px] font-bold uppercase text-charcoal-navy/50">Winner</span>
                  <span className="text-lg font-black text-charcoal-navy">{winner.winner}</span>
                </div>
                <div className="mt-2">
                  <span className="block text-[10px] font-bold uppercase text-charcoal-navy/50">Winning Ticket</span>
                  <span className="text-sm font-bold text-dragon-orange">#{winner.ticket}</span>
                </div>
                <p className="mt-4 text-[10px] font-bold text-charcoal-navy/40 uppercase">{winner.date}</p>
              </div>
            </WinnerCard>
          ))}
        </WinnersGrid>
      </Container>
    </div>
  );
}
