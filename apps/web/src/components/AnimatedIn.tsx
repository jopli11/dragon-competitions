"use client";

import { type ReactNode } from "react";

interface AnimatedInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * A wrapper component that previously handled animations.
 * Now simplified to a static container as per requirements.
 */
export function AnimatedIn({
  children,
  className = "",
}: AnimatedInProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
