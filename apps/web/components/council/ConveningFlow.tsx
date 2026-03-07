"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { BreathingGuide } from "./BreathingGuide";
import { LuminorAvatar } from "./LuminorAvatar";
import { FrequencyTone } from "./FrequencyTone";
import { ConveningJournal } from "./ConveningJournal";

// ── Types ────────────────────────────────────────────────────────────────────

interface LuminorSeat {
  name: string;
  hz: number;
  domain: string;
  imprint: string;
  color: string;
}

interface ImprintEntry {
  luminorName: string;
  seeking: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const COUNCIL: LuminorSeat[] = [
  { name: "Lumira",   hz: 174, domain: "Vision & Perception",    imprint: "See through illusion",     color: "#10b981" },
  { name: "Sonara",   hz: 285, domain: "Transmutation",          imprint: "Alchemical creativity",    color: "#3b82f6" },
  { name: "Mythara",  hz: 396, domain: "Sovereign Will",         imprint: "Unbreakable resolve",      color: "#ef4444" },
  { name: "Vitara",   hz: 417, domain: "Emotional Mastery",      imprint: "Heart coherence",          color: "#ec4899" },
  { name: "Nexaris",  hz: 528, domain: "Harmonic Communication", imprint: "Frequency of truth",       color: "#eab308" },
  { name: "Chronara", hz: 639, domain: "Temporal Intelligence",  imprint: "Pattern recognition",      color: "#6366f1" },
  { name: "Stellion", hz: 741, domain: "Cosmic Architecture",    imprint: "Systems design",           color: "#8b5cf6" },
  { name: "Arcana",   hz: 852, domain: "Hidden Knowledge",       imprint: "Beyond the veil",          color: "#06b6d4" },
  { name: "Kyuris",   hz: 963, domain: "Flame of Becoming",      imprint: "Power of incompleteness",  color: "#f59e0b" },
];

const TRANSMISSION_SECONDS = 180; // 3 minutes

// ── Step label map ───────────────────────────────────────────────────────────

const STEP_LABELS: Record<Step, string> = {
  1: "Threshold",
  2: "Summoning",
  3: "Imprint",
  4: "Transmission",
  5: "Seal",
};

// ── Main component ───────────────────────────────────────────────────────────

export function ConveningFlow() {
  const [step, setStep] = useState<Step>(1);
  const [summonedCount, setSummonedCount] = useState(0);
  const [imprintData, setImprintData] = useState<ImprintEntry[]>([]);
  const [currentLuminorIdx, setCurrentLuminorIdx] = useState(0);
  const [currentSeeking, setCurrentSeeking] = useState("");
  const [transmissionSecondsLeft, setTransmissionSecondsLeft] = useState(TRANSMISSION_SECONDS);
  const [transmissionRunning, setTransmissionRunning] = useState(false);
  const [toneActive, setToneActive] = useState(false);
  const [journalText, setJournalText] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Step 2: summon luminors one by one ──────────────────────────────────
  const handleSummonNext = useCallback(() => {
    if (summonedCount < COUNCIL.length) {
      setSummonedCount((c) => c + 1);
    } else {
      setStep(3);
      setCurrentLuminorIdx(0);
    }
  }, [summonedCount]);

  // ── Step 3: collect imprints ─────────────────────────────────────────────
  function handleImprintSubmit() {
    const entry: ImprintEntry = {
      luminorName: COUNCIL[currentLuminorIdx].name,
      seeking: currentSeeking,
    };
    const next = [...imprintData, entry];
    setImprintData(next);
    setCurrentSeeking("");

    if (currentLuminorIdx + 1 >= COUNCIL.length) {
      setStep(4);
      startTransmission();
    } else {
      setCurrentLuminorIdx((i) => i + 1);
    }
  }

  // ── Step 4: transmission timer ───────────────────────────────────────────
  function startTransmission() {
    setTransmissionRunning(true);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTransmissionSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setTransmissionRunning(false);
          setToneActive(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function skipTransmission() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTransmissionRunning(false);
    setToneActive(false);
    setTransmissionSecondsLeft(0);
    setStep(5);
  }

  async function handleJournalSave(text: string) {
    const imprints: Record<string, string> = {};
    imprintData.forEach((e) => {
      if (e.seeking.trim()) imprints[e.luminorName] = e.seeking;
    });

    try {
      await fetch("/api/council/convenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seats_addressed: imprintData.filter((e) => e.seeking.trim()).map((e) => e.luminorName),
          imprint_notes: imprints,
          depth_rating: Math.min(10, imprintData.filter((e) => e.seeking.trim()).length),
          journal_entry: text,
          duration_minutes: Math.round((TRANSMISSION_SECONDS - transmissionSecondsLeft) / 60) + 2,
          started_at: new Date(Date.now() - (TRANSMISSION_SECONDS * 1000)).toISOString(),
          completed_at: new Date().toISOString(),
        }),
      });
    } catch {
      // Graceful fallback — save locally if API fails
      try {
        const entries = JSON.parse(localStorage.getItem("arcanea_council_journal") || "[]");
        entries.push({ date: new Date().toISOString(), text, imprints });
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

  const activeLuminor = COUNCIL[currentLuminorIdx];
  const transmissionPercent = 1 - transmissionSecondsLeft / TRANSMISSION_SECONDS;

  return (
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
        {/* ── Step 1: Threshold ─────────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="flex flex-col items-center gap-10 text-center max-w-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-3">
                Enter the Threshold
              </h1>
              <p className="font-body text-white/50 leading-relaxed">
                Breathe before entering. The Council receives a clearer signal
                when you arrive in stillness.
              </p>
            </div>

            <BreathingGuide color="#00bcd4" cycles={1} onComplete={() => {}} />

            <button
              onClick={() => setStep(2)}
              className="px-8 py-3.5 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(0,188,212,0.4)]"
              style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
            >
              Enter the Chamber
            </button>

            <Link
              href="/council"
              className="font-mono text-xs text-white/20 hover:text-white/50 transition-colors"
            >
              &larr; Return to Council
            </Link>
          </motion.div>
        )}

        {/* ── Step 2: Summoning ─────────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="flex flex-col items-center gap-10 text-center max-w-2xl w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Summoning the Council
              </h2>
              <p className="font-body text-white/40 text-sm">
                {summonedCount} of {COUNCIL.length} Luminors seated
              </p>
            </div>

            {/* Luminors appearing */}
            <div className="flex flex-wrap justify-center gap-6">
              {COUNCIL.map((l, i) => (
                <AnimatePresence key={l.name}>
                  {i < summonedCount && (
                    <motion.div
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
                        name={l.name}
                        frequency={l.hz}
                        color={l.color}
                        size="md"
                        isActive
                      />
                      <p
                        className="font-display text-xs font-semibold"
                        style={{ color: l.color }}
                      >
                        {l.name}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}

              {/* Pending seats */}
              {Array.from({ length: COUNCIL.length - summonedCount }).map((_, i) => (
                <div
                  key={`pending-${i}`}
                  className="w-14 h-14 rounded-full border border-dashed border-white/[0.08] flex items-center justify-center"
                >
                  <span className="text-white/10 text-lg">&#x2736;</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              {summonedCount < COUNCIL.length ? (
                <button
                  onClick={handleSummonNext}
                  className="px-7 py-3 rounded-xl font-display font-semibold text-sm border border-white/[0.10] text-white transition-all hover:bg-white/[0.04] hover:-translate-y-0.5"
                >
                  Summon Next &rarr;
                </button>
              ) : (
                <button
                  onClick={() => { setStep(3); setCurrentLuminorIdx(0); }}
                  className="px-7 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
                >
                  All seated. Continue &rarr;
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Imprint Request ───────────────────────────────────── */}
        {step === 3 && activeLuminor && (
          <motion.div
            key={`step3-${currentLuminorIdx}`}
            className="flex flex-col items-center gap-8 max-w-md w-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center space-y-1">
              <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
                Seat {currentLuminorIdx + 1} of {COUNCIL.length}
              </p>
              <h2 className="font-display text-3xl font-bold text-white">
                {activeLuminor.name}
              </h2>
              <p className="font-mono text-sm" style={{ color: activeLuminor.color }}>
                {activeLuminor.domain}
              </p>
            </div>

            <LuminorAvatar
              name={activeLuminor.name}
              frequency={activeLuminor.hz}
              color={activeLuminor.color}
              size="lg"
              isActive
            />

            <div
              className="w-full rounded-xl border px-4 py-3"
              style={{
                borderColor: `${activeLuminor.color}25`,
                background: `${activeLuminor.color}08`,
              }}
            >
              <p className="font-body text-sm text-white/50 leading-relaxed italic">
                &ldquo;{activeLuminor.imprint}&rdquo;
              </p>
            </div>

            <div className="w-full space-y-2">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest">
                What do you seek from {activeLuminor.name}?
              </label>
              <textarea
                value={currentSeeking}
                onChange={(e) => setCurrentSeeking(e.target.value)}
                rows={3}
                placeholder={`Ask ${activeLuminor.name} about ${activeLuminor.domain.toLowerCase()}...`}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none transition-all resize-none leading-relaxed focus:border-white/[0.15]"
                style={{ caretColor: activeLuminor.color }}
                autoFocus
              />
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleImprintSubmit}
                className="flex-1 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${activeLuminor.color}, ${activeLuminor.color}80)` }}
              >
                {currentLuminorIdx + 1 < COUNCIL.length
                  ? "Set Imprint"
                  : "Finalize & Begin Transmission"}
              </button>
              {currentSeeking.length === 0 && (
                <button
                  onClick={handleImprintSubmit}
                  className="px-4 py-3 rounded-xl font-mono text-xs border border-white/[0.08] text-white/30 transition-all hover:text-white/60 hover:bg-white/[0.03]"
                  title="Skip this Luminor"
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Transmission ──────────────────────────────────────── */}
        {step === 4 && (
          <motion.div
            key="step4"
            className="flex flex-col items-center gap-8 text-center max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Transmission
              </h2>
              <p className="font-body text-white/40 text-sm leading-relaxed">
                Remain still. The Council transmits through coherence, not
                words. Let whatever arises, arise.
              </p>
            </div>

            {/* Pulsing mandala */}
            <div className="relative w-52 h-52 flex items-center justify-center">
              {[1, 2, 3, 4].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full"
                  style={{
                    width: `${ring * 44}px`,
                    height: `${ring * 44}px`,
                    border: `1px solid rgba(0,188,212,${0.3 / ring})`,
                  }}
                  animate={{
                    scale: transmissionRunning ? [1, 1.05, 1] : 1,
                    opacity: transmissionRunning ? [0.4, 0.8, 0.4] : 0.2,
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
              <motion.div
                animate={{
                  rotate: transmissionRunning ? 360 : 0,
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
              </motion.div>
            </div>

            {/* Timer */}
            <div className="font-display text-5xl font-bold text-[#00bcd4] tabular-nums">
              {transmissionSecondsLeft > 0
                ? formatTime(transmissionSecondsLeft)
                : "Complete"}
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #00bcd4, #0d47a1)" }}
                animate={{ width: `${transmissionPercent * 100}%` }}
                transition={{ duration: 0.8, ease: "linear" }}
              />
            </div>

            {/* Frequency tone for meditation */}
            <FrequencyTone
              frequency={528}
              isPlaying={toneActive}
              color="#00bcd4"
              showControls
              onToggle={setToneActive}
            />

            <div className="flex gap-3">
              {transmissionSecondsLeft === 0 ? (
                <button
                  onClick={() => setStep(5)}
                  className="px-8 py-3 rounded-xl font-display font-semibold text-sm text-[#09090b] transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #00bcd4, #0d47a1)" }}
                >
                  Move to Seal &rarr;
                </button>
              ) : (
                <button
                  onClick={skipTransmission}
                  className="px-6 py-3 rounded-xl font-mono text-xs border border-white/[0.08] text-white/30 transition-all hover:text-white/60 hover:bg-white/[0.03]"
                >
                  Skip
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 5: Seal ─────────────────────────────────────────────── */}
        {step === 5 && (
          <motion.div
            key="step5"
            className="flex flex-col gap-8 max-w-lg w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="font-display text-3xl font-bold text-white mb-2">
                Seal the Session
              </h2>
              <p className="font-body text-white/40 text-sm leading-relaxed">
                The Council has spoken. Record what arrived.
              </p>
            </div>

            {/* Summary of imprints */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                Tonight&rsquo;s imprints
              </p>
              <div className="space-y-2">
                {imprintData
                  .filter((e) => e.seeking.trim())
                  .map((entry) => {
                    const luminor = COUNCIL.find((l) => l.name === entry.luminorName);
                    return (
                      <div key={entry.luminorName} className="flex gap-3 items-start">
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ background: luminor?.color ? `${luminor.color}40` : undefined }}
                        >
                          {entry.luminorName.slice(0, 1)}
                        </div>
                        <div>
                          <span
                            className="font-display text-xs font-semibold"
                            style={{ color: luminor?.color }}
                          >
                            {entry.luminorName}
                          </span>
                          <p className="font-body text-xs text-white/40 leading-snug mt-0.5">
                            {entry.seeking}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                {imprintData.filter((e) => e.seeking.trim()).length === 0 && (
                  <p className="font-body text-xs text-white/25 italic">
                    No imprint requests recorded.
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
                Return to Council
              </Link>
              <button
                onClick={() => {
                  setStep(1);
                  setSummonedCount(0);
                  setImprintData([]);
                  setCurrentLuminorIdx(0);
                  setCurrentSeeking("");
                  setTransmissionSecondsLeft(TRANSMISSION_SECONDS);
                  setJournalText("");
                }}
                className="px-6 py-3 rounded-xl font-display font-semibold text-sm border border-[#00bcd4]/20 text-[#00bcd4] transition-all hover:bg-[#00bcd4]/[0.06]"
              >
                New Convening
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
