"use client";

import styled from "@emotion/styled";
import { Container } from "./Container";
import Image from "next/image";
import { BrandLinkButton } from "@/lib/styles";

const Section = styled.section`
  padding: 4rem 0;
  background: #fcfdff;
  position: relative;

  @media (min-width: 768px) {
    padding: 8rem 0;
  }
`;

const WinnersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WinnerCard = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(0, 48, 135, 0.08);
  box-shadow: 0 10px 30px rgba(0, 48, 135, 0.05);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 48, 135, 0.1);
    border-color: rgba(0, 112, 224, 0.2);
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    min-height: 320px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  height: 240px;
  flex-shrink: 0;
  
  @media (min-width: 1024px) {
    width: 40%;
    height: auto;
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

const ContentSection = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const Quote = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #0a2540;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const winners = [
  {
    prize: "Tesla Model S Plaid",
    winner: "Michael Walker",
    date: "Jan 21, 2026",
    ticket: "282262",
    quote: "I've been entering for 6 months and finally my number came up! The team at Dragon were amazing and the car is even better in person.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "BMW M5 Competition",
    winner: "Louise St Louie",
    date: "Jan 20, 2026",
    ticket: "282262",
    quote: "Absolutely life changing. I never thought I'd actually win, but here I am with my dream car. Thank you Dragon Competitions!",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  },
];

export function WinnersSection() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-brand-secondary">
            Hall of Fame
          </h2>
          <h3 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl text-brand-midnight">
            Recent Winners
          </h3>
        </div>

        <WinnersGrid>
          {winners.map((winner, i) => (
            <WinnerCard key={i}>
              <ImageSection>
                <Image
                  src={winner.image}
                  alt={winner.winner}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <VerifiedBadge>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified
                </VerifiedBadge>
              </ImageSection>
              
              <ContentSection>
                <div className="mb-4">
                  <h3 className="text-xl font-black text-brand-midnight uppercase tracking-tight">
                    {winner.winner}
                  </h3>
                  <p className="text-brand-secondary font-bold text-xs uppercase tracking-wider">
                    {winner.prize}
                  </p>
                </div>

                <Quote>"{winner.quote}"</Quote>

                <div className="flex items-center justify-between pt-4 border-t border-brand-primary/5">
                  <div className="text-[10px] font-bold uppercase text-brand-midnight/40">
                    Ticket <span className="text-brand-secondary">#{winner.ticket}</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase text-brand-midnight/40">
                    {winner.date}
                  </div>
                </div>
              </ContentSection>
            </WinnerCard>
          ))}
        </WinnersGrid>
        
        <div className="mt-12 text-center">
          <BrandLinkButton variant="outline" href="/winners">
            View All Success Stories
          </BrandLinkButton>
        </div>
      </Container>
    </Section>
  );
}
