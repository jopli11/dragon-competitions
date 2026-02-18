"use client";

import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { GradientText, BrandSectionHeading, GlassCard } from "@/lib/styles";
import Image from "next/image";

const WinnersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-top: 4rem;
`;

const WinnerCard = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  background: white;
  border-radius: 2.5rem;
  overflow: hidden;
  border: 1px solid rgba(0, 48, 135, 0.08);
  box-shadow: 0 20px 40px rgba(0, 48, 135, 0.05);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 60px rgba(0, 48, 135, 0.1);
    border-color: rgba(0, 112, 224, 0.2);
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1.2fr;
    min-height: 450px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  height: 300px;
  
  @media (min-width: 1024px) {
    height: auto;
  }

  .video-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    z-index: 5;
  }

  .play-button {
    width: 4.5rem;
    height: 4.5rem;
    background: white;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0070e0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }

    svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-left: 0.25rem;
    }
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
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 1024px) {
    padding: 4rem;
  }
`;

const Quote = styled.blockquote`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0a2540;
  line-height: 1.5;
  margin-bottom: 2rem;
  position: relative;
  font-style: italic;

  &::before {
    content: '"';
    font-size: 4rem;
    color: #0070e0;
    opacity: 0.1;
    position: absolute;
    top: -2rem;
    left: -1rem;
    font-family: serif;
  }
`;

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
    <div className="min-h-screen bg-white py-16">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <BrandSectionHeading>The <GradientText>Hall of Fame</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium text-lg">
            Meet our lucky winners and hear their life-changing stories. 
            Real people, real prizes, real winners.
          </p>
        </div>

        <WinnersGrid>
          {winners.map((winner, i) => (
            <WinnerCard key={i}>
              <ImageSection>
                <Image
                  src={winner.image}
                  alt={winner.winner}
                  fill
                  className="object-cover"
                />
                {winner.hasVideo && (
                  <div className="video-overlay">
                    <button className="play-button" aria-label="Play testimonial video">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                )}
                <VerifiedBadge>
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Verified Winner
                </VerifiedBadge>
              </ImageSection>
              
              <ContentSection>
                <div className="mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-secondary">
                    Winner Story
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-brand-midnight uppercase tracking-tight mt-1">
                    {winner.winner}
                  </h3>
                  <p className="text-brand-secondary font-bold text-sm mt-1">
                    Won: {winner.prize}
                  </p>
                </div>

                <Quote>{winner.quote}</Quote>

                <div className="flex items-center gap-8 pt-6 border-t border-brand-primary/5">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40">Draw Date</span>
                    <span className="text-sm font-bold text-brand-midnight">{winner.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-brand-midnight/40">Winning Ticket</span>
                    <span className="text-sm font-black text-brand-secondary">#{winner.ticket}</span>
                  </div>
                </div>
              </ContentSection>
            </WinnerCard>
          ))}
        </WinnersGrid>
      </Container>
    </div>
  );
}
