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

            {/* 1. The Promoter */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">1. The Promoter</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                The promoter is Coast Competitions Ltd (Company No. 17087259), whose registered office is at 33 Seaview Drive, Ogmore-By-Sea, Bridgend, Wales, CF32 0PB (&ldquo;Promoter&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;), who operates various competitions resulting in the allocation of prizes (&ldquo;Prize&rdquo; or &ldquo;Prizes&rdquo;) on the website www.coastcompetitions.co.uk (&ldquo;Platform&rdquo;) in accordance with these Terms and Conditions.
              </p>
            </section>

            {/* 2. The Competitions */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">2. The Competitions</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  2.1 &nbsp; All draws operated by the Promoter on its Platform to win Prizes are referred to as the &ldquo;Competition(s)&rdquo; in these Terms and Conditions.
                </p>
                <p>
                  2.2 &nbsp; Multiple Competitions may be operated at the same time by the Promoter on the Platform and each Competition will have a specific Prize, all as specified on the Platform.
                </p>
                <p>
                  2.3 &nbsp; Availability and pricing of Competitions is at the discretion of the Promoter and will be specified on the Platform.
                </p>
                <p>
                  2.4 &nbsp; Each Competition has a free entry route available as well as a paid entry route (see Clause 4 below). The availability of a free entry route to enter each Competition means that each such Competition does not fall within the definition of a lottery under the Gambling Act 2005 and can be operated legally in Great Britain without any need for a licence.
                </p>
                <p>
                  2.5 &nbsp; Each Competition will run for the period of time specified at the creation of each Competition. Please see our Platform for details of each Competition including start and end times and dates (&ldquo;Promotion Period(s)&rdquo;).
                </p>
                <p>
                  2.6 &nbsp; The Competitions will end when the timer runs out on the Platform at the end of the Promotion Period for each Competition, or when all available tickets have been sold, whichever occurs first. The Promoter will never add time to a Promotion Period. However, the Promoter may end the Promotion Period earlier at its discretion, provided that the Competition will remain open for at least 3 clear days following the Promoter&apos;s announcement on the Platform that the Promotion Period will end early.
                </p>
              </div>
            </section>

            {/* 3. Eligibility */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">3. Eligibility</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  3.1 &nbsp; Competitions are open to all persons aged 18 or over who are resident in the United Kingdom.
                </p>
                <p>
                  3.2 &nbsp; Any employees of the Promoter or any person connected with the Promoter (through immediate family, professional or commercial association) are prohibited from participating in Competitions.
                </p>
                <p>
                  3.3 &nbsp; By entering a Competition, the entrant (&ldquo;Entrant&rdquo;, &ldquo;you&rdquo;, &ldquo;your(s)&rdquo;) will be deemed to undertake that you:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>are at least 18 years of age;</li>
                  <li>are a resident of the United Kingdom;</li>
                  <li>have the legal capacity to enter the Competition;</li>
                  <li>have read, understood and accepted these Terms and Conditions; and</li>
                  <li>will be bound by them and by any other requirements set out in any of the Promoter&apos;s related promotional material on the Platform.</li>
                </ul>
                <p>
                  3.4 &nbsp; You must have a registered account on our Platform to enter any Competition, whether by online or postal entry. This is required so that ticket numbers can be allocated and entry can be confirmed.
                </p>
                <p>
                  3.5 &nbsp; The Promoter reserves the right to refuse an Entrant&apos;s entry at the Promoter&apos;s own discretion.
                </p>
                <p>
                  3.6 &nbsp; All Competitions are governed by the laws of England and Wales and all matters or disputes relating to the Competitions will be dealt with and resolved under the laws of England and Wales. The Courts of England and Wales shall have exclusive jurisdiction.
                </p>
              </div>
            </section>

            {/* 4. How to Enter */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">4. How to Enter</h2>
              <div className="space-y-6 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  4.1 &nbsp; To enter any Competition, you must first create an account on our Platform by providing a valid email address. You must then either submit an online entry via the Platform or send a postal entry to the Promoter. In both cases, entries (&ldquo;Entry&rdquo;, &ldquo;Entries&rdquo;) must be received by the end of the Promotion Period for the Competition as stated on the Platform.
                </p>
                <p>
                  4.2 &nbsp; All Entrants must provide their contact details to the Promoter including: full name, date of birth, email address, postal address, and contact telephone number (&ldquo;Contact Details&rdquo;). The Contact Details will be used to confirm an Entry, to notify the winner if they have won a Prize, to post the winner&apos;s first name and county on the Platform as a winner (unless requested otherwise under Clause 10.2), and in any other way set out in our Privacy Policy.
                </p>

                <div>
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">A. Online Entry (Paid)</h3>
                  <p>
                    4.3 &nbsp; When entering a Competition online via the Platform, you must follow the on-screen instructions to: select the Competition you wish to enter, answer the skill-based question correctly, select the number of tickets you wish to purchase, and provide your payment details. Once your payment has cleared, we will contact you by email to confirm your ticket purchase and ticket numbers.
                  </p>
                </div>

                <div id="free-postal-entry">
                  <h3 className="text-lg font-bold text-brand-midnight mb-2">B. Free Postal Entry</h3>
                  <p className="mb-4">
                    4.4 &nbsp; You may enter any Competition free of charge by post, subject to all of the following conditions being met in full. Failure to comply with any condition will result in the entry being void and discarded.
                  </p>
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>Format:</strong> Each postal entry must be submitted on an <strong>open, unenclosed postcard</strong> (minimum size 100mm &times; 148mm / A6). Entries submitted in envelopes, letters, or any other sealed format will not be accepted under any circumstances. Bulk entries (multiple postcards within the same envelope or package) will not be accepted.
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
                        <li>Your answer to the skill-based question for that Competition (the correct answer is required &mdash; you must visit the Competition page on our website to obtain the question).</li>
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

                <p>
                  4.5 &nbsp; For all Competitions, a random ticket number will be allocated to each valid Entry by the Promoter. All postal entries will be treated in the exact same way as paid online entries once ticket numbers have been allocated. If a Competition has sold out or reached its maximum number of entries, no further entries will be accepted and the Platform will state that the Competition has closed.
                </p>
                <p>
                  4.6 &nbsp; Whether submitting an online entry or a postal entry, you will not be deemed entered into the Competition until the Promoter confirms your entry, which can be verified in your account when you log in.
                </p>
                <p>
                  4.7 &nbsp; The Promoter reserves the right to refuse an entry or disqualify any incomplete entry if it has reasonable grounds for believing that an Entrant has contravened any of these Terms and Conditions.
                </p>
                <p>
                  4.8 &nbsp; The Promoter reserves the right to disqualify an entry if it has reasonable grounds for believing that an Entrant&apos;s conduct might be contrary to the spirit or intention of the Competition, including conduct that might be abusive, racist, threatening, or defamatory, or where an Entrant has posted or is likely to post such comments on the Platform or elsewhere on social media.
                </p>
                <p>
                  4.9 &nbsp; All entries are final. To the extent permitted by applicable law, all entries become the Promoter&apos;s property and will not be returned.
                </p>
                <p>
                  4.10 &nbsp; Postal entries will be processed daily. If a Competition has sold the maximum number of entries allocated to it, the Platform will state that it has sold out and no further entries will be accepted.
                </p>
                <p>
                  4.11 &nbsp; An Entrant can enter each Competition up to the maximum number of times stated on each Competition&apos;s page on the Platform, by online entry or postal entry.
                </p>
              </div>
            </section>

            {/* 5. Draw Mechanism */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">5. Competition Draw</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  5.1 &nbsp; All automated draws are conducted using a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). For live draws broadcast on our social media platforms, we use an independent online random generator (such as Wheel of Names or similar) to ensure 100% transparency and fairness.
                </p>
                <p>
                  5.2 &nbsp; In the event that there is any malfunction or technical error with the draw mechanism in selecting a winner (whether partially or wholly), the Promoter shall be entitled at its absolute discretion to re-run the winner selection process.
                </p>
                <p>
                  5.3 &nbsp; There will only be one Prize Winner per Competition, unless the Promoter states otherwise on the Platform. The Promoter&apos;s decision is final regarding any aspect of the Competition.
                </p>
                <p>
                  5.4 &nbsp; The Promoter will draw a Prize Winner for each Competition at the end of the Promotion Period stated on the Platform. There will be no extensions to the Promotion Period and all Prizes will be awarded in full regardless of the number of entries received for a Competition. The Promoter may bring the draw date forward if the maximum number of entries has been received.
                </p>
                <p>
                  5.5 &nbsp; The Promoter will attempt to contact Prize Winners using the Contact Details provided at the time of entry (or as subsequently updated). It is the Entrant&apos;s responsibility to ensure that their Contact Details are accurate, up to date, and complete. If Contact Details are incorrect, the Promoter will not be held responsible for any consequences arising from this.
                </p>
                <p>
                  5.6 &nbsp; If the Promoter is unable to contact a Prize Winner within five (5) working days of the end of a Competition, or the Prize Winner fails to confirm acceptance of the Prize, or the Prize Winner is disqualified as a result of not complying with these Terms and Conditions, the Prize Winner hereby agrees that the Prize will be immediately, irrevocably and automatically forfeited and the Promoter may select an alternative winner.
                </p>
              </div>
            </section>

            {/* 6. Competition Cancellation */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">6. Competition Cancellation</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                6.1 &nbsp; The Promoter reserves the right to cancel any Competition at any time either before or after entries have been sold. If a Competition is cancelled, the Promoter will notify each Entrant at the email address they have provided and return any payment made by the same method as payment was received. Where a payment has been refunded, the Promoter will have no further liability to the Entrant or to any other person.
              </p>
            </section>

            {/* 7. Prize Winner Verification */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">7. Prize Winner Verification</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  7.1 &nbsp; Each Prize Winner will be required to provide documentary proof of their age (18+) and identification prior to receiving a Prize. Any failure to provide satisfactory proof may result in the Prize Winner being disqualified and the Promoter re-allocating the Prize.
                </p>
                <p>
                  7.2 &nbsp; All monetary prizes will only be paid directly into the verified personal bank account of the named winner. Under no circumstances will winnings be transferred to any third-party account, regardless of relationship or consent.
                </p>
                <p>
                  7.3 &nbsp; Prizes are non-transferable and cannot be assigned, gifted, or paid to any other person or entity. The Promoter reserves the right to withhold payment or delivery until full verification has been completed.
                </p>
                <p>
                  7.4 &nbsp; The Promoter hereby reserves the right not to deliver a Prize until it is satisfied that: (a) the Prize Winner has a validly registered Platform account and is not in breach of these Terms and Conditions; (b) any amounts due or owing by the Prize Winner to the Promoter have been paid in full; and (c) the age and identity of the Prize Winner and their entitlement to receive the Prize has been established to the Promoter&apos;s satisfaction.
                </p>
                <p>
                  7.5 &nbsp; Without prejudice to the above, the Promoter reserves the right not to award a Prize and/or to retrieve a Prize or the value of the Prize if it reasonably suspects fraud in relation to a Competition.
                </p>
              </div>
            </section>

            {/* 8. Prizes and Delivery */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">8. Prizes and Delivery</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  8.1 &nbsp; Prizes are as described on each Competition page on the Platform. The Promoter takes no responsibility for the Prize after delivery to the Prize Winner has taken place. Once the Prize Winner has taken possession of the Prize, the Promoter will no longer be responsible for insuring the Prize.
                </p>
                <p>
                  8.2 &nbsp; Delivery of the Prize to the Prize Winner&apos;s home address in the United Kingdom is free of charge. The Promoter may charge delivery fees if the Prize Winner requires delivery to an address outside the United Kingdom.
                </p>
                <p>
                  8.3 &nbsp; All expenses to collect a Prize (where applicable) are the sole responsibility of the Prize Winner unless otherwise stated by the Promoter. The Prize Winner is also responsible for all taxes, duties, or charges in relation to receipt of the Prize.
                </p>
                <p>
                  8.4 &nbsp; Each Prize must be accepted as awarded and is non-transferable or convertible to other substitutes and cannot be used in conjunction with any other offers or discounts.
                </p>
                <p>
                  8.5 &nbsp; If the Promoter so offers, Prize Winners may have the option to elect to receive either the full Prize or a cash alternative set by the Promoter. The Prize Winner is under no obligation to accept the cash alternative.
                </p>
                <p>
                  8.6 &nbsp; The Promoter can store a Prize free of charge for up to 30 days after notifying the Prize Winner, after which time the Prize will be delivered. If the Prize needs to be stored for more than 30 days, storage costs shall be borne by the Prize Winner and must be paid before the Prize is released.
                </p>
              </div>
            </section>

            {/* 9. Refunds */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">9. Refunds</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                All entries are final and non-refundable, except in the event of a Competition cancellation under Clause 6.1 or where tickets are oversold due to a technical error.
              </p>
            </section>

            {/* 10. Prize Winner Publicity */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">10. Prize Winner Publicity</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  10.1 &nbsp; Subject to the Prize Winner&apos;s consent, the Prize Winner may be asked to provide photographs and/or pose for photographs and videos and to consent to have their personal details (including details of any Prize won) included in marketing material and public relations by the Promoter in connection with the Competition.
                </p>
                <p>
                  10.2 &nbsp; An Entrant has the right to withhold consent to these uses of their details, but the Promoter will be entitled to use a winning Entrant&apos;s first name and county when announcing the Prize Winner on the Platform and social media channels.
                </p>
              </div>
            </section>

            {/* 11. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">11. Limitation of Liability</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  11.1 &nbsp; The Promoter makes no representations or warranties of whatever nature as to the quality, suitability, or fitness for any particular purpose of any goods or services offered as Prizes. Except for liability for death or personal injury caused by the negligence of the Promoter, for any fraudulent misrepresentations, and for any matters which cannot be excluded or limited by law, the Promoter shall not be liable for any loss suffered or sustained to person or property including but not limited to consequential (including economic) loss by reason of any act or omission by the Promoter in connection with the Competitions or the supply of any Prize.
                </p>
                <p>
                  11.2 &nbsp; The total maximum aggregate liability of the Promoter to each Prize Winner shall be limited to the total value of the Prize that has been won by that Prize Winner.
                </p>
                <p>
                  11.3 &nbsp; The total maximum aggregate liability of the Promoter to an Entrant who is not a Prize Winner shall be limited to the amount that the Entrant has paid to enter Competitions in the preceding 12 months.
                </p>
                <p>
                  11.4 &nbsp; Nothing in these Terms and Conditions shall prevent you from exercising your statutory rights.
                </p>
              </div>
            </section>

            {/* 12. Electronic Communications */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">12. Electronic Communications</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                No responsibility will be accepted by the Promoter for failed, partial, or garbled computer transmissions, for any computer, telephone, cable, network, electronic, or internet hardware or software malfunctions, failures, connections, or availability, for the acts or omissions of any service provider, internet accessibility or availability, or for traffic congestion or unauthorised human act, including any errors or mistakes. The Promoter shall use its reasonable endeavours to award the Prize for a Competition to the correct Entrant. If due to hardware, software, or other technical failure, or due to human error, the Prize is awarded incorrectly, the Promoter reserves the right to reclaim the Prize and award it to the correct Entrant, at its sole discretion. Only the ticket recorded in our systems shall be entered into the relevant Competition and the Promoter shall not be held liable for any entries that occur as a result of malfunctioning software or other event.
              </p>
            </section>

            {/* 13. Data Protection */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">13. Data Protection</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  13.1 &nbsp; Any personal data that you supply to the Promoter will be processed by the Promoter to administer the Competitions and fulfil Prizes where applicable, as set out in the <a href="/privacy" className="text-brand-primary underline">Privacy Policy</a> on the Platform.
                </p>
                <p>
                  13.2 &nbsp; In order to process, record, and use your personal data, the Promoter may disclose it to: (i) any payment provider whose details you provide; (ii) any person to whom the Promoter proposes to transfer any of its rights or responsibilities; (iii) any person to whom the Promoter proposes to transfer its business or any part of it; (iv) comply with any legal or regulatory requirement; and (v) prevent, detect, or prosecute fraud and other crime.
                </p>
                <p>
                  13.3 &nbsp; If you, as a Prize Winner, do not consent to the Promoter using your name or likeness in promotional or marketing materials, the Promoter will respect your decision but will still need to hold such data in accordance with the Privacy Policy to retain records of your entry and winning of a Prize.
                </p>
              </div>
            </section>

            {/* 14. Your Account */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">14. Your Account</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  14.1 &nbsp; You must keep your account password secure and secret at all times and take steps to prevent it being used without your permission. You must not share your login credentials with anyone else and must use a password which is unique to your Coast Competitions account.
                </p>
                <p>
                  14.2 &nbsp; You must contact the Promoter immediately if you believe, suspect, or know that anyone apart from you has used your account or knows your password.
                </p>
                <p>
                  14.3 &nbsp; The Promoter shall not be responsible or liable for any consequences arising from any breach of this clause by you or from any unauthorised access to your account.
                </p>
              </div>
            </section>

            {/* 15. Payment Disputes and Chargebacks */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">15. Payment Disputes and Chargebacks</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  15.1 &nbsp; If you dispute any payment made to us, you shall contact us immediately to discuss the matter before initiating a chargeback.
                </p>
                <p>
                  15.2 &nbsp; In the event that you submit an unjustified chargeback (being a credit card or debit card chargeback or cancellation), the following shall be due and payable by you: (a) the charges due for any Competitions you entered in the period covered by the chargeback; (b) such chargeback costs as are levied upon us by your bank or card company; and (c) at our discretion, our reasonable costs and losses incurred in recovering the above-mentioned fees including debt recovery costs and legal fees.
                </p>
                <p>
                  15.3 &nbsp; In the event of an unjustified chargeback, we reserve the right to terminate your account on our Platform and to disqualify any entries associated with that account.
                </p>
              </div>
            </section>

            {/* 16. Use of the Platform */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">16. Use of the Platform</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  16.1 &nbsp; You agree that the Platform and the Competitions are for your own personal, non-commercial use, and you are only allowed to use your account and the Platform as set out in these Terms and Conditions.
                </p>
                <p>
                  16.2 &nbsp; You agree that you will only use your account and the Platform in an appropriate and lawful manner. You will not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>receive, access, or transmit any content which is obscene, threatening, racist, menacing, offensive, defamatory, or otherwise objectionable or unlawful;</li>
                  <li>knowingly or recklessly transmit any content (including viruses) through the Platform which will cause detriment or harm to the Platform or the Promoter&apos;s systems;</li>
                  <li>hack into, make excessive traffic demands on, or cause any impairment of the functions of any computer system, or engage in any behaviour intended to prevent others from using the Platform; or</li>
                  <li>authorise or allow anyone to do any of the above.</li>
                </ul>
                <p>
                  16.3 &nbsp; You agree to indemnify the Promoter against any costs, losses, damages, and expenses which the Promoter may suffer arising from any claim or demand by a third party due to your unlawful or negligent use of the Platform, or breach by you of these Terms and Conditions.
                </p>
                <p>
                  16.4 &nbsp; The Promoter is the owner or licensee of all copyright, trademarks, and other intellectual property rights in respect of the Competitions, the Platform, and all content thereon. You will not acquire any rights in any of these.
                </p>
                <p>
                  16.5 &nbsp; You must not copy, disclose, transmit, or otherwise make available any material on the Platform, reverse engineer or decompile any software used in connection with the Platform, or remove or change any copyright, trademark, or intellectual property notices.
                </p>
              </div>
            </section>

            {/* 17. Changes to Terms */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">17. Changes to Terms and Conditions</h2>
              <p className="text-brand-midnight/70 leading-relaxed font-medium">
                We may revise these Terms and Conditions from time to time and will post the most current version on the Platform as soon as the revised terms become effective. Please check this page periodically to ensure you understand the Terms and Conditions that apply. By continuing to access or use the Platform after any revisions come into effect, you agree to be bound by the revised Terms and Conditions.
              </p>
            </section>

            {/* 18. General */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">18. General</h2>
              <div className="space-y-4 text-brand-midnight/70 leading-relaxed font-medium">
                <p>
                  18.1 &nbsp; If the Promoter fails or delays to enforce a provision of these Terms and Conditions, this failure or delay is not a waiver of the Promoter&apos;s right to do so later.
                </p>
                <p>
                  18.2 &nbsp; If any provision (or part of a provision) of these Terms and Conditions is decided by a court of competent jurisdiction to be void or unenforceable, that decision will only affect the particular provision and will not make the other provisions void or unenforceable.
                </p>
                <p>
                  18.3 &nbsp; You may not assign or otherwise transfer (in whole or in part) your rights or obligations under these Terms and Conditions. Any breach of this clause may result in your account being suspended or terminated immediately. The Promoter may assign or transfer its rights and obligations under these Terms and Conditions to any third party at its sole discretion, including to its successor in connection with a merger, reorganisation, or sale of all or substantially all assets.
                </p>
                <p>
                  18.4 &nbsp; These Terms and Conditions constitute the entire agreement between you and the Promoter regarding the subject matter herein and supersede all prior or contemporaneous agreements and terms applicable to the subject matter.
                </p>
                <p>
                  18.5 &nbsp; A person who is not a party to these Terms and Conditions has no rights under the Contracts (Rights of Third Parties) Act 1999 or otherwise to enforce any provision of these Terms and Conditions.
                </p>
                <p>
                  18.6 &nbsp; The Promoter will not be liable for any delay or failure to perform any obligation under these Terms and Conditions where the delay or failure results from any cause beyond its reasonable control, including but not limited to acts of God, labour disputes or other industrial disturbances, electrical or power outages, utilities or other telecommunications failures, earthquake, storms or other elements of nature, blockages, embargoes, riots, acts or orders of government, acts of terrorism, or war.
                </p>
                <p>
                  18.7 &nbsp; The Platform may contain hyperlinks to websites operated by third parties. Such hyperlinks are provided for your reference only. We do not control such websites and are not responsible for their content or practices. Our inclusion of hyperlinks does not imply any endorsement of, association with, or sponsorship of those websites.
                </p>
                <p>
                  18.8 &nbsp; The exercise by the Promoter of any discretion provided for in these Terms and Conditions will be final and binding.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-black uppercase tracking-tight text-brand-midnight mb-6">Contact Details</h2>
              <div className="text-brand-midnight/70 leading-relaxed font-medium space-y-2">
                <p><strong>Promoter:</strong> Coast Competitions Ltd</p>
                <p>33 Seaview Drive, Ogmore-By-Sea, Bridgend, Wales, CF32 0PB</p>
                <p><strong>Email:</strong> support@coastcompetitions.co.uk</p>
                <p><strong>Platform:</strong> <a href="https://www.coastcompetitions.co.uk" className="text-brand-primary underline">www.coastcompetitions.co.uk</a></p>
              </div>
            </section>

          </div>
        </div>
      </Container>
    </div>
  );
}
