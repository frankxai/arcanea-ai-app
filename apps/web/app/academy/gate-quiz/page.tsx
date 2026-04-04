"use client";

/**
 * Which Guardian Resonates With You?
 * A 10-question personality quiz to discover your primary Guardian affinity.
 * Each question maps to creative personality dimensions across the Ten Gates.
 *
 * Data + scoring: ./quiz-data.ts
 * Screen components: ./quiz-screens.tsx
 */

import { useState, useCallback, useRef } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from '@/lib/auth/context';
import { createClient } from '@/lib/supabase/client';

import {
  GUARDIANS,
  QUIZ_QUESTIONS,
  GUARDIAN_GATE_MAP,
  getRankFromGates,
  calculateResult,
} from './quiz-data';
import type { GuardianKey } from './quiz-data';
import {
  IntroScreen,
  QuestionScreen,
  ResultScreen,
  fadeUp,
  slideRight,
  scaleIn,
} from './quiz-screens';

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ STATE MACHINE
// ─────────────────────────────────────────────────────────────────────────────

type QuizPhase = "intro" | "quiz" | "result";

export default function GateQuizPage() {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [resultGuardian, setResultGuardian] = useState<GuardianKey | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const { user } = useAuth();
  const supabaseRef = useRef(createClient());

  const handleSave = useCallback(async () => {
    if (!user || !resultGuardian) return;
    setSaveStatus('saving');
    try {
      const gateInfo = GUARDIAN_GATE_MAP[resultGuardian];
      const { error } = await supabaseRef.current
        .from('profiles')
        .update({
          guardian: resultGuardian,
          active_gate: gateInfo.gateName,
          gates_open: gateInfo.gateNumber,
          magic_rank: getRankFromGates(gateInfo.gateNumber),
        })
        .eq('id', user.id);
      if (error) throw error;
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    }
  }, [user, resultGuardian]);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedChoice(null);
  }, []);

  const handleSelectChoice = useCallback((index: number) => {
    setSelectedChoice(index);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedChoice === null) return;

    const question = QUIZ_QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [question.id]: selectedChoice };
    setAnswers(newAnswers);

    if (currentQuestion + 1 >= QUIZ_QUESTIONS.length) {
      // Final question — calculate result
      const winner = calculateResult(newAnswers);
      setResultGuardian(winner);
      setPhase("result");
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedChoice(null);
    }
  }, [selectedChoice, currentQuestion, answers]);

  const handleRestart = useCallback(() => {
    setPhase("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedChoice(null);
    setResultGuardian(null);
    setSaveStatus('idle');
  }, []);

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <LazyMotion features={domAnimation}>
    <main className="min-h-[100dvh] bg-cosmic-void bg-cosmic-mesh relative">
      {/* Page-level ambient background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 left-1/4 h-[600px] w-[600px] rounded-full bg-brand-primary/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-crystal/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        {/* Site nav breadcrumb */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center gap-2 text-xs text-text-muted font-sans"
        >
          <Link
            href="/"
            className="hover:text-text-secondary transition-colors"
          >
            Arcanea
          </Link>
          <span className="text-white/[0.12]">/</span>
          <Link
            href="/academy"
            className="hover:text-text-secondary transition-colors"
          >
            Academy
          </Link>
          <span className="text-white/[0.12]">/</span>
          <span className="text-text-secondary">Guardian Quiz</span>
        </m.div>

        {/* Phase rendering */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <m.div key="intro" {...fadeUp}>
              <IntroScreen onStart={handleStart} />
            </m.div>
          )}

          {phase === "quiz" && question && (
            <m.div key={`question-${question.id}`} {...slideRight}>
              <QuestionScreen
                question={question}
                questionNumber={currentQuestion + 1}
                totalQuestions={QUIZ_QUESTIONS.length}
                selectedChoice={selectedChoice}
                onSelect={handleSelectChoice}
                onNext={handleNext}
              />
            </m.div>
          )}

          {phase === "result" && resultGuardian && (
            <m.div key="result" {...scaleIn}>
              <ResultScreen
                guardian={GUARDIANS[resultGuardian]}
                onRestart={handleRestart}
                onSave={handleSave}
                saveStatus={saveStatus}
                isAuthenticated={!!user}
              />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </main>
    </LazyMotion>
  );
}
