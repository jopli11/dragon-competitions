"use client";

import { useState } from "react";
import styled from "@emotion/styled";
import type { FaqCategory } from "@/lib/seo/faq-data";

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

export function FaqsAccordion({ categories }: { categories: FaqCategory[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>("0-0");

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {categories.map((category, catIdx) => (
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
  );
}
