"use client";

import Link from "next/link";
import { Container } from "@/components/Container";
import styled from "@emotion/styled";
import { BrandButton, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";

const CountdownContainer = styled.div`
  background: #1f2a33;
  border-radius: 2rem;
  padding: 1.5rem 3rem;
  display: inline-flex;
  gap: 2rem;
  margin-top: -2rem;
  position: relative;
  z-index: 20;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 640px) {
    padding: 1rem 1.5rem;
    gap: 1rem;
  }
`;

const CountdownItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .value {
    font-size: 1.5rem;
    font-weight: 800;
    color: white;
  }
  .label {
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.1em;
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 4rem;
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
  return (
    <div className="min-h-screen bg-[#f6f2ed]">
      <BrandHeroCarousel />

      <div className="flex justify-center">
        <CountdownContainer>
          <CountdownItem>
            <span className="value">0</span>
            <span className="label">Days</span>
          </CountdownItem>
          <CountdownItem>
            <span className="value">12</span>
            <span className="label">Hours</span>
          </CountdownItem>
          <CountdownItem>
            <span className="value">34</span>
            <span className="label">Mins</span>
          </CountdownItem>
          <CountdownItem>
            <span className="value">08</span>
            <span className="label">Secs</span>
          </CountdownItem>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div className="hidden flex-col justify-center text-left sm:flex">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
              Until the next
            </span>
            <span className="text-xs font-bold text-white uppercase">
              Competition Ends
            </span>
          </div>
        </CountdownContainer>
      </div>

      <Container className="py-20">
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

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#161616]"
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
                <h3 className="text-lg font-bold tracking-tight text-charcoal-navy dark:text-white">
                  {item.title}
                </h3>
                <div className="mt-2 flex items-center justify-between text-[11px] font-bold text-charcoal-navy/40 uppercase dark:text-white/40">
                  <span>{item.sold}</span>
                  <span>Ends: {item.ends}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <div
                    className="h-full bg-dragon-orange"
                    style={{ width: "30%" }}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-xs font-bold text-charcoal-navy/60 uppercase tracking-widest dark:text-white/60">
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
    </div>
  );
}
