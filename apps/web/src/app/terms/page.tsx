import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Terms & <GradientText>Conditions</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: February 5, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16">
            <p className="text-lg font-bold text-brand-midnight leading-relaxed">
              Please read these terms and conditions carefully before using our platform.
            </p>
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">1. Introduction</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              These terms and conditions govern your use of Dragon Competitions. By accessing or using our website, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use our services.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">2. Eligibility</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
              To enter any competition on Dragon Competitions, you must:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium mb-6">
              <li>Be a resident of the United Kingdom.</li>
              <li>Be aged 18 years or older.</li>
              <li>Have a valid account and payment method.</li>
            </ul>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">3. Skill-Based Entry</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              All competitions hosted on this platform are skill-based. To be entered into a draw, you must correctly answer a qualifying question. Failure to answer correctly will result in an invalid entry without a refund.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">4. Draw Transparency</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              We are committed to 100% transparency. All draws are conducted using a certified random number generator and are broadcast live on our social media platforms.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">5. No Extensions Policy</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              Dragon Competitions operates a strict "No Extensions" policy. Every competition will close and the draw will take place on the specified date, regardless of the number of tickets sold.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
