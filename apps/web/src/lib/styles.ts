"use client";

import styled from "@emotion/styled";
import { ComponentProps } from "react";
import Link from "next/link";
import isPropValid from "@emotion/is-prop-valid";

/**
 * Master Style Sheet - Reusable Brand Components
 */

const ignoredProps = ["variant", "size", "fullWidth"];

export const BrandButton = styled("button", {
  shouldForwardProp: (prop) => isPropValid(prop) && !ignoredProps.includes(prop),
})<{
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  text-decoration: none;
  position: relative;
  overflow: hidden;
  border: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover::after {
    opacity: 0.1;
  }

  ${({ variant = "primary" }) => {
    if (variant === "primary") {
      return `
        background: linear-gradient(135deg, #003087 0%, #0070e0 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(0, 48, 135, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 48, 135, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
          color: white;
        }
        &:active {
          transform: translateY(0);
        }
      `;
    }
    if (variant === "secondary") {
      return `
        background: #0a2540;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        &:hover {
          background: #113355;
          transform: translateY(-1px);
          color: white;
        }
      `;
    }
    if (variant === "outline") {
      return `
        background: transparent;
        color: #003087;
        border: 2px solid rgba(0, 48, 135, 0.1);
        &:hover {
          background: rgba(0, 48, 135, 0.03);
          border-color: rgba(0, 48, 135, 0.3);
          transform: translateY(-1px);
        }
      `;
    }
  }}

  ${({ size = "md" }) => {
    if (size === "sm") return "padding: 0.625rem 1.25rem; font-size: 0.75rem;";
    if (size === "md") return "padding: 0.875rem 1.75rem; font-size: 0.875rem;";
    if (size === "lg") return "padding: 1.125rem 2.25rem; font-size: 1rem;";
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

export const BrandLinkButton = styled(Link, {
  shouldForwardProp: (prop) => isPropValid(prop) && !ignoredProps.includes(prop),
})<{
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "auto")};
  text-decoration: none;
  position: relative;
  overflow: hidden;
  border: none;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &:hover::after {
    opacity: 0.1;
  }

  ${({ variant = "primary" }) => {
    if (variant === "primary") {
      return `
        background: linear-gradient(135deg, #003087 0%, #0070e0 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(0, 48, 135, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 48, 135, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.2);
          color: white;
        }
        &:active {
          transform: translateY(0);
        }
      `;
    }
    if (variant === "secondary") {
      return `
        background: #0a2540;
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        &:hover {
          background: #113355;
          transform: translateY(-1px);
          color: white;
        }
      `;
    }
    if (variant === "outline") {
      return `
        background: transparent;
        color: #003087;
        border: 2px solid rgba(0, 48, 135, 0.1);
        &:hover {
          background: rgba(0, 48, 135, 0.03);
          border-color: rgba(0, 48, 135, 0.3);
          transform: translateY(-1px);
        }
      `;
    }
  }}

  ${({ size = "md" }) => {
    if (size === "sm") return "padding: 0.625rem 1.25rem; font-size: 0.75rem;";
    if (size === "md") return "padding: 0.875rem 1.75rem; font-size: 0.875rem;";
    if (size === "lg") return "padding: 1.125rem 2.25rem; font-size: 1rem;";
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
  border-radius: 2rem;
  border: 1px solid rgba(0, 48, 135, 0.08);
  box-shadow: 0 10px 30px -5px rgba(0, 48, 135, 0.05);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: 0 20px 40px -10px rgba(0, 48, 135, 0.12);
    border-color: rgba(0, 112, 224, 0.2);
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
  background: #0070e0;
  color: white;
`;

export const BrandSectionHeading = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0a2540;
  text-transform: uppercase;
`;

export const GlassCard = styled.div`
  background: white;
  border-radius: 2rem;
  border: 1px solid rgba(0, 48, 135, 0.05);
  box-shadow: 0 10px 30px rgba(0, 48, 135, 0.03);
  padding: 2rem;
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, #003087 0%, #0070e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
`;
