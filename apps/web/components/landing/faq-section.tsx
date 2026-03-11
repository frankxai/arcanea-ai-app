'use client';

import { m, useInView, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { useRef, useState } from 'react';
import { PhQuestion, PhPlus, PhMinus } from '@/lib/phosphor-icons';

const FAQS = [
  // — Getting Started —
  {
    question: 'What do I get on the free plan?',
    answer: '3 Luminors (writing, research, brainstorming), 100 messages per month, full Library browsing, and Academy access through Gate 2.',
  },
  {
    question: 'Do I need a credit card to start?',
    answer: 'No. The Spark plan is free with no card required.',
  },
  // — Luminors —
  {
    question: 'What are Luminors?',
    answer: 'AI companions, each built for a specific creative domain — writing, code, design, music, research, and more. You chat with them directly, and they remember your work across sessions.',
  },
  {
    question: 'Can I switch between Luminors mid-conversation?',
    answer: 'Yes. Bring a different Luminor into any conversation at any point.',
  },
  // — Platform —
  {
    question: 'Is my work private?',
    answer: 'Yes. Your conversations and creations are encrypted and never used for training. You own everything you make on Arcanea.',
  },
  {
    question: 'Can I export my work?',
    answer: 'Spark exports to PDF. Creator and Studio add Markdown, HTML, and API access. Studio can export without Arcanea branding.',
  },
  {
    question: 'What is the Ten Gates system?',
    answer: 'A progression framework for creative growth. Each Gate represents a stage of mastery, from Foundation to Source. You advance by creating, not by paying.',
  },
  // — Pricing —
  {
    question: 'Can I switch plans later?',
    answer: 'Yes. Upgrade or downgrade anytime from your settings. Payments are prorated.',
  },
  {
    question: 'What happens to my work if I downgrade?',
    answer: 'Everything stays. Your creations, conversations, and progress are always kept. You return to the limits of your new plan.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Cancel from your settings and keep access through the end of your billing period.',
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05 }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-start justify-between gap-4 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-white group-hover:text-atlantean-teal-aqua transition-colors">
          {question}
        </span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
            isOpen
              ? 'bg-atlantean-teal-aqua text-cosmic-deep'
              : 'bg-white/[0.04] text-text-muted group-hover:bg-white/[0.06]'
          }`}
        >
          {isOpen ? <PhMinus className="w-4 h-4" /> : <PhPlus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-text-secondary leading-relaxed">{answer}</p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <LazyMotion features={domAnimation}>
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-atlantean-teal-aqua/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-atlantean-teal-aqua/20 mb-6">
            <PhQuestion className="w-3.5 h-3.5 text-atlantean-teal-aqua" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-atlantean-teal-aqua/90">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Frequently asked questions
          </h2>
          <p className="text-xl text-text-secondary">
            Everything you need to know about Arcanea.
          </p>
        </m.div>

        {/* FAQ list */}
        <div className="border-t border-white/[0.06]">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              index={i}
            />
          ))}
        </div>

        {/* Still have questions */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center p-8 rounded-2xl liquid-glass border border-white/[0.06]"
        >
          <h3 className="text-xl font-display font-semibold mb-3">Still have questions?</h3>
          <p className="text-text-secondary mb-6">
            We typically respond within 24 hours.
          </p>
          <a
            href="mailto:support@arcanea.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-atlantean-teal-aqua text-cosmic-deep font-semibold hover:bg-atlantean-teal-aqua/90 transition-colors"
          >
            Contact Support
          </a>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
