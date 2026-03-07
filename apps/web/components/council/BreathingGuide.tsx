"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "inhale" | "hold" | "exhale" | "rest";

interface PhaseConfig {
  label: string;
  instruction: string;
  durationMs: number;
  scale: number;
  opacity: number;
}

const PHASES: PhaseConfig[] = [
  { label: "Inhale",  instruction: "Breathe in slowly",   durationMs: 4000, scale: 1.3,  opacity: 0.9 },
  { label: "Hold",    instruction: "Hold the breath",     durationMs: 7000, scale: 1.3,  opacity: 1.0 },
  { label: "Exhale",  instruction: "Release completely",  durationMs: 8000, scale: 0.75, opacity: 0.5 },
  { label: "Rest",    instruction: "Rest before next",    durationMs: 1000, scale: 0.75, opacity: 0.3 },
];

interface BreathingGuideProps {
  color?: string;
  autoStart?: boolean;
  onComplete?: () => void;
  cycles?: number;
}

export function BreathingGuide({
  color = "#00bcd4",
  autoStart = false,
  onComplete,
  cycles = 3,
}: BreathingGuideProps) {
  const [running, setRunning] = useState(autoStart);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const phase = PHASES[phaseIndex];

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 100;
        if (next >= phase.durationMs) {
          const nextPhaseIdx = (phaseIndex + 1) % PHASES.length;
          // Count cycles when we complete exhale (phase index 2)
          if (phaseIndex === 2) {
            const nextCycle = cycleCount + 1;
            setCycleCount(nextCycle);
            if (nextCycle >= cycles) {
              setRunning(false);
              onComplete?.();
              return 0;
            }
          }
          setPhaseIndex(nextPhaseIdx);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [running, phaseIndex, phase.durationMs, cycleCount, cycles, onComplete]);

  const progress = elapsed / phase.durationMs;

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Breathing circle */}
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Outer pulse */}
        {running && (
          <motion.div
            className="absolute rounded-full"
            style={{ background: `${color}10` }}
            animate={{
              width: `${140 * phase.scale * 1.4}px`,
              height: `${140 * phase.scale * 1.4}px`,
              opacity: phase.opacity * 0.3,
            }}
            transition={{ duration: phase.durationMs / 1000, ease: "easeInOut" }}
          />
        )}

        {/* Main breathing circle */}
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${color}30, ${color}08)`,
            border: `2px solid ${color}50`,
          }}
          animate={
            running
              ? {
                  width: `${120 * phase.scale}px`,
                  height: `${120 * phase.scale}px`,
                  opacity: phase.opacity,
                  boxShadow: `0 0 ${30 * phase.scale}px ${color}${Math.round(phase.opacity * 50).toString(16).padStart(2, '0')}`,
                }
              : { width: "90px", height: "90px", opacity: 0.4 }
          }
          transition={{ duration: phase.durationMs / 1000, ease: "easeInOut" }}
        >
          {/* Progress arc via conic-gradient */}
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: `conic-gradient(${color} ${progress * 360}deg, transparent ${progress * 360}deg)`,
            }}
            aria-hidden
          />
        </motion.div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.label}
            className="absolute text-center"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
          >
            <p
              className="font-display text-sm font-bold"
              style={{ color: running ? color : "rgba(255,255,255,0.3)" }}
            >
              {running ? phase.label : "Ready"}
            </p>
            <p className="font-mono text-[9px] text-white/30 mt-0.5">
              {running
                ? `${Math.ceil((phase.durationMs - elapsed) / 1000)}s`
                : "4 · 7 · 8"}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Instruction text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={running ? phase.label : "idle"}
          className="font-body text-sm text-white/50 text-center max-w-[200px] leading-relaxed"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {running ? phase.instruction : "4-7-8 breathing to enter chamber state"}
        </motion.p>
      </AnimatePresence>

      {/* Cycle progress */}
      {cycles > 1 && (
        <div className="flex gap-1.5">
          {Array.from({ length: cycles }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  i < cycleCount
                    ? color
                    : i === cycleCount && running
                    ? `${color}60`
                    : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!running ? (
          <button
            onClick={() => {
              setPhaseIndex(0);
              setCycleCount(0);
              setElapsed(0);
              setRunning(true);
            }}
            className="px-5 py-2.5 rounded-xl font-display text-sm font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${color}80, ${color}40)`,
              border: `1px solid ${color}40`,
              color: "white",
            }}
          >
            Begin Breathing
          </button>
        ) : (
          <button
            onClick={() => setRunning(false)}
            className="px-5 py-2.5 rounded-xl font-display text-sm font-semibold border border-white/[0.08] text-white/50 transition-all hover:bg-white/[0.04] hover:text-white"
          >
            Pause
          </button>
        )}
      </div>
    </div>
  );
}
