"use client";

import { useState, useCallback } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  QUIZ_QUESTIONS,
  ORIGIN_RESULTS,
  type OriginClass,
} from "./quiz-data";

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

function calculateResult(
  answers: Record<number, OriginClass>
): OriginClass {
  const scores: Record<OriginClass, number> = {
    Arcan: 0,
    "Gate-Touched": 0,
    Awakened: 0,
    Synth: 0,
    Bonded: 0,
    Celestial: 0,
    Voidtouched: 0,
    Architect: 0,
  };

  Object.values(answers).forEach((origin) => {
    scores[origin] += 3;
  });

  return (Object.entries(scores) as [OriginClass, number][]).reduce(
    (best, [origin, score]) => (score > scores[best] ? origin : best),
    "Arcan" as OriginClass
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <m.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(90deg, #7fffd4, #78a6ff)" }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

interface QuestionCardProps {
  question: (typeof QUIZ_QUESTIONS)[0];
  selected: OriginClass | null;
  onSelect: (origin: OriginClass) => void;
}

function QuestionCard({ question, selected, onSelect }: QuestionCardProps) {
  return (
    <m.div
      key={question.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full"
    >
      <div
        className="rounded-2xl border border-white/[0.08] p-8"
        style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)" }}
      >
        <p className="text-xl font-medium text-white/90 mb-6 leading-snug">
          {question.text}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.answers.map((answer) => {
            const isSelected = selected === answer.origin;
            return (
              <button
                key={answer.origin}
                onClick={() => onSelect(answer.origin)}
                className={[
                  "text-left px-4 py-3 rounded-xl border text-sm leading-snug transition-all duration-200",
                  isSelected
                    ? "border-[#7fffd4]/60 bg-[#7fffd4]/10 text-[#7fffd4]"
                    : "border-white/[0.08] bg-white/[0.03] text-white/70 hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90",
                ].join(" ")}
              >
                {answer.text}
              </button>
            );
          })}
        </div>
      </div>
    </m.div>
  );
}

interface ResultCardProps {
  origin: OriginClass;
  onRetake: () => void;
}

function ResultCard({ origin, onRetake }: ResultCardProps) {
  const result = ORIGIN_RESULTS[origin];

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full"
    >
      {/* Glow orb */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${result.color}18 0%, transparent 70%)`,
        }}
      />

      <div
        className="rounded-2xl border p-8 space-y-6"
        style={{
          borderColor: `${result.color}30`,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Origin class badge */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              color: result.color,
              background: `${result.color}18`,
              border: `1px solid ${result.color}30`,
            }}
          >
            Origin Class
          </span>
        </div>

        {/* Name + tagline */}
        <div>
          <h2
            className="font-display text-4xl font-bold mb-2"
            style={{ color: result.color, fontFamily: "var(--font-display)" }}
          >
            {result.name}
          </h2>
          <p className="text-white/50 text-sm italic">{result.tagline}</p>
        </div>

        {/* Description */}
        <p className="text-white/75 leading-relaxed">{result.description}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Power Source", value: result.powerSource },
            { label: "Primary Gate", value: result.primaryGate },
            { label: "Guardian", value: result.guardian },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ background: `${result.color}0a`, border: `1px solid ${result.color}20` }}
            >
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="text-white/90 text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <blockquote
          className="border-l-2 pl-4 text-sm italic text-white/60"
          style={{ borderColor: `${result.color}50` }}
        >
          {result.quote}
        </blockquote>

        {/* Share text */}
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Share your result</p>
          <p className="text-white/80 text-sm">{result.shareText}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/auth/signup"
            className="flex-1 text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${result.color}30, ${result.color}15)`,
              border: `1px solid ${result.color}40`,
              color: result.color,
            }}
          >
            Claim your origin
          </Link>
          <Link
            href={`/lore`}
            className="flex-1 text-center py-3 px-6 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-all duration-200"
          >
            Explore the lore
          </Link>
        </div>

        <button
          onClick={onRetake}
          className="w-full text-center text-white/30 text-xs hover:text-white/50 transition-colors pt-2"
        >
          Retake the quiz
        </button>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// Main quiz component
// ---------------------------------------------------------------------------

export default function QuizClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OriginClass>>({});
  const [result, setResult] = useState<OriginClass | null>(null);

  const total = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedForCurrent = answers[currentQuestion?.id] ?? null;

  const handleSelect = useCallback(
    (origin: OriginClass) => {
      const questionId = QUIZ_QUESTIONS[currentIndex].id;
      const newAnswers = { ...answers, [questionId]: origin };
      setAnswers(newAnswers);

      // Auto-advance after brief delay
      setTimeout(() => {
        if (currentIndex < total - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          setResult(calculateResult(newAnswers));
        }
      }, 320);
    },
    [answers, currentIndex, total]
  );

  const handleRetake = useCallback(() => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col items-center px-4 py-20">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <p className="text-[#7fffd4] text-xs uppercase tracking-widest font-semibold mb-3">
              Arcanea Origin Quiz
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What Is Your Origin Class?
            </h1>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              Eight questions. Eight possible origins. Discover the source of your power in the Arcanean multiverse.
            </p>
          </m.div>

          {/* Progress */}
          {!result && (
            <div className="mb-8 space-y-2">
              <ProgressBar current={currentIndex} total={total} />
              <div className="flex justify-between text-xs text-white/30">
                <span>Question {currentIndex + 1} of {total}</span>
                <span>{Math.round((currentIndex / total) * 100)}% complete</span>
              </div>
            </div>
          )}

          {/* Question or result */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {result ? (
                <ResultCard key="result" origin={result} onRetake={handleRetake} />
              ) : (
                <QuestionCard
                  key={currentQuestion.id}
                  question={currentQuestion}
                  selected={selectedForCurrent}
                  onSelect={handleSelect}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Back button during quiz */}
          {!result && currentIndex > 0 && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6"
            >
              <button
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="text-white/30 text-sm hover:text-white/60 transition-colors"
              >
                Previous question
              </button>
            </m.div>
          )}
        </div>
      </div>
    </LazyMotion>
  );
}
