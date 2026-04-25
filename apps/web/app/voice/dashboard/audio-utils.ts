/**
 * Voice Dashboard — Audio Utilities
 *
 * Mic capture + level metering + double-clap detection via Web Audio API.
 * All client-side. No external libraries.
 */

export interface MicSession {
  stream: MediaStream;
  audioContext: AudioContext;
  analyser: AnalyserNode;
  source: MediaStreamAudioSourceNode;
  stop: () => void;
}

/** Open a mic session bound to a deviceId (or default). */
export async function openMic(deviceId?: string): Promise<MicSession> {
  const constraints: MediaStreamConstraints = {
    audio: deviceId ? { deviceId: { exact: deviceId } } : true,
    video: false,
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const AudioContextCtor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioContext = new AudioContextCtor();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0.3;
  source.connect(analyser);

  const stop = () => {
    try {
      source.disconnect();
    } catch {}
    try {
      stream.getTracks().forEach((t) => t.stop());
    } catch {}
    try {
      void audioContext.close();
    } catch {}
  };

  return { stream, audioContext, analyser, source, stop };
}

/** Compute current RMS energy (0..1) from an analyser. */
export function readRms(analyser: AnalyserNode, buffer: Uint8Array): number {
  analyser.getByteTimeDomainData(buffer);
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = (buffer[i] - 128) / 128;
    sumSquares += v * v;
  }
  return Math.sqrt(sumSquares / buffer.length);
}

/**
 * Detect dominant frequency band energy.
 * Returns ratio of energy in 1-4kHz band over total — claps are mid-high transients.
 */
export function readMidHighRatio(
  analyser: AnalyserNode,
  freqBuffer: Uint8Array,
  sampleRate: number,
): number {
  analyser.getByteFrequencyData(freqBuffer);
  const binHz = sampleRate / analyser.fftSize;
  const lowBin = Math.floor(1000 / binHz);
  const highBin = Math.min(freqBuffer.length, Math.ceil(4000 / binHz));
  let band = 0;
  let total = 0;
  for (let i = 0; i < freqBuffer.length; i++) {
    total += freqBuffer[i];
    if (i >= lowBin && i < highBin) band += freqBuffer[i];
  }
  return total > 0 ? band / total : 0;
}

export interface ClapDetectorOptions {
  /** RMS amplitude that counts as a peak (0..1). Tune via slider; default 0.18. */
  peakThreshold: number;
  /** Minimum mid-high frequency ratio for a clap-like transient (0..1). Default 0.30. */
  midHighRatio: number;
  /** Min ms between detected claps (suppresses sustain). Default 100. */
  refractoryMs: number;
  /** Min/max ms between two claps to fire double-clap. Default 150-650. */
  doubleClapWindow: [number, number];
  /** Called when a single clap is detected (for visual feedback). */
  onClap?: () => void;
  /** Called when a double-clap pattern is matched. */
  onDoubleClap: () => void;
}

export interface ClapDetector {
  /** Process one tick. Call from rAF loop. */
  tick: () => void;
  /** Reset internal state. */
  reset: () => void;
}

/**
 * Build a clap detector bound to a mic session.
 * Strategy: peak detection on RMS energy with frequency-profile filter, then
 * pattern-match two consecutive claps within the doubleClapWindow.
 */
export function createClapDetector(
  session: MicSession,
  opts: ClapDetectorOptions,
): ClapDetector {
  const { analyser, audioContext } = session;
  const timeBuf = new Uint8Array(analyser.fftSize);
  const freqBuf = new Uint8Array(analyser.frequencyBinCount);

  let lastPeakTs = 0;
  let lastClapTs = 0;
  let aboveThreshold = false;

  const tick = () => {
    const now = performance.now();
    const rms = readRms(analyser, timeBuf);

    // Hysteresis: only count one peak per above-threshold excursion.
    if (rms < opts.peakThreshold * 0.6) {
      aboveThreshold = false;
      return;
    }
    if (rms < opts.peakThreshold) return;
    if (aboveThreshold) return;
    if (now - lastPeakTs < opts.refractoryMs) {
      aboveThreshold = true;
      return;
    }

    // Frequency profile: claps emphasize 1–4 kHz mids.
    const ratio = readMidHighRatio(analyser, freqBuf, audioContext.sampleRate);
    if (ratio < opts.midHighRatio) {
      aboveThreshold = true;
      lastPeakTs = now;
      return;
    }

    // It's a clap.
    aboveThreshold = true;
    lastPeakTs = now;
    opts.onClap?.();

    const dt = now - lastClapTs;
    const [minDt, maxDt] = opts.doubleClapWindow;
    if (dt >= minDt && dt <= maxDt) {
      lastClapTs = 0; // consume the pair
      opts.onDoubleClap();
    } else {
      lastClapTs = now;
    }
  };

  const reset = () => {
    lastPeakTs = 0;
    lastClapTs = 0;
    aboveThreshold = false;
  };

  return { tick, reset };
}

/** Enumerate available audio input/output devices. */
export async function listAudioDevices(): Promise<{
  inputs: MediaDeviceInfo[];
  outputs: MediaDeviceInfo[];
}> {
  // Permission first — labels are empty without it.
  try {
    const probe = await navigator.mediaDevices.getUserMedia({ audio: true });
    probe.getTracks().forEach((t) => t.stop());
  } catch {}
  const devices = await navigator.mediaDevices.enumerateDevices();
  return {
    inputs: devices.filter((d) => d.kind === 'audioinput'),
    outputs: devices.filter((d) => d.kind === 'audiooutput'),
  };
}

export interface SessionLogEntry {
  persona: string;
  startedAt: number;
  trigger: 'click' | 'clap' | 'voice';
}

const SESSION_LOG_KEY = 'arcanea.voice.dashboard.sessions';

export function readSessionLog(): SessionLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SESSION_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function appendSessionLog(entry: SessionLogEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const next = [entry, ...readSessionLog()].slice(0, 20);
    window.localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(next));
  } catch {}
}
