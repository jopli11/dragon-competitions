"use client";

import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandLinkButton } from "@/lib/styles";
import { useState, useEffect } from "react";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  color: #0a2540;
  height: 4.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 48, 135, 0.05);
  box-shadow: 0 2px 10px rgba(0, 48, 135, 0.03);

  @media (max-width: 768px) {
    height: 4rem;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 600;
  color: #0a2540;
  transition: color 0.2s;
  &:hover {
    color: #0070e0;
  }
`;

const HeaderButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 800;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  font-size: 0.8125rem;
  background: linear-gradient(135deg, #003087, #0070e0);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(0, 48, 135, 0.2);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 48, 135, 0.3);
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }
`;

const MobileMenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: white;
  z-index: 90;
  display: flex;
  flex-direction: column;
  padding: 6rem 2rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
`;

const MobileNavLink = styled(Link)`
  font-size: 1.5rem;
  font-weight: 900;
  color: #0a2540;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(0, 48, 135, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::after {
    content: "→";
    color: #0070e0;
    font-size: 1.25rem;
  }
`;

const HamburgerButton = styled.button<{ isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 101;

  @media (max-width: 768px) {
    display: flex;
  }

  div {
    width: 1.5rem;
    height: 2px;
    background: #0a2540;
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    &:first-of-type {
      transform: ${({ isOpen }) => (isOpen ? "rotate(45deg)" : "rotate(0)")};
    }

    &:nth-of-type(2) {
      opacity: ${({ isOpen }) => (isOpen ? "0" : "1")};
      transform: ${({ isOpen }) => (isOpen ? "translateX(20px)" : "translateX(0)")};
    }

    &:last-of-type {
      transform: ${({ isOpen }) => (isOpen ? "rotate(-45deg)" : "rotate(0)")};
    }
  }
`;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { href: "/raffles", label: "Current Competitions" },
    { href: "/results", label: "Draw Results" },
    { href: "/about", label: "About Us" },
    { href: "/winners", label: "Winners" },
  ];

  return (
    <>
      <HeaderWrapper>
        <Container className="flex w-full items-center justify-between">
          <Link href="/" className="group flex items-center gap-0" onClick={() => setIsOpen(false)}>
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Dragon Competitions"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col justify-center leading-[0.9] -ml-2 sm:-ml-4">
              <span className="text-xl sm:text-3xl font-black tracking-tighter uppercase text-brand-midnight">
                Dragon
              </span>
              <span className="text-[10px] sm:text-[14px] font-bold tracking-[0.15em] text-brand-secondary uppercase">
                Competitions
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-brand-midnight/80 transition-colors hover:text-brand-primary sm:block"
            >
              Login
            </Link>
            <HeaderButton href="/raffles">Enter Now</HeaderButton>
            <HamburgerButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <div />
              <div />
              <div />
            </HamburgerButton>
          </div>
        </Container>
      </HeaderWrapper>

      <MobileMenuOverlay isOpen={isOpen}>
        <div className="flex items-center gap-0 mb-12 px-2">
          <div className="relative h-24 w-24 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Dragon Competitions"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center leading-[0.9] -ml-4">
            <span className="text-4xl font-black tracking-tighter uppercase text-brand-midnight">
              Dragon
            </span>
            <span className="text-[16px] font-bold tracking-[0.15em] text-brand-secondary uppercase">
              Competitions
            </span>
          </div>
        </div>
        <nav className="flex flex-col">
          {navLinks.map((link) => (
            <MobileNavLink key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </MobileNavLink>
          ))}
          <MobileNavLink href="/login" onClick={() => setIsOpen(false)}>
            Login / Register
          </MobileNavLink>
        </nav>
        <div className="mt-auto">
          <BrandLinkButton fullWidth size="lg" href="/raffles" onClick={() => setIsOpen(false)}>
            View All Raffles
          </BrandLinkButton>
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-brand-midnight/20">
            18+ Only • BeGambleAware
          </p>
        </div>
      </MobileMenuOverlay>
    </>
  );
}
