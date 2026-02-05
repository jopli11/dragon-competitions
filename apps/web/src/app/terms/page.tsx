import { Container } from "@/components/Container";

export default function TermsPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Terms</h1>
      <p className="mt-3 max-w-2xl text-sm text-foreground/70">
        Next: render legal copy from Contentful and add per-raffle terms.
      </p>
    </Container>
  );
}

