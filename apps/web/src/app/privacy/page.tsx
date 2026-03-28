import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Privacy <GradientText>Policy</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: March 28, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">1. Introduction</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Coast Competitions Ltd ("we", "us", "our") is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">2. Data Controller</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Coast Competitions Ltd is the data controller responsible for your personal data. If you have any questions, please contact us at support@coastcompetitions.co.uk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>Identity Data: Name, date of birth.</li>
                <li>Contact Data: Email address, phone number, postal address.</li>
                <li>Financial Data: Payment card details (processed securely by our payment provider).</li>
                <li>Technical Data: IP address, browser type, device information.</li>
                <li>Usage Data: Information about how you use our website and competitions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">4. How We Use Your Data</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                We use your data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>To register you as a new customer.</li>
                <li>To process and deliver your competition entries.</li>
                <li>To notify you if you are a winner.</li>
                <li>To manage our relationship with you (e.g., notifying you about changes to our terms).</li>
                <li>To improve our website and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">5. Data Security</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorised way. We limit access to your personal data to those employees and third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">6. Your Rights</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                Under data protection laws, you have rights including:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>The right to access your personal data.</li>
                <li>The right to rectification of inaccurate data.</li>
                <li>The right to erasure of your data.</li>
                <li>The right to object to or restrict processing.</li>
                <li>The right to data portability.</li>
              </ul>
              <p className="mt-4 text-brand-midnight/70 leading-relaxed font-medium">
                You also have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
