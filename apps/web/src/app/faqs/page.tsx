import { Container } from "@/components/Container";
import { GradientText, BrandSectionHeading, BrandLinkButton } from "@/lib/styles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  JsonLd,
  buildFaqPageSchema,
  buildWebPageSchema,
  SITE_URL,
} from "@/lib/seo/json-ld";
import { FAQ_CATEGORIES } from "@/lib/seo/faq-data";
import { FaqsAccordion } from "./FaqsAccordion";

export default function FaqsPage() {
  const flatFaqs = FAQ_CATEGORIES.flatMap((category) => category.items);

  return (
    <div className="min-h-screen bg-white pt-16 pb-32">
      <JsonLd
        id="schema-faqs-webpage"
        schema={buildWebPageSchema({
          url: "/faqs",
          name: "FAQs · Coast Competitions UK Prize Competitions",
          description:
            "Answers to common questions about Coast Competitions: how UK skill-based prize competitions work, ticket entry, draws, winners, and whether competition winnings are tax free.",
          breadcrumbId: `${SITE_URL}/faqs#breadcrumb`,
        })}
      />
      <JsonLd id="schema-faqs-faqpage" schema={buildFaqPageSchema(flatFaqs)} />
      <Container>
        <Breadcrumbs
          items={[{ label: "FAQs", href: "/faqs" }]}
          className="mb-8"
        />
        <div className="text-center mb-12">
          <BrandSectionHeading>Frequently Asked <GradientText>Questions</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Everything you need to know about winning with Coast.
          </p>
        </div>

        <FaqsAccordion categories={FAQ_CATEGORIES} />

        <div className="mt-20 rounded-4xl text-center bg-linear-to-br from-brand-primary to-brand-secondary p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Still have questions?</h3>
            <p className="mt-4 text-white/60 font-medium">
              Our support team is always here to help you.
            </p>
            <div className="mt-8">
              <BrandLinkButton variant="secondary" size="lg" href="/contact" className="bg-white! text-brand-primary! hover:bg-brand-accent!">
                Contact Support
              </BrandLinkButton>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
            </svg>
          </div>
        </div>
      </Container>
    </div>
  );
}
