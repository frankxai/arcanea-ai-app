'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m, LazyMotion, domAnimation } from 'framer-motion';

interface TraceRow {
  id: string;
  mode: 'solo' | 'swarm';
  planner_source: 'llm' | 'heuristic' | 'fallback';
  plan_ms: number | null;
  total_ms: number | null;
  total_tokens: number | null;
  input: string;
  plan_luminors: Array<{ id: string; name: string; reason: string }>;
  rationale: string | null;
  contributions: Array<{
    id: string;
    name: string;
    guardian: string;
    text: string;
    toolCalls: Array<{ toolName: string; input: unknown; output?: unknown }>;
    tokensIn: number;
    tokensOut: number;
    durationMs: number;
    error?: string;
  }>;
  synthesis: string | null;
  error: string | null;
  created_at: string;
}

export default function TraceReplayContent({ id }: { id: string }) {
  const [trace, setTrace] = useState<TraceRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/chat/traces/${id}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, data: j })))
      .then(({ ok, data }) => {
        if (cancelled) return;
        if (!ok) {
          setError((data as { error?: string }).error ?? 'Trace not found');
        } else {
          setTrace((data as { trace: TraceRow }).trace);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load trace');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-[#09090b] text-white/90">
        <div className="mx-auto max-w-[960px] px-4 sm:px-6 py-10">
          <header className="flex items-start justify-between gap-3 mb-6">
            <div>
              <Link
                href="/chat/swarm"
                className="text-[11px] uppercase tracking-[0.08em] text-[#00bcd4]/80 hover:text-[#9be7f2]"
              >
                ← Back to swarm
              </Link>
              <h1 className="mt-2 text-2xl sm:text-3xl font-display">Swarm trace</h1>
              <p className="text-[12px] text-white/40 font-mono mt-1">{id}</p>
            </div>
          </header>

          {loading && (
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-6 text-white/40">
              Loading trace…
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-300">
              {error}
            </div>
          )}

          {trace && !loading && (
            <m.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <Meta trace={trace} />
              <InputCard text={trace.input} />
              <RationaleCard trace={trace} />
              <ContributionsStack trace={trace} />
              {trace.synthesis && <SynthesisCard text={trace.synthesis} />}
            </m.div>
          )}
        </div>
      </main>
    </LazyMotion>
  );
}

function Meta({ trace }: { trace: TraceRow }) {
  const created = new Date(trace.created_at).toLocaleString();
  return (
    <div className="flex flex-wrap gap-2 text-[11px] text-white/40">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium ${
          trace.mode === 'swarm'
            ? 'border-[#00bcd4]/30 bg-[#00bcd4]/10 text-[#9be7f2]'
            : 'border-[#ffd700]/25 bg-[#ffd700]/5 text-[#ffd700]'
        }`}
      >
        {trace.mode.toUpperCase()}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5">
        {trace.planner_source} planner
      </span>
      {trace.total_ms && (
        <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5">
          {(trace.total_ms / 1000).toFixed(1)}s total
        </span>
      )}
      {trace.total_tokens && (
        <span className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5">
          {trace.total_tokens.toLocaleString()} tokens
        </span>
      )}
      <span className="ml-auto">{created}</span>
    </div>
  );
}

function InputCard({ text }: { text: string }) {
  return (
    <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 sm:px-5 py-4">
      <h2 className="text-[11px] uppercase tracking-[0.08em] text-white/30 mb-2">Prompt</h2>
      <p className="text-[14px] text-white/85 whitespace-pre-wrap leading-relaxed">{text}</p>
    </section>
  );
}

function RationaleCard({ trace }: { trace: TraceRow }) {
  if (!trace.rationale && trace.plan_luminors.length === 0) return null;
  return (
    <section className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 sm:px-5 py-4 space-y-3">
      <h2 className="text-[11px] uppercase tracking-[0.08em] text-white/30">Plan</h2>
      {trace.rationale && (
        <p className="text-[13px] text-white/70 leading-relaxed">{trace.rationale}</p>
      )}
      {trace.plan_luminors.length > 0 && (
        <ul className="space-y-1.5 text-[12px] text-white/60">
          {trace.plan_luminors.map((l) => (
            <li key={l.id} className="flex gap-2">
              <span className="font-medium text-white/80 min-w-[140px]">{l.name}</span>
              <span className="text-white/50">{l.reason}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ContributionsStack({ trace }: { trace: TraceRow }) {
  if (trace.contributions.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-[11px] uppercase tracking-[0.08em] text-white/30">Contributions</h2>
      {trace.contributions.map((c) => (
        <article
          key={c.id}
          className="rounded-2xl border border-white/[0.05] bg-white/[0.02] px-4 sm:px-5 py-4"
        >
          <header className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[13px] font-medium text-white">{c.name}</span>
            <span className="text-[10px] text-white/30 capitalize">{c.guardian}</span>
            <span className="ml-auto text-[10px] text-white/30">
              {(c.durationMs / 1000).toFixed(1)}s · {c.tokensOut} tok
            </span>
          </header>
          {c.error ? (
            <p className="text-[12px] text-red-300/80">{c.error}</p>
          ) : (
            <p className="text-[13px] text-white/80 whitespace-pre-wrap leading-relaxed">
              {c.text || <span className="text-white/30 italic">(empty)</span>}
            </p>
          )}
          {c.toolCalls.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {c.toolCalls.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/50"
                >
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  {t.toolName.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

function SynthesisCard({ text }: { text: string }) {
  return (
    <section className="rounded-2xl border border-[#00bcd4]/20 bg-gradient-to-br from-[#00bcd4]/[0.05] to-[#7fffd4]/[0.02] px-4 sm:px-5 py-5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-[#00bcd4]" />
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#9be7f2]">
          Lumina · Synthesis
        </span>
      </div>
      <p className="text-[14px] text-white/85 whitespace-pre-wrap leading-relaxed">{text}</p>
    </section>
  );
}
