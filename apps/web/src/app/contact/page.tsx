"use client";

import styled from "@emotion/styled";
import { Container } from "@/components/Container";
import { GlassCard, GradientText, BrandSectionHeading, BrandButton } from "@/lib/styles";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f6f2ed;
  padding: 4rem 0 8rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  margin-top: 4rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1f2a33;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(31, 42, 51, 0.02);
  font-size: 1rem;
  font-weight: 500;
  color: #1f2a33;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e5531a;
    background: white;
    box-shadow: 0 0 0 4px rgba(229, 83, 26, 0.05);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(31, 42, 51, 0.02);
  font-size: 1rem;
  font-weight: 500;
  color: #1f2a33;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #e5531a;
    background: white;
    box-shadow: 0 0 0 4px rgba(229, 83, 26, 0.05);
  }
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1.25rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e5531a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.02);

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const InfoContent = styled.div`
  .title {
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(31, 42, 51, 0.4);
    margin-bottom: 0.25rem;
  }
  .value {
    font-size: 1.125rem;
    font-weight: 800;
    color: #1f2a33;
  }
  .link {
    color: #e5531a;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function ContactPage() {
  return (
    <PageWrapper>
      <Container>
        <div className="text-center mb-12">
          <BrandSectionHeading>Get in <GradientText>Touch</GradientText></BrandSectionHeading>
          <p className="mt-4 text-charcoal-navy/60 font-medium uppercase tracking-widest text-sm">
            Have a question or need help? We're here for you.
          </p>
        </div>

        <ContactGrid>
          <GlassCard className="!p-10">
            <h2 className="text-2xl font-black uppercase tracking-tight text-charcoal-navy mb-8">
              Send us a <GradientText>Message</GradientText>
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField>
                  <Label htmlFor="name">Full Name</Label>
                  <Input type="text" id="name" placeholder="John Doe" />
                </FormField>
                <FormField>
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" placeholder="john@example.com" />
                </FormField>
              </div>
              <FormField>
                <Label htmlFor="subject">Subject</Label>
                <Input type="text" id="subject" placeholder="How can we help?" />
              </FormField>
              <FormField>
                <Label htmlFor="message">Message</Label>
                <TextArea id="message" placeholder="Your message here..." />
              </FormField>
              <BrandButton type="submit" size="lg" fullWidth className="mt-4">
                Send Message
              </BrandButton>
            </form>
          </GlassCard>

          <div className="space-y-8">
            <div className="space-y-6">
              <InfoItem>
                <IconWrapper>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </IconWrapper>
                <InfoContent>
                  <div className="title">Email Us</div>
                  <div className="value">
                    <a href="mailto:support@dragoncompetitions.co.uk" className="link">
                      support@dragoncompetitions.co.uk
                    </a>
                  </div>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <IconWrapper>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-12 0 9 9 0 0112 0z" />
                  </svg>
                </IconWrapper>
                <InfoContent>
                  <div className="title">Support Hours</div>
                  <div className="value text-charcoal-navy/80">Mon - Fri: 9am - 6pm</div>
                  <div className="text-sm font-medium text-charcoal-navy/40">Sat - Sun: 10am - 4pm</div>
                </InfoContent>
              </InfoItem>

              <InfoItem>
                <IconWrapper>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </IconWrapper>
                <InfoContent>
                  <div className="title">Location</div>
                  <div className="value text-charcoal-navy/80">United Kingdom</div>
                  <div className="text-sm font-medium text-charcoal-navy/40">Registered Business</div>
                </InfoContent>
              </InfoItem>
            </div>

            <div className="rounded-[2rem] bg-gradient-to-br from-[#1f2a33] to-[#11181d] p-8 !text-white border border-white/5 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">Follow the Dragon</h3>
                <p className="mt-4 text-white/60 text-sm font-medium leading-relaxed">
                  Join our community on social media for live draws, exclusive offers, and winner announcements.
                </p>
                <div className="mt-6 flex gap-4">
                  {/* Social Icons */}
                  {[
                    { name: "Facebook", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 11.127 8.812 13.22v-9.357H5.445v-3.863h3.367V9.121c0-3.322 2.022-5.14 4.99-5.14 1.42 0 2.905.254 2.905.254v3.193h-1.636c-1.647 0-2.16 1.023-2.16 2.071v2.488h3.6l-.576 3.863h-3.024v9.357C20.344 23.2 24 18.062 24 12.073z"/>
                      </svg>
                    )},
                    { name: "Instagram", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.774 4.919 4.851.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.075-1.664 4.703-4.919 4.85-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.775-4.919-4.851-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.075 1.664-4.704 4.919-4.85 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-5.838 2.435-5.838 5.838s2.435 5.838 5.838 5.838 5.838-2.435 5.838-5.838-2.435-5.838-5.838-5.838zm0 9.513c-2.03 0-3.675-1.645-3.675-3.675 0-2.03 1.645-3.675 3.675-3.675 2.03 0 3.675 1.645 3.675 3.675 0 2.03-1.645 3.675-3.675 3.675zm4.961-11.461c.73 0 1.322.592 1.322 1.322 0 .73-.592 1.322-1.322 1.322-.73 0-1.322-.592-1.322-1.322 0-.73.592-1.322 1.322-1.322z"/>
                      </svg>
                    )},
                    { name: "Twitter", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.95 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.923 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )},
                  ].map((social) => (
                    <div key={social.name} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#e5531a] transition-colors cursor-pointer border border-white/5" title={social.name}>
                      {social.icon}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 opacity-10 text-white">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
                </svg>
              </div>
            </div>
          </div>
        </ContactGrid>
      </Container>
    </PageWrapper>
  );
}
