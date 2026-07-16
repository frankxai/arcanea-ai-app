/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { useSwarmChat } from '@/hooks/use-swarm-chat';
import { SwarmTrace } from '@/components/chat/swarm-trace';

// ---------------------------------------------------------------------------
// Swarm chat surface — dedicated test bench for the multi-Luminor pipeline.
// Feature-flagged via ARCANEA_SWARM_MODE (the route handles gating).
// ---------------------------------------------------------------------------

const STARTERS = [
  'Design a villain for my cyberpunk detective world with a backstory, visual direction, and a theme track.',
  'Help me architect a composable plugin system in Next.js with observability and graceful degradation.',
  'I want to build a 5-chapter origin story for a rogue AI that becomes the protagonist of a series.',
  'Plan a launch week — positioning, a landing page, a teaser soundtrack, and a research-backed hook.',
];

interface Exchange {
  id: string;
  input: string;
  mode: 'solo' | 'swarm' | null;
  luminorNames: string[];
  synthesis: string;
  totalMs?: number;
  totalTokens?: number;
  traceId?: string;
}

export default function SwarmChatContent() {
  const [input, setInput] = useState('');
  const [maxLuminors, setMaxLuminors] = useState(4);
  const [heuristicOnly, setHeuristicOnly] = useState(false);
  const [history, setHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(
    [],
  );
  const [transcript, setTranscript] = useState<Exchange[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { state, run, stop, reset } = useSwarmChat({
    onDone: (final) => {
      // Capture the exchange once the stream completes.
      const synthesis =
        final.synthesis.trim().length > 0
          ? final.synthesis
          : // Solo mode: fall back to the single contribution
            Object.values(final.contributions)[0]?.text ?? '';

      const luminorNames = (final.plan?.luminors ?? []).map((l) => l.name);

      setTranscript((prev) => [
        ...prev,
        {
          id: `x-${Date.now()}`,
          input: input.trim(),
          mode: final.plan?.mode ?? null,
          luminorNames,
          synthesis,
          totalMs: final.totalMs,
          totalTokens: final.totalTokens,
          traceId: final.traceId,
        },
      ]);

      setHistory((prev) => [
        ...prev.slice(-6),
        { role: 'user', content: input.trim() },
        { role: 'assistant', content: synthesis },
      ]);
    },
  });

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || state.isStreaming) return;

      run({
        input: trimmed,
        history: history.slice(-4),
        maxLuminors,
        heuristicOnly,
      });
    },
    [input, state.isStreaming, run, history, maxLuminors, heuristicOnly],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const handleClearSession = useCallback(() => {
    stop();
    reset();
    setInput('');
    setHistory([]);
    setTranscript([]);
    textareaRef.current?.focus();
  }, [reset, stop]);

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 pb-40 pt-8 sm:pt-10">
          <Header onClear={handleClearSession} hasSession={transcript.length > 0} />

          <div className="mt-6 space-y-6">
            {transcript.map((x) => (
              <ExchangeCard key={x.id} exchange={x} />
            ))}

            {(state.plan || state.error) && (
              <div className="space-y-3">
                {transcript.length === 0 && (
                  <p className="text-[11px] uppercase tracking-[0.08em] text-white/30">
                    Live trace
                  </p>
                )}
                <SwarmTrace state={state} />
              </div>
            )}

            {!state.isStreaming && transcript.length === 0 && !state.plan && (
              <EmptyState
                onPick={(s) => {
                  setInput(s);
                  textareaRef.current?.focus();
                }}
              />
            )}
          </div>
        </div>

        {/* Input bar */}
        <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[var(--arc-cosmic-void)] via-[var(--arc-cosmic-void)] to-transparent pt-6 pb-[max(env(safe-area-inset-bottom),16px)]">
          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-[960px] px-4 sm:px-6"
          >
            <m.div
              layout
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md px-4 pt-3 pb-3 shadow-[0_0_40px_-15px_rgba(0,188,212,0.25)]"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={Math.min(5, Math.max(1, input.split('\n').length))}
                placeholder="Ask something that spans domains — the swarm will split it."
                className="w-full resize-none bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
                disabled={state.isStreaming}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/50">
                  <label className="inline-flex items-center gap-1">
                    Max
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={maxLuminors}
                      onChange={(e) =>
                        setMaxLuminors(Math.min(5, Math.max(1, Number(e.target.value) || 1)))
                      }
                      className="w-10 rounded border border-white/10 bg-transparent px-1 py-0.5 text-center text-white/80 focus:outline-none focus:border-[var(--arc-brand-atlantean-teal)]/40"
                      disabled={state.isStreaming}
                    />
                  </label>
                  <label className="inline-flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={heuristicOnly}
                      onChange={(e) => setHeuristicOnly(e.target.checked)}
                      className="accent-[var(--arc-brand-atlantean-teal)]"
                      disabled={state.isStreaming}
                    />
                    Heuristic planner
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {state.isStreaming && (
                    <button
                      type="button"
                      onClick={stop}
                      className="px-3 py-1.5 rounded-lg text-[12px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      Stop
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={state.isStreaming || !input.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] font-medium bg-[var(--arc-brand-atlantean-teal)]/15 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-text-primary)] hover:bg-[var(--arc-brand-atlantean-teal)]/25 hover:border-[var(--arc-brand-atlantean-teal)]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {state.isStreaming ? 'Streaming…' : 'Invoke swarm'}
                  </button>
                </div>
              </div>
            </m.div>
          </form>
        </div>
      </main>
    </LazyMotion>
  );
}

