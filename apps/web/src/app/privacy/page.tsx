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

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Privacy <GradientText>Policy</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: February 5, 2026
          </p>
        </div>

        <Content>
          <GlassCard className="!p-10 !sm:p-16">
            <p className="text-lg font-bold text-brand-midnight">
              Your privacy is important to us. This policy explains how we collect and use your data.
            </p>
            
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes your name, email address, phone number, and payment information.
            </p>

            <h2>2. How We Use Your Data</h2>
            <p>
              We use your data to process your entries, notify you of draw results, and improve our services. We may also use your email to send you marketing communications, which you can opt out of at any time.
            </p>

            <h2>3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. Your payment details are processed securely through Stripe and are never stored on our servers.
            </p>

            <h2>4. Third-Party Sharing</h2>
            <p>
              We do not sell your personal data. We only share information with trusted third-party service providers (like Stripe and Postmark) necessary to operate our platform.
            </p>

            <h2>5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information at any time. Please contact our support team if you wish to exercise these rights.
            </p>
          </GlassCard>
        </Content>
      </Container>
    </PageWrapper>
  );
}
