"use client";

import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { GlassCard, GradientText, BrandSectionHeading, BrandLinkButton } from "@/lib/styles";
import Image from "next/image";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f6f2ed;
  position: relative;
  overflow: hidden;
`;

const Hero = styled.div`
  background: #1f2a33;
  color: white;
  padding: 8rem 0 12rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 30%, rgba(229, 83, 26, 0.15), transparent 40%),
      radial-gradient(circle at 80% 70%, rgba(196, 58, 18, 0.1), transparent 40%),
      url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
    opacity: 0.4;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 250px;
    background: linear-gradient(to bottom, transparent, #f6f2ed);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  margin-top: -6rem;
  position: relative;
  z-index: 10;

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 1fr;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(GlassCard)`
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .value {
    font-size: 1.5rem;
    font-weight: 900;
    color: #e5531a;
  }
  
  .label {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    color: rgba(31, 42, 51, 0.4);
    letter-spacing: 0.1em;
  }
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  background: rgba(229, 83, 26, 0.1);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5531a;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(229, 83, 26, 0.2);

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export default function AboutPage() {
  return (
    <PageWrapper>
      <Hero>
        <Container>
          <span className="text-sm font-black uppercase tracking-[0.4em] text-dragon-orange mb-4 block">
            The Legend
          </span>
          <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-7xl md:text-8xl">
            About <GradientText>Dragon</GradientText>
          </h1>
          <p className="mt-8 text-xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed">
            We're not just another competition site. We're a community-driven platform 
            built on transparency, epic prizes, and the thrill of the win.
          </p>
        </Container>
      </Hero>

      <Container>
        <ContentGrid>
          <div className="space-y-8">
            <GlassCard className="!p-10">
              <h2 className="text-3xl font-black uppercase tracking-tight text-charcoal-navy">
                Our <GradientText>Heritage</GradientText>
              </h2>
              <div className="mt-8 space-y-6 text-charcoal-navy/70 text-lg leading-relaxed">
                <p>
                  Dragon Competitions was born from a passion for high-performance machinery and the desire to make premium experiences accessible to everyone. We saw a gap in the market for a truly transparent, UK-based platform that puts the community first.
                </p>
                <p>
                  Every raffle we host is a promise: a promise of a fair draw, a guaranteed winner, and a life-changing moment. We don't do extensions, and we don't do hidden terms. Just pure, skill-based competition.
                </p>
              </div>
              
              <StatsGrid>
                {[
                  { label: "Winners", value: "1,200+" },
                  { label: "Prizes Won", value: "£2.5M+" },
                  { label: "Community", value: "50k+" },
                  { label: "Trust Score", value: "4.9/5" },
                ].map((stat, i) => (
                  <StatCard key={i}>
                    <div className="value">{stat.value}</div>
                    <div className="label">{stat.label}</div>
                  </StatCard>
                ))}
              </StatsGrid>
            </GlassCard>

            <div className="grid gap-6 md:grid-cols-2">
              <GlassCard>
                <FeatureIcon>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355l-.39-.233A11.952 11.955 0 003.382 5.44M12 21.355l.39-.233A11.952 11.955 0 0020.618 5.44" />
                  </svg>
                </FeatureIcon>
                <h3 className="text-xl font-black uppercase tracking-tight text-charcoal-navy">UK Regulated</h3>
                <p className="mt-3 text-sm text-charcoal-navy/60 leading-relaxed">
                  Operating strictly under UK skill-based competition laws. Every draw is transparent and auditable.
                </p>
              </GlassCard>
              <GlassCard>
                <FeatureIcon>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </FeatureIcon>
                <h3 className="text-xl font-black uppercase tracking-tight text-charcoal-navy">Instant Wins</h3>
                <p className="mt-3 text-sm text-charcoal-navy/60 leading-relaxed">
                  Beyond our main draws, we offer instant win opportunities on select raffles for immediate excitement.
                </p>
              </GlassCard>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop"
                alt="Dragon Competitions Lifestyle"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-navy/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white font-black uppercase tracking-widest text-xs mb-2">Established 2024</p>
                <h3 className="text-2xl font-black text-white uppercase">The Dragon Standard</h3>
              </div>
            </div>
            
            <GlassCard className="bg-gradient-to-br from-[#e5531a] to-[#c43a12] !text-white border-none p-10 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-black uppercase tracking-tight text-white">Ready to Win?</h3>
                <p className="mt-4 text-white/90 text-lg font-medium">
                  Join thousands of happy winners and start your journey today.
                </p>
                <div className="mt-8">
                  <BrandLinkButton variant="secondary" size="lg" href="/raffles" className="!bg-white !text-[#e5531a] hover:!bg-[#f6f2ed]">
                    Explore Live Raffles
                  </BrandLinkButton>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-20 text-white">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
                </svg>
              </div>
            </GlassCard>
          </div>
        </ContentGrid>
      </Container>

      <div className="py-20 text-center">
        <Container>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-charcoal-navy/20">
            Dragon Competitions • UK Skill-Based Raffles
          </p>
        </Container>
      </div>
    </PageWrapper>
  );
}
