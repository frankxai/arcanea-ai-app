"use client";

import { m, useInView, AnimatePresence } from "framer-motion";
import { MotionProvider } from "@/lib/motion";
import { useRef, useState, useCallback } from "react";
import {
  Plus,
  Minus,
} from "@/lib/phosphor-icons";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTASection } from "@/components/landing/cta-section";
import { GuardianShowcase } from "@/components/landing/guardian-showcase";
import { WorldsShowcase } from "@/components/landing/worlds-showcase";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const FAQ_ITEMS = [
  {
    q: "What makes Arcanea different from other AI tools?",
    a: "Sixteen Luminors — specialized creative minds trained on 190K words of original philosophy, not generic AI. A mythology-driven intelligence layer, 17 knowledge collections, and a 10-gate mastery framework. You pick the Luminor that fits your project.",
  },
  {
    q: "How do the Luminors work?",
    a: "Each Luminor is specialized for a creative domain — writing, research, design, music, strategy. Trained on Arcanea's philosophy, not generic datasets. Pick one, describe your project, and build together.",
  },
  {
    q: "What is the Library of Arcanea?",
    a: "190K+ words of original creative philosophy across 17 collections. Laws, meditations, parables, and dialogues — the knowledge foundation that shapes every Luminor in the system.",
  },
  {
    q: "What is the Ten Gates system?",
    a: "A progression framework from Apprentice to Luminor. Each Gate maps to a creative capacity. Progress is earned through creation, not purchases.",
  },
  {
    q: "How does BYOK work?",
    a: "Bring your own API key. Your key lives in your browser's localStorage — we never see it or store it on our servers. Pay OpenAI, Anthropic, or Google directly at cost. No markup, no middleman, no vendor lock-in. You own your usage, billing, and data.",
  },
  {
    q: "Do you train on my data?",
    a: "No. Never. Your creations, conversations, and worlds are yours. Export anytime as markdown, JSON, or your preferred format. The database is yours to run locally too if you want full sovereignty.",
  },
  {
    q: "Is my work private?",
    a: "Yes. We do not train on your data. What you build stays yours — keep it in Arcanea or export it.",
  },
];

// ---------------------------------------------------------------------------
// Atmospheric Divider
// ---------------------------------------------------------------------------

function AtmosphericDivider({
  variant = "teal",
}: {
  variant?: "teal" | "purple" | "gold";
}) {
  const colors = {
    teal: "rgba(0,188,212,0.06)",
    purple: "rgba(13,71,161,0.06)",
    gold: "rgba(255,215,0,0.04)",
  };
  return (
    <div className="relative h-px">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${colors[variant]}, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

function FAQItem({
  item,
  index,
}: {
  item: (typeof FAQ_ITEMS)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const measureRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContentHeight(node.scrollHeight);
    }
  }, []);

  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full text-left py-6 flex items-start justify-between gap-4 border-b border-white/[0.06] group cursor-pointer min-h-[56px]"
      >
        <span className="text-base font-medium text-white/80 group-hover:text-white transition-colors leading-snug">
          {item.q}
        </span>
        <span className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full border border-white/[0.10] flex items-center justify-center group-hover:border-white/[0.20] transition-colors">
          {open ? (
            <Minus className="w-3.5 h-3.5 text-white/40" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-white/40" />
          )}
        </span>
      </button>
      <m.div
        ref={measureRef}
        initial={false}
        animate={{
          height: open ? contentHeight : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="py-5 text-sm text-white/45 leading-relaxed max-w-2xl font-body">
          {item.a}
        </p>
      </m.div>
    </m.div>
  );
}

function FAQInline() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-24 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
            Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
            Frequently asked
          </h2>
        </m.div>

        <div>
          {FAQ_ITEMS.map((item, i) => (
            <FAQItem key={item.q} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Exported below-fold composition
// ---------------------------------------------------------------------------

export interface V3BelowFoldProps {
  collectionsCount: number;
  textsCount: number;
  totalWords: number;
}

export function V3BelowFold({
  collectionsCount,
  textsCount,
  totalWords,
}: V3BelowFoldProps) {
  return (
    <MotionProvider>
      <>
        {/* 1. Guardian showcase — visual proof */}
        <GuardianShowcase />

        <AtmosphericDivider variant="teal" />

        {/* 2. How it works — 4 clear steps */}
        <HowItWorks />

        {/* 3. Worlds showcase — multiverse teaser */}
        <WorldsShowcase />

        <AtmosphericDivider variant="gold" />

        {/* 4. FAQ — objection handling */}
        <FAQInline />

        {/* 4. Built With — tech trust strip */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20 text-center mb-5">
              Built With
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-mono text-white/25">
              <span>Next.js 16</span>
              <span className="text-white/10">·</span>
              <span>React 19</span>
              <span className="text-white/10">·</span>
              <span>Supabase</span>
              <span className="text-white/10">·</span>
              <span>Vercel</span>
              <span className="text-white/10">·</span>
              <span>Claude</span>
              <span className="text-white/10">·</span>
              <span>Gemini</span>
            </div>
          </div>
        </section>

        <AtmosphericDivider variant="purple" />

        {/* 5. Final CTA */}
        <CTASection />
      </>
    </MotionProvider>
  );
}
