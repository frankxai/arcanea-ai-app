/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { emit } from '../lib/intent-bus';

/**
 * Voice Control — Web Speech API → /api/voice/classify → intent bus.
 *
 * Activated by clicking the mic icon (push-to-talk) or auto-on when the
 * dashboard's activation mode is set to 'voice'. Streams interim transcripts
 * for live UI feedback; final transcript is POSTed to the classifier.
 */

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}
type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

interface ClassifyResponse {
  kind: 'summon' | 'workflow' | 'runtime' | 'embed' | 'unknown';
  targetId: string | null;
  confidence: number;
  summary: string;
  source?: string;
}

function getRecognitionCtor(): { new (): SpeechRecognitionInstance } | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: { new (): SpeechRecognitionInstance };
    webkitSpeechRecognition?: { new (): SpeechRecognitionInstance };
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function VoiceControl({
  onIntent,
}: {
  onIntent: (intent: ClassifyResponse, transcript: string) => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [final, setFinal] = useState<string | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [lastResult, setLastResult] = useState<ClassifyResponse | null>(null);
  const recogRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    setSupported(!!Ctor);
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    if (recogRef.current) {
      try {
        recogRef.current.abort();
      } catch {}
    }
    const recog = new Ctor();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = 'en-US';
    recog.onstart = () => {
      setListening(true);
      setInterim('');
      setFinal(null);
    };
    recog.onresult = (event) => {
      let interimText = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      if (interimText) setInterim(interimText);
      if (finalText) setFinal(finalText.trim());
    };
    recog.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') {
        setListening(false);
        return;
      }
      console.warn('[voice] recognition error', e.error);
      setListening(false);
    };
    recog.onend = () => {
      setListening(false);
    };
    recogRef.current = recog;
    try {
      recog.start();
    } catch {}
  }, []);

  const stopListening = useCallback(() => {
    try {
      recogRef.current?.stop();
    } catch {}
    setListening(false);
  }, []);

  /* When a final transcript lands, classify and fire intent. */
  useEffect(() => {
    if (!final) return;
    let cancelled = false;
    setClassifying(true);
    fetch('/api/voice/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: final }),
    })
      .then((r) => r.json() as Promise<ClassifyResponse>)
      .then((result) => {
        if (cancelled) return;
        setLastResult(result);
        // Always log the heard line on the bus for visibility
        emit({
          kind: 'clap', // reuse a leaf-only kind for "heard"; doesn't trigger summon
          trigger: 'voice',
          summary: `Heard: "${final}"`,
        });
        if (result.kind !== 'unknown' && result.targetId) {
          onIntent(result, final);
        } else {
          emit({
            kind: 'clap',
            trigger: 'voice',
            summary: `No match: "${final.slice(0, 40)}"`,
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setClassifying(false);
      });
    return () => {
      cancelled = true;
    };
  }, [final, onIntent]);

  if (supported === false) return null;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Voice control</p>
        <span className="text-[10px] text-white/25">
          {supported === null ? 'detecting…' : supported ? 'Web Speech ready' : 'unsupported'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={listening ? stopListening : startListening}
          disabled={!supported}
          className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            listening
              ? 'bg-[var(--arc-fire)] shadow-[0_0_24px_rgba(239,68,68,0.6)]'
              : 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
          }`}
          aria-label={listening ? 'Stop listening' : 'Start listening'}
        >
          {listening ? (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-[var(--arc-fire)]"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          ) : null}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="8" y1="22" x2="16" y2="22" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {listening ? (
              <motion.p
                key="listening"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-white/60 italic truncate"
              >
                {interim || 'Listening…'}
              </motion.p>
            ) : classifying ? (
              <motion.p
                key="classifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-[var(--arc-brand-atlantean-teal)]/80"
              >
                Classifying intent…
              </motion.p>
            ) : lastResult ? (
              <motion.p
                key="result"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-white/65 truncate"
              >
                <span className="text-white/35 uppercase tracking-widest text-[9px] mr-2">
                  {lastResult.kind}
                </span>
                {lastResult.summary}
              </motion.p>
            ) : (
              <p className="text-xs text-white/35">
                Click the mic and speak. Try &ldquo;summon Lumina&rdquo;,
                &ldquo;open library&rdquo;, &ldquo;show me arcanea on youtube&rdquo;.
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
