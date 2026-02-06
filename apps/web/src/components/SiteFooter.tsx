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
            <div className="mt-8 flex gap-4">
              {[
                { name: "Facebook", icon: (
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 11.127 8.812 13.22v-9.357H5.445v-3.863h3.367V9.121c0-3.322 2.022-5.14 4.99-5.14 1.42 0 2.905.254 2.905.254v3.193h-1.636c-1.647 0-2.16 1.023-2.16 2.071v2.488h3.6l-.576 3.863h-3.024v9.357C20.344 23.2 24 18.062 24 12.073z"/>
                  </svg>
                )},
                { name: "Instagram", icon: (
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.774 4.919 4.851.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.075-1.664 4.703-4.919 4.85-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.775-4.919-4.851-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.075 1.664-4.704 4.919-4.85 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-5.838 2.435-5.838 5.838s2.435 5.838 5.838 5.838 5.838-2.435 5.838-5.838-2.435-5.838-5.838-5.838zm0 9.513c-2.03 0-3.675-1.645-3.675-3.675 0-2.03 1.645-3.675 3.675-3.675 2.03 0 3.675 1.645 3.675 3.675 0 2.03-1.645 3.675-3.675 3.675zm4.961-11.461c.73 0 1.322.592 1.322 1.322 0 .73-.592 1.322-1.322 1.322-.73 0-1.322-.592-1.322-1.322 0-.73.592-1.322 1.322-1.322z"/>
                  </svg>
                )},
                { name: "Twitter", icon: (
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.95 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.923 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                )},
              ].map((social) => (
                <div key={social.name} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#e5531a] transition-colors cursor-pointer border border-white/5" title={social.name}>
                  {social.icon}
                </div>
              ))}
            </div>
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
