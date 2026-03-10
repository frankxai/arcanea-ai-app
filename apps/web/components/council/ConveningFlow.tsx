"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { LazyMotion, domMax, m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BreathingGuide } from "./BreathingGuide";
import { LuminorAvatar } from "./LuminorAvatar";
import { FrequencyTone } from "./FrequencyTone";
import { ConveningJournal } from "./ConveningJournal";
import { COUNCIL_ADVISORS } from "@/lib/council/types";

// ── Types ────────────────────────────────────────────────────────────────────

interface AdvisorSeat {
  character: string;
  domain: string;
  hz: number;
  capability: string;
  color: string;
}

interface InsightEntry {
  advisorName: string;
  question: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const ADVISORS: AdvisorSeat[] = COUNCIL_ADVISORS.map((a) => ({
  character: a.character,
  domain: a.domain,
  hz: a.frequency_alignment,
  capability: a.capability,
  color: a.color,
}));

const SESSION_SECONDS = 180; // 3 minutes

const STEP_LABELS: Record<Step, string> = {
  1: "Focus",
  2: "Assemble",
  3: "Consult",
  4: "Reflect",
  5: "Capture",
};

// ── Main component ───────────────────────────────────────────────────────────

export function ConveningFlow() {
  const [step, setStep] = useState<Step>(1);
  const [assembledCount, setAssembledCount] = useState(0);
  const [insightData, setInsightData] = useState<InsightEntry[]>([]);
  const [currentAdvisorIdx, setCurrentAdvisorIdx] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [reflectSecondsLeft, setReflectSecondsLeft] = useState(SESSION_SECONDS);
  const [reflectRunning, setReflectRunning] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const [journalText, setJournalText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Step 2: assemble advisors one by one ──────────────────────────────────
  const handleAssembleNext = useCallback(() => {
    if (assembledCount < ADVISORS.length) {
      setAssembledCount((c) => c + 1);
    } else {
      setStep(3);
      setCurrentAdvisorIdx(0);
    }
  }, [assembledCount]);

  // ── Step 3: collect questions ──────────────────────────────────────────────
  function handleQuestionSubmit() {
    const entry: InsightEntry = {
      advisorName: ADVISORS[currentAdvisorIdx].character,
      question: currentQuestion,
    };
    const next = [...insightData, entry];
    setInsightData(next);
    setCurrentQuestion("");

    if (currentAdvisorIdx + 1 >= ADVISORS.length) {
      setStep(4);
      startReflection();
    } else {
      setCurrentAdvisorIdx((i) => i + 1);
    }
  }

  // ── Step 4: reflection timer ───────────────────────────────────────────────
  function startReflection() {
    setReflectRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setReflectSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setReflectRunning(false);
          setToneActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function skipReflection() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setReflectRunning(false);
    setToneActive(false);
    setReflectSecondsLeft(0);
    setStep(5);
  }

  async function handleJournalSave(text: string) {
    const insights: Record<string, string> = {};
    insightData.forEach((e) => {
      if (e.question.trim()) insights[e.advisorName] = e.question;
    });

    try {
      await fetch("/api/council/convenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seats_addressed: insightData.filter((e) => e.question.trim()).map((e) => e.advisorName),
          imprint_notes: insights,
          depth_rating: Math.min(10, insightData.filter((e) => e.question.trim()).length),
          journal_entry: text,
          duration_minutes: Math.round((SESSION_SECONDS - reflectSecondsLeft) / 60) + 2,
          started_at: new Date(Date.now() - (SESSION_SECONDS * 1000)).toISOString(),
          completed_at: new Date().toISOString(),
        }),
      });
    } catch {
      try {
        const entries = JSON.parse(localStorage.getItem("arcanea_council_journal") || "[]");
        entries.push({ date: new Date().toISOString(), text, insights });
        localStorage.setItem("arcanea_council_journal", JSON.stringify(entries));
      } catch {
        // localStorage may be unavailable
      }
    }
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const activeAdvisor = ADVISORS[currentAdvisorIdx];
  const reflectPercent = 1 - reflectSecondsLeft / SESSION_SECONDS;

