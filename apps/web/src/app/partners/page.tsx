import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { GradientText } from "@/lib/styles";
import { PartnerEnquiryForm } from "./PartnerEnquiryForm";

export const metadata: Metadata = {
  title: "Collaborate with Coast Competitions | For Local Businesses",
  description:
    "Run a giveaway or ticketed prize campaign with Coast Competitions. We offer local businesses a fresh marketing route that combines community engagement, social media exposure, and professionally run prize campaigns.",
  openGraph: {
    title: "Collaborate with Coast Competitions",
    description:
      "A fresh marketing route for local businesses. Free giveaways and ticketed prize campaigns, professionally run.",
  },
  alternates: { canonical: "/partners" },
};

const PROOF_POINTS = [
  {
    title: "Reach new local customers",
    body: "Giveaway-style campaigns consistently outperform standard promotional posts on likes, shares and comments — bringing fresh local eyes to your brand.",
  },
  {
    title: "Turn a product into content",
    body: "We treat your prize as a story. Polished campaign tiles and social content make your product something people want to interact with and share.",
  },
  {
    title: "Drive spending behaviour",
    body: "Research from Northwestern's Medill Spiegel Research Center found social media contest participation was associated with increased spending in the weeks after engagement.",
  },
];

const TRUST_CRITERIA = [
  "Good fit with our audience",
  "Suitable prize value or product type",
  "Clear promotional potential",
  "A campaign that benefits both sides",
  "A professional collaboration that reflects well on the business",
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Enquire",
    body: "Send us a few details about your business and prize. We'll come back to you quickly.",
  },
  {
    step: "02",
    title: "Review",
    body: "We assess fit, suitability, and the right collaboration route — free giveaway or ticketed.",
  },
  {
    step: "03",
    title: "Launch",
    body: "We build the campaign tile, promote it across our platform and socials, and run the draw.",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Hero */}
      <section className="bg-brand-midnight text-white py-32 sm:py-48 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-[20%] w-[40%] h-[40%] bg-brand-secondary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-[20%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-linear-to-t from-white to-transparent z-10" />

        <Container className="relative z-20">
          <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-secondary mb-6 block">
            For Business
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
            Collaborate with <GradientText>Coast</GradientText>
          </h1>
          <p className="mt-10 text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            A fresh marketing route for local businesses — combining community
            engagement, social media exposure, and professionally run prize
            campaigns.
          </p>
        </Container>
      </section>

      {/* Why collaborate */}
      <Container className="relative z-30 -mt-24 sm:-mt-32 pb-24">
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-brand-primary/5 shadow-2xl p-10 sm:p-20">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-midnight">
            Why collaborate with <GradientText>Coast Competitions</GradientText>
          </h2>
          <div className="mt-10 space-y-8 text-brand-midnight/70 text-lg sm:text-xl leading-relaxed font-medium">
            <p>
              At Coast Competitions, we provide local businesses with a fresh
              marketing route that combines community engagement, social media
              exposure, and professionally run prize campaigns.
            </p>
            <p>
              We work with businesses that want to reach local people in a way
              that feels exciting, shareable, and beneficial. Whether you want
              to promote a product, build awareness, or create buzz around your
              business, our platform gives you a new way to connect with your
              audience.
            </p>
            <p>
              We&apos;ve already completed a collaboration with{" "}
              <strong className="text-brand-midnight">Bont Golf</strong>, and
              we&apos;re continuing to build trusted partnerships with local
              businesses who want to benefit from our growing platform.
            </p>
          </div>
        </div>
      </Container>

      {/* Recent collaboration: Bont Golf */}
      <Container className="pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
          {/* Co-branded campaign hero */}
          <div className="relative overflow-hidden rounded-4xl border border-brand-primary/5 shadow-2xl bg-white flex items-center justify-center">
            <Image
              src="/bont/coast-bont-golf-bundle.png"
              alt="Coast Competitions x Bont Golf — Win a Titleist Pro V1 and Bont Golf bundle"
              width={1024}
              height={576}
              className="w-full h-auto block"
              priority={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <div className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/95 text-brand-secondary shadow-sm">
              Recent Collaboration
            </div>
          </div>

          {/* Text card — stretches to match hero height on desktop */}
          <div className="rounded-4xl border border-brand-primary/5 bg-white p-8 sm:p-10 shadow-xl flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-secondary">
              Bont Golf · Bridgend, UK
            </p>
            <h3 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight">
              A ticketed prize campaign that worked for both sides
            </h3>
            <p className="mt-4 text-brand-midnight/65 font-medium leading-relaxed">
              We partnered with Bont Golf — a UK golf apparel brand based in
              Bridgend — to launch a ticketed campaign featuring a Titleist
              Pro V1 prize bundle alongside Bont Golf kit. The first 100
              entries went free, driving early engagement and exposing Bont
              to a new local audience right at launch.
            </p>
            <div className="mt-6 lg:mt-auto pt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-accent text-brand-secondary border border-brand-secondary/10">
                Ticketed
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-accent text-brand-secondary border border-brand-secondary/10">
                Free-entry tier
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-accent text-brand-secondary border border-brand-secondary/10">
                Co-branded creative
              </span>
            </div>
          </div>
        </div>

        {/* Brand image strip — full width gallery below */}
        <div className="mt-6 lg:mt-8 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              src: "/bont/bont-lifestyle-polo.jpg",
              alt: "Bont Golf signature polo shirt",
            },
            {
              src: "/bont/bont-hybrid-gilet-studio.jpg",
              alt: "Bont Golf hybrid gilet — navy",
            },
            {
              src: "/bont/bont-course-lifestyle.jpg",
              alt: "Bont Golf apparel on the course",
            },
          ].map((img) => (
            <div
              key={img.src}
              className="relative aspect-4/5 overflow-hidden rounded-2xl border border-brand-primary/5 bg-brand-accent/40 shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 33vw, 33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </Container>

      {/* How it works — two routes */}
      <Container className="pb-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
            Two collaboration routes
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-midnight">
            How it <GradientText>works</GradientText>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-brand-midnight/60 text-lg leading-relaxed font-medium">
            We offer two routes, depending on the type of business, prize, and
            campaign. We&apos;ll help you pick the right one.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Free giveaway */}
          <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-accent text-brand-secondary border border-brand-secondary/10">
              Route 1
            </span>
            <h3 className="mt-6 text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight">
              Free prize giveaways
            </h3>
            <p className="mt-4 text-brand-midnight/65 leading-relaxed font-medium">
              For smaller cost prizes and suitable promotional items, we may
              offer a no-cost collaboration. Ideal for local businesses that
              want to:
            </p>
            <ul className="mt-6 space-y-3 text-brand-midnight/70 font-medium">
              {[
                "Gain exposure in the local area",
                "Reach new potential customers",
                "Create social media hype and engagement",
                "Be featured in shared promotional content",
                "Support a community-focused campaign with no upfront fee",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-brand-secondary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-midnight/40">
              Criteria applies
            </p>
          </div>

          {/* Ticketed */}
          <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20">
              Route 2
            </span>
            <h3 className="mt-6 text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight">
              Ticketed prize campaigns
            </h3>
            <p className="mt-4 text-brand-midnight/65 leading-relaxed font-medium">
              For established businesses, higher-value prizes, or products
              where a paid route is more suitable. The prize is promoted
              through ticket sales, so the product is eventually paid for
              while still creating strong promotional value. Well suited to
              businesses that want:
            </p>
            <ul className="mt-6 space-y-3 text-brand-midnight/70 font-medium">
              {[
                "Paid exposure alongside promotion",
                "A wider reach across local audiences",
                "More commercial return from a prize or product",
                "A campaign that generates attention while supporting sales",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-brand-secondary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-xs font-bold uppercase tracking-widest text-brand-midnight/40">
              Criteria applies
            </p>
          </div>
        </div>
      </Container>

      {/* Why businesses choose giveaways */}
      <section className="bg-brand-accent/40 py-24">
        <Container>
          <div className="text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
              The case for giveaways
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-midnight">
              Why businesses choose <GradientText>giveaways</GradientText>
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-brand-midnight/60 text-lg leading-relaxed font-medium">
              Research-backed marketing evidence consistently shows that
              giveaway-style campaigns can increase engagement, improve reach,
              and encourage more likes, comments, shares, and tags than
              standard promotional posts. Social engagement is one of the
              fastest ways to expand visibility online.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {PROOF_POINTS.map((p) => (
              <div
                key={p.title}
                className="bg-white rounded-4xl p-8 border border-brand-primary/5 shadow-sm"
              >
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">
                  {p.title}
                </h3>
                <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process: Enquire → Review → Launch */}
      <Container className="py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
            From enquiry to launch
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-midnight">
            A simple <GradientText>three-step</GradientText> process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white rounded-4xl p-10 border border-brand-primary/5 shadow-xl"
            >
              <span className="text-5xl font-black text-brand-secondary/30 leading-none">
                {step.step}
              </span>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-brand-midnight">
                {step.title}
              </h3>
              <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Trust and suitability */}
      <section className="bg-brand-midnight text-white py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 sm:gap-20 items-start">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
                Trust and suitability
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Quality <GradientText>matters</GradientText>
              </h2>
              <p className="mt-6 text-white/70 text-lg leading-relaxed font-medium">
                We only work with businesses and prizes that meet our
                criteria. This approach helps us protect the quality of the
                platform while making sure every business receives a
                worthwhile opportunity.
              </p>
            </div>
            <div className="bg-white/5 rounded-[2.5rem] p-10 border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-secondary mb-6">
                What we look for
              </p>
              <ul className="space-y-4 text-white/80 font-medium text-lg">
                {TRUST_CRITERIA.map((c) => (
                  <li key={c} className="flex gap-4">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-brand-secondary shrink-0 mt-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Enquiry form */}
      <div id="enquire">
      <Container className="py-24">
        <div className="text-center mb-16">
          <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
            Let&apos;s explore it
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-midnight">
            Interested in <GradientText>collaborating?</GradientText>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-brand-midnight/60 text-lg leading-relaxed font-medium">
            Send us a few details about your business and prize, and
            we&apos;ll review whether it&apos;s a good fit for our platform.
            Whether you&apos;re interested in a free giveaway or a ticketed
            competition, we&apos;re happy to discuss all opportunities.
          </p>
        </div>

        <PartnerEnquiryForm />
      </Container>
      </div>

      <div className="py-20 text-center border-t border-brand-primary/5">
        <Container>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-midnight/20">
            Coast Competitions • For Local Business Collaborations
          </p>
        </Container>
      </div>
    </div>
  );
}
