"use client";

import { useState, useEffect } from "react";
import styled from "@emotion/styled";

const CountdownContainer = styled.div`
  background: linear-gradient(135deg, #003087 0%, #0070e0 100%);
  border-radius: 1.5rem;
  padding: 1rem 2.5rem;
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: -2.5rem;
  position: relative;
  z-index: 20;
  box-shadow: 0 15px 35px -8px rgba(0, 48, 135, 0.4);
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

export function HomeCountdown() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
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
