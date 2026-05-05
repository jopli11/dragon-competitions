"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";

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
            <Link href="/" className="flex items-center gap-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Coast Competitions"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center leading-[0.8] -ml-2 sm:-ml-4">
                <span className="text-[1.65rem] sm:text-[2.35rem] font-bold leading-none tracking-widest text-white">
                  coast
                </span>
                <span className="text-[7px] sm:text-[10px] font-black tracking-[0.22em] uppercase text-white mt-1 ml-0.5">
                  Competitions
                </span>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              Family run UK skill-based prize competitions with exciting prizes,
              fair and transparent draws, and a commitment to giving back to
              coastal communities.
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
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
              <FooterLink href="/refunds">Refund Policy</FooterLink>
              <FooterLink href="/responsible-gaming">Responsible Gaming</FooterLink>
            </nav>
            <div className="mt-8 flex gap-4">
              {[
                { name: "Instagram", href: "https://www.instagram.com/coast.competitions", icon: (
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.774 4.919 4.851.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.075-1.664 4.703-4.919 4.85-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.775-4.919-4.851-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.075 1.664-4.704 4.919-4.85 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-5.838 2.435-5.838 5.838s2.435 5.838 5.838 5.838 5.838-2.435 5.838-5.838-2.435-5.838-5.838-5.838zm0 9.513c-2.03 0-3.675-1.645-3.675-3.675 0-2.03 1.645-3.675 3.675-3.675 2.03 0 3.675 1.645 3.675 3.675 0 2.03-1.645 3.675-3.675 3.675zm4.961-11.461c.73 0 1.322.592 1.322 1.322 0 .73-.592 1.322-1.322 1.322-.73 0-1.322-.592-1.322-1.322 0-.73.592-1.322 1.322-1.322z"/>
                  </svg>
                )},
                { name: "TikTok", href: "https://www.tiktok.com/@coastcompetitions", icon: (
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                )},
              ].map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-secondary transition-colors cursor-pointer border border-white/5" title={social.name}>
                  {social.icon}
                </a>
              ))}
            </div>
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
