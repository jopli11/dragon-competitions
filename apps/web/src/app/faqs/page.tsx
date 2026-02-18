"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import { Container } from "@/components/Container";
import { GlassCard, GradientText, BrandSectionHeading, BrandLinkButton } from "@/lib/styles";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: white;
  padding: 4rem 0 8rem;
`;

const AccordionItem = styled.div<{ isOpen: boolean }>`
  margin-bottom: 1rem;
  border-radius: 1.5rem;
  overflow: hidden;
  background: white;
  border: 1px solid ${({ isOpen }) => (isOpen ? "rgba(0, 112, 224, 0.3)" : "rgba(0, 48, 135, 0.05)")};
  box-shadow: ${({ isOpen }) => (isOpen ? "0 10px 30px rgba(0, 112, 224, 0.05)" : "0 4px 12px rgba(0, 48, 135, 0.02)")};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(0, 112, 224, 0.2);
    transform: translateY(-2px);
  }
`;

const AccordionHeader = styled.button`
  width: 100%;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const Question = styled.span`
  font-size: 1.125rem;
  font-weight: 800;
  color: #0a2540;
  letter-spacing: -0.01em;
`;

const Icon = styled.span<{ isOpen: boolean }>`
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: ${({ isOpen }) => (isOpen ? "#0070e0" : "rgba(0, 48, 135, 0.05)")};
  color: ${({ isOpen }) => (isOpen ? "white" : "#0a2540")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0)")};
  font-weight: bold;
`;

const AccordionContent = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? "500px" : "0")};
  opacity: ${({ isOpen }) => (isOpen ? "1" : "0")};
  padding: ${({ isOpen }) => (isOpen ? "0 2rem 2rem" : "0 2rem")};
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(10, 37, 64, 0.6);
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
`;

const CategoryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 900;
  color: #0070e0;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  margin-top: 4rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(0, 112, 224, 0.1);
  }
`;

const faqCategories = [
  {
    title: "General Questions",
    items: [
      {
        question: "How do Dragon Competitions work?",
        answer: "It's simple! Choose a prize you'd love to win, answer the skill-based qualifying question correctly, and purchase your tickets. Once the countdown ends or all tickets are sold, we perform a live draw to pick the winner.",
      },
      {
        question: "Are these competitions legal?",
        answer: "Yes, absolutely. We operate strictly within UK laws for skill-based competitions. The requirement of a correct answer to a skill question distinguishes our competitions from lotteries or gambling.",
      },
      {
        question: "Who can enter?",
        answer: "Our competitions are open to all residents of the United Kingdom who are 18 years of age or older at the time of entry.",
      },
    ],
  },
  {
    title: "Tickets & Entry",
    items: [
      {
        question: "How many tickets can I buy?",
        answer: "The maximum number of tickets per person varies for each competition. You can find the specific limit on each individual raffle page.",
      },
      {
        question: "What happens if I answer the question incorrectly?",
        answer: "If you answer the skill question incorrectly, your entry will not be valid and you will not be entered into the draw. You are welcome to try again!",
      },
      {
        question: "Will I get a confirmation of my entry?",
        answer: "Yes, immediately after a successful purchase, you will receive an email confirmation containing your unique ticket numbers for that draw.",
      },
    ],
  },
  {
    title: "The Draw & Winners",
    items: [
      {
        question: "How is the winner chosen?",
        answer: "We use a random number generator during our live draws to ensure 100% transparency and fairness. Every draw is broadcast live on our social media channels.",
      },
      {
        question: "Do you ever extend draw dates?",
        answer: "Never. At Dragon Competitions, we pride ourselves on our 'No Extensions' policy. When the timer hits zero, the draw happens, regardless of how many tickets have been sold.",
      },
      {
        question: "How will I know if I've won?",
        answer: "Winners are announced live and contacted immediately via phone and email. We also publish all results on our 'Draw Results' page.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <PageWrapper>
      <Container>
        <div className="text-center mb-12">
          <BrandSectionHeading>Frequently Asked <GradientText>Questions</GradientText></BrandSectionHeading>
          <p className="mt-4 text-brand-midnight/60 font-medium uppercase tracking-widest text-sm">
            Everything you need to know about winning with Dragon.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqCategories.map((category, catIdx) => (
            <div key={category.title}>
              <CategoryTitle>{category.title}</CategoryTitle>
              {category.items.map((item, itemIdx) => {
                const id = `${catIdx}-${itemIdx}`;
                const isOpen = openIndex === id;
                return (
                  <AccordionItem key={id} isOpen={isOpen}>
                    <AccordionHeader onClick={() => toggle(id)}>
                      <Question>{item.question}</Question>
                      <Icon isOpen={isOpen}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Icon>
                    </AccordionHeader>
                    <AccordionContent isOpen={isOpen}>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[3rem] text-center bg-gradient-to-br from-brand-primary to-brand-secondary p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white">Still have questions?</h3>
            <p className="mt-4 text-white/60 font-medium">
              Our support team is always here to help you.
            </p>
            <div className="mt-8">
              <BrandLinkButton variant="secondary" size="lg" href="/contact" className="!bg-white !text-brand-primary hover:!bg-brand-accent">
                Contact Support
              </BrandLinkButton>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10 text-white">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
            </svg>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
}
