import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Refund <GradientText>Policy</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: March 28, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">1. General Policy</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Due to the nature of our skill-based competitions, all ticket entries are final and non-refundable once purchased. By entering a competition, you acknowledge that you have read and accepted our Terms and Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">2. Competition Cancellation</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                In the unlikely event that a competition is cancelled by Coast Competitions, all entrants will receive a full refund of their entry fee to the original payment method used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. Technical Errors</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                If a technical error occurs during the checkout process resulting in an overpayment or the purchase of tickets that are no longer available (oversold), a refund for the affected portion of the transaction will be processed automatically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">4. Refund Processing</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Approved refunds will be processed back to the original payment method within 5-10 business days, depending on your bank or card issuer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">5. Contact Us</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                If you have any questions regarding our refund policy, please contact our support team at coastcompetitionsuk@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
