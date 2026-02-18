import { Container } from "@/components/Container";
import { BrandButton, BrandSectionHeading } from "@/lib/styles";
import Image from "next/image";
import { BrandHeroCarousel } from "@/components/BrandHeroCarousel";
import { TrustpilotBadge } from "@/components/TrustpilotBadge";
import { HomeCountdown } from "@/components/HomeCountdown";
import dynamic from "next/dynamic";

const HowItWorks = dynamic(() => import("@/components/HowItWorks").then(m => m.HowItWorks));
const WinnersSection = dynamic(() => import("@/components/WinnersSection").then(m => m.WinnersSection));

const MOCK_RAFFLES = [
  {
    title: "Tesla Model S",
    price: "18p",
    sold: "200,008 / 699,999",
    ends: "28th April",
    img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "£15,000 Tax Free Cash",
    price: "18p",
    sold: "410 / 350,000",
    ends: "1st May",
    img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "PS5 Bundle",
    price: "18p",
    sold: "249,566 / 699,996",
    ends: "29th April",
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "£15,000 Tax Free Cash",
    price: "18p",
    sold: "840 / 380,000",
    ends: "23rd May",
    img: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=800&auto=format&fit=crop",
  },
];

const CATEGORIES = [
  { id: "all", label: "View All", active: true },
  { id: "auto", label: "Auto Draw" },
  { id: "instant", label: "Instant Wins" },
  { id: "car-bike", label: "Car & Bike" },
  { id: "cash", label: "Tax Free Cash" },
  { id: "tech-watch", label: "Tech & Watch" },
  { id: "ending", label: "Ending Soon", special: true },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <BrandHeroCarousel />

      <HomeCountdown />

      <div className="mt-6">
        <TrustpilotBadge />
      </div>

      <Container className="pt-6 pb-20">
        <div className="text-center">
          <BrandSectionHeading>Current Competitions</BrandSectionHeading>
          <div className="flex flex-nowrap justify-start gap-3 mt-8 overflow-x-auto pb-4 px-4 scrollbar-hide md:flex-wrap md:justify-center md:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`
                  whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border
                  ${cat.active 
                    ? "bg-brand-primary text-white border-brand-primary shadow-md" 
                    : cat.special
                      ? "bg-brand-secondary text-white border-brand-secondary"
                      : "bg-white text-brand-midnight border-brand-primary/10 hover:bg-brand-accent/30 hover:border-brand-primary/30"
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0">
          {MOCK_RAFFLES.map((item) => (
            <div
              key={item.title + item.ends}
              className="group overflow-hidden rounded-[2.5rem] border border-brand-primary/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 rounded-lg bg-brand-secondary/90 px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                  Entries Open
                </div>
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <h3 className="text-lg font-black tracking-tight text-brand-midnight leading-tight">
                  {item.title}
                </h3>
                <div className="mt-4 flex items-center justify-between text-[11px] font-extrabold text-brand-midnight/40 uppercase tracking-wider">
                  <span>{item.sold}</span>
                  <span>Ends: {item.ends}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-accent/50 border border-brand-primary/5">
                  <div
                    className="h-full bg-brand-secondary rounded-full shadow-[0_0_8px_rgba(0,112,224,0.4)]"
                    style={{ width: "30%" }}
                  />
                </div>
                <div className="mt-8 text-center">
                  <p className="text-[10px] font-black text-brand-midnight/50 uppercase tracking-[0.2em] mb-4">
                    Just <span className="text-brand-secondary">{item.price}</span> per entry
                  </p>
                  <BrandButton fullWidth>
                    Enter Now
                  </BrandButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      <HowItWorks />
      <WinnersSection />
    </div>
  );
}
