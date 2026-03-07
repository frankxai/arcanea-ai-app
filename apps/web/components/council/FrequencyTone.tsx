"use client";

import { useRef, useEffect, useCallback } from "react";

interface FrequencyToneProps {
  frequency: number;
  isPlaying: boolean;
  volume?: number;
  color?: string;
  showControls?: boolean;
  onToggle?: (playing: boolean) => void;
}

export function FrequencyTone({
  frequency,
  isPlaying,
  volume = 0.12,
  color = "#00bcd4",
  showControls = true,
  onToggle,
}: FrequencyToneProps) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopTone = useCallback(() => {
    if (oscRef.current) {
      gainRef.current?.gain.setTargetAtTime(0, ctxRef.current!.currentTime, 0.2);
      oscRef.current.stop(ctxRef.current!.currentTime + 0.5);
      oscRef.current = null;
    }
  }, []);

  const startTone = useCallback(() => {
    if (typeof window === "undefined") return;

    // Create context lazily (requires user gesture)
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // Clean up existing oscillator
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscRef.current = osc;
    gainRef.current = gain;
  }, [frequency, volume]);

  useEffect(() => {
    if (isPlaying) {
      startTone();
    } else {
      stopTone();
    }
    return stopTone;
  }, [isPlaying, startTone, stopTone]);

  // Update frequency live if changed while playing
  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.frequency.setTargetAtTime(
        frequency,
        ctxRef.current!.currentTime,
        0.1
      );
    }
  }, [frequency]);

  if (!showControls) return null;

  return (
    <button
      onClick={() => onToggle?.(!isPlaying)}
      className="flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2"
      style={{
        borderColor: isPlaying ? `${color}50` : "rgba(255,255,255,0.08)",
        background: isPlaying ? `${color}10` : "rgba(255,255,255,0.02)",
        color: isPlaying ? color : "rgba(255,255,255,0.4)",
      }}
      aria-label={`${isPlaying ? "Stop" : "Play"} ${frequency} Hz tone`}
      aria-pressed={isPlaying}
    >
      {/* Waveform icon */}
      <svg
        width="16"
        height="10"
        viewBox="0 0 16 10"
        fill="none"
        aria-hidden
        style={{ opacity: isPlaying ? 1 : 0.4 }}
      >
        <path
          d="M0 5 Q2 0 4 5 Q6 10 8 5 Q10 0 12 5 Q14 10 16 5"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <span className="font-mono text-xs">
        {frequency} Hz
      </span>

      {/* Animated bars when playing */}
      {isPlaying && (
        <span className="flex items-end gap-[2px] h-3" aria-hidden>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full"
              style={{
                backgroundColor: color,
                height: `${3 + i * 3}px`,
                animation: `pulse ${0.6 + i * 0.15}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </span>
      )}
    </button>
  );
}
