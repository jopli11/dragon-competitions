"use client";

import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";
import { SocialLinks } from "@/components/SocialLinks";
import { submitContactForm } from "./actions";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd, buildWebPageSchema, SITE_URL } from "@/lib/seo/json-ld";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setErrorMessage("");
    track("contact_form_submit");

    try {
      const result = await submitContactForm(formData);
      if (result?.error) {
        track("contact_form_error");
        setStatus("error");
        setErrorMessage(result.error);
      } else {
        track("contact_form_success");
        setStatus("success");
      }
    } catch {
      track("contact_form_error");
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <JsonLd
        id="schema-contact-webpage"
        schema={{
          ...buildWebPageSchema({
            url: "/contact",
            name: "Contact Coast Competitions · UK Prize Competition Support",
            description:
              "Get in touch with the Coast Competitions UK support team. Mon-Fri 9am-6pm, Sat-Sun 10am-4pm. Email support, social channels, and contact form.",
            breadcrumbId: `${SITE_URL}/contact#breadcrumb`,
          }),
          "@type": ["WebPage", "ContactPage"],
        }}
      />
      <Container>
        <Breadcrumbs
          items={[{ label: "Contact", href: "/contact" }]}
          className="mb-8"
        />
        <div className="text-center mb-16 sm:mb-24">
          <BrandSectionHeading>Get in <GradientText>Touch</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Have a question or need help? We&apos;re here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 sm:gap-20">
          <div className="bg-white rounded-4xl border border-brand-primary/5 shadow-2xl p-8 sm:p-16">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-brand-midnight mb-10">
              Send us a <GradientText>Message</GradientText>
            </h2>
            
            {status === "success" ? (
              <div className="bg-green-50 border border-green-100 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-brand-midnight uppercase tracking-tight mb-2">Message Sent!</h3>
                <p className="text-brand-midnight/60 font-medium">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-sm font-black uppercase tracking-widest text-brand-primary hover:text-brand-secondary transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form action={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Full Name</label>
                    <input name="name" type="text" id="name" required placeholder="John Doe" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Email Address</label>
                    <input name="email" type="email" id="email" required placeholder="john@example.com" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  <label htmlFor="subject" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Subject</label>
                  <input name="subject" type="text" id="subject" required placeholder="How can we help?" className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all" />
                </div>
                <div className="space-y-2 mt-6">
                  <label htmlFor="message" className="block text-[10px] font-black uppercase tracking-widest text-brand-midnight/40 ml-4">Message</label>
                  <textarea name="message" id="message" required placeholder="Your message here..." rows={6} className="w-full bg-brand-accent/30 border border-brand-primary/5 rounded-2xl px-6 py-4 text-brand-midnight font-medium placeholder:text-brand-midnight/20 focus:outline-none focus:ring-2 focus:ring-brand-secondary/20 focus:bg-white transition-all resize-none"></textarea>
                </div>
                
                {status === "error" && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold">
                    {errorMessage}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full mt-10 bg-brand-primary text-white rounded-full py-5 font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all duration-300 hover:bg-brand-secondary hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-12">
            <div className="space-y-10 px-4">
              {[
                { 
                  title: "Email Us", 
                  value: "coastcompetitionsuk@gmail.com", 
                  link: "mailto:coastcompetitionsuk@gmail.com",
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
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Follow the Coast</h3>
                <p className="mt-4 text-white/70 text-base font-medium leading-relaxed">
                  Join our community on social media for live draws, exclusive offers, and winner announcements.
                </p>
                <SocialLinks
                  className="mt-8 flex-wrap"
                  iconClassName="w-6 h-6"
                  wrapperClassName="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-brand-secondary transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                />
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
