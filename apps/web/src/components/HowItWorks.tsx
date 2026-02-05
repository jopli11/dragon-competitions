"use client";

import styled from "@emotion/styled";
import { Container } from "./Container";

const Section = styled.section`
  background: #11181d;
  color: white;
  padding: 8rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    background: radial-gradient(
      circle at 70% 30%,
      rgba(229, 83, 26, 0.1),
      transparent 70%
    );
    pointer-events: none;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  margin-top: 4rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const StepCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 2rem;
  padding: 2.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(229, 83, 26, 0.3);
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  background: rgba(229, 83, 26, 0.1);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #e5531a;
  border: 1px solid rgba(229, 83, 26, 0.2);

  svg {
    width: 2rem;
    height: 2rem;
  }
`;

const StepNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 900;
  color: #e5531a;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  display: block;
  margin-bottom: 0.5rem;
`;

const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const StepDescription = styled.p`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9375rem;
  line-height: 1.6;
`;

const steps = [
  {
    number: "Step 01",
    title: "Register an account",
    description: "Create your Dragon Competitions account in seconds. We keep your data secure and transparent.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "Step 02",
    title: "Pick Competition",
    description: "Browse our live raffles and choose the prize you want to win. From cash to cars and tech.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "Step 03",
    title: "Answer Question",
    description: "Answer our qualifying skill question correctly to enter. Choose your ticket quantity and proceed.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "Step 04",
    title: "Secure Checkout",
    description: "Complete your purchase using our secure payment gateway. You'll receive instant email confirmation.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: "Step 05",
    title: "No Extensions",
    description: "Our draws take place regardless of sell-out. Better odds for you with guaranteed draw dates.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "Step 06",
    title: "Watch the Draw",
    description: "Follow us on social media for live draws. Winners are contacted immediately after the draw.",
    icon: (
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <Section>
      <Container>
        <div className="text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-dragon-orange">
            Process
          </h2>
          <h3 className="mt-4 text-4xl font-black uppercase tracking-tight sm:text-5xl">
            How It Works
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/50">
            Winning your dream prize is simple. Follow these 6 steps to enter our skill-based competitions.
          </p>
        </div>

        <Grid>
          {steps.map((step) => (
            <StepCard key={step.number}>
              <IconWrapper>{step.icon}</IconWrapper>
              <StepNumber>{step.number}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
