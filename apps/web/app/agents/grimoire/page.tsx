"use client";

import { useState, useCallback } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { GRIMOIRE_QUESTIONS, GRIMOIRE_TIERS } from "@/lib/agents/grimoire/types";
import { IntroScreen } from "./intro-screen";

// Animation variants
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
    filter: "blur(8px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    filter: "blur(8px)",
    transition: { duration: 0.18 },
  }),
};

// Element orb
const ELEMENT_COLORS: Record<string, string> = {
  Fire: "#ef4444",
  Water: "#38bdf8",
  Earth: "#22c55e",
  Wind: "#e2e8f0",
  Void: "#8b5cf6",
  Spirit: "#fbbf24",
};

function ElementOrb({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const color = ELEMENT_COLORS[label] ?? "#7fffd4";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 ${
        selected
          ? "border-white/30 bg-white/[0.08]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
    >
      <span
        className="w-10 h-10 rounded-full transition-all duration-300"
        style={{
          background: selected
            ? `radial-gradient(circle at 40% 35%, ${color}cc, ${color}66)`
            : `radial-gradient(circle at 40% 35%, ${color}44, ${color}22)`,
          boxShadow: selected ? `0 0 18px ${color}55` : "none",
        }}
        aria-hidden="true"
      />
      <span
        className={`text-xs font-medium transition-colors ${
          selected ? "text-white" : "text-white/40"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

// Progress gates
function ProgressGates({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current + 1} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-[#7fffd4] w-6"
              : i === current
                ? "bg-[#7fffd4]/60 w-4"
                : "bg-white/10 w-3"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Shared background decoration
function CosmicBg() {
  return (
    <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,rgba(127,255,212,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_80%,rgba(120,166,255,0.05)_0%,transparent_55%)]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#ffd700]/[0.03] rounded-full blur-3xl" />
    </div>
  );
}

// Page
type Step = "intro" | "questions" | "review" | "forging";

export default function GrimoirePage() {
  const [step, setStep] = useState<Step>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTierId, setSelectedTierId] = useState<
    "apprentice" | "mage" | "archmage"
  >("mage");
  const [inputError, setInputError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedTier =
    GRIMOIRE_TIERS.find((t) => t.id === selectedTierId) ?? GRIMOIRE_TIERS[1];
  const currentQuestion = GRIMOIRE_QUESTIONS[questionIndex];
  const currentAnswer = answers[currentQuestion?.id ?? ""] ?? "";
  const selectedElements = (answers["elements"] ?? "").split(",").filter(Boolean);
  const canAdvance = !currentQuestion?.required || currentAnswer.trim().length > 0;

  const setAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      setInputError(null);
    },
    [currentQuestion],
  );

  const toggleElement = useCallback(
    (el: string) => {
      const raw = answers["elements"] ?? "";
      const existing = raw ? raw.split(",").filter(Boolean) : [];
      const next = existing.includes(el)
        ? existing.filter((e) => e !== el)
        : existing.length < 3
          ? [...existing, el]
          : existing;
      setAnswers((prev) => ({ ...prev, elements: next.join(",") }));
      setInputError(null);
    },
    [answers],
  );

  function advance() {
    if (!canAdvance) {
      setInputError("This field is required before continuing.");
      return;
    }
    if (questionIndex < GRIMOIRE_QUESTIONS.length - 1) {
      setDirection(1);
      setQuestionIndex((i) => i + 1);
    } else {
      setStep("review");
    }
  }

  function retreat() {
    if (questionIndex > 0) {
      setDirection(-1);
      setQuestionIndex((i) => i - 1);
    } else {
      setStep("intro");
    }
  }

  async function submitOrder() {
    setSubmitError(null);
    setStep("forging");
    try {
      const res = await fetch("/api/agents/grimoire/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, tier: selectedTierId }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setStep("review");
    }
  }

  // Intro
  if (step === "intro") {
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
          <CosmicBg />
          <IntroScreen
            selectedTierId={selectedTierId}
            onSelectTier={setSelectedTierId}
            onBegin={() => { setStep("questions"); setQuestionIndex(0); }}
          />
        </div>
      </LazyMotion>
    );
  }

  // Forging
  if (step === "forging") {
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
          <CosmicBg />
          <m.div
            className="relative z-10 text-center max-w-md mx-auto px-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="w-20 h-20 rounded-full mx-auto mb-8 animate-pulse"
              style={{
                background: "radial-gradient(circle at 40% 35%, #ffd70099, #ffd70033)",
                boxShadow: "0 0 50px rgba(255,215,0,0.35)",
              }}
              aria-hidden="true"
            />
            <h2 className="text-3xl font-display font-bold mb-4">
              Your Grimoire is being forged
            </h2>
            <p className="text-white/50 mb-2">
              {selectedTier.agentCount} agents are weaving your universe.
            </p>
            <p className="text-white/30 text-sm">
              You will receive a notification when it is ready.
            </p>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  // Review
  if (step === "review") {
    const isArchmage = selectedTier.id === "archmage";
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gray-950 text-white">
          <CosmicBg />
          <main className="relative z-10 max-w-3xl mx-auto px-6 py-20">
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[#7fffd4] font-mono text-xs tracking-widest uppercase mb-3">
                Review Your Invocation
              </p>
              <h2 className="text-3xl font-display font-bold mb-8">
                Your world, in ten answers
              </h2>
              <div className="space-y-3 mb-10">
                {GRIMOIRE_QUESTIONS.map((q) => {
                  const ans = answers[q.id];
                  return (
                    <div key={q.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-xs font-mono text-white/35 mb-1 uppercase tracking-wide">
                        {q.label}
                      </p>
                      <p className="text-sm text-white/75 leading-relaxed">
                        {ans?.trim() || <span className="text-white/25 italic">Not answered</span>}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div
                className="p-5 rounded-2xl border mb-8"
                style={{
                  borderColor: isArchmage ? "rgba(255,215,0,0.3)" : "rgba(127,255,212,0.2)",
                  background: isArchmage
                    ? "linear-gradient(135deg, rgba(255,215,0,0.06), rgba(255,215,0,0.02))"
                    : "rgba(127,255,212,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display font-bold text-lg">{selectedTier.name} Grimoire</span>
                  <span className="text-2xl font-display font-bold text-white">${selectedTier.price}</span>
                </div>
                <p className="text-sm text-white/50">
                  {selectedTier.sections.length} sections · {selectedTier.agentCount} agents
                </p>
              </div>
              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-sm text-red-300" role="alert">
                  {submitError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => { setDirection(-1); setStep("questions"); setQuestionIndex(GRIMOIRE_QUESTIONS.length - 1); }}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Edit Answers
                </button>
                <m.button
                  type="button"
                  onClick={submitOrder}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-8 py-3 rounded-xl font-display font-bold text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd700]/60"
                  style={{
                    background: "linear-gradient(135deg, #ffd700 0%, #fbbf24 50%, #f59e0b 100%)",
                    boxShadow: "0 0 30px rgba(255,215,0,0.2)",
                  }}
                >
                  Begin the Ritual — ${selectedTier.price}
                </m.button>
              </div>
            </m.div>
          </main>
        </div>
      </LazyMotion>
    );
  }

  // Questions
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gray-950 text-white">
        <CosmicBg />
        <main className="relative z-10 min-h-screen flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-8 pb-6 max-w-2xl mx-auto w-full">
            <button
              type="button"
              onClick={retreat}
              className="text-white/40 hover:text-white/80 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded px-1"
              aria-label="Previous question"
            >
              Back
            </button>
            <ProgressGates current={questionIndex} total={GRIMOIRE_QUESTIONS.length} />
            <span className="text-white/30 font-mono text-xs tabular-nums">
              {questionIndex + 1} / {GRIMOIRE_QUESTIONS.length}
            </span>
          </div>

          {/* Question card */}
          <div className="flex-1 flex items-center justify-center px-6 pb-24">
            <div className="w-full max-w-xl">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <m.div
                  key={questionIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <p className="font-mono text-xs text-[#7fffd4]/60 uppercase tracking-widest mb-4">
                    Question {questionIndex + 1}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-2 leading-snug">
                    {currentQuestion?.label}
                  </h2>
                  <p className="text-white/45 text-sm mb-8 leading-relaxed">
                    {currentQuestion?.description}
                  </p>

                  {currentQuestion?.type === "textarea" && (
                    <textarea
                      id={`q-${currentQuestion.id}`}
                      value={currentAnswer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      rows={4}
                      aria-label={currentQuestion.label}
                      aria-required={currentQuestion.required}
                      className="w-full px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 resize-none focus:outline-none focus:border-[#7fffd4]/40 focus:ring-1 focus:ring-[#7fffd4]/20 transition-all text-sm leading-relaxed"
                    />
                  )}

                  {currentQuestion?.type === "text" && (
                    <input
                      id={`q-${currentQuestion.id}`}
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder={currentQuestion.placeholder}
                      aria-label={currentQuestion.label}
                      aria-required={currentQuestion.required}
                      className="w-full px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-[#7fffd4]/40 focus:ring-1 focus:ring-[#7fffd4]/20 transition-all text-sm"
                    />
                  )}

                  {currentQuestion?.type === "select" && (
                    <div className="grid gap-2" role="group" aria-label={currentQuestion.label}>
                      {currentQuestion.options?.map((opt) => {
                        const active = currentAnswer === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setAnswer(opt)}
                            aria-pressed={active}
                            className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60 ${
                              active
                                ? "border-[#7fffd4]/40 bg-[#7fffd4]/[0.08] text-[#7fffd4]"
                                : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white/85 hover:bg-white/[0.04]"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion?.type === "multiselect" && (
                    <div>
                      <div className="grid grid-cols-3 gap-3 mb-3" role="group" aria-label={currentQuestion.label}>
                        {currentQuestion.options?.map((opt) => (
                          <ElementOrb
                            key={opt}
                            label={opt}
                            selected={selectedElements.includes(opt)}
                            onToggle={() => toggleElement(opt)}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/25 text-center">
                        Select up to 3 elements
                        {selectedElements.length > 0 && ` — ${selectedElements.join(", ")} chosen`}
                      </p>
                    </div>
                  )}

                  {inputError && (
                    <p className="mt-3 text-sm text-red-400" role="alert" aria-live="polite">
                      {inputError}
                    </p>
                  )}
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating continue button */}
          <div className="fixed bottom-0 inset-x-0 px-6 pb-8 flex justify-center pointer-events-none">
            <m.button
              type="button"
              onClick={advance}
              whileHover={{ scale: canAdvance ? 1.03 : 1 }}
              whileTap={{ scale: canAdvance ? 0.97 : 1 }}
              disabled={!canAdvance}
              aria-disabled={!canAdvance}
              className="pointer-events-auto min-w-[200px] px-8 py-3.5 rounded-2xl font-display font-bold text-base transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7fffd4]/60"
              style={{
                background: canAdvance
                  ? "linear-gradient(135deg, #7fffd4, #78a6ff)"
                  : "rgba(255,255,255,0.06)",
                color: canAdvance ? "#030712" : "rgba(255,255,255,0.25)",
                boxShadow: canAdvance
                  ? "0 0 30px rgba(127,255,212,0.2), 0 4px 16px rgba(127,255,212,0.15)"
                  : "none",
              }}
            >
              {questionIndex < GRIMOIRE_QUESTIONS.length - 1 ? "Continue" : "Review My World"}
            </m.button>
          </div>
        </main>
      </div>
    </LazyMotion>
  );
}
