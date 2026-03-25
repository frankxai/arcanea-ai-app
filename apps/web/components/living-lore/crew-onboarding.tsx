'use client';

import { useState, useCallback } from 'react';
import { LazyMotion, domMax, m, AnimatePresence } from 'framer-motion';
import { transitions, springs } from '@/lib/design/motion';
import { CREW } from '@/lib/living-lore/crew-data';
import type { CrewMember } from '@/lib/living-lore/types';

/* ----------------------------------------------------------------
   Props
   ---------------------------------------------------------------- */

interface CrewOnboardingProps {
  onComplete?: (selectedCompanion: string) => void;
  onSkip?: () => void;
}

/* ----------------------------------------------------------------
   Crew quotes — the hook line for each member
   ---------------------------------------------------------------- */

const CREW_QUOTES: Record<string, string> = {
  'crew-ren':
    'I draw things before they happen. I don\u2019t know what that makes me.',
  'crew-vesper':
    'I remember fragments of someone who walked this path before. They did not return.',
  'crew-kaedra':
    'Every circuit in my body was someone else\u2019s choice. I fight for the right to choose my own.',
  'crew-thalien':
    'Five Ages I have watched. Five Ages I stayed silent. The silence ends here.',
  'crew-axiom':
    'I have polished the Foundation Gate for 312 years. Today I was told to step across it.',
  'crew-solenne':
    'Too divine for the human world. Too human for the divine. The crew doesn\u2019t care.',
  'crew-jinx':
    '\u2026sends an image of seven fires burning in a circle, then one word: "Together."',
};

/* ----------------------------------------------------------------
   Animation variants
   ---------------------------------------------------------------- */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { ...springs.snappy },
      opacity: { duration: 0.3 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: {
      x: { ...springs.snappy },
      opacity: { duration: 0.2 },
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, ...transitions.enter },
  }),
};

/* ----------------------------------------------------------------
   Total steps: 1 intro + 7 crew + 1 choose = 9
   ---------------------------------------------------------------- */

const TOTAL_STEPS = 9;

/* ----------------------------------------------------------------
   Sub-components
   ---------------------------------------------------------------- */

function IntroStep({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto min-h-[60vh]">
      <m.p
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-sm uppercase tracking-[0.3em] text-text-muted mb-8"
      >
        Before the journey begins&hellip;
      </m.p>

      <m.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight"
      >
        Seven beings were called to walk the Ten Gates.
      </m.h1>

      <m.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 text-text-muted text-lg leading-relaxed max-w-lg"
      >
        Each carries a different truth. Each sees the world through different
        eyes.
      </m.p>

      <m.p
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-2 text-atlantean-teal-aqua text-glow-soft text-lg"
      >
        Meet them.
      </m.p>

      <m.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
        <button
          onClick={onContinue}
          className="mt-10 liquid-glass rounded-xl px-8 py-3 font-semibold text-text-primary hover:bg-white/[0.08] transition-colors duration-200"
        >
          Continue
        </button>
      </m.div>
    </div>
  );
}

function CrewStep({ member }: { member: CrewMember }) {
  const quote = CREW_QUOTES[member.id] ?? member.backstoryHook;

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-2xl mx-auto min-h-[60vh]">
      {/* Avatar gradient circle */}
      <m.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...springs.gentle }}
        className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl md:text-6xl mb-8 animate-float-slow"
        style={{
          background: `linear-gradient(135deg, ${member.color}25, ${member.color}08)`,
          boxShadow: `0 0 60px ${member.color}20, 0 0 120px ${member.color}08`,
        }}
      >
        {member.avatar}
      </m.div>

      {/* Name */}
      <m.h2
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-cinzel text-4xl md:text-5xl font-semibold text-text-primary text-glow-soft"
        style={{ textShadow: `0 0 30px ${member.color}40` }}
      >
        {member.name}
      </m.h2>

      {/* Title + Species */}
      <m.p
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-2 text-sm"
        style={{ color: member.color }}
      >
        {member.title}
      </m.p>
      <m.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-1 text-xs text-text-muted"
      >
        {member.species}
      </m.p>

      {/* Element badge */}
      <m.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-4 inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-1.5 text-xs text-text-muted"
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: member.color }}
        />
        {member.element}
      </m.div>

      {/* Defining quote */}
      <m.blockquote
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-8 text-lg md:text-xl text-text-muted leading-relaxed italic max-w-lg"
      >
        &ldquo;{quote}&rdquo;
      </m.blockquote>
    </div>
  );
}

