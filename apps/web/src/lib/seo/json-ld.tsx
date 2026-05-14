import { SOCIAL_LINKS } from "@/lib/socials";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.coastcompetitions.com"
).replace(/\/+$/, "");

// Stable @id anchors used to cross-reference entities across pages.
// Schema.org consumers (Google, Bing, ChatGPT, Perplexity) follow these
// references to build a single knowledge graph for the whole site.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

const LOGO_PATH = "/coast_competitions_hi_res-removebg-preview.png";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

type RaffleProductInput = {
  title: string;
  slug: string;
  description?: string;
  heroImageUrl?: string;
  endAt: string;
  effectivePricePence: number;
  isAwaitingDraw: boolean;
  isEnded: boolean;
  isSoldOut: boolean;
};

type ItemListInput = {
  slug: string;
  title: string;
}[];

type WebPageInput = {
  url: string;
  name: string;
  description?: string;
  breadcrumbId?: string;
};

function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Coast Competitions",
    legalName: "COAST COMPETITIONS LTD",
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      "@id": LOGO_ID,
      url: absoluteUrl(LOGO_PATH),
      contentUrl: absoluteUrl(LOGO_PATH),
    },
    image: { "@id": LOGO_ID },
    email: "mailto:coastcompetitionsuk@gmail.com",
    description:
      "Family-run UK skill-based prize competitions with tax-free cash, luxury cars, and tech prizes. Transparent live draws, guaranteed winners, no extensions.",
    foundingDate: "2025",
    knowsAbout: [
      "UK prize competitions",
      "skill-based competitions",
      "online raffles",
      "win cash prizes",
      "guaranteed draw competitions",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "33 Seaview Drive",
      addressLocality: "Ogmore-By-Sea",
      addressRegion: "Bridgend",
      postalCode: "CF32 0PB",
      addressCountry: "GB",
    },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    identifier: {
      "@type": "PropertyValue",
      propertyID: "UK Companies House Number",
      value: "17087259",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "mailto:coastcompetitionsuk@gmail.com",
        url: `${SITE_URL}/contact`,
        availableLanguage: "en-GB",
        areaServed: "GB",
        hoursAvailable: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday", "Sunday"],
            opens: "10:00",
            closes: "16:00",
          },
        ],
      },
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "Coast Competitions",
    description:
      "UK skill-based prize competitions with tax-free cash, luxury cars, and tech prizes.",
    inLanguage: "en-GB",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/raffles?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildWebPageSchema({
  url,
  name,
  description,
  breadcrumbId,
}: WebPageInput) {
  const absolute = absoluteUrl(url);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${absolute}#webpage`,
    url: absolute,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    inLanguage: "en-GB",
    primaryImageOfPage: { "@id": LOGO_ID },
    ...(breadcrumbId ? { breadcrumb: { "@id": breadcrumbId } } : {}),
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const pageUrl = items[items.length - 1]?.href
    ? absoluteUrl(items[items.length - 1].href!)
    : `${SITE_URL}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function buildFaqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faqs#faqpage`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildItemListSchema(items: ItemListInput) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: items.length,
    itemListElement: items.map((raffle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/raffles/${raffle.slug}`,
      name: raffle.title,
    })),
  };
}

export function buildProductSchema(raffle: RaffleProductInput) {
  const productUrl = `${SITE_URL}/raffles/${raffle.slug}`;
  const productId = `${productUrl}#product`;
  const eventId = `${productUrl}#draw`;

  const availability = raffle.isEnded
    ? "https://schema.org/Discontinued"
    : raffle.isSoldOut || raffle.isAwaitingDraw
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

  const eventStatus = raffle.isEnded
    ? "https://schema.org/EventCompleted"
    : "https://schema.org/EventScheduled";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": productId,
        name: raffle.title,
        description:
          raffle.description ||
          `Win ${raffle.title} with Coast Competitions — a UK skill-based prize competition with a guaranteed draw and no extensions.`,
        sku: raffle.slug,
        url: productUrl,
        ...(raffle.heroImageUrl ? { image: raffle.heroImageUrl } : {}),
        brand: { "@id": ORGANIZATION_ID },
        category: "UK prize competition",
        subjectOf: { "@id": eventId },
        offers: {
          "@type": "Offer",
          "@id": `${productUrl}#offer`,
          url: productUrl,
          price: (raffle.effectivePricePence / 100).toFixed(2),
          priceCurrency: "GBP",
          priceValidUntil: raffle.endAt,
          availability,
          seller: { "@id": ORGANIZATION_ID },
          itemCondition: "https://schema.org/NewCondition",
          areaServed: { "@type": "Country", name: "United Kingdom" },
          eligibleRegion: { "@type": "Country", name: "United Kingdom" },
        },
      },
      {
        "@type": "Event",
        "@id": eventId,
        name: `${raffle.title} — Live Draw`,
        description: `Live prize draw for ${raffle.title} on Coast Competitions.`,
        startDate: raffle.endAt,
        endDate: raffle.endAt,
        eventStatus,
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: productUrl,
        },
        organizer: { "@id": ORGANIZATION_ID },
        offers: { "@id": `${productUrl}#offer` },
        ...(raffle.heroImageUrl ? { image: raffle.heroImageUrl } : {}),
      },
    ],
  };
}

type JsonLdProps = {
  schema: unknown;
  id: string;
};

// Renders a single JSON-LD script tag. The stable `id` prevents React from
// double-mounting the script during hydration if the same schema is included
// in both the server and client trees.
export function JsonLd({ schema, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
