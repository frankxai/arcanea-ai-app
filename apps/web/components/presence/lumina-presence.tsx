/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAudioAnalyser } from './use-audio-analyser';
import { LuminaOrb, type OrbState } from './lumina-orb';

export type PresenceState = 'idle' | OrbState;

export interface LuminaPresenceProps {
  state: PresenceState;
  stream?: MediaStream | null;
  audio?: HTMLAudioElement | null;
  color?: string;
  accent?: string;
  size?: number;
  label?: string | null;
  className?: string;
}

const STATUS_COPY: Record<OrbState, string> = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

// Sticky-mount policy: once the orb first activates, keep its WebGL context
// alive for the rest of the component's lifetime. Rapid state flips (from
// push-to-talk, barge-in, tool chains) were tearing down and rebuilding the
// three.js renderer each time, which looked shaky and cost a full context
// create on every turn. The orb's own shader handles idle vs. active, so
// visibility is driven purely by opacity.

export function LuminaPresence({
  state,
  stream,
  audio,
  color = 'var(--arc-brand-atlantean-teal)',
  accent = 'var(--arc-brand-arcanean-gold)',
  size = 320,
  label,
  className,
}: LuminaPresenceProps) {
  const source = state === 'listening' ? stream : state === 'speaking' ? audio : null;
  const snapshotRef = useAudioAnalyser(source);
  const [hasActivated, setHasActivated] = useState(false);
  const everActiveRef = useRef(false);

  useEffect(() => {
    if (state !== 'idle' && !everActiveRef.current) {
      everActiveRef.current = true;
      setHasActivated(true);
    }
  }, [state]);

  const visible = state !== 'idle';
  // Render the orb if it has EVER been active; visibility is opacity-only.
  // Drive the orb with 'listening' as a stable placeholder when idle so shader
  // uniforms lerp to a calm state without the orb being unmounted.
  const orbState: OrbState = state === 'idle' ? 'listening' : (state as OrbState);

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      {hasActivated && (
        <motion.div
          animate={{
            opacity: visible ? 1 : 0,
            scale: visible ? 1 : 0.92,
            filter: visible ? 'blur(0px)' : 'blur(10px)',
          }}
          transition={{ duration: 0.4, ease: [0.22, 0.65, 0.25, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${color}33 0%, ${color}10 35%, transparent 68%)`,
              filter: 'blur(24px)',
            }}
          />
          <LuminaOrb
            state={orbState}
            snapshotRef={snapshotRef}
            color={color}
            accent={accent}
            size={size}
          />
        </motion.div>
      )}

      <AnimatePresence>
        {visible && label !== null && (
          <motion.div
            key={`label-${state}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' }}
          >
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
              />
              <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                {label ?? STATUS_COPY[state as OrbState]}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
