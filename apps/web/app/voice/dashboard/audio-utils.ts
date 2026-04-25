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
export function readRms(analyser: AnalyserNode, buffer: Uint8Array<ArrayBuffer>): number {
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
  freqBuffer: Uint8Array<ArrayBuffer>,
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
  /**
   * Sensitivity multiplier above the running noise floor (1.0 = 1x floor).
   * Higher = less sensitive. Default 4.0.
   */
  sensitivity: number;
  /** Minimum mid-high frequency ratio for a clap-like transient (0..1). Default 0.30. */
  midHighRatio: number;
  /** Min ms between detected claps (suppresses sustain). Default 100. */
  refractoryMs: number;
  /** Min/max ms between two claps to fire double-clap. Default 150-650. */
  doubleClapWindow: [number, number];
  /** Maximum attack time in ms — peak must rise from baseline this fast. Default 50. */
  maxAttackMs: number;
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
  /** Read current noise floor (for UI display, 0..1). */
  getNoiseFloor: () => number;
}

/**
 * Build a clap detector bound to a mic session.
 *
 * Strategy: adaptive noise-floor EMA + sharp-attack gate + 1-4kHz frequency
 * profile filter, then pattern-match two consecutive claps within the
 * doubleClapWindow. Pattern from tom-s/clap-detector + web-audio-beat-detector.
 *
 * Why running noise floor: hardcoded thresholds break in noisy environments
 * (cafe, fans, traffic). EMA-tracked floor adapts in ~2s so the detector
 * stays correct as ambient changes.
 *
 * Why attack-time gate: speech and music build amplitude over 100-200ms;
 * claps reach peak in 10-30ms. Rejecting slow attacks kills 90% of speech
 * false-positives without needing a separate VAD.
 */
export function createClapDetector(
  session: MicSession,
  opts: ClapDetectorOptions,
): ClapDetector {
  const { analyser, audioContext } = session;
  const timeBuf = new Uint8Array(new ArrayBuffer(analyser.fftSize));
  const freqBuf = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));

  // Noise floor — exponential moving average of RMS while not in a peak.
  // Tau ~ 2 seconds at 60fps = alpha ~ 0.008. We bias toward "lift" only —
  // peaks should not raise the floor.
  let noiseFloor = 0.01;
  const FLOOR_ALPHA = 0.008;
  const FLOOR_MIN = 0.005;

  // Attack tracking: when did RMS leave the noise floor band?
  let attackStartTs: number | null = null;
  let lastPeakTs = 0;
  let lastClapTs = 0;

  const tick = () => {
    const now = performance.now();
    const rms = readRms(analyser, timeBuf);
    const dynamicThreshold = Math.max(noiseFloor * opts.sensitivity, FLOOR_MIN * 4);

    // Below threshold band — track noise floor, reset attack.
    if (rms < noiseFloor * 1.5) {
      noiseFloor = noiseFloor * (1 - FLOOR_ALPHA) + rms * FLOOR_ALPHA;
      noiseFloor = Math.max(FLOOR_MIN, noiseFloor);
      attackStartTs = null;
      return;
    }

    // Above floor but below threshold — start tracking attack.
    if (rms < dynamicThreshold) {
      if (attackStartTs === null) attackStartTs = now;
      return;
    }

    // Above threshold — refractory check.
    if (now - lastPeakTs < opts.refractoryMs) {
      attackStartTs = null;
      return;
    }

    // Attack-time gate: peak must rise from baseline within maxAttackMs.
    // If attackStartTs is null, this rise was instant (frame-to-frame) — pass.
    const attackMs = attackStartTs === null ? 0 : now - attackStartTs;
    if (attackMs > opts.maxAttackMs) {
      // Slow build-up — speech, music, fan whir. Reject.
      attackStartTs = null;
      return;
    }

    // Frequency profile: claps emphasize 1-4 kHz mids.
    const ratio = readMidHighRatio(analyser, freqBuf, audioContext.sampleRate);
    if (ratio < opts.midHighRatio) {
      lastPeakTs = now;
      attackStartTs = null;
      return;
    }

    // Confirmed clap.
    lastPeakTs = now;
    attackStartTs = null;
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
    noiseFloor = 0.01;
    attackStartTs = null;
    lastPeakTs = 0;
    lastClapTs = 0;
  };

  return { tick, reset, getNoiseFloor: () => noiseFloor };
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
