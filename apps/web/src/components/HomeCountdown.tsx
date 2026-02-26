"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";

const CountdownContainer = styled.div`
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

export function HomeCountdown({ endAt }: { endAt?: string }) {
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

  return (
    <div className="flex justify-center">
      <CountdownContainer>
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
        <div className="hidden h-10 w-px bg-white/10 sm:block" />
        <div className="hidden flex-col justify-center text-left sm:flex">
          <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.15em]">
            Next Draw
          </span>
          <span className="text-sm font-black text-white uppercase leading-none">
            Ending Soon
          </span>
        </div>
      </CountdownContainer>
    </div>
  );
}
