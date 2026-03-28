import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Terms & <GradientText>Conditions</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: March 28, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">1. The Promoter</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                The promoter is Coast Competitions Ltd (Company No. 17087259), whose registered office is at 33 Seaview Drive, Ogmore-By-Sea, Bridgend, Wales, CF32 0PB ("Promoter", "we", "us").
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">2. Eligibility</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                To enter any competition on this platform, you must:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>Be a resident of the United Kingdom.</li>
                <li>Be aged 18 years or older.</li>
                <li>Have a valid account and payment method.</li>
              </ul>
              <p className="mt-4 text-brand-midnight/70 leading-relaxed font-medium">
                Employees of the Promoter or their immediate family members are prohibited from entering.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. How to Enter</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                Entries can be made via two routes:
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">A. Online Entry (Paid)</h3>
                  <p className="text-brand-midnight/70 leading-relaxed font-medium">
                    Select the competition, answer the skill-based question, and purchase your tickets. You must answer correctly to be entered into the draw.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">B. Free Postal Entry</h3>
                  <p className="text-brand-midnight/70 leading-relaxed font-medium">
                    Send a postcard to our registered address with: your full name, address, DOB, email, phone number, and the name of the competition you wish to enter. Postal entries are limited to one per person per competition and must be received before the draw date.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">4. Draw Mechanism</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                All automated draws are conducted using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). For live draws broadcast on our social media platforms, we use an independent online random generator (such as Wheel of Names or similar) to ensure 100% transparency and fairness.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">5. No Extensions Policy</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                We operate a strict "No Extensions" policy. Every competition will close and the draw will take place on the specified date, regardless of the number of tickets sold.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">6. Prizes and Delivery</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Prizes are as described on each competition page. Winners will be notified within 48 hours of the draw. Delivery to UK mainland addresses is free of charge. A cash alternative may be offered at the Promoter's discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">7. Refunds</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                All entries are final and non-refundable, except in the event of a competition cancellation or where tickets are oversold due to technical error.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
