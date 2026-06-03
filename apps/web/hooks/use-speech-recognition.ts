'use client';

/**
 * use-speech-recognition — thin wrapper around the browser Web Speech API
 * (`SpeechRecognition` / `webkitSpeechRecognition`).
 *
 * Purpose: give the chat composer *live, on-device interim transcripts* ("words
 * as you speak") while the existing MediaRecorder -> /api/ai/transcribe (Groq /
 * OpenAI Whisper) pipeline still produces the authoritative final text. This is
 * an enhancement layer only — when the API is unavailable (e.g. Firefox) the
 * caller falls back to the batch Whisper flow with no behavioural change.
 *
 * Privacy note: in Chrome the captured audio is sent to Google's servers for
 * recognition. We therefore treat Web Speech output as a *preview* and let
 * Whisper be the source of truth for what actually gets sent.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// --- Minimal Web Speech typings (not present in the default TS DOM lib) ------

interface SpeechAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechResult {
  readonly isFinal: boolean;
  readonly length: number;
  readonly [index: number]: SpeechAlternative;
}
interface SpeechResultList {
  readonly length: number;
  readonly [index: number]: SpeechResult;
}
interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: SpeechResultList;
}
interface SpeechRecognitionErrorEventLike {
  readonly error: string;
  readonly message?: string;
}
interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export interface UseSpeechRecognitionReturn {
  /** Whether the browser exposes the Web Speech API at all. */
  supported: boolean;
  /** Currently capturing audio. */
  listening: boolean;
  /** Stabilised, recognised text so far (finalised results joined). */
  finalText: string;
  /** In-flight best guess for the current utterance (not yet finalised). */
  interim: string;
  /** Last error code, if any (e.g. 'not-allowed', 'no-speech', 'network'). */
  error: string | null;
  /** Begin recognition. Optional BCP-47 language tag (default 'en-US'). */
  start: (lang?: string) => void;
  /** Stop recognition gracefully (fires onend). */
  stop: () => void;
  /** Clear accumulated transcripts + error. */
  reset: () => void;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  // Lazy init: evaluates once on the client's first render. On the server it
  // returns false (no `window`); `supported` is never used in JSX, so there is
  // no hydration mismatch.
  const [supported] = useState<boolean>(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  // Accumulates finalised segments across `onresult` events.
  const finalRef = useRef('');

  useEffect(() => {
    return () => {
      // Abort any in-flight session on unmount; abort() does not fire onend handlers we care about.
      try {
        recognitionRef.current?.abort();
      } catch {
        /* no-op */
      }
      recognitionRef.current = null;
    };
  }, []);

  const reset = useCallback(() => {
    finalRef.current = '';
    setFinalText('');
    setInterim('');
    setError(null);
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* no-op */
    }
  }, []);

  const start = useCallback((lang = 'en-US') => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;

    // Tear down any previous instance before starting a fresh one.
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* no-op */
      }
      recognitionRef.current = null;
    }

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalRef.current = `${finalRef.current} ${transcript}`.trim();
        } else {
          interimChunk += transcript;
        }
      }
      setFinalText(finalRef.current);
      setInterim(interimChunk);
    };

    recognition.onerror = (event) => {
      // 'no-speech' and 'aborted' are benign — don't surface them as hard errors.
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(event.error || 'speech-recognition-error');
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // start() throws if called while already started; ignore.
    }
  }, []);

  return { supported, listening, finalText, interim, error, start, stop, reset };
}
