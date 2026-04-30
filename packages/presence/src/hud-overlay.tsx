'use client';

/**
 * HUDOverlay — the cinematic Iron-Man-helmet wrapper for Arcanea voice
 * sessions. Activates on wake-word "Starlight" (or any caller-driven
 * `state === 'wake'`). Composes:
 *
 *   - Desktop-edge ambient cyan glow (CSS gradient on a fixed inset:0
 *     pointer-events:none layer)
 *   - Bottom transcript pill (current utterance + reply)
 *   - Top-right agent roster (which Luminor is on the case + intent
 *     classification badge from voice-operator's packet)
 *   - Inline approval gate modal with 3-second confirm timer for
 *     tier-B/C packets (auto-confirm A, hold-to-confirm B, type-to-confirm C)
 *
 * Designed for two surfaces:
 *   1. Browser overlay (today) — full-viewport fixed positioning, lives
 *      inside arcanea.ai/room or the LCC dashboard.
 *   2. Tauri desktop overlay (Phase D) — same component, mounted in a
 *      transparent always-on-top WebView. Same code, no rewrite.
 *
 * Motion: framer-motion `domAnimation` only (per @arcanea/design-system
 * canon). All entrances expoOut, exits expoIn. prefers-reduced-motion
 * collapses transitions to 0.01s. Continuous animation is reserved for
 * 'thinking' state only — never decorative.
 *
 * Typography: Geist (display) + Instrument Serif (editorial accent for
 * the transcript pill quote). Never Cinzel/Inter/Space Grotesk.
 *
 * Colors: only design-system tokens — Atlantean Teal #00bcd4, Cosmic
 * Blue #0d47a1, Gold #ffd700, BG #09090b. Tier colors map via the
 * approval.tier prop.
 */

import { useEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig, m, AnimatePresence, domAnimation } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HUDState =
  | 'dormant'      // overlay invisible, no edge glow
  | 'wake'         // wake-word fired, edge glow pulses up
  | 'listening'    // mic active, transcript building
  | 'thinking'     // utterance routed to brain, awaiting packet
  | 'speaking'     // reply playing (TTS), transcript pinned
  | 'approval';    // packet returned, approval gate visible

export type ApprovalTier = 'A' | 'B' | 'C';

export interface ApprovalPacket {
  packet_id: string;
  intent?: string;
  target_system?: string;
  task: string;
  tier: ApprovalTier;
  reason_if_required?: string;
  spoken_update?: string;
}

export interface AgentRosterEntry {
  id: string;
  name: string;
  /** Color from the persona's design-system slot, e.g. '#00bcd4' */
  color: string;
  /** Whether this agent is currently routing the active packet */
  active?: boolean;
}

export interface HUDOverlayProps {
  state: HUDState;
  /** What the user said (live, partial OK) */
  transcript?: string;
  /** What the agent said (live, streamed OK) */
  reply?: string;
  /** Active agent + roster shown top-right */
  roster?: AgentRosterEntry[];
  /** Pending approval, surfaces the modal when state === 'approval' */
  approval?: ApprovalPacket | null;
  /** Approve callback. Called after the user-driven gate passes (auto-3s for A,
   *  hold for B, type for C). Component owns the timer/keystroke logic. */
  onApprove?: (packetId: string) => void;
  /** Reject callback. Wired to Esc + the X button. */
  onReject?: (packetId: string) => void;
  /** Optional accent for the edge glow. Defaults to Atlantean Teal. */
  accent?: string;
  /** Optional className for the outer fixed wrapper */
  className?: string;
}

const DEFAULT_ACCENT = '#00bcd4';

