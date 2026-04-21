'use client';

import { useEffect, useRef } from 'react';

export interface AudioSnapshot {
  amplitude: number;
  low: number;
  mid: number;
  high: number;
  bins: Uint8Array;
}

export interface UseAudioAnalyserOptions {
  fftSize?: number;
  smoothing?: number;
}

type Source = MediaStream | HTMLAudioElement | null | undefined;

export function useAudioAnalyser(source: Source, options: UseAudioAnalyserOptions = {}) {
  const { fftSize = 256, smoothing = 0.82 } = options;
  const snapshotRef = useRef<AudioSnapshot>({
    amplitude: 0,
    low: 0,
    mid: 0,
    high: 0,
    bins: new Uint8Array(fftSize / 2),
  });

  useEffect(() => {
    if (!source || typeof window === 'undefined') return;

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = fftSize;
    analyser.smoothingTimeConstant = smoothing;

    let node: AudioNode;
    try {
      if (source instanceof MediaStream) {
        node = ctx.createMediaStreamSource(source);
      } else {
        node = ctx.createMediaElementSource(source);
        node.connect(ctx.destination);
      }
      node.connect(analyser);
    } catch {
      ctx.close();
      return;
    }

    const bins = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const binCount = bins.length;
    const lowEnd = Math.floor(binCount * 0.15);
    const midEnd = Math.floor(binCount * 0.55);

    const tick = () => {
      analyser.getByteFrequencyData(bins);
      let sum = 0;
      let low = 0;
      let mid = 0;
      let high = 0;
      for (let i = 0; i < binCount; i++) {
        const v = bins[i];
        sum += v;
        if (i < lowEnd) low += v;
        else if (i < midEnd) mid += v;
        else high += v;
      }
      snapshotRef.current.amplitude = sum / (binCount * 255);
      snapshotRef.current.low = low / (lowEnd * 255);
      snapshotRef.current.mid = mid / ((midEnd - lowEnd) * 255);
      snapshotRef.current.high = high / ((binCount - midEnd) * 255);
      snapshotRef.current.bins = bins;
      raf = requestAnimationFrame(tick);
    };

    if (ctx.state === 'suspended') void ctx.resume();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      try {
        node.disconnect();
        analyser.disconnect();
      } catch {}
      void ctx.close();
    };
  }, [source, fftSize, smoothing]);

  return snapshotRef;
}
