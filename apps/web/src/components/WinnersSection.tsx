"use client";

import styled from "@emotion/styled";
import { Container } from "./Container";
import Image from "next/image";

const Section = styled.section`
  padding: 4rem 0;
  background: #f6f2ed;

  @media (min-width: 768px) {
    padding: 8rem 0;
  }
`;

const WinnerCard = styled.div`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;

  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
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

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  width: 100%;
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.4) 100%);
  }
`;

const Content = styled.div`
  padding: 2rem;
  text-align: center;
`;

const PrizeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 900;
  color: #c43a12;
  text-transform: uppercase;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  min-height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WinnerMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #1f2a33;
  font-size: 0.875rem;

  .label {
    font-weight: 800;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: rgba(31, 42, 51, 0.4);
    letter-spacing: 0.1em;
  }

  .value {
    font-weight: 700;
  }
`;

const winners = [
  {
    prize: "Win This MK8 VW Golf GTI or This MK8 VW Golf GTD & £1,000 Cash *YOU CHOOSE*",
    winner: "Michael Walker",
    date: "January 21, 2026",
    time: "8:30 pm",
    ticket: "282262",
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "BMW M5 Competition",
    winner: "Louise St Louie",
    date: "January 20, 2026",
    time: "11:27 am",
    ticket: "282262",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "JCW Mini GP2",
    winner: "Triston Upton",
    date: "January 19, 2026",
    time: "7:26 pm",
    ticket: "82047",
    image: "https://images.unsplash.com/photo-1619330091138-ec1aaaf53688?q=80&w=800&auto=format&fit=crop",
  },
  {
    prize: "Nissan 370Z Nismo",
    winner: "Danny Hales",
    date: "January 19, 2026",
    time: "7:15 pm",
    ticket: "286004",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
  },
];

export function WinnersSection() {
  return (
    <Section>
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-dragon-orange">
            Hall of Fame
          </h2>
          <h3 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl text-charcoal-navy">
            Recent Winners
          </h3>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          {winners.map((winner, i) => (
            <WinnerCard key={i}>
              <VerifiedBadge>
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Winner
              </VerifiedBadge>
              <ImageWrapper>
                <Image
                  src={winner.image}
                  alt={winner.winner}
                  fill
                  className="object-cover"
                />
              </ImageWrapper>
              <Content>
                <PrizeTitle>{winner.prize}</PrizeTitle>
                <WinnerMeta>
                  <div>
                    <span className="label">Won:</span>
                    <div className="value">{winner.date}</div>
                    <div className="text-xs opacity-60">{winner.time}</div>
                  </div>
                  <div className="mt-4">
                    <div className="value text-lg">{winner.ticket}</div>
                  </div>
                </WinnerMeta>
              </Content>
            </WinnerCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}
