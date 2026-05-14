import Link from "next/link";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SocialLinks } from "@/components/SocialLinks";
import {
  JsonLd,
  buildArticleSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
  SITE_URL,
  type FaqItem,
} from "@/lib/seo/json-ld";
import { type GuideMeta, getRelatedGuides } from "@/lib/seo/guides-data";
import { GuideFaqAccordion } from "./GuideFaqAccordion";

export type GuideKeyTakeaway = {
  label: string;
  value: string;
};

type GuideLayoutProps = {
  guide: GuideMeta;
  intro: React.ReactNode;
  keyTakeaways: GuideKeyTakeaway[];
  body: React.ReactNode;
  faqs: FaqItem[];
  disclaimer?: React.ReactNode;
};

export function GuideLayout({
  guide,
  intro,
  keyTakeaways,
  body,
  faqs,
  disclaimer,
}: GuideLayoutProps) {
  const url = `/guides/${guide.slug}`;
  const absoluteUrl = `${SITE_URL}${url}`;
  const relatedGuides = getRelatedGuides(guide.slug);

  return (
    <article className="min-h-screen bg-white">
      <JsonLd
        id={`schema-guide-webpage-${guide.slug}`}
        schema={buildWebPageSchema({
          url,
          name: guide.metaTitle,
          description: guide.metaDescription,
          breadcrumbId: `${absoluteUrl}#breadcrumb`,
        })}
      />
      <JsonLd
        id={`schema-guide-article-${guide.slug}`}
        schema={buildArticleSchema({
          url,
          headline: guide.title,
          description: guide.metaDescription,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
          articleSection: guide.articleSection,
          keywords: guide.keywords,
        })}
      />
      <JsonLd
        id={`schema-guide-faqpage-${guide.slug}`}
        schema={buildFaqPageSchema(faqs, url)}
      />

      <section className="relative overflow-hidden bg-brand-midnight text-white">
        <div className="absolute inset-0 z-0 opacity-40" aria-hidden>
          <div className="absolute top-1/4 left-[15%] h-[40%] w-[40%] rounded-full bg-brand-secondary/15 blur-[120px]" />
          <div className="absolute bottom-1/4 right-[15%] h-[40%] w-[40%] rounded-full bg-brand-primary/10 blur-[120px]" />
        </div>
        <Container className="relative z-10 py-20 sm:py-28">
          <Breadcrumbs
            variant="dark"
            items={[
              { label: "Guides", href: "/guides" },
              { label: guide.shortTitle, href: url },
            ]}
            className="mb-10"
          />
          <p className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
            Coast Competitions Guide · {guide.articleSection}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase tracking-tighter leading-tight sm:text-5xl md:text-6xl">
            {guide.title}
          </h1>
          <div className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 font-medium">
            {intro}
          </div>
          <p className="mt-10 text-[10px] font-bold uppercase tracking-widest text-white/40">
            Last updated {formatDate(guide.dateModified)} · Written by Coast Competitions
          </p>
        </Container>
      </section>

      {keyTakeaways.length > 0 ? (
        <section className="bg-surface-mint py-12 sm:py-16">
          <Container>
            <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-xl sm:p-12">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-brand-secondary">
                Key Takeaways
              </h2>
              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                {keyTakeaways.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-brand-accent/40 p-5"
                  >
                    <dt className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm font-medium leading-relaxed text-brand-midnight">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>
      ) : null}

      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="prose prose-lg max-w-none text-brand-midnight/80 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-brand-midnight [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-midnight [&_p]:mb-5 [&_p]:leading-relaxed [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol>li]:mb-2 [&_a]:font-bold [&_a]:text-brand-primary [&_a:hover]:underline">
            {body}

            <div className="mt-16">
              <h2>Frequently Asked Questions</h2>
              <GuideFaqAccordion faqs={faqs} />
            </div>

            {disclaimer ? (
              <div className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-50 p-6 text-sm leading-relaxed text-amber-900">
                <p className="font-black uppercase tracking-widest text-amber-700 text-xs mb-3">
                  Disclaimer
                </p>
                {disclaimer}
              </div>
            ) : null}
          </div>

          <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl bg-linear-to-br from-brand-primary to-brand-secondary p-8 text-white shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                Ready to enter?
              </p>
              <h3 className="mt-3 text-2xl font-black uppercase tracking-tight">
                Browse live competitions
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/75">
                Coast Competitions runs UK skill-based prize draws with
                guaranteed winners and no extensions. Free postal entry route
                available on every competition.
              </p>
              <Link
                href="/raffles"
                title="View live Coast Competitions UK prize competitions"
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-xs font-black uppercase tracking-widest text-brand-primary transition-colors hover:bg-brand-accent"
              >
                View live competitions
              </Link>
            </div>

            {relatedGuides.length > 0 ? (
              <div className="rounded-3xl border border-brand-primary/10 bg-white p-8 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary">
                  Related guides
                </p>
                <ul className="mt-6 space-y-4">
                  {relatedGuides.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/guides/${related.slug}`}
                        title={related.metaDescription}
                        className="group block"
                      >
                        <p className="text-sm font-black uppercase tracking-tight text-brand-midnight transition-colors group-hover:text-brand-primary">
                          {related.title}
                        </p>
                        <p className="mt-1 text-xs font-medium leading-snug text-brand-midnight/55">
                          {related.summary}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-3xl border border-brand-primary/10 bg-brand-accent/30 p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-secondary">
                Follow the journey
              </p>
              <p className="mt-3 text-sm font-medium leading-relaxed text-brand-midnight/70">
                We post every live draw on social. Follow Coast Competitions to
                catch winners in real time.
              </p>
              <SocialLinks
                className="mt-6"
                iconClassName="w-4 h-4"
                wrapperClassName="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-secondary transition-colors hover:bg-brand-secondary hover:text-white"
              />
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
