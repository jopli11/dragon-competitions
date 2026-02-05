"use client";

import Link from "next/link";
import { AnimatedIn } from "@/components/AnimatedIn";
import { Container } from "@/components/Container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60 dark:border-white/10">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
            DC
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Dragon Competitions
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-foreground/80 md:flex">
          <Link className="hover:text-foreground" href="/raffles">
            Raffles
          </Link>
          <Link className="hover:text-foreground" href="/faqs">
            FAQs
          </Link>
          <Link className="hover:text-foreground" href="/contact">
            Contact
          </Link>
        </nav>

        <AnimatedIn delay={0.05}>
          <Link
            href="/raffles"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            View raffles
          </Link>
        </AnimatedIn>
      </Container>
    </header>
  );
}

