"use client";

import { Container } from "@/components/Container";
import { BrandButton, BrandLinkButton, BrandSectionHeading, GradientText } from "@/lib/styles";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center bg-white py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-coral/10 mb-8">
            <svg className="h-10 w-10 text-brand-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <BrandSectionHeading className="text-brand-midnight!">
            Something went <GradientText>wrong</GradientText>
          </BrandSectionHeading>
          
          <p className="mt-6 text-lg font-medium text-brand-midnight/60 leading-relaxed">
            We encountered an unexpected error. Our team has been notified and we&apos;re working to fix it.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BrandButton onClick={() => reset()} size="lg" className="min-w-[200px]">
              Try Again
            </BrandButton>
            <BrandLinkButton href="/" variant="outline" size="lg" className="min-w-[200px]">
              Back to Home
            </BrandLinkButton>
          </div>
          
          {process.env.NODE_ENV === "development" && (
            <div className="mt-12 rounded-2xl bg-brand-accent/30 p-6 text-left overflow-auto">
              <p className="text-xs font-black uppercase tracking-widest text-brand-midnight/40 mb-2">Error Details (Dev Only)</p>
              <code className="text-sm text-brand-coral font-mono">{error.message}</code>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
