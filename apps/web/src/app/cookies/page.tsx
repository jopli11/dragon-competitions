import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Cookie <GradientText>Policy</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: March 28, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">1. What are Cookies?</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">2. How We Use Cookies</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                We use cookies for the following reasons:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li><strong>Essential Cookies:</strong> Necessary for the website to function, such as maintaining your session and security.</li>
                <li><strong>Analytical Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                <li><strong>Functional Cookies:</strong> Remember choices you make to provide a more personalised experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. Managing Cookies</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                You can change your cookie preferences at any time through our cookie consent banner. Additionally, most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-brand-primary underline">www.aboutcookies.org</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">4. More Information</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                For more information about how we use your personal data, please see our <a href="/privacy" className="text-brand-primary underline">Privacy Policy</a>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
