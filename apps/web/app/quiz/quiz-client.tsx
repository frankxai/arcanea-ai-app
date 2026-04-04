"use client";

import { useState, useCallback } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { CosmicParticles } from "@/components/magic/particles";
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
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(() => {
    const shareMessage = `${result.shareText} — arcanea.ai/quiz`;
    navigator.clipboard.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [result.shareText]);

  return (
    <m.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full relative"
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
          boxShadow: `0 0 40px ${result.color}15`,
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

        {/* Share row */}
        <div
          className="rounded-xl p-4 flex items-start justify-between gap-4"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Share your origin</p>
            <p className="text-white/70 text-sm truncate">{result.shareText}</p>
          </div>
          <button
            onClick={handleShare}
            aria-label="Copy share text to clipboard"
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              color: copied ? "#7fffd4" : result.color,
              background: copied ? "rgba(127,255,212,0.12)" : `${result.color}15`,
              border: `1px solid ${copied ? "rgba(127,255,212,0.3)" : result.color + "30"}`,
            }}
          >
            {/* Inline clipboard SVG */}
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="5" y="1" width="9" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <path d="M3 5H2.5A1.5 1.5 0 0 0 1 6.5v7A1.5 1.5 0 0 0 2.5 15h7A1.5 1.5 0 0 0 11 13.5V13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/worlds/create"
            className="flex-1 text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              background: `linear-gradient(135deg, ${result.color}35, ${result.color}18)`,
              border: `1px solid ${result.color}45`,
              color: result.color,
            }}
          >
            Create Your Character
          </Link>
          <Link
            href="/lore"
            className="flex-1 text-center py-3 px-6 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            Explore the lore
          </Link>
        </div>

        <button
          onClick={onRetake}
          className="w-full text-center text-white/30 text-xs hover:text-white/50 transition-colors pt-2 focus-visible:outline-none focus-visible:underline"
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
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center px-4 py-20 relative overflow-hidden">
        <CosmicParticles />

        {/* Background glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(120,166,255,0.04) 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(127,255,212,0.04) 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="w-full max-w-2xl relative z-10">
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