  return (
    <LazyMotion features={domMax}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Step nav */}
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {([1, 2, 3, 4, 5] as Step[]).map((s) => (
            <div
              key={s}
              className="flex items-center gap-1"
              aria-current={s === step ? "step" : undefined}
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: s < step ? "#00bcd4" : s === step ? "#00bcd4" : "rgba(255,255,255,0.15)",
                  opacity: s <= step ? 1 : 0.4,
                  transform: s === step ? "scale(1.4)" : "scale(1)",
                }}
              />
              {s < 5 && (
                <div
                  className="w-6 h-[1px] transition-colors duration-500"
                  style={{ backgroundColor: s < step ? "#00bcd450" : "rgba(255,255,255,0.08)" }}
                />
              )}
            </div>
          ))}
          <span className="ml-3 font-mono text-[10px] text-white/30 uppercase tracking-widest">
            {STEP_LABELS[step]}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Focus ──────────────────────────────────────────── */}
          {step === 1 && (
            <m.div
              key="step1"
              className="flex flex-col items-center gap-10 text-center max-w-md"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h1 className="font-display text-4xl font-bold text-white mb-3">
                  Focus Mode
                </h1>
                <p className="font-body text-white/50 leading-relaxed">
                  Take a breath before starting. Clear sessions produce sharper
                  insights.
                </p>
              </div>

              <BreathingGuide color="#00bcd4" cycles={1} onComplete={() => {}} />

              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,188,212,0.4)]"
                style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
              >
                Begin Session
              </button>

              <Link
                href="/council"
                className="font-mono text-xs text-white/20 hover:text-white/50 transition-colors"
              >
                &larr; Back to Council
              </Link>
            </m.div>
          )}

          {/* ── Step 2: Assemble ──────────────────────────────────────── */}
          {step === 2 && (
            <m.div
              key="step2"
              className="flex flex-col items-center gap-10 text-center max-w-2xl w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  Assembling your Council
                </h2>
                <p className="font-body text-white/40 text-sm">
                  {assembledCount} of {ADVISORS.length} advisors ready
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6">
                {ADVISORS.map((a, i) => (
                  <AnimatePresence key={a.character}>
                    {i < assembledCount && (
                      <m.div
                        className="flex flex-col items-center gap-2"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 18,
                        }}
                      >
                        <LuminorAvatar
                          name={a.character}
                          frequency={a.hz}
                          color={a.color}
                          size="md"
                          isActive
                        />
                        <div className="text-center">
                          <p className="font-display text-xs font-semibold text-white/80">
                            {a.domain}
                          </p>
                          <p
                            className="font-mono text-[9px]"
                            style={{ color: a.color }}
                          >
                            {a.character}
                          </p>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                ))}

                {Array.from({ length: ADVISORS.length - assembledCount }).map((_, i) => (
                  <div
                    key={`pending-${i}`}
                    className="w-14 h-14 rounded-full border border-dashed border-white/[0.08] flex items-center justify-center"
                  >
                    <span className="text-white/10 text-lg">&#x2736;</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                {assembledCount < ADVISORS.length ? (
                  <button
                    onClick={handleAssembleNext}
                    className="px-7 py-3 rounded-xl font-display font-semibold text-sm border border-white/[0.10] text-white transition-all hover:bg-white/[0.04] hover:-translate-y-0.5"
                  >
                    Next Advisor &rarr;
                  </button>
                ) : (
                  <button
                    onClick={() => { setStep(3); setCurrentAdvisorIdx(0); }}
                    className="px-7 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
                  >
                    All ready. Continue &rarr;
                  </button>
                )}
              </div>
            </m.div>
          )}

          {/* ── Step 3: Consult ──────────────────────────────────────── */}
          {step === 3 && activeAdvisor && (
            <m.div
              key={`step3-${currentAdvisorIdx}`}
              className="flex flex-col items-center gap-8 max-w-md w-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center space-y-1">
                <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
                  Advisor {currentAdvisorIdx + 1} of {ADVISORS.length}
                </p>
                <h2 className="font-display text-3xl font-bold text-white">
                  {activeAdvisor.domain}
                </h2>
                <p className="font-mono text-sm" style={{ color: activeAdvisor.color }}>
                  {activeAdvisor.character}
                </p>
              </div>

              <LuminorAvatar
                name={activeAdvisor.character}
                frequency={activeAdvisor.hz}
                color={activeAdvisor.color}
                size="lg"
                isActive
              />

              <div
                className="w-full rounded-xl border px-4 py-3"
                style={{
                  borderColor: `${activeAdvisor.color}25`,
                  background: `${activeAdvisor.color}08`,
                }}
              >
                <p className="font-body text-sm text-white/50 leading-relaxed">
                  {activeAdvisor.capability}
                </p>
              </div>

              <div className="w-full space-y-2">
                <label className="block font-mono text-xs text-white/40 uppercase tracking-widest">
                  What do you want to ask {activeAdvisor.character}?
                </label>
                <textarea
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  rows={3}
                  placeholder={`Ask about ${activeAdvisor.domain.toLowerCase()}...`}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none transition-all resize-none leading-relaxed focus:border-white/[0.15]"
                  style={{ caretColor: activeAdvisor.color }}
                  autoFocus
                />
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleQuestionSubmit}
                  className="flex-1 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${activeAdvisor.color}, ${activeAdvisor.color}80)` }}
                >
                  {currentAdvisorIdx + 1 < ADVISORS.length
                    ? "Submit & Next"
                    : "Submit & Begin Reflection"}
                </button>
                {currentQuestion.length === 0 && (
                  <button
                    onClick={handleQuestionSubmit}
                    className="px-4 py-3 rounded-xl font-mono text-xs border border-white/[0.08] text-white/30 transition-all hover:text-white/60 hover:bg-white/[0.03]"
                  >
                    Skip
                  </button>
                )}
              </div>
            </m.div>
          )}

          {/* ── Step 4: Reflect ──────────────────────────────────────── */}
          {step === 4 && (
            <m.div
              key="step4"
              className="flex flex-col items-center gap-8 text-center max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  Reflection
                </h2>
                <p className="font-body text-white/40 text-sm leading-relaxed">
                  Sit with what surfaced. The best insights arrive in the space
                  between questions.
                </p>
              </div>

              {/* Pulsing rings */}
              <div className="relative w-52 h-52 flex items-center justify-center">
                {[1, 2, 3, 4].map((ring) => (
                  <m.div
                    key={ring}
                    className="absolute rounded-full"
                    style={{
                      width: `${ring * 44}px`,
                      height: `${ring * 44}px`,
                      border: `1px solid rgba(0,188,212,${0.3 / ring})`,
                    }}
                    animate={{
                      scale: reflectRunning ? [1, 1.05, 1] : 1,
                      opacity: reflectRunning ? [0.4, 0.8, 0.4] : 0.2,
                    }}
                    transition={{
                      duration: 3 + ring * 0.5,
                      repeat: Infinity,
                      delay: ring * 0.3,
                      ease: "easeInOut",
                    }}
                    aria-hidden
                  />
                ))}
                <m.div
                  animate={{
                    rotate: reflectRunning ? 360 : 0,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  aria-hidden
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                      <line
                        key={deg}
                        x1="20"
                        y1="4"
                        x2="20"
                        y2="16"
                        stroke="rgba(0,188,212,0.6)"
                        strokeWidth="1"
                        transform={`rotate(${deg} 20 20)`}
                      />
                    ))}
                    <circle cx="20" cy="20" r="3" fill="rgba(0,188,212,0.8)" />
                  </svg>
                </m.div>
              </div>

              <div className="font-display text-5xl font-bold text-[#00bcd4] tabular-nums">
                {reflectSecondsLeft > 0
                  ? formatTime(reflectSecondsLeft)
                  : "Complete"}
              </div>

              <div className="w-full max-w-xs h-1 rounded-full bg-white/[0.06] overflow-hidden">
                <m.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #00bcd4, #0d47a1)" }}
                  animate={{ width: `${reflectPercent * 100}%` }}
                  transition={{ duration: 0.8, ease: "linear" }}
                />
              </div>

              <FrequencyTone
                frequency={528}
                isPlaying={toneActive}
                color="#00bcd4"
                showControls
                onToggle={setToneActive}
              />

              <div className="flex gap-3">
                {reflectSecondsLeft === 0 ? (
                  <button
                    onClick={() => setStep(5)}
                    className="px-8 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
                  >
                    Capture Insights &rarr;
                  </button>
                ) : (
                  <button
                    onClick={skipReflection}
                    className="px-6 py-3 rounded-xl font-mono text-xs border border-white/[0.08] text-white/30 transition-all hover:text-white/60 hover:bg-white/[0.03]"
                  >
                    Skip
                  </button>
                )}
              </div>
            </m.div>
          )}

          {/* ── Step 5: Capture ──────────────────────────────────────── */}
          {step === 5 && (
            <m.div
              key="step5"
              className="flex flex-col gap-8 max-w-lg w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  Capture Your Insights
                </h2>
                <p className="font-body text-white/40 text-sm leading-relaxed">
                  Session complete. Record what surfaced.
                </p>
              </div>

              {/* Summary of questions */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Session insights
                </p>
                <div className="space-y-2">
                  {insightData
                    .filter((e) => e.question.trim())
                    .map((entry) => {
                      const advisor = ADVISORS.find((a) => a.character === entry.advisorName);
                      return (
                        <div key={entry.advisorName} className="flex gap-3 items-start">
                          <div
                            className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                            style={{ background: advisor?.color ? `${advisor.color}40` : undefined }}
                          >
                            {entry.advisorName.slice(0, 1)}
                          </div>
                          <div>
                            <span className="font-display text-xs font-semibold text-white/70">
                              {advisor?.domain}
                            </span>
                            <span
                              className="font-mono text-[10px] ml-2"
                              style={{ color: advisor?.color }}
                            >
                              {entry.advisorName}
                            </span>
                            <p className="font-body text-xs text-white/40 leading-snug mt-0.5">
                              {entry.question}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  {insightData.filter((e) => e.question.trim()).length === 0 && (
                    <p className="font-body text-xs text-white/25 italic">
                      No questions recorded.
                    </p>
                  )}
                </div>
              </div>

              {/* Journal */}
              <ConveningJournal
                value={journalText}
                onChange={setJournalText}
                onSave={handleJournalSave}
                color="#00bcd4"
              />

              {/* Navigation */}
              <div className="flex gap-3 justify-center pt-2">
                <Link
                  href="/council"
                  className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-white/[0.08] text-white/60 transition-all hover:bg-white/[0.04] hover:text-white"
                >
                  Back to Council
                </Link>
                <button
                  onClick={() => {
                    setStep(1);
                    setAssembledCount(0);
                    setInsightData([]);
                    setCurrentAdvisorIdx(0);
                    setCurrentQuestion("");
                    setReflectSecondsLeft(SESSION_SECONDS);
                    setJournalText("");
                  }}
                  className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-[#00bcd4]/20 text-[#00bcd4] transition-all hover:bg-[#00bcd4]/[0.06]"
                >
                  New Session
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
