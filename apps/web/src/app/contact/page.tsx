import { Container } from "@/components/Container";

export default function ContactPage() {
  return (
    <Container className="py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-2xl text-sm text-foreground/70">
        Email us at{" "}
        <a className="text-foreground hover:underline" href="mailto:support@dragoncompetitions.co.uk">
          support@dragoncompetitions.co.uk
        </a>
        .
      </p>
    </Container>
  );
}

