"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { SocialLinks } from "@/components/SocialLinks";
import styled from "@emotion/styled";

const BRAND_LOGO_SRC = "/coast_competitions_hi_res-removebg-preview.png";

const FooterWrapper = styled.footer`
  background: #232F3E;
  color: white;
  padding-top: 4rem;
  padding-bottom: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
  transition: color 0.2s;
  &:hover {
    color: #35B1AB;
  }
`;

export function SiteFooter() {
  return (
    <FooterWrapper>
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="inline-flex rounded-2xl bg-white p-2">
              <div className="relative h-16 w-60 overflow-hidden">
                <Image
                  src={BRAND_LOGO_SRC}
                  alt="Coast Competitions"
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              Family run UK skill-based prize competitions with exciting prizes,
              fair and transparent draws, and a commitment to giving back to
              coastal communities.
            </p>
            <div className="mt-8">
              <h3 className="text-xs font-bold tracking-widest text-white uppercase">
                We Accept
              </h3>
              <div className="mt-4">
                <PaymentMethodBadges compact />
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-white/35">
                Secure checkout with major cards, Google Pay, and Apple Pay.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Quick Links
            </h3>
            <nav className="mt-6 flex flex-col gap-3">
              <FooterLink href="/raffles">Current Competitions</FooterLink>
              <FooterLink href="/results">Draw Results</FooterLink>
              <FooterLink href="/winners">Winners</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Support
            </h3>
            <nav className="mt-6 flex flex-col gap-3">
              <FooterLink href="/faqs">FAQs</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
              <FooterLink href="/refunds">Refund Policy</FooterLink>
              <FooterLink href="/responsible-gaming">Responsible Gaming</FooterLink>
            </nav>
            <SocialLinks className="mt-8" />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-8 md:flex-row">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Coast Competitions. All rights reserved.
            </p>
            <p className="text-[10px] leading-relaxed text-white/20 uppercase tracking-wider">
              COAST COMPETITIONS LTD (Company No. 17087259)<br />
              Registered Office: 33 Seaview Drive, Ogmore-By-Sea, Bridgend, Wales, CF32 0PB
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/responsible-gaming" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">
              18+ Only
            </Link>
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">
              BeGambleAware
            </a>
          </div>
        </div>
      </Container>
    </FooterWrapper>
  );
}
