"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandLinkButton } from "@/lib/styles";
import { useState, useEffect } from "react";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #1f2a33;
  color: white;
  height: 4.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    height: 4rem;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.2s;
  &:hover {
    color: white;
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
  background: linear-gradient(135deg, #e5531a, #c43a12);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(229, 83, 26, 0.3);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.02em;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(229, 83, 26, 0.4);
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
  background: #1f2a33;
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
  color: white;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;

  &::after {
    content: "→";
    color: #e5531a;
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
    background: white;
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
          <Link href="/" className="group flex items-center gap-2 sm:gap-3" onClick={() => setIsOpen(false)}>
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-dragon-orange to-dragon-red shadow-lg">
              <span className="text-base sm:text-lg font-bold text-white">D</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base sm:text-lg font-bold tracking-tight uppercase">
                Dragon
              </span>
              <span className="text-[8px] sm:text-[10px] font-medium tracking-[0.2em] text-dragon-orange uppercase">
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
              className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:block"
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
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-white/20">
            18+ Only • BeGambleAware
          </p>
        </div>
      </MobileMenuOverlay>
    </>
  );
}
