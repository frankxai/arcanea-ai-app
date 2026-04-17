'use client';

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

const MOTION = {
  initial: { opacity: 0, scale: 0.82, filter: 'blur(12px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.85, filter: 'blur(14px)' },
  transition: { duration: 0.45, ease: [0.22, 0.65, 0.25, 1] as [number, number, number, number] },
};

const STATUS_COPY: Record<OrbState, string> = {
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

export function LuminaPresence({
  state,
  stream,
  audio,
  color = '#00bcd4',
  accent = '#ffd700',
  size = 320,
  label,
  className,
}: LuminaPresenceProps) {
  const source = state === 'listening' ? stream : state === 'speaking' ? audio : null;
  const snapshotRef = useAudioAnalyser(source);
  const active = state !== 'idle';

  return (
    <div className={className} style={{ width: size, height: size, position: 'relative' }}>
      <AnimatePresence>
        {active && (
          <motion.div
            key="orb"
            {...MOTION}
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
              state={state as OrbState}
              snapshotRef={snapshotRef}
              color={color}
              accent={accent}
              size={size}
            />
            {label !== null && (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
