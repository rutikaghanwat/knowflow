import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How does KNOWFLOW ensure it does not hallucinate false information?',
    answer:
      'KNOWFLOW utilizes a strict 4-tier classification system: Verified Facts, AI Inferences, Recommendations, and Unknown/Missing. Every Verified Fact is backed by a verifiable source citation (exact commit hash, file path, line numbers, or document page). Nothing is accepted as truth without traceable evidence, and the Project Manager reviews every finding before final release.',
  },
  {
    question: 'Does KNOWFLOW require write access to our GitHub repositories or execute code?',
    answer:
      'No. KNOWFLOW requires strictly read-only access to repository commit logs, pull request metadata, and Markdown/documentation files. It never pushes commits, modifies branches, alters code, or executes commands in your repositories.',
  },
  {
    question: 'What is the "Access Permission First, Role Relevance Second" principle?',
    answer:
      'KNOWFLOW operates a dual-layer security model. First, it enforces a strict access boundary: incoming employees can only view knowledge from repositories and documents they are formally authorized to access. Second, within those permitted sources, KNOWFLOW personalizes the report so backend developers see backend architecture, frontend developers see component state, and managers see milestone tracking.',
  },
  {
    question: 'What file formats and knowledge sources can be ingested?',
    answer:
      'KNOWFLOW ingests technical documentation in PDF and DOCX formats (including Architecture Decision Records, postmortems, and runbooks) alongside connected GitHub repositories (commits, PR descriptions, and markdown documentation).',
  },
  {
    question: 'Can the Project Manager edit or reject AI-generated findings?',
    answer:
      'Yes. In KNOWFLOW, the Project Manager is the primary administrator with full governance authority. Managers can inspect the raw source quote for every claim, add managerial comments, reclassify items, request clarifications from the departing engineer, or reject handovers until critical gaps are resolved.',
  },
  {
    question: 'Is our proprietary code or documentation used to train public AI models?',
    answer:
      'Never. KNOWFLOW processes all data through enterprise-grade endpoints with strict zero-data-retention guarantees. Your proprietary source code, internal architecture decisions, and employee discussions are never stored or used to train third-party foundation models.',
  },
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-[#218653] shadow-resting'
                : 'bg-white/80 hover:bg-white border-[#E5EAE6]'
            }`}
          >
            <button
              onClick={() => toggleFaq(idx)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3">
                <HelpCircle
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isOpen ? 'text-[#218653]' : 'text-[#8E9B96]'
                  }`}
                />
                <span className="text-sm sm:text-base font-bold text-[#142640] font-heading">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#687570] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#218653]' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#687570] leading-relaxed border-t border-[#F5F7F6] pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
