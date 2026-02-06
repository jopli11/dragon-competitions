"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandButton, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { WinnersSection } from "@/components/WinnersSection";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { useState, useEffect } from "react";

const CountdownContainer = styled.div`
  background: linear-gradient(135deg, #1f2a33 0%, #11181d 100%);
  border-radius: 1.5rem;
  padding: 1rem 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: -2.5rem;
  position: relative;
  z-index: 20;
  box-shadow: 0 15px 35px -8px rgba(0, 0, 0, 0.5),
    0 0 15px rgba(229, 83, 26, 0.1);
  border: 1px solid rgba(229, 83, 26, 0.2);

  &::before {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: 1.6rem;
    background: linear-gradient(to right, #e5531a, #c43a12, transparent, transparent);
    z-index: -1;
    opacity: 0.4;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: -1.5rem;
    border-radius: 1rem;
    width: calc(100% - 2rem);
    max-width: 320px;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 2.5rem;

  @media (max-width: 768px) {
    min-width: 2rem;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 900;
    color: white;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 10px rgba(229, 83, 26, 0.2);

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
  .label {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #e5531a;
    letter-spacing: 0.1em;
    margin-top: 0.25rem;

    @media (max-width: 768px) {
      font-size: 0.5rem;
    }
  }
`;

const CountdownDivider = styled.div`
  height: 2rem;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent);
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  gap: 0.75rem;
  margin-top: 2rem;
  overflow-x: auto;
  padding: 0.5rem 1rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    overflow-x: visible;
    padding: 0;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s;
  background: ${({ active }) => (active ? "#1f2a33" : "white")};
  color: ${({ active }) => (active ? "white" : "#1f2a33")};
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);

  &:hover {
    background: ${({ active }) => (active ? "#1f2a33" : "#f9f9f9")};
    transform: translateY(-1px);
  }
`;

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f2ed]">
      <BrandHeroCarousel />

      <div className="flex justify-center">
        <CountdownContainer>
          <CountdownItem>
            <span className="value">{mounted ? "0" : "--"}</span>
            <span className="label">Days</span>
          </CountdownItem>
          <CountdownDivider />
          <CountdownItem>
            <span className="value">{mounted ? "12" : "--"}</span>
            <span className="label">Hours</span>
          </CountdownItem>
          <CountdownDivider />
          <CountdownItem>
            <span className="value">{mounted ? "34" : "--"}</span>
            <span className="label">Mins</span>
          </CountdownItem>
          <CountdownDivider />
          <CountdownItem>
            <span className="value">{mounted ? "08" : "--"}</span>
            <span className="label">Secs</span>
          </CountdownItem>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="hidden flex-col justify-center text-left sm:flex">
            <span className="text-[10px] font-black text-dragon-orange uppercase tracking-[0.15em]">
              Next Draw
            </span>
            <span className="text-sm font-black text-white uppercase leading-none">
              Ending Soon
            </span>
          </div>
        </CountdownContainer>
      </div>

      <div className="mt-6">
        <TrustpilotBadge />
      </div>

      <Container className="pt-6 pb-20">
        <div className="text-center">
          <BrandSectionHeading>Current Competitions</BrandSectionHeading>
          <CategoryFilter>
            <FilterButton active>View All</FilterButton>
            <FilterButton>Auto Draw</FilterButton>
            <FilterButton>Instant Wins</FilterButton>
            <FilterButton>Car & Bike</FilterButton>
            <FilterButton>Tax Free Cash</FilterButton>
            <FilterButton>Tech & Watch</FilterButton>
            <FilterButton className="!bg-dragon-orange !text-white !border-none">
              Ending Soon
            </FilterButton>
          </CategoryFilter>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          {/* Placeholder Raffle Cards */}
          {[
            {
              title: "Tesla Model S",
              price: "18p",
              sold: "200,008 / 699,999",
              ends: "28th April",
              img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "£15,000 Tax Free Cash",
              price: "18p",
              sold: "410 / 350,000",
              ends: "1st May",
              img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "PS5 Bundle",
              price: "18p",
              sold: "249,566 / 699,996",
              ends: "29th April",
              img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "£15,000 Tax Free Cash",
              price: "18p",
              sold: "840 / 380,000",
              ends: "23rd May",
              img: "https://images.unsplash.com/photo-1518458028434-541f00c6bfa0?q=80&w=800&auto=format&fit=crop",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute top-3 left-3 z-10 rounded-lg bg-dragon-orange/90 px-2 py-1 text-[10px] font-bold text-white uppercase">
                  Entries Open
                </div>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold tracking-tight text-charcoal-navy">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-charcoal-navy/40 uppercase">
                  <span>{item.sold}</span>
                  <span>Ends: {item.ends}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full bg-dragon-orange"
                    style={{ width: "30%" }}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs font-bold text-charcoal-navy/60 uppercase tracking-widest">
                    Just <span className="text-dragon-orange">{item.price}</span> per entry
                  </p>
                  <BrandButton fullWidth className="mt-4">
                    Enter Now
                  </BrandButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <HowItWorks />
      <WinnersSection />
    </div>
  );
}
