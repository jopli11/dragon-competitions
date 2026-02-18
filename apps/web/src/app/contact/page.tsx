import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center mb-16 sm:mb-24">
          <BrandSectionHeading>Get in <GradientText>Touch</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Have a question or need help? We're here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 sm:gap-20">
          <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] border border-brand-primary/5 shadow-2xl p-8 sm:p-16">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight mb-10">
              Send us a <GradientText>Message</GradientText>
            </h2>
            <form action="#">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Email Address</label>
                  <input type="email" id="email" placeholder="john@example.com" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
                </div>
              </div>
              <div className="space-y-2 mt-6">
                <label htmlFor="subject" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Subject</label>
                <input type="text" id="subject" placeholder="How can we help?" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
              </div>
              <div className="space-y-2 mt-6">
                <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Message</label>
                <textarea id="message" placeholder="Your message here..." rows={6} className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full mt-10 bg-brand-primary text-white rounded-full py-5 font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all duration-300 hover:bg-brand-secondary hover:-translate-y-1 active:translate-y-0">
                Send Message
              </button>
            </form>
          </div>

          <div className="space-y-12">
            <div className="space-y-10 px-4">
              {[
                { 
                  title: "Email Us", 
                  value: "support@dragoncompetitions.co.uk", 
                  link: "mailto:support@dragoncompetitions.co.uk",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                { 
                  title: "Support Hours", 
                  value: "Mon - Fri: 9am - 6pm", 
                  subValue: "Sat - Sun: 10am - 4pm",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-12 0 9 9 0 0112 0z" />
                    </svg>
                  )
                },
                { 
                  title: "Location", 
                  value: "United Kingdom", 
                  subValue: "Registered Business",
                  icon: (
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )
                }
              ].map((item) => (
                <div key={item.title} className="flex gap-6">
                  <div className="w-14 h-14 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-secondary border border-brand-secondary/10 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 mb-1">{item.title}</div>
                    {item.link ? (
                      <a href={item.link} className="text-lg font-black text-brand-midnight hover:text-brand-secondary transition-colors break-all">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-lg font-black text-brand-midnight">{item.value}</div>
                    )}
                    {item.subValue && <div className="text-sm font-bold text-brand-midnight/40 mt-1">{item.subValue}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2.5rem] bg-linear-to-br from-brand-primary to-brand-secondary p-10 sm:p-12 relative overflow-hidden shadow-2xl border-4 border-white/10">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Follow the Dragon</h3>
                <p className="mt-4 text-white/70 text-base font-medium leading-relaxed">
                  Join our community on social media for live draws, exclusive offers, and winner announcements.
                </p>
                <div className="mt-8 flex gap-4">
                  {[
                    { name: "Facebook", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 11.127 8.812 13.22v-9.357H5.445v-3.863h3.367V9.121c0-3.322 2.022-5.14 4.99-5.14 1.42 0 2.905.254 2.905.254v3.193h-1.636c-1.647 0-2.16 1.023-2.16 2.071v2.488h3.6l-.576 3.863h-3.024v9.357C20.344 23.2 24 18.062 24 12.073z"/>
                      </svg>
                    )},
                    { name: "Instagram", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.774 4.919 4.851.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.075-1.664 4.703-4.919 4.85-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.775-4.919-4.851-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.075 1.664-4.704 4.919-4.85 1.265-.058 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-5.838 2.435-5.838 5.838s2.435 5.838 5.838 5.838 5.838-2.435 5.838-5.838-2.435-5.838-5.838-5.838zm0 9.513c-2.03 0-3.675-1.645-3.675-3.675 0-2.03 1.645-3.675 3.675-3.675 2.03 0 3.675 1.645 3.675 3.675 0 2.03-1.645 3.675-3.675 3.675zm4.961-11.461c.73 0 1.322.592 1.322 1.322 0 .73-.592 1.322-1.322 1.322-.73 0-1.322-.592-1.322-1.322 0-.73.592-1.322 1.322-1.322z"/>
                      </svg>
                    )},
                    { name: "Twitter", icon: (
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.923 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )},
                  ].map((social) => (
                    <a key={social.name} href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-secondary transition-all duration-300 hover:-translate-y-1 active:translate-y-0" title={social.name}>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute -right-16 -bottom-16 opacity-10 text-white transform rotate-12">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
