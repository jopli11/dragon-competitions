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
                <li>Have a registered account on our website (required for both paid and postal entries so that ticket numbers can be allocated).</li>
              </ul>
              <p className="mt-4 text-brand-midnight/70 leading-relaxed font-medium">
                Employees of the Promoter or their immediate family members are prohibited from entering.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. How to Enter</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                Each Competition has both a paid online entry route and a free postal entry route. The availability of a free entry route to enter each Competition means that each such Competition does not fall within the definition of a lottery under the Gambling Act 2005 and can be operated legally in Great Britain without any need for a licence.
              </p>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">A. Online Entry (Paid)</h3>
                  <p className="text-brand-midnight/70 leading-relaxed font-medium">
                    Select the competition, answer the skill-based question correctly, and purchase your tickets. You must answer the question correctly to be entered into the draw. Each paid entry carries the same chance of winning as any other valid entry, including postal entries.
                  </p>
                </div>
                <div id="free-postal-entry">
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">B. Free Postal Entry</h3>
                  <p className="text-brand-midnight/70 leading-relaxed font-medium mb-4">
                    You may enter any Competition free of charge by post, subject to all of the following conditions being met in full. Failure to comply with any condition will result in the entry being void and discarded.
                  </p>
                  <ol className="list-decimal pl-6 space-y-4 text-brand-midnight/70 font-medium">
                    <li>
                      <strong>Format:</strong> Each postal entry must be submitted on an <strong>open, unenclosed postcard</strong> (minimum size 100mm x 148mm / A6). Entries submitted in envelopes, letters, or any other sealed format will not be accepted under any circumstances. Bulk entries (multiple postcards within the same envelope or package) will not be accepted.
                    </li>
                    <li>
                      <strong>One Entry Per Postcard:</strong> Each postcard constitutes one (1) single entry into one (1) Competition only. To enter multiple Competitions, or to obtain multiple entries into the same Competition, a separate postcard must be sent for each individual entry.
                    </li>
                    <li>
                      <strong>Handwritten Only:</strong> All information on the postcard must be handwritten in clear, legible block capitals using permanent ink (blue or black). Typed, printed, photocopied, or digitally produced postcards will not be accepted.
                    </li>
                    <li>
                      <strong>Required Information:</strong> Each postcard must include all of the following details written clearly on the message side:
                      <ul className="list-disc pl-6 mt-2 space-y-2">
                        <li>Your full legal name (as it appears on your registered account).</li>
                        <li>Your full postal address including postcode.</li>
                        <li>Your date of birth (DD/MM/YYYY).</li>
                        <li>Your registered email address (the email associated with your Coast Competitions account).</li>
                        <li>Your telephone number.</li>
                        <li>The exact name of the Competition you wish to enter (as displayed on the website).</li>
                        <li>Your answer to the skill-based question for that Competition (the correct answer is required — you must visit the Competition page on our website to obtain the question).</li>
                        <li>The following declaration, written in full: &ldquo;I confirm I am aged 18 or over, I am a UK resident, and I have read and agree to the Coast Competitions Terms &amp; Conditions.&rdquo;</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Postage:</strong> First-class or second-class Royal Mail postage must be paid by the entrant. Special delivery, recorded delivery, courier, or franked mail will not be accepted. The Promoter is not responsible for entries lost, delayed, or damaged in the post.
                    </li>
                    <li>
                      <strong>Postal Address:</strong> All postal entries must be sent to: <strong>Coast Competitions Ltd, 33 Seaview Drive, Ogmore-By-Sea, Bridgend, Wales, CF32 0PB</strong>. Entries delivered by hand or through the letterbox directly will not be accepted.
                    </li>
                    <li>
                      <strong>Deadline:</strong> Postal entries must be <strong>received</strong> (not postmarked) by the Promoter no later than 48 hours before the published draw date and time for the relevant Competition. Late entries will not be accepted regardless of the posting date.
                    </li>
                    <li>
                      <strong>Account Requirement:</strong> All postal entrants must hold a valid, registered account on coastcompetitions.co.uk at the time the entry is received. The email address on the postcard must match the registered account email exactly. Entries from unregistered individuals will be void.
                    </li>
                    <li>
                      <strong>Verification:</strong> The Promoter reserves the right to verify the identity and eligibility of any postal entrant. Incomplete, illegible, defaced, altered, or non-compliant postcards will be void and discarded without notice. The Promoter&apos;s decision regarding the validity of any postal entry is final.
                    </li>
                    <li>
                      <strong>Equal Treatment:</strong> Each valid postal entry carries the same chance per entry of winning a Prize as a paid online entry. The system determining the winner does not distinguish between paid and postal entries.
                    </li>
                  </ol>
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
