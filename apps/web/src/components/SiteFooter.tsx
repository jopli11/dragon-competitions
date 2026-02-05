"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";

const FooterWrapper = styled.footer`
  background: #1f2a33;
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
    color: #e5531a;
  }
`;

export function SiteFooter() {
  return (
    <FooterWrapper>
      <Container>
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dragon-orange to-dragon-red shadow-lg">
                <span className="text-lg font-bold text-white">D</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold tracking-tight uppercase">
                  Dragon
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-dragon-orange uppercase">
                  Competitions
                </span>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              UK skill-based competition raffles. Win epic prizes with
              transparent draws and fast entry. Join thousands of winners today.
            </p>
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
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Dragon Competitions. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-white/20 uppercase">
              18+ Only
            </span>
            <span className="text-[10px] font-bold text-white/20 uppercase">
              BeGambleAware
            </span>
          </div>
        </div>
      </Container>
    </FooterWrapper>
  );
}
