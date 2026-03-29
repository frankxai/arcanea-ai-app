'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface VoiceWaveformProps {
  /** The active MediaStream from getUserMedia */
  stream: MediaStream;
  /** Called when the user clicks the stop button */
  onStop: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BAR_COUNT = 24;
const MIN_HEIGHT = 4;
const MAX_HEIGHT = 32;
const SMOOTHING = 0.8;
const FFT_SIZE = 64; // Gives us 32 frequency bins — we sample BAR_COUNT of them

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VoiceWaveform({ stream, onStop }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);

  // -------------------------------------------------------------------------
  // Format seconds as m:ss
  // -------------------------------------------------------------------------

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }, []);

  // -------------------------------------------------------------------------
  // Timer
  // -------------------------------------------------------------------------

  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 250);
    return () => clearInterval(interval);
  }, []);

  // -------------------------------------------------------------------------
  // Audio analysis + canvas rendering
  // -------------------------------------------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create audio context and analyser
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = SMOOTHING;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-DPI support
    const dpr = window.devicePixelRatio || 1;

    function draw() {
      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const gap = 3;
      const totalGap = gap * (BAR_COUNT - 1);
      const barWidth = (width - totalGap) / BAR_COUNT;
      const centerY = height / 2;

      for (let i = 0; i < BAR_COUNT; i++) {
        // Map bar index to frequency bin
        const binIndex = Math.floor((i / BAR_COUNT) * bufferLength);
        const value = dataArray[binIndex] / 255; // 0..1

        // Map value to bar height
        const barHeight = MIN_HEIGHT + value * (MAX_HEIGHT - MIN_HEIGHT);
        const halfBar = barHeight / 2;

        const x = i * (barWidth + gap);

        // Opacity: taller bars more opaque
        const opacity = 0.3 + value * 0.7;

        // Gradient from #00bcd4 (base/outside) to #00897b (center/top)
        const gradient = ctx.createLinearGradient(x, centerY - halfBar, x, centerY + halfBar);
        gradient.addColorStop(0, `rgba(0, 137, 123, ${opacity})`); // top: teal-dark
        gradient.addColorStop(0.5, `rgba(0, 188, 212, ${opacity})`); // center: cyan
        gradient.addColorStop(1, `rgba(0, 137, 123, ${opacity})`); // bottom: teal-dark

        ctx.fillStyle = gradient;

        // Draw rounded bar (top half + bottom half from center)
        const radius = Math.min(barWidth / 2, 2);
        roundedRect(ctx, x, centerY - halfBar, barWidth, barHeight, radius);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      source.disconnect();
      if (audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, [stream]);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 mx-3 my-1.5 rounded-xl bg-[#0d0d14]/80 border border-white/[0.06]">
      {/* Recording indicator dot */}
      <span className="relative flex items-center justify-center w-3 h-3 shrink-0">
        <span className="absolute w-3 h-3 rounded-full bg-red-500/40 animate-ping" />
        <span className="relative w-2 h-2 rounded-full bg-red-500" />
      </span>

      {/* Waveform canvas */}
      <canvas
        ref={canvasRef}
        className="flex-1 h-10"
        aria-label="Voice recording waveform visualization"
        role="img"
        style={{ imageRendering: 'auto' }}
      />

      {/* Timer */}
      <span className="text-xs text-white/50 font-mono tabular-nums min-w-[3ch]">
        {formatTime(elapsed)}
      </span>

      {/* Stop button */}
      <button
        type="button"
        onClick={onStop}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/25 hover:border-red-500/30 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-red-500/40 focus-visible:outline-none"
        aria-label="Stop recording"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="shrink-0">
          <rect x="1" y="1" width="8" height="8" rx="1.5" />
        </svg>
        Stop
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: draw a rounded rectangle
// ---------------------------------------------------------------------------

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
}
