"use client";

import styled from "@emotion/styled";
import { Container } from "./Container";
import Image from "next/image";

const Section = styled.section`
  padding: 8rem 0;
  background: #f6f2ed;
`;

const WinnerCard = styled.div`
  background: white;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 4/3;
  width: 100%;
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {winners.map((winner, i) => (
            <WinnerCard key={i}>
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
