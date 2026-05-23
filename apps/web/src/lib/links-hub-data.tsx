import type { ReactNode } from "react";

export type LinkHubEntry = {
  id: string;
  href: string;
  label: string;
  description: string;
  title: string;
  icon: ReactNode;
  /**
   * When true the link is rendered as the headline call-to-action with the
   * brand gradient background. Only one entry should be marked featured.
   */
  featured?: boolean;
  /**
   * Marks an external destination so the link opens in a new tab with the
   * appropriate `rel` attribute.
   */
  external?: boolean;
};

/**
 * Server-safe link config powering the public `/links` hub page (the
 * LinkTree-style QR-code landing). Keep this list intentionally short so
 * it scans cleanly on a phone after a QR scan.
 */
export const LINK_HUB_ENTRIES: LinkHubEntry[] = [
  {
    id: "current-competitions",
    href: "/raffles",
    label: "Enter a Competition",
    description: "See every live prize draw on Coast Competitions",
    title: "Browse live UK prize competitions on Coast Competitions",
    featured: true,
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="M6 4h12v3a6 6 0 0 1-12 0Z" />
        <path d="M6 5H3v2a3 3 0 0 0 3 3" />
        <path d="M18 5h3v2a3 3 0 0 1-3 3" />
        <path d="M9 20h6" />
        <path d="M12 14v6" />
      </svg>
    ),
  },
  {
    id: "home",
    href: "/",
    label: "Visit Our Website",
    description: "Explore the Coast Competitions homepage",
    title: "Coast Competitions UK — skill-based prize competitions",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" />
        <path d="M10 20v-6h4v6" />
      </svg>
    ),
  },
  {
    id: "winners",
    href: "/winners",
    label: "Meet Our Winners",
    description: "Real people, real prizes, real winning moments",
    title: "Meet Coast Competitions UK prize winners",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="M12 3 9.5 8.5 3.5 9.4l4.3 4.2L6.8 19.5 12 16.8l5.2 2.7-1-5.9 4.3-4.2-6-.9Z" />
      </svg>
    ),
  },
  {
    id: "results",
    href: "/results",
    label: "Draw Results",
    description: "See verifiable results from every past draw",
    title: "View verifiable Coast Competitions draw results",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    ),
  },
  {
    id: "about",
    href: "/about",
    label: "About Coast",
    description: "Our story, our values and our coastal mission",
    title: "About Coast Competitions, a family-run UK prize competition company",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8h.01" />
        <path d="M11 12h1v4h1" />
      </svg>
    ),
  },
  {
    id: "contact",
    href: "/contact",
    label: "Get in Touch",
    description: "Questions? The Coast team is here to help",
    title: "Contact the Coast Competitions UK support team",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    id: "partners",
    href: "/partners",
    label: "Partner With Us",
    description: "Run a campaign with Coast — for local businesses",
    title: "Partner with Coast Competitions on a UK prize competition",
    icon: (
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        className="h-full w-full"
        aria-hidden
      >
        <path d="M3 8h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
        <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        <path d="M3 13h18" />
      </svg>
    ),
  },
];
