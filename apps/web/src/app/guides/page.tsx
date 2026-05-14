import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import {
  JsonLd,
  buildWebPageSchema,
  SITE_URL,
} from "@/lib/seo/json-ld";
import { GUIDES } from "@/lib/seo/guides-data";

const PAGE_TITLE = "UK Prize Competition Guides";
const PAGE_DESCRIPTION =
  "Plain-English guides to UK prize competitions and online raffles: the law, the tax position, how draws work, and how to win cash prizes online legally and safely.";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} · Coast Competitions`,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/guides" },
  openGraph: {
    title: `${PAGE_TITLE} · Coast Competitions`,
    description: PAGE_DESCRIPTION,
    url: "/guides",
    type: "website",
  },
};

export default function GuidesHubPage() {
  const url = "/guides";

  const collectionPageSchema = {
    ...buildWebPageSchema({
      url,
      name: `${PAGE_TITLE} · Coast Competitions`,
      description: PAGE_DESCRIPTION,
      breadcrumbId: `${SITE_URL}${url}#breadcrumb`,
    }),
    "@type": ["WebPage", "CollectionPage"],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}${url}#guides-list`,
    numberOfItems: GUIDES.length,
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/guides/${guide.slug}`,
      name: guide.title,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd id="schema-guides-hub-webpage" schema={collectionPageSchema} />
      <JsonLd id="schema-guides-hub-itemlist" schema={itemListSchema} />

      <section className="relative overflow-hidden bg-brand-midnight text-white">
        <div className="absolute inset-0 z-0 opacity-40" aria-hidden>
          <div className="absolute top-1/4 left-[15%] h-[40%] w-[40%] rounded-full bg-brand-secondary/15 blur-[120px]" />
          <div className="absolute bottom-1/4 right-[15%] h-[40%] w-[40%] rounded-full bg-brand-primary/10 blur-[120px]" />
        </div>
        <Container className="relative z-10 py-20 sm:py-28">
          <Breadcrumbs
            variant="dark"
            items={[{ label: "Guides", href: url }]}
            className="mb-10"
          />
          <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
            Knowledge Base
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tighter leading-tight sm:text-5xl md:text-6xl">
            UK Prize Competition <GradientText>Guides</GradientText>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-medium leading-relaxed text-white/75">
            {PAGE_DESCRIPTION}
          </p>
        </Container>
      </section>

      <Container className="py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <BrandSectionHeading>
            All <GradientText>Guides</GradientText>
          </BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Everything you need to enter UK prize competitions with confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              title={guide.metaDescription}
              className="group flex flex-col rounded-3xl border border-brand-primary/5 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-secondary/20 hover:shadow-xl"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary">
                {guide.articleSection}
              </span>
              <h2 className="mt-4 text-xl font-black uppercase tracking-tight leading-tight text-brand-midnight transition-colors group-hover:text-brand-primary">
                {guide.title}
              </h2>
              <p className="mt-4 flex-1 text-sm font-medium leading-relaxed text-brand-midnight/60">
                {guide.summary}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-primary">
                Read guide
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
