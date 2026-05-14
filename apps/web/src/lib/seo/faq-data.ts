export type FaqCategory = {
  title: string;
  items: { question: string; answer: string }[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    title: "General Questions",
    items: [
      {
        question: "How do Coast Competitions work?",
        answer:
          "It's simple! Choose a prize you'd love to win, answer the skill-based qualifying question correctly, and purchase your tickets. Once the countdown ends or all tickets are sold, we perform a live draw to pick the winner.",
      },
      {
        question: "Are these competitions legal?",
        answer:
          "Yes, absolutely. We operate strictly within UK laws for skill-based competitions. The requirement of a correct answer to a skill question distinguishes our competitions from lotteries or gambling under the UK Gambling Act 2005.",
      },
      {
        question: "Who can enter?",
        answer:
          "Our competitions are open to all residents of the United Kingdom who are 18 years of age or older at the time of entry.",
      },
      {
        question: "Are competition winnings tax free in the UK?",
        answer:
          "Yes. In the United Kingdom, prizes won in skill-based competitions and raffles are not classed as income and are therefore not subject to income tax. You receive 100% of the prize value. Always check HMRC guidance if your personal circumstances are complex.",
      },
    ],
  },
  {
    title: "Tickets & Entry",
    items: [
      {
        question: "How many tickets can I buy?",
        answer:
          "The maximum number of tickets per person varies for each competition. You can find the specific limit on each individual competition page.",
      },
      {
        question: "What happens if I answer the question incorrectly?",
        answer:
          "If you answer the skill question incorrectly, your entry will not be valid and you will not be entered into the draw. You are welcome to try again!",
      },
      {
        question: "Will I get a confirmation of my entry?",
        answer:
          "Yes, immediately after a successful purchase, you will receive an email confirmation containing your unique ticket numbers for that draw.",
      },
      {
        question: "Is there a free entry route?",
        answer:
          "Yes. Every Coast Competitions draw has a free postal entry route, which is what allows us to operate legally in the UK without a gambling licence. Full instructions are available on our Terms & Conditions page under the Free Postal Entry section.",
      },
    ],
  },
  {
    title: "The Draw & Winners",
    items: [
      {
        question: "How is the winner chosen?",
        answer:
          "For automated draws we use a Cryptographically Secure Pseudo-Random Number Generator (CSPRNG). For live draws we use an independent random number generator broadcast on our social media channels. Every draw publishes its seed and total ticket count so anyone can verify the result.",
      },
      {
        question: "Do you ever extend draw dates?",
        answer:
          "Never. At Coast Competitions, we pride ourselves on our 'No Extensions' policy. When the timer hits zero, the draw happens, regardless of how many tickets have been sold.",
      },
      {
        question: "How will I know if I've won?",
        answer:
          "Winners are announced live and contacted immediately via phone and email. We also publish all results on our Draw Results page.",
      },
    ],
  },
];
