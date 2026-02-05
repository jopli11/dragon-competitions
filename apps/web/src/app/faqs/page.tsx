import { Container } from "@/components/Container";

export default function FaqsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">FAQs</h1>
      <p className="mt-3 max-w-2xl text-sm text-foreground/70">
        Next: this page will be driven by Contentful (global FAQs + per-raffle
        FAQs).
      </p>
    </Container>
  );
}

