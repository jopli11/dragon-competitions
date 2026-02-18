"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";
import { Container } from "./Container";

const CarouselWrapper = styled.section`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #0a0a0a;
  overflow: hidden;
  
  @media (min-width: 768px) {
    aspect-ratio: 21/9;
  }
`;

const SlideContainer = styled.div<{ active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ active }) => (active ? 1 : 0)};
  visibility: ${({ active }) => (active ? "visible" : "hidden")};
  transition: opacity 0.5s ease-in-out;
`;

const SlideLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 10;
`;

const SlideContent = styled.div`
  position: absolute;
  bottom: 10%;
  left: 0;
  right: 0;
  z-index: 20;
  color: white;
  text-align: center;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 30;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: ${({ active }) => (active ? "#0070e0" : "rgba(255, 255, 255, 0.3)")};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ active }) => (active ? "#0070e0" : "rgba(255, 255, 255, 0.5)")};
  }
`;

interface Slide {
  id: string;
  image: string;
  link: string;
  title: string;
}

const MOCK_SLIDES: Slide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2000&auto=format&fit=crop",
    link: "/raffles/win-20000-cash",
    title: "Win £20,000 Tax Free Cash",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2000&auto=format&fit=crop",
    link: "/raffles/tesla-model-s",
    title: "Tesla Model S Plaid",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=2000&auto=format&fit=crop",
    link: "/raffles/ps5-bundle",
    title: "PS5 Ultimate Bundle",
  },
];

export function BrandHeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % MOCK_SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <CarouselWrapper>
      {MOCK_SLIDES.map((slide, index) => (
        <SlideContainer key={slide.id} active={index === current}>
          <SlideLink href={slide.link}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
            <Overlay />
            <SlideContent>
              <Container>
                <h2 className="text-xl font-black uppercase tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl px-4">
                  {slide.title}
                </h2>
              </Container>
            </SlideContent>
          </SlideLink>
        </SlideContainer>
      ))}
      
      <Controls>
        {MOCK_SLIDES.map((_, index) => (
          <Dot
            key={index}
            active={index === current}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Controls>
    </CarouselWrapper>
  );
}
