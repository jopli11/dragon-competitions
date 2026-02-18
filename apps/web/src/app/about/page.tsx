import { Container } from "@/components/Container";
import { GradientText, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <section className="bg-brand-midnight text-white py-32 sm:py-48 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-1/4 left-[20%] w-[40%] h-[40%] bg-brand-secondary/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-[20%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[250px] bg-linear-to-t from-white to-transparent z-10" />
        
        <Container className="relative z-20">
          <span className="text-sm font-black uppercase tracking-[0.4em] text-brand-secondary mb-6 block">
            The Legend
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85]">
            About <GradientText>Dragon</GradientText>
          </h1>
          <p className="mt-10 text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            We're not just another competition site. We're a community-driven platform 
            built on transparency, epic prizes, and the thrill of the win.
          </p>
        </Container>
      </section>

      <Container className="relative z-30 -mt-24 sm:-mt-32 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 sm:gap-20">
          <div className="space-y-12">
            <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-brand-primary/5 shadow-2xl p-10 sm:p-20">
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-brand-midnight">
                Our <GradientText>Heritage</GradientText>
              </h2>
              <div className="mt-10 space-y-8 text-brand-midnight/70 text-lg sm:text-xl leading-relaxed font-medium">
                <p>
                  Dragon Competitions was born from a passion for high-performance machinery and the desire to make premium experiences accessible to everyone. We saw a gap in the market for a truly transparent, UK-based platform that puts the community first.
                </p>
                <p>
                  Every raffle we host is a promise: a promise of a fair draw, a guaranteed winner, and a life-changing moment. We don't do extensions, and we don't do hidden terms. Just pure, skill-based competition.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-16">
                {[
                  { label: "Winners", value: "1,200+" },
                  { label: "Prizes Won", value: "£2.5M+" },
                  { label: "Community", value: "50k+" },
                  { label: "Trust Score", value: "4.9/5" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-brand-accent/30 rounded-3xl p-6 text-center border border-brand-primary/5 flex flex-col gap-2">
                    <div className="text-xl sm:text-2xl font-black text-brand-secondary">{stat.value}</div>
                    <div className="text-[10px] font-extrabold text-brand-midnight/40 uppercase tracking-widest leading-none">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-10 border border-brand-primary/5 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-brand-secondary/20 group">
                <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-secondary mb-8 border border-brand-secondary/10 group-hover:bg-brand-secondary group-hover:text-white transition-colors duration-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.355l-.39-.233A11.952 11.955 0 003.382 5.44M12 21.355l.39-.233A11.952 11.955 0 0020.618 5.44" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-brand-midnight">UK Regulated</h3>
                <p className="mt-4 text-brand-midnight/60 leading-relaxed font-medium">
                  Operating strictly under UK skill-based competition laws. Every draw is transparent and auditable.
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
                  Beyond our main draws, we offer instant win opportunities on select raffles for immediate excitement.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="relative aspect-4/5 rounded-[3rem] sm:rounded-[4rem] overflow-hidden shadow-2xl group border-12 border-white">
              <Image
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop"
                alt="Dragon Competitions Lifestyle"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-midnight/80 via-brand-midnight/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-3 opacity-80">Established 2024</p>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">The Dragon <br />Standard</h3>
              </div>
            </div>
            
            <div className="rounded-[3rem] sm:rounded-[4rem] bg-linear-to-br from-brand-primary to-brand-secondary p-12 sm:p-16 relative overflow-hidden shadow-2xl border-4 border-white/10">
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">Ready <br />to Win?</h3>
                <p className="mt-6 text-white/80 text-lg sm:text-xl font-medium leading-relaxed">
                  Join thousands of happy winners and start your journey today.
                </p>
                <div className="mt-10">
                  <Link href="/raffles" className="inline-flex items-center justify-center bg-white text-brand-primary px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300 hover:bg-brand-accent hover:-translate-y-1 active:translate-y-0">
                    Explore Live Raffles
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
      </Container>

      <div className="py-24 text-center border-t border-brand-primary/5">
        <Container>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-midnight/20">
            Dragon Competitions • UK Skill-Based Raffles
          </p>
        </Container>
      </div>
    </div>
  );
}
