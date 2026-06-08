"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { PaymentMethodBadges } from "@/components/PaymentMethodBadges";
import { SocialLinks } from "@/components/SocialLinks";
import { TrustpilotScore } from "@/components/TrustpilotScore";
import type { TrustpilotSummary } from "@/lib/trustpilot";
import { GUIDES } from "@/lib/seo/guides-data";
import styled from "@emotion/styled";

const BRAND_LOGO_SRC = "/coast_competitions_hi_res-removebg-preview.png";

const QUICK_LINKS: { href: string; label: string; title: string }[] = [
  {
    href: "/raffles",
    label: "Current Competitions",
    title: "Browse live UK prize competitions on Coast Competitions",
  },
  {
    href: "/results",
    label: "Draw Results",
    title: "View verifiable draw results from past Coast Competitions",
  },
  {
    href: "/winners",
    label: "Winners",
    title: "Meet Coast Competitions UK prize winners",
  },
  {
    href: "/about",
    label: "About Us",
    title: "About Coast Competitions, a family-run UK prize competition company",
  },
];

const GUIDE_LINKS: { href: string; label: string; title: string }[] = [
  {
    href: "/guides",
    label: "All Guides",
    title: "Browse all Coast Competitions UK prize competition guides",
  },
  ...GUIDES.map((guide) => ({
    href: `/guides/${guide.slug}`,
    label: guide.shortTitle,
    title: guide.metaDescription,
  })),
];

const SUPPORT_LINKS: { href: string; label: string; title: string }[] = [
  {
    href: "/faqs",
    label: "FAQs",
    title: "Frequently asked questions about UK prize competitions and Coast Competitions",
  },
  {
    href: "/contact",
    label: "Contact Us",
    title: "Contact the Coast Competitions UK support team",
  },
  {
    href: "/partners",
    label: "For Business",
    title: "Partner with Coast Competitions on a UK prize competition",
  },
  {
    href: "/terms",
    label: "Terms & Conditions",
    title: "Coast Competitions Terms and Conditions, including free postal entry",
  },
  {
    href: "/privacy",
    label: "Privacy Policy",
    title: "Coast Competitions Privacy Policy",
  },
  {
    href: "/cookies",
    label: "Cookie Policy",
    title: "Coast Competitions Cookie Policy",
  },
  {
    href: "/refunds",
    label: "Refund Policy",
    title: "Coast Competitions Refund Policy",
  },
  {
    href: "/responsible-gaming",
    label: "Responsible Gaming",
    title: "Responsible gaming information for UK competition entrants",
  },
];

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

export function SiteFooter({
  trustpilot,
}: {
  trustpilot?: TrustpilotSummary | null;
}) {
  const pathname = usePathname();

  // The /links hub is a standalone QR-code landing — render no chrome.
  if (pathname === "/links") return null;

  return (
    <FooterWrapper>
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex rounded-2xl bg-white p-2"
              title="Coast Competitions home — UK skill-based prize competitions"
            >
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
            {trustpilot ? (
              <div className="mt-8">
                <h3 className="text-xs font-bold tracking-widest text-white uppercase">
                  Rated on Trustpilot
                </h3>
                <div className="mt-3">
                  <TrustpilotScore data={trustpilot} variant="dark" />
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Quick Links
            </h3>
            <nav className="mt-6 flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href} title={link.title}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Guides
            </h3>
            <nav className="mt-6 flex flex-col gap-3">
              {GUIDE_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href} title={link.title}>
                  {link.label}
                </FooterLink>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest text-white uppercase">
              Support
            </h3>
            <nav className="mt-6 flex flex-col gap-3">
              {SUPPORT_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href} title={link.title}>
                  {link.label}
                </FooterLink>
              ))}
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
            <Link
              href="/responsible-gaming"
              className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
              title="Coast Competitions responsible gaming information for UK entrants"
            >
              18+ Only
            </Link>
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors"
              title="BeGambleAware — independent UK gambling support charity"
            >
              BeGambleAware
            </a>
          </div>
        </div>
      </Container>
    </FooterWrapper>
  );
}
