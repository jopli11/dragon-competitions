"use client";

import { motion, type MotionProps } from "framer-motion";
import { type ReactNode } from "react";

export function AnimatedIn({
  children,
  className,
  delay = 0,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
} & MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

