/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

/**
 * SwarmTrace — live visualization of the multi-Luminor swarm.
 *
 * During streaming:
 *   - Top banner shows the planner's mode + rationale.
 *   - Each active Luminor renders as a glass card with avatar, streaming text,
 *     tool-call chips, and a status pulse.
 *   - When Lumina's synthesis starts, a synthesis card slides down and
 *     streams alongside — the contributor cards collapse into chips.
 *
 * After streaming:
 *   - The synthesis is the headline answer.
 *   - Contributor pills sit below; clicking one expands that Luminor's raw
 *     contribution.
 *
 * No external deps beyond framer-motion + tailwind. Zero visual churn.
 */

import { useState } from 'react';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import type { SwarmState, SwarmContribution } from '@/hooks/use-swarm-chat';

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const GUARDIAN_COLOR: Record<string, string> = {
  development: 'var(--arc-brand-atlantean-teal)',
  creative: 'var(--arc-brand-atlantean-teal)',
  writing: 'var(--arc-void)',
  research: 'var(--arc-brand-arcanean-gold)',
  orchestrator: 'var(--arc-text-primary)',
  unknown: 'var(--arc-void)',
};

function colorFor(guardian: string): string {
  return GUARDIAN_COLOR[guardian] ?? GUARDIAN_COLOR.unknown;
}

