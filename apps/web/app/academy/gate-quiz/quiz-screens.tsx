"use client";

/**
 * Gate Quiz — Screen Components
 * IntroScreen, QuestionScreen, ResultScreen, and shared sub-components.
 */

import { m } from "framer-motion";
import Link from "next/link";
import {
  PhSparkle,
  PhCaretRight,
  PhArrowCounterClockwise,
  PhArrowRight,
} from '@/lib/phosphor-icons';
import type { GuardianData, QuizQuestion } from './quiz-data';
import { GUARDIANS } from './quiz-data';

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: {
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number] as [
      number,
      number,
      number,
      number,
    ],
  },
};

export const slideRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.04 },
  transition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function AmbientOrbs({ color }: { color: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -left-32 top-8 h-96 w-96 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: color }}
      />
      <div
        className="absolute -right-24 bottom-12 h-80 w-80 rounded-full blur-3xl opacity-15"
        style={{ backgroundColor: color }}
      />
      <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-primary/10 blur-3xl" />
    </div>
  );
}

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = (current / total) * 100;
  return (
    <div className="relative mb-8">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-text-muted font-sans">
          Question {current} of {total}
        </span>
        <span className="text-xs text-text-muted font-sans font-mono">
          {Math.round(percent)}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
        <m.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #0d47a1, #00bcd4)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTRO SCREEN
// ─────────────────────────────────────────────────────────────────────────────

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <m.div {...fadeUp} className="relative">
      <AmbientOrbs color="#0d47a1" />

      <div className="relative liquid-glass rounded-3xl p-8 md:p-14 overflow-hidden">
        {/* Inner shimmer accent */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>

        <div className="relative max-w-2xl">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/20 shadow-glow-brand">
              <PhSparkle className="h-4 w-4 text-brand-primary" />
            </div>
            <span className="text-xs uppercase tracking-[0.4em] text-brand-primary font-sans font-semibold">
              The Academy of Creation
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-fluid-3xl font-bold tracking-tight leading-tight md:text-fluid-4xl">
            <span className="text-gradient-brand">Which Guardian</span>
            <br />
            <span className="text-text-primary">Resonates With You?</span>
          </h1>

          {/* Body */}
          <p className="mt-6 text-fluid-base text-text-secondary font-sans leading-relaxed">
            In the world of Arcanea, every creator carries an affinity with one
            of the Ten Guardians — the divine beings who hold the Gates of
            creative mastery.
          </p>
          <p className="mt-4 text-fluid-base text-text-secondary font-sans leading-relaxed">
            This is not a test. It is a mirror. Ten questions will reveal which
            Guardian&apos;s wisdom already lives in how you create, what drives
            you, and what calls to you from beyond the horizon.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { label: "Questions", value: "10" },
              { label: "Guardians", value: "10" },
              { label: "Time", value: "3 min" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted font-sans uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10">
            <m.button
              onClick={onStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 rounded-xl bg-brand-primary px-8 py-4 font-semibold text-white shadow-glow-brand transition-all hover:bg-brand-primary/90 font-sans"
            >
              Begin the Journey
              <PhCaretRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </m.button>
          </div>

          {/* Disclaimer */}
          <p className="mt-6 text-xs text-text-muted font-sans">
            Your answers are private. Sign in to save your result to your profile.
          </p>
        </div>
      </div>

      {/* Gate preview strip */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Object.values(GUARDIANS).map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.key}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 liquid-glass rounded-xl p-3 min-w-[72px]"
            >
              <span style={{ color: g.color }}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs text-text-muted font-sans text-center leading-none">
                {g.name}
              </span>
            </div>
          );
        })}
      </div>
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION SCREEN
// ─────────────────────────────────────────────────────────────────────────────

interface QuestionScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedChoice: number | null;
  onSelect: (index: number) => void;
  onNext: () => void;
}