const TIER_COPY: Record<ApprovalTier, { label: string; subtext: string; color: string }> = {
  A: { label: 'Read-only', subtext: 'Auto-confirms in 3s', color: '#0d47a1' },
  B: { label: 'Safe write', subtext: 'Hold Space to confirm', color: '#00bcd4' },
  C: { label: 'Dangerous', subtext: 'Type "approve" to confirm', color: '#ffd700' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HUDOverlay({
  state,
  transcript,
  reply,
  roster,
  approval,
  onApprove,
  onReject,
  accent = DEFAULT_ACCENT,
  className,
}: HUDOverlayProps) {
  const isVisible = state !== 'dormant';
  const isWaking = state === 'wake' || state === 'listening' || state === 'thinking' || state === 'speaking' || state === 'approval';
  const showTranscript = Boolean(transcript || reply) && isWaking;
  const showRoster = Boolean(roster && roster.length > 0) && isWaking;
  const showApproval = state === 'approval' && approval;

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <m.div
          className={className}
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: showApproval ? 'auto' : 'none',
            zIndex: 60,
            fontFamily: 'var(--font-geist), system-ui, sans-serif',
          }}
          aria-hidden={!isVisible}
        >
          <EdgeGlow active={isWaking} accent={accent} pulse={state === 'wake'} />

          <AnimatePresence>
            {showRoster && (
              <m.div
                key="roster"
                initial={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  top: 'max(1.5rem, env(safe-area-inset-top, 0px))',
                  right: 'max(1.5rem, env(safe-area-inset-right, 0px))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  pointerEvents: 'auto',
                }}
              >
                <AgentRoster entries={roster ?? []} />
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTranscript && (
              <m.div
                key="transcript"
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  bottom: 'max(2rem, env(safe-area-inset-bottom, 0px))',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'min(92vw, 640px)',
                  pointerEvents: 'none',
                }}
              >
                <TranscriptPill transcript={transcript} reply={reply} accent={accent} state={state} />
              </m.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showApproval && approval && (
              <m.div
                key="approval"
                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.96 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(9, 9, 11, 0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  pointerEvents: 'auto',
                }}
              >
                <ApprovalGate
                  packet={approval}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// EdgeGlow — fixed inset:0 ambient cyan gradient
// ---------------------------------------------------------------------------

function EdgeGlow({ active, accent, pulse }: { active: boolean; accent: string; pulse: boolean }) {
  return (
    <m.div
      aria-hidden
      animate={{
        opacity: active ? (pulse ? 1 : 0.55) : 0,
      }}
      transition={{ duration: pulse ? 0.32 : 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 50% 0%, ${accent}26 0%, transparent 38%),
          radial-gradient(ellipse at 50% 100%, ${accent}1f 0%, transparent 38%),
          radial-gradient(ellipse at 0% 50%, ${accent}1a 0%, transparent 38%),
          radial-gradient(ellipse at 100% 50%, ${accent}1a 0%, transparent 38%)
        `,
        filter: 'blur(0.5px)',
        mixBlendMode: 'screen',
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// TranscriptPill — what you said (italic Instrument Serif), what they said
// ---------------------------------------------------------------------------

function TranscriptPill({
  transcript,
  reply,
  accent,
  state,
}: {
  transcript?: string;
  reply?: string;
  accent: string;
  state: HUDState;
}) {
  const stateLabel =
    state === 'listening' ? 'Listening' :
    state === 'thinking' ? 'Thinking' :
    state === 'speaking' ? 'Speaking' :
    state === 'wake' ? 'Awake' : '';

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '1.25rem',
        padding: '1rem 1.5rem',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.45), 0 0 32px ${accent}14`,
      }}
    >
      {stateLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          <span
            style={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '50%',
              backgroundColor: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
          <span
            style={{
              fontSize: '10px',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)',
            }}
          >
            {stateLabel}
          </span>
        </div>
      )}
      {transcript && (
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontStyle: 'italic',
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'rgba(255, 255, 255, 0.55)',
            margin: 0,
          }}
        >
          &ldquo;{transcript}&rdquo;
        </p>
      )}
      {reply && (
        <p
          style={{
            fontFamily: 'var(--font-instrument-serif), Georgia, serif',
            fontSize: '18px',
            lineHeight: 1.5,
            color: 'rgba(255, 255, 255, 0.92)',
            marginTop: transcript ? '0.625rem' : 0,
            marginBottom: 0,
            letterSpacing: '0.005em',
          }}
        >
          {reply}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// AgentRoster — small glass cards for active + dormant agents
// ---------------------------------------------------------------------------

function AgentRoster({ entries }: { entries: AgentRosterEntry[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        minWidth: '180px',
      }}
    >
      <div
        style={{
          fontSize: '9px',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.4)',
          marginBottom: '0.25rem',
        }}
      >
        Roster
      </div>
      {entries.map((e) => (
        <div
          key={e.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: e.active ? 1 : 0.5,
          }}
        >
          <span
            style={{
              width: '0.375rem',
              height: '0.375rem',
              borderRadius: '50%',
              backgroundColor: e.color,
              boxShadow: e.active ? `0 0 12px ${e.color}` : `0 0 4px ${e.color}40`,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: e.active ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {e.name}
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ApprovalGate — tier-aware confirm flow
// ---------------------------------------------------------------------------

const TIER_C_PHRASE = 'approve';

function ApprovalGate({
  packet,
  onApprove,
  onReject,
}: {
  packet: ApprovalPacket;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}) {
  const tier = packet.tier;
  const meta = TIER_COPY[tier];

  const [holdProgress, setHoldProgress] = useState(0); // 0..1 for tier B
  const [typed, setTyped] = useState(''); // for tier C
  const holdTimerRef = useRef<number | null>(null);
  const autoTimerRef = useRef<number | null>(null);
  const holdStartRef = useRef<number>(0);

  // Tier A — auto-confirm 3s
  useEffect(() => {
    if (tier !== 'A') return;
    autoTimerRef.current = window.setTimeout(() => {
      onApprove?.(packet.packet_id);
    }, 3000);
    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    };
  }, [tier, packet.packet_id, onApprove]);

  // Tier A — also tick a progress bar visually
  const [autoProgress, setAutoProgress] = useState(0);
  useEffect(() => {
    if (tier !== 'A') return;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(1, elapsed / 3000);
      setAutoProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tier]);

  // Tier B — hold Space to confirm
  useEffect(() => {
    if (tier !== 'B') return;
    const onDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();
      holdStartRef.current = performance.now();
      const tickHold = () => {
        const elapsed = performance.now() - holdStartRef.current;
        const p = Math.min(1, elapsed / 1500);
        setHoldProgress(p);
        if (p >= 1) {
          onApprove?.(packet.packet_id);
          return;
        }
        holdTimerRef.current = window.requestAnimationFrame(tickHold);
      };
      holdTimerRef.current = window.requestAnimationFrame(tickHold);
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      if (holdTimerRef.current) cancelAnimationFrame(holdTimerRef.current);
      setHoldProgress(0);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onReject?.(packet.packet_id);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('keydown', onEsc);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('keydown', onEsc);
      if (holdTimerRef.current) cancelAnimationFrame(holdTimerRef.current);
    };
  }, [tier, packet.packet_id, onApprove, onReject]);

  // Tier C — type 'approve'
  useEffect(() => {
    if (tier !== 'C') return;
    if (typed.toLowerCase() === TIER_C_PHRASE) {
      onApprove?.(packet.packet_id);
    }
  }, [tier, typed, packet.packet_id, onApprove]);

  return (
    <div
      role="dialog"
      aria-labelledby="approval-heading"
      style={{
        background: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${meta.color}66`,
        boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 60px ${meta.color}33`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '1.25rem',
        padding: '1.75rem 2rem',
        width: 'min(92vw, 480px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '0.875rem',
        }}
      >
        <span
          style={{
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '50%',
            backgroundColor: meta.color,
            boxShadow: `0 0 16px ${meta.color}`,
          }}
        />
        <span
          style={{
            fontSize: '10px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: meta.color,
          }}
        >
          Tier {tier} · {meta.label}
        </span>
      </div>

      <h2
        id="approval-heading"
        style={{
          fontFamily: 'var(--font-instrument-serif), Georgia, serif',
          fontSize: '20px',
          lineHeight: 1.4,
          color: 'rgba(255, 255, 255, 0.92)',
          margin: 0,
        }}
      >
        {packet.task}
      </h2>

      {packet.target_system && (
        <p
          style={{
            fontFamily: 'var(--font-jetbrains-mono), monospace',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '0.5rem',
          }}
        >
          → {packet.target_system}
          {packet.intent && <span> · {packet.intent}</span>}
        </p>
      )}

      {packet.reason_if_required && (
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.65)',
            marginTop: '0.75rem',
            lineHeight: 1.5,
          }}
        >
          {packet.reason_if_required}
        </p>
      )}

      {/* Tier-specific confirm UI */}
      <div style={{ marginTop: '1.25rem' }}>
        {tier === 'A' && (
          <ProgressBar progress={autoProgress} color={meta.color} hint={meta.subtext} />
        )}
        {tier === 'B' && (
          <ProgressBar progress={holdProgress} color={meta.color} hint={meta.subtext} />
        )}
        {tier === 'C' && (
          <input
            autoFocus
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={`type "${TIER_C_PHRASE}" to confirm`}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${meta.color}66`,
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              color: 'rgba(255, 255, 255, 0.92)',
              fontFamily: 'var(--font-jetbrains-mono), monospace',
              fontSize: '13px',
              outline: 'none',
            }}
          />
        )}
      </div>

      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => onReject?.(packet.packet_id)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.55)',
            cursor: 'pointer',
          }}
        >
          Reject (Esc)
        </button>
      </div>
    </div>
  );
}

function ProgressBar({ progress, color, hint }: { progress: number; color: string; hint: string }) {
  return (
    <div>
      <div
        style={{
          height: '4px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress * 100}%`,
            background: color,
            boxShadow: `0 0 12px ${color}`,
            transition: 'width 0.05s linear',
          }}
        />
      </div>
      <p
        style={{
          fontSize: '10px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.45)',
          marginTop: '0.5rem',
        }}
      >
        {hint}
      </p>
    </div>
  );
}