function statusChip(status: SwarmContribution['status']): {
  label: string;
  dot: string;
  text: string;
} {
  switch (status) {
    case 'thinking':
      return { label: 'thinking', dot: 'bg-white/30', text: 'text-white/40' };
    case 'streaming':
      return { label: 'responding', dot: 'bg-[var(--arc-brand-atlantean-teal)] animate-pulse', text: 'text-[var(--arc-text-primary)]' };
    case 'done':
      return { label: 'done', dot: 'bg-[var(--arc-brand-atlantean-teal)]', text: 'text-[var(--arc-brand-atlantean-teal)]' };
    case 'error':
      return { label: 'error', dot: 'bg-red-500', text: 'text-red-400' };
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SwarmTraceProps {
  state: SwarmState;
  className?: string;
}

export function SwarmTrace({ state, className = '' }: SwarmTraceProps) {
  const { plan, contributions, order, synthesis, synthesisStarted, synthesisDone, error } = state;

  if (!plan && !error) return null;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence mode="wait">
        <m.div
          key="swarm-trace"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`w-full max-w-[960px] mx-auto space-y-3 ${className}`}
        >
          {plan && <PlanBanner plan={plan} />}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {plan && (
            <ContributorGrid
              luminors={order.map((id) => contributions[id]).filter(Boolean)}
              collapsed={synthesisStarted || synthesisDone}
            />
          )}

          <AnimatePresence>
            {(synthesisStarted || synthesis.length > 0) && (
              <SynthesisCard
                key="synthesis"
                text={synthesis}
                done={synthesisDone}
              />
            )}
          </AnimatePresence>
        </m.div>
      </AnimatePresence>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// Plan banner
// ---------------------------------------------------------------------------

function PlanBanner({ plan }: { plan: NonNullable<SwarmState['plan']> }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
            plan.mode === 'swarm'
              ? 'border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-text-primary)]'
              : 'border-[var(--arc-brand-arcanean-gold)]/25 bg-[var(--arc-brand-arcanean-gold)]/5 text-[var(--arc-brand-arcanean-gold)]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              plan.mode === 'swarm' ? 'bg-[var(--arc-brand-atlantean-teal)]' : 'bg-[var(--arc-brand-arcanean-gold)]'
            }`}
          />
          {plan.mode === 'swarm' ? `Swarm · ${plan.luminors.length} Luminors` : 'Solo'}
        </span>
        <span className="text-[11px] text-white/30">
          planned in {plan.planMs}ms via {plan.source}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{plan.rationale}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contributor grid
// ---------------------------------------------------------------------------

function ContributorGrid({
  luminors,
  collapsed,
}: {
  luminors: SwarmContribution[];
  collapsed: boolean;
}) {
  if (luminors.length === 0) return null;

  if (collapsed) {
    return (
      <div className="flex flex-wrap gap-2">
        {luminors.map((l) => (
          <ContributorPill key={l.id} contribution={l} />
        ))}
      </div>
    );
  }

  const gridCols =
    luminors.length === 1
      ? 'grid-cols-1'
      : luminors.length === 2
        ? 'md:grid-cols-2'
        : luminors.length === 3
          ? 'md:grid-cols-3'
          : 'md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-3`}>
      {luminors.map((l) => (
        <ContributorCard key={l.id} contribution={l} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contributor card
// ---------------------------------------------------------------------------

function ContributorCard({ contribution }: { contribution: SwarmContribution }) {
  const accent = colorFor(contribution.guardian);
  const status = statusChip(contribution.status);

  return (
    <m.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden flex flex-col min-h-[180px]"
      style={{ borderTopColor: accent, borderTopWidth: '2px' }}
    >
      <header className="flex items-center gap-2.5 px-3.5 pt-3 pb-2">
        {contribution.avatar ? (
          <div
            className="w-7 h-7 rounded-full bg-cover bg-center ring-1"
            style={{
              backgroundImage: `url(${contribution.avatar})`,
              boxShadow: `0 0 0 1px ${accent}40`,
            }}
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-black"
            style={{ background: accent }}
          >
            {contribution.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-white truncate">{contribution.name}</div>
          <div className="text-[10px] text-white/30 capitalize">{contribution.guardian}</div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </header>

      <div className="px-3.5 pb-3 text-[13px] leading-relaxed text-white/80 whitespace-pre-wrap flex-1 min-h-0 overflow-y-auto max-h-[260px]">
        {contribution.text || (
          <span className="text-white/25 italic">
            {contribution.status === 'thinking' ? 'Listening...' : 'Drafting...'}
          </span>
        )}
      </div>

      {contribution.toolCalls.length > 0 && (
        <footer className="border-t border-white/[0.04] px-3.5 py-2 flex flex-wrap gap-1.5">
          {contribution.toolCalls.map((t, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${
                t.completed
                  ? 'bg-white/[0.04] text-white/50'
                  : 'bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-text-primary)]'
              }`}
            >
              <span
                className={`w-1 h-1 rounded-full ${
                  t.completed ? 'bg-white/30' : 'bg-[var(--arc-brand-atlantean-teal)] animate-pulse'
                }`}
              />
              {t.toolName.replace(/_/g, ' ')}
            </span>
          ))}
        </footer>
      )}

      {contribution.error && (
        <div className="px-3.5 py-2 border-t border-red-500/20 text-[11px] text-red-400/80">
          {contribution.error}
        </div>
      )}

      {contribution.durationMs !== undefined && contribution.status === 'done' && (
        <footer className="px-3.5 py-1.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-white/25">
          <span>{(contribution.durationMs / 1000).toFixed(1)}s</span>
          {contribution.tokensOut ? <span>{contribution.tokensOut} tok</span> : null}
        </footer>
      )}
    </m.article>
  );
}

// ---------------------------------------------------------------------------
// Contributor pill (collapsed)
// ---------------------------------------------------------------------------

function ContributorPill({ contribution }: { contribution: SwarmContribution }) {
  const [expanded, setExpanded] = useState(false);
  const accent = colorFor(contribution.guardian);

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70 hover:bg-white/[0.06] transition-colors"
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
          aria-hidden
        />
        <span>{contribution.name}</span>
        {contribution.durationMs !== undefined && (
          <span className="text-white/30">· {(contribution.durationMs / 1000).toFixed(1)}s</span>
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[12px] leading-relaxed text-white/70 whitespace-pre-wrap max-w-[560px] max-h-[220px] overflow-y-auto"
          >
            {contribution.text}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Synthesis card
// ---------------------------------------------------------------------------

function SynthesisCard({ text, done }: { text: string; done: boolean }) {
  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-[var(--arc-brand-atlantean-teal)]/20 bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)]/[0.04] to-[var(--arc-brand-atlantean-teal)]/[0.02] backdrop-blur-sm p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-[var(--arc-brand-atlantean-teal)] animate-pulse" />
        <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--arc-text-primary)]">
          Lumina · Synthesis
        </span>
        {done && (
          <span className="text-[10px] text-white/30 ml-auto">✓ Synthesized</span>
        )}
      </div>
      <div className="text-[14px] leading-relaxed text-white/85 whitespace-pre-wrap">
        {text || <span className="text-white/25 italic">Weaving the swarm...</span>}
      </div>
    </m.div>
  );
}
