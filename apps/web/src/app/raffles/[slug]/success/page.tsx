import Link from "next/link";
import { Container } from "@/components/Container";
import { AnimatedIn } from "@/components/AnimatedIn";

export default function SuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Container className="py-20 text-center">
      <AnimatedIn>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Payment Successful!
        </h1>
        <p className="mt-3 text-sm text-foreground/70">
          Your tickets have been reserved. You will receive a confirmation email
          shortly with your ticket numbers.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            href="/raffles"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-8 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Browse more raffles
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-foreground/60 hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </AnimatedIn>
    </Container>
  );
}
