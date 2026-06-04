"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styled from "@emotion/styled";

const CountdownContainer = styled(Link)`
  background: linear-gradient(135deg, #0E7E8B 0%, #35B1AB 100%);
  border-radius: 1.5rem;
  padding: 1rem 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: -2.5rem;
  position: relative;
  z-index: 20;
  box-shadow: 0 15px 35px -8px rgba(14, 126, 139, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px -8px rgba(14, 126, 139, 0.5);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    gap: 0.5rem 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: -1.5rem;
    border-radius: 1rem;
    width: calc(100% - 2rem);
    max-width: 340px;
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

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
  .label {
    font-size: 0.625rem;
    font-weight: 800;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
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

export function HomeCountdown({
  endAt,
  title,
  slug,
}: {
  endAt?: string;
  title?: string;
  slug?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    if (!endAt) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endAt).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endAt]);

  const href = slug ? `/raffles/${slug}` : "/raffles";

  return (
    <div className="flex justify-center">
      <CountdownContainer className="group" href={href} aria-label={title ? `Ending soon: ${title}` : "View competitions ending soon"}>
        <CountdownItem>
          <span className="value">{mounted ? timeLeft.days : "--"}</span>
          <span className="label">Days</span>
        </CountdownItem>
        <CountdownDivider />
        <CountdownItem>
          <span className="value">{mounted ? String(timeLeft.hours).padStart(2, '0') : "--"}</span>
          <span className="label">Hours</span>
        </CountdownItem>
        <CountdownDivider />
        <CountdownItem>
          <span className="value">{mounted ? String(timeLeft.minutes).padStart(2, '0') : "--"}</span>
          <span className="label">Mins</span>
        </CountdownItem>
        <CountdownDivider />
        <CountdownItem>
          <span className="value">{mounted ? String(timeLeft.seconds).padStart(2, '0') : "--"}</span>
          <span className="label">Secs</span>
        </CountdownItem>

        {/* Name block — shown on mobile (full width below timers) and desktop (to the right). */}
        <div className="hidden h-10 w-px bg-white/10 sm:block" />
        <div className="flex w-full flex-col justify-center border-t border-white/15 pt-2 text-center sm:w-auto sm:max-w-50 sm:border-t-0 sm:pt-0 sm:text-left">
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.15em]">
            Ending Soon
          </span>
          <span className="flex items-center justify-center gap-1.5 text-sm font-black text-white uppercase leading-tight sm:justify-start">
            <span className="truncate underline decoration-white decoration-[2.5px] underline-offset-4 transition-all group-hover:decoration-[3px] group-hover:underline-offset-2">
              {title || "Live Competitions"}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            >
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </div>
      </CountdownContainer>
    </div>
  );
}
