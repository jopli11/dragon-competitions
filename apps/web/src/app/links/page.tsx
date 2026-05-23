import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LINK_HUB_ENTRIES } from "@/lib/links-hub-data";
import { SocialLinks } from "@/components/SocialLinks";
import { JsonLd, buildWebPageSchema } from "@/lib/seo/json-ld";

const BRAND_LOGO_SRC = "/coast_competitions_hi_res-removebg-preview.png";

export const metadata: Metadata = {
  title: "Coast Competitions Links · Website, Competitions & Socials",
  description:
    "All Coast Competitions UK links in one place — our website, live prize competitions, draw results, winners, guides, and our social channels.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: "Coast Competitions · Links Hub",
    description:
      "Every Coast Competitions link in one place — competitions, results, winners, socials and more.",
    url: "/links",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LinksHubPage() {
  const featured = LINK_HUB_ENTRIES.find((entry) => entry.featured);
  const secondary = LINK_HUB_ENTRIES.filter((entry) => !entry.featured);

  return (
    <div className="relative min-h-screen overflow-hidden bg-brand-midnight text-white">
      <JsonLd
        id="schema-links-webpage"
        schema={buildWebPageSchema({
          url: "/links",
          name: "Coast Competitions · Links Hub",
          description:
            "All Coast Competitions UK links in one place — website, live prize competitions, draw results, winners and our social channels.",
        })}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 left-1/2 h-112 w-md -translate-x-1/2 rounded-full bg-brand-secondary/25 blur-[140px]" />
        <div className="absolute top-1/3 -right-32 h-88 w-88 rounded-full bg-brand-primary/20 blur-[140px]" />
        <div className="absolute bottom-0 -left-24 h-88 w-88 rounded-full bg-brand-secondary/10 blur-[140px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 pt-12 pb-16 sm:max-w-lg sm:pt-16">
        <Link
          href="/"
          className="inline-flex rounded-3xl bg-white p-3 shadow-2xl ring-1 ring-white/20 transition-transform duration-300 hover:scale-[1.02]"
          title="Coast Competitions home — UK skill-based prize competitions"
        >
          <div className="relative h-20 w-56 overflow-hidden sm:h-24 sm:w-64">
            <Image
              src={BRAND_LOGO_SRC}
              alt="Coast Competitions"
              fill
              priority
              sizes="(min-width: 640px) 256px, 224px"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Coast Competitions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            Family-run, UK skill-based prize competitions. Pick a link below
            and dive in.
          </p>
        </div>

        {featured ? (
          <Link
            href={featured.href}
            title={featured.title}
            className="group mt-10 flex w-full items-center gap-4 rounded-2xl bg-linear-to-br from-brand-primary to-brand-secondary p-5 shadow-[0_18px_40px_-12px_rgba(53,177,171,0.55)] ring-1 ring-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-12px_rgba(53,177,171,0.75)]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 p-2.5 text-white ring-1 ring-white/25 backdrop-blur">
              {featured.icon}
            </span>
            <span className="flex-1 text-left">
              <span className="block text-base font-black uppercase tracking-wide text-white">
                {featured.label}
              </span>
              <span className="mt-1 block text-xs font-medium text-white/75 sm:text-sm">
                {featured.description}
              </span>
            </span>
            <ChevronIcon className="h-5 w-5 shrink-0 text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : null}

        <nav
          className="mt-4 flex w-full flex-col gap-3"
          aria-label="Coast Competitions links"
        >
          {secondary.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              title={entry.title}
              target={entry.external ? "_blank" : undefined}
              rel={entry.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-secondary/60 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 p-2.5 text-brand-secondary ring-1 ring-white/10 transition-colors duration-300 group-hover:bg-brand-secondary group-hover:text-white">
                {entry.icon}
              </span>
              <span className="flex-1 text-left">
                <span className="block text-sm font-bold uppercase tracking-wide text-white">
                  {entry.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-white/55">
                  {entry.description}
                </span>
              </span>
              <ChevronIcon className="h-4 w-4 shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-secondary" />
            </Link>
          ))}
        </nav>

        <div className="mt-12 flex flex-col items-center gap-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
            Follow Us
          </span>
          <SocialLinks
            wrapperClassName="w-11 h-11 rounded-full bg-white/8 flex items-center justify-center hover:bg-brand-secondary transition-colors cursor-pointer border border-white/10"
            iconClassName="w-4 h-4"
            gapClassName="gap-3"
          />
        </div>

        <p className="mt-12 text-center text-[10px] leading-relaxed uppercase tracking-[0.25em] text-white/30">
          © {new Date().getFullYear()} Coast Competitions UK
          <br />
          18+ · Play Responsibly · BeGambleAware.org
        </p>
      </section>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
