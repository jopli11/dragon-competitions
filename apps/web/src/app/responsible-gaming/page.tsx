import { Container } from "@/components/Container";
import { BrandSectionHeading, GradientText } from "@/lib/styles";

export default function ResponsibleGamingPage() {
  return (
    <div className="min-h-screen bg-white py-16 sm:py-32">
      <Container>
        <div className="text-center">
          <BrandSectionHeading>Responsible <GradientText>Gaming</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Last Updated: March 28, 2026
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <div className="bg-white rounded-4xl sm:rounded-[3.5rem] border border-brand-primary/5 shadow-xl p-8 sm:p-16 space-y-12">
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">Our Commitment</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                At Coast Competitions, we want our players to have fun while participating in our skill-based competitions. We are committed to promoting responsible participation and ensuring that our platform remains a safe environment for everyone. All our draws are conducted using verifiable random generators to ensure absolute fairness.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">18+ Only</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                Participation in our competitions is strictly limited to individuals aged 18 years or older. We implement age verification checks during registration to ensure compliance with this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">Stay in Control</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                Participation should always be for entertainment. Here are some tips to help you stay in control:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>Set a budget for how much you want to spend and stick to it.</li>
                <li>Only participate with money you can afford to lose.</li>
                <li>Don't chase losses.</li>
                <li>Take regular breaks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">Support Resources</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                If you feel that your participation is becoming a problem, there are several organisations that can provide support and advice:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-brand-midnight/70 font-medium">
                <li>
                  <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline font-bold">
                    BeGambleAware.org
                  </a>
                  : Provides information to help people make informed decisions about their gambling.
                </li>
                <li>
                  <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-brand-primary underline font-bold">
                    GamCare
                  </a>
                  : The leading provider of information, advice, and support for anyone affected by gambling problems.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
