import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Privacy <GradientText>Policy</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: February 5, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16">
            <p className="text-lg font-bold text-brand-midnight leading-relaxed">
              Your privacy is important to us. This policy explains how we collect and use your data.
            </p>
            
            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">1. Information We Collect</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This includes your name, email address, phone number, and payment information.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">2. How We Use Your Data</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              We use your data to process your entries, notify you of draw results, and improve our services. We may also use your email to send you marketing communications, which you can opt out of at any time.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">3. Data Security</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              We implement industry-standard security measures to protect your personal information. Your payment details are processed securely through Stripe and are never stored on our servers.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">4. Third-Party Sharing</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              We do not sell your personal data. We only share information with trusted third-party service providers (like Stripe and Postmark) necessary to operate our platform.
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mt-12 mb-6">5. Your Rights</h2>
            <p className="text-brand-midnight/70 leading-relaxed font-medium mb-6">
              You have the right to access, correct, or delete your personal information at any time. Please contact our support team if you wish to exercise these rights.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
