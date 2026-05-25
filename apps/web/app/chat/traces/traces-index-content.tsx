/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';

interface TraceRow {
  id: string;
  mode: 'solo' | 'swarm';
  planner_source: 'llm' | 'heuristic' | 'fallback';
  luminor_count: number;
  luminor_names: string[];
  total_ms: number | null;
  total_tokens: number | null;
  input_preview: string;
  synthesis_preview: string;
  created_at: string;
}

export default function TracesIndexContent() {
  const [traces, setTraces] = useState<TraceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'solo' | 'swarm'>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ limit: '25' });
    if (filter !== 'all') params.set('mode', filter);
    fetch(`/api/chat/traces?${params}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, data: j })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError((data as { error?: string }).error ?? 'Failed to load traces');
        } else {
          const d = data as { traces: TraceRow[]; nextCursor: string | null };
          setTraces(d.traces);
          setNextCursor(d.nextCursor);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Load failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const loadMore = () => {
    if (!nextCursor) return;
    const params = new URLSearchParams({ limit: '25', cursor: nextCursor });
    if (filter !== 'all') params.set('mode', filter);
    fetch(`/api/chat/traces?${params}`)
      .then((r) => r.json())
      .then((data: { traces: TraceRow[]; nextCursor: string | null }) => {
        setTraces((prev) => [...prev, ...data.traces]);
        setNextCursor(data.nextCursor);
      })
      .catch(() => {
        /* swallow */
      });
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[var(--arc-cosmic-void)] text-white/90">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 py-10">
          <header className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--arc-brand-atlantean-teal)]/80">
                Arcanea · Swarm · Observability
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-display">Your swarm traces</h1>
              <p className="mt-2 text-sm text-white/55 max-w-[600px] leading-relaxed">
                Every swarm run persists here. Click any trace to replay exactly what the
                Luminors thought.
              </p>
            </div>
            <Link
              href="/chat/swarm"
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-[var(--arc-text-primary)] bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-[var(--arc-brand-atlantean-teal)]/15 transition-colors"
            >
              New swarm →
            </Link>
          </header>

          <div className="mb-4 flex items-center gap-2">
            {(['all', 'swarm', 'solo'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                type="button"
                className={`px-3 py-1 rounded-full text-[11px] border transition-colors ${
                  filter === f
                    ? 'bg-[var(--arc-brand-atlantean-teal)]/15 border-[var(--arc-brand-atlantean-teal)]/35 text-[var(--arc-text-primary)]'
                    : 'bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white/80'
                }`}
              >
                {f === 'all' ? 'All' : f.toUpperCase()}
              </button>
            ))}
          </div>

          {loading && traces.length === 0 && (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-white/40">
              Loading traces…
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300">
              {error}
            </div>
          )}

          {!loading && traces.length === 0 && !error && (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-white/40">
              No traces yet.{' '}
              <Link
                href="/chat/swarm"
                className="text-[var(--arc-text-primary)] underline decoration-white/20 underline-offset-4 hover:decoration-[var(--arc-text-primary)]/60"
              >
                Invoke the swarm
              </Link>{' '}
              to generate your first one.
            </div>
          )}

          <ul className="space-y-2">
            {traces.map((t) => (
              <m.li
                key={t.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={`/chat/traces/${t.id}`}
                  className="block rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 sm:px-5 py-3.5 hover:border-[var(--arc-brand-atlantean-teal)]/25 hover:bg-white/[0.035] transition-all"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        t.mode === 'swarm'
                          ? 'border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-text-primary)]'
                          : 'border border-[var(--arc-brand-arcanean-gold)]/25 bg-[var(--arc-brand-arcanean-gold)]/5 text-[var(--arc-brand-arcanean-gold)]'
                      }`}
                    >
                      {t.mode}
                    </span>
                    {t.luminor_names.length > 0 && (
                      <span className="text-[11px] text-white/40 truncate max-w-[320px]">
                        {t.luminor_names.join(' · ')}
                      </span>
                    )}
                    <span className="ml-auto text-[10px] text-white/25">
                      {new Date(t.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/80 line-clamp-1">{t.input_preview}</p>
                  {t.synthesis_preview && (
                    <p className="mt-1 text-[12px] text-white/45 line-clamp-1">
                      {t.synthesis_preview}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-white/25">
                    {t.total_ms ? <span>{(t.total_ms / 1000).toFixed(1)}s</span> : null}
                    {t.total_tokens ? <span>· {t.total_tokens.toLocaleString()} tok</span> : null}
                    <span>· {t.planner_source} planner</span>
                  </div>
                </Link>
              </m.li>
            ))}
          </ul>

          {nextCursor && (
            <button
              type="button"
              onClick={loadMore}
              className="mt-4 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] py-3 text-sm text-white/50 transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      </main>
    </LazyMotion>
  );
}
