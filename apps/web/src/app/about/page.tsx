import { Container } from "@/components/Container";
import { GradientText } from "@/lib/styles";
import { SOCIAL_LINKS } from "@/lib/socials";
import { FloatingBusinessPrompt } from "@/components/FloatingBusinessPrompt";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, buildWebPageSchema, SITE_URL } from "@/lib/seo/json-ld";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <JsonLd
        id="schema-about-webpage"
        schema={{
          ...buildWebPageSchema({
            url: "/about",
            name: "About Coast Competitions · Family-Run UK Prize Competitions",
            description:
              "Coast Competitions is a family-run UK skill-based prize competition company. Learn about our mission, our DNA Payments-secured checkout, and our commitment to fairness.",
            breadcrumbId: `${SITE_URL}/about#breadcrumb`,
          }),
          "@type": ["WebPage", "AboutPage"],
        }}
      />
      <section className="bg-brand-midnight text-white py-32 sm:py-48 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-[20%] w-[40%] h-[40%] bg-brand-secondary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-[20%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-linear-to-t from-white to-transparent z-10" />
        
        <Container className="relative z-20">
          <Breadcrumbs
            items={[{ label: "About", href: "/about" }]}
            variant="dark"
            className="mb-8 justify-center [&_ol]:justify-center"
          />
          <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-secondary mb-6 block">
            The Legend
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
            About <GradientText>Coast</GradientText>
          </h1>
          <p className="mt-10 text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            We&apos;re more than just a competition site. We&apos;re a family-run,
            community-focused platform built on transparency, exciting prizes,
            and the belief that a win can make a real difference.
          </p>
        </Container>
      </section>

      <Container className="relative z-30 -mt-24 sm:-mt-32 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 sm:gap-20 items-start">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-brand-primary/5 shadow-2xl p-10 sm:p-20">
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-midnight">
              Our <GradientText>Heritage</GradientText>
            </h2>
            <div className="mt-10 space-y-8 text-brand-midnight/70 text-lg sm:text-xl leading-relaxed font-medium">
              <p>
                Coast Competitions is a family-run UK prize competition company built on fairness, transparency, and community.
              </p>
              <p>
                Inspired by the coast and the communities around it, our brand carries a coastal spirit - but our prizes are not limited by it. From high-performance tech and cash prizes to lifestyle rewards and coastal-themed experiences, we aim to offer prizes that excite, inspire, and make a real difference.
              </p>
              <p>
                Every competition is designed to be simple, fair, and transparent, with guaranteed winners, clear entry routes, and no hidden surprises.
              </p>
              <p>
                As we grow, we&apos;ll bring the Coast Competitions community together through events, treasure hunts, cash drops, social media giveaways, and local initiatives. We&apos;ll also listen to your feedback, recommendations, and ideas to help shape the prizes, events, and causes we support.
              </p>
              <p>
                Our mission is simple: create unforgettable winning moments, give back to coastal communities, and hopefully change lives along the way.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <div className="relative aspect-4/5 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl group border-12 border-white">
              <Image
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop"
                alt="Waves on the coast"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-midnight/80 via-brand-midnight/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-3 opacity-80">Established 2025</p>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">Family-Run. <br />Community-Focused.</h3>
              </div>
            </div>
            
            <div className="rounded-[3rem] sm:rounded-[4rem] bg-linear-to-br from-brand-primary to-brand-secondary p-12 sm:p-16 relative overflow-hidden shadow-2xl border-4 border-white/10">
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">Ready <br />to Win?</h3>
                <p className="mt-6 text-white/80 text-lg sm:text-xl font-medium leading-relaxed">
                  Be part of Coast Competitions from the very beginning. Enter today for your chance to win exciting prizes through fair, transparent, skill-based competitions.
                </p>
                <div className="mt-10">
                  <Link href="/raffles" className="inline-flex items-center justify-center bg-white text-brand-primary px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300 hover:bg-brand-accent hover:-translate-y-1 active:translate-y-0">
                    Explore Live Competitions
                  </Link>
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 opacity-10 text-white transform rotate-12">
                <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-brand-midnight rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/10 shadow-2xl p-10 sm:p-14 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-brand-secondary/20 blur-3xl" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
                Secure Payments
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-tight">
                Powered by <GradientText>DNA Payments</GradientText>
              </h2>
            </div>
            <div className="space-y-6 text-white/75 text-lg leading-relaxed font-medium">
              <p>
                Coast Competitions utilises DNA Payments to support every payment made through the website, giving customers a secure and reliable checkout experience.
              </p>
              <p>
                We have completed DNA Payments&apos; risk process and operate as a fully UK operational, regulated, and compliant competition website.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20 group">
            <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-secondary mb-8 border border-brand-secondary/10 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355l-.39-.233A11.952 11.955 0 003.382 5.44M12 21.355l.39-.233A11.952 11.955 0 0020.618 5.44" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">UK Compliant</h3>
            <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
              Operating under UK skill-based competition rules with DNA Payments supporting our compliant UK payment process.
            </p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-10 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20 group">
            <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-secondary mb-8 border border-brand-secondary/10 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">Instant Wins</h3>
            <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
              Beyond our main draws, we offer instant win opportunities on select competitions for immediate excitement.
            </p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-10 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20 group">
            <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-secondary mb-8 border border-brand-secondary/10 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.868v4.264a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">And Much More</h3>
            <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
              Treasure hunts, cash drops, giveaways and events that bring the Coast community together.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2.5rem] sm:rounded-[3.5rem] bg-brand-accent p-10 sm:p-14 border border-brand-secondary/10 shadow-xl">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.35em] text-brand-secondary">
                Follow the Journey
              </span>
              <h2 className="mt-5 text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-midnight">
                Join us on <GradientText>social</GradientText>
              </h2>
              <p className="mt-5 max-w-2xl text-brand-midnight/65 text-lg leading-relaxed font-medium">
                Follow Coast Competitions for prize updates, winner announcements, giveaways, and behind-the-scenes community moments.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-brand-midnight shadow-lg border border-brand-secondary/10 transition-all duration-300 hover:-translate-y-1 hover:bg-brand-secondary hover:text-white active:translate-y-0"
                >
                  <span className="inline-flex w-5 h-5" aria-hidden>
                    {social.icon}
                  </span>
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>

      <div className="py-24 text-center border-t border-brand-primary/5">
        <Container>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-midnight/20">
            Coast Competitions • UK Skill-Based Prize Competitions
          </p>
        </Container>
      </div>

      <FloatingBusinessPrompt />
    </div>
  );
}