// ---------------------------------------------------------------------------
// Parts
// ---------------------------------------------------------------------------

function Header({ hasSession, onClear }: { hasSession: boolean; onClear: () => void }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--arc-brand-atlantean-teal)]/80">
          Arcanea · Swarm v1
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-display text-white">
          Two to five Luminors, thinking in parallel.
        </h1>
        <p className="mt-2 max-w-[620px] text-sm text-white/55 leading-relaxed">
          Preview of the multi-agent chat surface. The planner routes your request,
          each specialist streams in parallel, and Lumina synthesizes. The classic{' '}
          <Link href="/chat" className="text-[var(--arc-text-primary)] underline decoration-white/20 underline-offset-4 hover:decoration-[var(--arc-text-primary)]/60">
            /chat
          </Link>{' '}
          remains single-Luminor.
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/chat/traces"
          className="px-3 py-1.5 rounded-lg text-[12px] text-white/50 hover:text-[var(--arc-text-primary)] hover:bg-white/[0.04] transition-colors"
        >
          Trace history
        </Link>
        {hasSession && (
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1.5 rounded-lg text-[12px] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors"
          >
            Clear session
          </button>
        )}
      </div>
    </header>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-5 sm:p-6">
      <h2 className="text-[15px] font-medium text-white/80 mb-3">Try a starter</h2>
      <ul className="space-y-2">
        {STARTERS.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => onPick(s)}
              className="text-left w-full rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed text-white/70 bg-white/[0.015] hover:bg-white/[0.04] border border-white/[0.04] hover:border-[var(--arc-brand-atlantean-teal)]/25 transition-all"
            >
              {s}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-white/30">
        Swarm decides solo vs multi. Max 5 Luminors per request.{/* facts-ok: per-request cap */}
      </p>
    </section>
  );
}

function ExchangeCard({ exchange }: { exchange: Exchange }) {
  return (
    <m.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-4 sm:p-5 space-y-3"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/30">
          You
        </span>
        <p className="text-[14px] text-white/85 leading-relaxed whitespace-pre-wrap">
          {exchange.input}
        </p>
      </div>
      <div className="border-t border-white/[0.05] pt-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--arc-brand-atlantean-teal)]/80">
            Lumina · {exchange.mode === 'swarm' ? 'Swarm' : 'Solo'}
          </span>
          {exchange.luminorNames.length > 0 && (
            <span className="text-[11px] text-white/35">
              {exchange.luminorNames.join(' · ')}
            </span>
          )}
          {exchange.totalMs && (
            <span className="text-[11px] text-white/25 ml-auto">
              {(exchange.totalMs / 1000).toFixed(1)}s
              {exchange.totalTokens ? ` · ${exchange.totalTokens} tok` : ''}
            </span>
          )}
        </div>
        <p className="text-[14px] text-white/85 leading-relaxed whitespace-pre-wrap">
          {exchange.synthesis}
        </p>
        {exchange.traceId && (
          <Link
            href={`/chat/traces/${exchange.traceId}`}
            className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-[var(--arc-text-primary)] transition-colors"
          >
            View trace →
          </Link>
        )}
      </div>
    </m.article>
  );
}
