"use client";

import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandSectionHeading, GradientText, GlassCard } from "@/lib/styles";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: white;
  padding: 4rem 0 8rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 4rem auto 0;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #0a2540;
    margin-top: 3rem;
    margin-bottom: 1.5rem;
    letter-spacing: -0.01em;
  }
  
  p {
    color: rgba(10, 37, 64, 0.7);
    line-height: 1.8;
    margin-bottom: 1.5rem;
    font-weight: 500;
  }
  
  ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin-bottom: 1.5rem;
    color: rgba(10, 37, 64, 0.7);
    
    li {
      margin-bottom: 0.75rem;
    }
  }
`;

export default function TermsPage() {
  return (
    <PageWrapper>
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Terms & <GradientText>Conditions</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: February 5, 2026
          </p>
        </div>

        <Content>
          <GlassCard className="!p-10 !sm:p-16">
            <p className="text-lg font-bold text-brand-midnight">
              Please read these terms and conditions carefully before using our platform.
            </p>
            
            <h2>1. Introduction</h2>
            <p>
              These terms and conditions govern your use of Dragon Competitions. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.
            </p>

            <h2>2. Eligibility</h2>
            <p>
              To enter any competition on Dragon Competitions, you must:
            </p>
            <ul>
              <li>Be a resident of the United Kingdom.</li>
              <li>Be aged 18 years or older.</li>
              <li>Have a valid account and payment method.</li>
            </ul>

            <h2>3. Skill-Based Entry</h2>
            <p>
              All competitions hosted on this platform are skill-based. To be entered into a draw, you must correctly answer a qualifying question. Failure to answer correctly will result in an invalid entry without a refund.
            </p>

            <h2>4. Draw Transparency</h2>
            <p>
              We are committed to 100% transparency. All draws are conducted using a certified random number generator and are broadcast live on our social media platforms.
            </p>

            <h2>5. No Extensions Policy</h2>
            <p>
              Dragon Competitions operates a strict "No Extensions" policy. Every competition will close and the draw will take place on the specified date, regardless of the number of tickets sold.
            </p>
          </GlassCard>
        </Content>
      </Container>
    </PageWrapper>
  );
}
