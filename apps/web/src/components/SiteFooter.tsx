import Link from "next/link";
import { Container } from "@/components/Container";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-black/5 py-12 text-sm text-foreground/70 dark:border-white/10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-foreground/80">
            © {new Date().getFullYear()} Dragon Competitions
          </p>
          <p>
            Need help?{" "}
            <a className="text-foreground hover:underline" href="mailto:support@dragoncompetitions.co.uk">
              support@dragoncompetitions.co.uk
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link className="hover:text-foreground hover:underline" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-foreground hover:underline" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground hover:underline" href="/faqs">
            FAQs
          </Link>
        </div>
      </Container>
    </footer>
  );
}

