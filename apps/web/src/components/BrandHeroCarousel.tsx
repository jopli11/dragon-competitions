"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";

const CarouselWrapper = styled.section`
  position: relative;
  width: 100%;
  background: #f3fbf8;
  overflow: hidden;
`;

const BackdropContainer = styled.div<{ active: boolean }>`
  position: absolute;
  inset: 0;
  opacity: ${({ active }) => (active ? 1 : 0)};
  visibility: ${({ active }) => (active ? "visible" : "hidden")};
  transition: opacity 0.5s ease-in-out;

  &::after {
    position: absolute;
    inset: 0;
    content: "";
    background: rgba(243, 251, 248, 0.72);
  }
`;

const CarouselFrame = styled.div`
  position: relative;
  width: min(100%, 1280px);
  margin-inline: auto;
  aspect-ratio: 16/9;
  background: #f3fbf8;
  overflow: hidden;
  z-index: 1;
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

const Controls = styled.div`
  position: absolute;
  bottom: clamp(3.75rem, 5vw, 5rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  align-items: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.72);
  padding: 0.35rem 0.55rem;
  box-shadow: 0 8px 24px rgba(14, 126, 139, 0.16);
  z-index: 30;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: ${({ active }) => (active ? "#0E7E8B" : "rgba(14, 126, 139, 0.28)")};
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  
  &:hover {
    background: ${({ active }) => (active ? "#0E7E8B" : "rgba(53, 177, 171, 0.6)")};
  }

  &:focus-visible {
    outline: 2px solid #35B1AB;
    outline-offset: 3px;
  }
`;

interface Slide {
  id: string;
  image: string;
  link: string;
  title: string;
}

interface BrandHeroCarouselProps {
  slides: Slide[];
}

export function BrandHeroCarousel({ slides }: BrandHeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  return (
    <CarouselWrapper>
      {slides.map((slide, index) => (
        <BackdropContainer key={`${slide.id}-backdrop`} active={index === current} aria-hidden="true">
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="100vw"
            className="scale-105 object-cover blur-xl"
          />
        </BackdropContainer>
      ))}

      <CarouselFrame>
        {slides.map((slide, index) => (
          <SlideContainer key={slide.id} active={index === current}>
            <SlideLink href={slide.link}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover"
              />
            </SlideLink>
          </SlideContainer>
        ))}
        
        {slides.length > 1 && (
          <Controls>
            {slides.map((_, index) => (
              <Dot
                key={index}
                active={index === current}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </Controls>
        )}
      </CarouselFrame>
    </CarouselWrapper>
  );
}
