/** Evidence-first, monophonic onset detector for the initial piano rhythm exercise.
 * No AI judgment; this is an intentionally narrow prototype, not a pitch grader.
 */
export type RhythmResult = {
  detectedOnsetsMs: number[];
  expectedIntervalsMs: number[];
  observedIntervalsMs: number[];
  meanAbsoluteIntervalErrorMs: number | null;
  confidence: number;
  status: 'measured' | 'insufficient_signal';
};

export function detectOnsets(samples: Float32Array, sampleRate: number): number[] {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) throw new Error('Invalid sample rate');
  const frameSize = Math.max(128, Math.round(sampleRate * 0.012));
  const envelope: number[] = [];
  for (let offset = 0; offset + frameSize <= samples.length; offset += frameSize) {
    let power = 0;
    for (let i = offset; i < offset + frameSize; i++) power += samples[i] * samples[i];
    envelope.push(Math.sqrt(power / frameSize));
  }
  const peak = Math.max(0, ...envelope);
  if (peak < 0.008) return [];
  const threshold = Math.max(0.012, peak * 0.18);
  const onsets: number[] = [];
  let last = -Infinity;
  for (let i = 1; i < envelope.length; i++) {
    const rising = envelope[i] > threshold && envelope[i] > envelope[i - 1] * 1.65;
    const ms = i * frameSize * 1000 / sampleRate;
    if (rising && ms - last >= 170) { onsets.push(Math.round(ms)); last = ms; }
  }
  return onsets;
}

export function evaluateRhythm(samples: Float32Array, sampleRate: number, bpm = 90): RhythmResult {
  if (!Number.isFinite(bpm) || bpm < 30 || bpm > 240) throw new Error('Invalid tempo');
  const detectedOnsetsMs = detectOnsets(samples, sampleRate);
  const expectedIntervalsMs = [60000 / bpm, 60000 / bpm, 60000 / bpm];
  const observedIntervalsMs = detectedOnsetsMs.slice(1, 4).map((time, index) => time - detectedOnsetsMs[index]);
  if (detectedOnsetsMs.length !== 4 || observedIntervalsMs.length !== 3) {
    return { detectedOnsetsMs, expectedIntervalsMs, observedIntervalsMs, meanAbsoluteIntervalErrorMs: null, confidence: 0, status: 'insufficient_signal' };
  }
  const meanAbsoluteIntervalErrorMs = Math.round(observedIntervalsMs.reduce((sum, observed, index) => sum + Math.abs(observed - expectedIntervalsMs[index]), 0) / 3);
  return { detectedOnsetsMs, expectedIntervalsMs, observedIntervalsMs, meanAbsoluteIntervalErrorMs, confidence: 0.65, status: 'measured' };
}