export function QuestionScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedChoice,
  onSelect,
  onNext,
}: QuestionScreenProps) {
  return (
    <m.div key={question.id} {...slideRight}>
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className="relative liquid-glass rounded-3xl overflow-hidden">
        <AmbientOrbs color="#0d47a1" />

        <div className="relative p-8 md:p-10">
          {/* Question header */}
          <div className="mb-8">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-brand-gold font-sans font-semibold">
              Gate {questionNumber}
            </div>
            <h2 className="font-display text-fluid-2xl font-bold text-text-primary leading-snug">
              {question.question}
            </h2>
            {question.subtext && (
              <p className="mt-3 text-sm text-text-muted font-sans italic">
                {question.subtext}
              </p>
            )}
          </div>

          {/* Choices */}
          <div className="space-y-3">
            {question.choices.map((choice, index) => {
              const isSelected = selectedChoice === index;
              return (
                <m.button
                  key={index}
                  onClick={() => onSelect(index)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  className={[
                    "group w-full rounded-xl p-5 text-left transition-all duration-300 font-sans",
                    isSelected
                      ? "glass-strong border border-brand-primary/50 shadow-glow-brand"
                      : "card-3d liquid-glass border border-white/[0.08] hover:border-crystal/30 hover:bg-white/[0.03]",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-4">
                    {/* Choice indicator */}
                    <div
                      className={[
                        "mt-0.5 flex-shrink-0 h-5 w-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                        isSelected
                          ? "border-brand-primary bg-brand-primary"
                          : "border-white/[0.12] group-hover:border-crystal/50",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <m.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2 w-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                    {/* Choice text */}
                    <span
                      className={[
                        "text-base leading-relaxed transition-colors duration-200",
                        isSelected
                          ? "text-text-primary"
                          : "text-text-secondary group-hover:text-text-primary",
                      ].join(" ")}
                    >
                      {choice.text}
                    </span>
                  </div>
                </m.button>
              );
            })}
          </div>

          {/* Next button */}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-text-muted font-sans">
              {selectedChoice === null
                ? "Choose one to continue"
                : "Selection made"}
            </span>
            <m.button
              onClick={onNext}
              disabled={selectedChoice === null}
              whileHover={selectedChoice !== null ? { scale: 1.02 } : {}}
              whileTap={selectedChoice !== null ? { scale: 0.98 } : {}}
              className={[
                "inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all font-sans",
                selectedChoice !== null
                  ? "bg-brand-primary text-white shadow-glow-brand hover:bg-brand-primary/90 cursor-pointer"
                  : "bg-white/[0.04] text-text-disabled cursor-not-allowed",
              ].join(" ")}
            >
              {questionNumber === totalQuestions
                ? "See My Guardian"
                : "Next Question"}
              <PhArrowRight className="h-4 w-4" />
            </m.button>
          </div>
        </div>
      </div>
    </m.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULT SCREEN
// ─────────────────────────────────────────────────────────────────────────────

interface ResultScreenProps {
  guardian: GuardianData;
  onRestart: () => void;
  onSave: () => Promise<void>;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  isAuthenticated: boolean;
}

export function ResultScreen({ guardian, onRestart, onSave, saveStatus, isAuthenticated }: ResultScreenProps) {
  const Icon = guardian.icon;

  return (
    <m.div {...scaleIn} className="relative">
      <AmbientOrbs color={guardian.color} />

      {/* Reveal animation wrapper */}
      <div className="relative">
        {/* Header — "Your Guardian is..." */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 text-center"
        >
          <span className="text-xs uppercase tracking-[0.4em] text-text-muted font-sans">
            Your Guardian Resonates
          </span>
        </m.div>

        {/* Main card */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="liquid-glass-elevated rounded-3xl overflow-hidden"
        >
          {/* Guardian header band */}
          <div
            className="relative px-8 pt-10 pb-8 md:px-12 md:pt-14"
            style={{
              background: `linear-gradient(135deg, ${guardian.glowColor} 0%, transparent 60%)`,
            }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />

            {/* Icon + gate badge */}
            <div className="mb-6 flex items-start justify-between">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: `${guardian.color}20`,
                  border: `1px solid ${guardian.color}40`,
                  boxShadow: `0 0 30px ${guardian.glowColor}`,
                }}
              >
                <span style={{ color: guardian.color }}>
                  <Icon className="h-8 w-8" />
                </span>
              </div>
              <div className="text-right">
                <div
                  className="text-xs uppercase tracking-wider font-semibold font-sans px-3 py-1 rounded-full"
                  style={{
                    color: guardian.color,
                    backgroundColor: `${guardian.color}15`,
                    border: `1px solid ${guardian.color}30`,
                  }}
                >
                  Gate of {guardian.gate}
                </div>
                <div className="mt-1 text-xs text-text-muted font-mono">
                  {guardian.frequency}
                </div>
              </div>
            </div>

            {/* Name */}
            <h1 className="font-display text-fluid-4xl font-bold tracking-tight leading-none">
              <span style={{ color: guardian.color }}>{guardian.name}</span>
            </h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-text-secondary font-sans">
              <span>{guardian.element}</span>
              <span className="text-white/[0.12]">·</span>
              <span>Godbeast: {guardian.godbeast}</span>
            </div>
          </div>

          {/* Description */}
          <div className="px-8 py-8 md:px-12 space-y-6">
            <m.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-base text-text-secondary font-sans leading-relaxed"
            >
              {guardian.description}
            </m.p>

            {/* Personality */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="liquid-glass rounded-2xl p-5"
            >
              <h3 className="mb-3 text-xs uppercase tracking-[0.3em] text-text-muted font-sans font-semibold">
                Your Creative Nature
              </h3>
              <p className="text-sm text-text-primary font-sans leading-relaxed">
                {guardian.personality}
              </p>
            </m.div>

            {/* Strength + Shadow */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="liquid-glass rounded-2xl p-5">
                <h3
                  className="mb-2 text-xs uppercase tracking-[0.25em] font-semibold font-sans"
                  style={{ color: guardian.color }}
                >
                  Creative Strength
                </h3>
                <p className="text-sm text-text-secondary font-sans leading-relaxed">
                  {guardian.creativeStrength}
                </p>
              </div>
              <div className="liquid-glass rounded-2xl p-5">
                <h3 className="mb-2 text-xs uppercase tracking-[0.25em] text-text-muted font-semibold font-sans">
                  Shadow to Transcend
                </h3>
                <p className="text-sm text-text-secondary font-sans leading-relaxed">
                  {guardian.shadowChallenge}
                </p>
              </div>
            </m.div>

            {/* CTAs */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.5 }}
              className="flex flex-col gap-3 pt-2 sm:flex-row"
            >
              <Link
                href={`/lore/guardians/${guardian.key}`}
                className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-4 px-6 font-semibold font-sans transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: `${guardian.color}20`,
                  border: `1px solid ${guardian.color}40`,
                  color: guardian.color,
                  boxShadow: `0 0 20px ${guardian.glowColor}`,
                }}
              >
                Meet {guardian.name}
                <PhArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={`/chat/${guardian.luminorId}`}
                className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary py-4 px-6 font-semibold text-white font-sans shadow-glow-brand transition-all hover:bg-brand-primary/90 hover:scale-[1.02]"
              >
                Create with {guardian.name}
                <PhSparkle className="h-4 w-4 transition-transform group-hover:scale-110" />
              </Link>
            </m.div>

            {/* Save to Profile */}
            <m.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              {isAuthenticated && saveStatus !== 'saved' && (
                <button
                  onClick={onSave}
                  disabled={saveStatus === 'saving'}
                  className="w-full rounded-xl bg-gradient-to-r from-[#0d47a1] to-[#00bcd4] py-4 px-6 font-semibold text-white font-sans transition-all hover:shadow-[0_0_30px_rgba(0,188,212,0.4)] disabled:opacity-50"
                >
                  {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'error' ? 'Error - Try Again' : 'Save to Profile'}
                </button>
              )}
              {saveStatus === 'saved' && (
                <div className="w-full rounded-xl bg-green-900/30 border border-green-500/30 py-4 px-6 text-green-400 text-center font-semibold font-sans">
                  Saved to your profile
                </div>
              )}
              {!isAuthenticated && (
                <Link
                  href="/auth/signup"
                  className="block w-full rounded-xl bg-gradient-to-r from-[#0d47a1] to-[#00bcd4] py-4 px-6 text-white text-center font-semibold font-sans transition-all hover:shadow-[0_0_30px_rgba(0,188,212,0.4)]"
                >
                  Sign Up to Save Results
                </Link>
              )}
            </m.div>

            {/* Journey links — connect to the rest of Arcanea */}
            <m.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="grid grid-cols-3 gap-2 pt-2"
            >
              <Link href="/academy" className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
                <span className="text-xs font-semibold text-white/70">Academy</span>
                <span className="text-[10px] text-white/30">Master the Gates</span>
              </Link>
              <Link href="/worlds" className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
                <span className="text-xs font-semibold text-white/70">Worlds</span>
                <span className="text-[10px] text-white/30">Explore universes</span>
              </Link>
              <Link href="/gallery" className="flex flex-col items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.05]">
                <span className="text-xs font-semibold text-white/70">Gallery</span>
                <span className="text-[10px] text-white/30">See creations</span>
              </Link>
            </m.div>

            {/* Secondary action */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="flex items-center justify-center pt-2"
            >
              <button
                onClick={onRestart}
                className="group inline-flex items-center gap-2 text-sm text-text-muted font-sans transition-colors hover:text-text-secondary"
              >
                <PhArrowCounterClockwise className="h-4 w-4 transition-transform group-hover:-rotate-45" />
                Retake the Quiz
              </button>
            </m.div>
          </div>
        </m.div>

        {/* All Guardians strip */}
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-6"
        >
          <p className="mb-3 text-center text-xs uppercase tracking-[0.3em] text-text-muted font-sans">
            All Ten Guardians
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.values(GUARDIANS).map((g) => {
              const GIcon = g.icon;
              const isMatch = g.key === guardian.key;
              return (
                <Link
                  key={g.key}
                  href={`/lore/guardians/${g.key}`}
                  className={[
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-sans transition-all hover-lift",
                    isMatch
                      ? "glass-strong border font-semibold"
                      : "card-3d liquid-glass border border-white/[0.08] text-text-muted hover:text-text-secondary",
                  ].join(" ")}
                  style={
                    isMatch
                      ? { borderColor: `${g.color}50`, color: g.color }
                      : {}
                  }
                >
                  <span style={{ color: g.color }}>
                    <GIcon className="h-3.5 w-3.5" />
                  </span>
                  {g.name}
                </Link>
              );
            })}
          </div>
        </m.div>
      </div>
    </m.div>
  );
}
