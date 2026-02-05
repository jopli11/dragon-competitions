"use client";

import styled from "@emotion/styled";
import { ComponentProps } from "react";

/**
 * Master Style Sheet - Reusable Brand Components
 */

export const BrandButton = styled.button<{
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  text-decoration: none;

  ${({ variant = "primary" }) => {
    if (variant === "primary") {
      return `
        background: linear-gradient(to right, #e5531a, #c43a12);
        color: white;
        border: none;
        box-shadow: 0 4px 15px rgba(229, 83, 26, 0.3);
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(229, 83, 26, 0.4);
        }
        &:active {
          transform: translateY(0);
        }
      `;
    }
    if (variant === "secondary") {
      return `
        background: #1f2a33;
        color: white;
        border: none;
        &:hover {
          background: #2c3a45;
        }
      `;
    }
    if (variant === "outline") {
      return `
        background: transparent;
        color: #1f2a33;
        border: 1px solid rgba(31, 42, 51, 0.1);
        &:hover {
          background: rgba(31, 42, 51, 0.05);
          border-color: rgba(31, 42, 51, 0.2);
        }
      `;
    }
  }}

  ${({ size = "md" }) => {
    if (size === "sm") return "padding: 0.5rem 1rem; font-size: 0.875rem;";
    if (size === "md") return "padding: 0.75rem 1.5rem; font-size: 0.875rem;";
    if (size === "lg") return "padding: 1rem 2rem; font-size: 1rem;";
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const BrandCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    background: #161616;
    border-color: rgba(255, 255, 255, 0.05);
  }
`;

export const BrandBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #e5531a;
  color: white;
`;

export const BrandSectionHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1f2a33;
  text-transform: uppercase;

  @media (prefers-color-scheme: dark) {
    color: #f6f2ed;
  }
`;