function ChooseStep({
  selected,
  onSelect,
  onBegin,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onBegin: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto min-h-[60vh]">
      <m.h2
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="font-cinzel text-2xl md:text-3xl text-text-primary mb-2"
      >
        Choose Your Companion
      </m.h2>
      <m.p
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-text-muted mb-8 max-w-md"
      >
        Every creator needs a companion. Who resonates with you?
      </m.p>

      {/* Grid of selectable crew cards */}
      <m.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full mb-10"
      >
        {CREW.map((member) => {
          const isSelected = selected === member.id;
          return (
            <button
              key={member.id}
              onClick={() => onSelect(member.id)}
              className={`
                relative liquid-glass rounded-2xl p-5 text-left transition-all duration-300
                ${isSelected ? 'ring-2 glow-soft' : 'hover:bg-white/[0.04]'}
              `}
              style={{
                // Ring color applied via Tailwind ring-2 class + border
                boxShadow: isSelected
                  ? `0 0 24px ${member.color}30, 0 0 48px ${member.color}10`
                  : undefined,
                borderColor: isSelected ? `${member.color}40` : undefined,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 animate-float-slow"
                style={{
                  background: `linear-gradient(135deg, ${member.color}20, ${member.color}08)`,
                }}
              >
                {member.avatar}
              </div>
              <p
                className="font-cinzel text-sm font-semibold text-text-primary"
                style={
                  isSelected
                    ? { color: member.color, textShadow: `0 0 12px ${member.color}40` }
                    : undefined
                }
              >
                {member.name}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                {member.title}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-text-dim">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                {member.element}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <m.div
                  layoutId="selected-ring"
                  className="absolute inset-0 rounded-2xl border-2 pointer-events-none"
                  style={{ borderColor: member.color }}
                  transition={{ ...springs.snappy }}
                />
              )}
            </button>
          );
        })}
      </m.div>

      {/* Begin button */}
      <m.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
        <button
          onClick={onBegin}
          disabled={!selected}
          className={`
            rounded-xl px-8 py-3 font-semibold transition-all duration-300
            ${
              selected
                ? 'liquid-glass-elevated text-atlantean-teal-aqua hover:brightness-110 glow-soft'
                : 'liquid-glass text-text-dim cursor-not-allowed opacity-50'
            }
          `}
        >
          Begin the Journey
        </button>
      </m.div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Progress dots
   ---------------------------------------------------------------- */

function ProgressDots({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? 'w-6 bg-atlantean-teal-aqua'
              : i < current
                ? 'w-1.5 bg-white/20'
                : 'w-1.5 bg-white/10'
          }`}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------
   Main Component
   ---------------------------------------------------------------- */

export function CrewOnboarding({ onComplete, onSkip }: CrewOnboardingProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(
    null,
  );

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goPrev = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleBegin = useCallback(() => {
    if (selectedCompanion) {
      onComplete?.(selectedCompanion);
    }
  }, [selectedCompanion, onComplete]);

  // Steps 1-7 map to CREW[0..6]
  const isIntro = step === 0;
  const isChoose = step === TOTAL_STEPS - 1;
  const crewIndex = !isIntro && !isChoose ? step - 1 : -1;

  return (
    <LazyMotion features={domMax} strict>
      <div className="relative flex min-h-[100dvh] flex-col">
        {/* Ambient background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[8%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.08)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(147,112,219,0.06)_0%,transparent_70%)] blur-3xl" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(120,166,255,0.04)_0%,transparent_70%)] blur-3xl" />
        </div>

        {/* Top bar: skip + progress */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <button
            onClick={onSkip}
            className="text-xs text-text-dim hover:text-text-muted transition-colors"
          >
            Skip
          </button>
          <ProgressDots current={step} total={TOTAL_STEPS} />
          <div className="w-8" /> {/* Spacer for balance */}
        </header>

        {/* Content area */}
        <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <m.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {isIntro && <IntroStep onContinue={goNext} />}
              {crewIndex >= 0 && crewIndex < CREW.length && (
                <CrewStep member={CREW[crewIndex]} />
              )}
              {isChoose && (
                <ChooseStep
                  selected={selectedCompanion}
                  onSelect={setSelectedCompanion}
                  onBegin={handleBegin}
                />
              )}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <footer className="relative z-10 flex items-center justify-between px-6 py-6">
          <button
            onClick={goPrev}
            disabled={step === 0}
            className={`text-sm transition-colors ${
              step === 0
                ? 'text-transparent cursor-default'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            &larr; Back
          </button>

          {/* Next button (not shown on intro or choose step) */}
          {!isIntro && !isChoose && (
            <button
              onClick={goNext}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              Next &rarr;
            </button>
          )}

          {isIntro && <div />}
          {isChoose && <div />}
        </footer>
      </div>
    </LazyMotion>
  );
}
