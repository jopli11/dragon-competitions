"use client";

"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandButton } from "@/lib/styles";

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #1f2a33;
  color: white;
  height: 4.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
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
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  background: linear-gradient(to right, #e5531a, #c43a12);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(229, 83, 26, 0.3);
  text-decoration: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(229, 83, 26, 0.4);
    color: white;
  }
`;

export function SiteHeader() {
  return (
    <HeaderWrapper>
      <Container className="flex w-full items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
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

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink href="/raffles">Current Competitions</NavLink>
          <NavLink href="/results">Draw Results</NavLink>
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/winners">Winners</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:block"
          >
            Login
          </Link>
          <HeaderButton href="/raffles">Enter Now</HeaderButton>
        </div>
      </Container>
    </HeaderWrapper>
  );
}

