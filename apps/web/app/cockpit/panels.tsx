'use client';

/**
 * Cockpit panels — the visible surface of Sir's command bridge.
 *
 * Aesthetic: dark holographic bridge. Asymmetric grid. Instrument Serif
 * italic wordmark, JetBrains Mono for data, Geist for body. Atlantean Teal
 * (#00bcd4) pulse on live signals; Gold (#ffd700) for success / merged states.
 * No purple-gradient AI-slop. No icy cyan everywhere — restraint.
 *
 * Each panel is a self-contained client component that fetches its own data.
 * They compose in cockpit-client.tsx into the full grid.
 */

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

interface ToolResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

async function callTool<T>(action: string, args: Record<string, unknown> = {}): Promise<T | null> {
  try {
    const res = await fetch('/api/voice/tools', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, args }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ToolResponse<T>;
    return json.ok && json.data ? json.data : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// SignalCard — base glass primitive with optional live indicator
// ---------------------------------------------------------------------------

interface SignalCardProps {
  label: string;
  accent?: 'teal' | 'gold' | 'rose' | 'neutral';
  live?: boolean;
  span?: 'full' | 'wide' | 'normal';
  children: ReactNode;
  cta?: { href: string; label: string };
}

const ACCENT_STYLES: Record<NonNullable<SignalCardProps['accent']>, { dot: string; glow: string; text: string }> = {
  teal:    { dot: '#00bcd4', glow: 'rgba(0,188,212,0.18)', text: '#7feaff' },
  gold:    { dot: '#ffd700', glow: 'rgba(255,215,0,0.16)', text: '#ffe675' },
  rose:    { dot: '#ef4444', glow: 'rgba(239,68,68,0.16)', text: '#fda4af' },
  neutral: { dot: 'rgba(255,255,255,0.5)', glow: 'transparent', text: 'rgba(255,255,255,0.65)' },
};

export function SignalCard({ label, accent = 'neutral', live = false, span = 'normal', children, cta }: SignalCardProps) {
  const a = ACCENT_STYLES[accent];
  const spanClass = span === 'full' ? 'md:col-span-12' : span === 'wide' ? 'md:col-span-8' : 'md:col-span-4';
  return (
    <section
      className={`relative rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-md p-6 transition-colors hover:border-white/[0.10] ${spanClass}`}
      style={{ boxShadow: accent !== 'neutral' ? `0 0 60px ${a.glow}` : undefined }}
    >
      <header className="flex items-center gap-2 mb-4">
        <span
          className={live ? 'animate-pulse' : ''}
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: a.dot,
            boxShadow: live && accent !== 'neutral' ? `0 0 10px ${a.dot}` : 'none',
          }}
          aria-hidden
        />
        <h2
          className="text-[10px] tracking-[0.32em] uppercase text-white/55"
          style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
        >
          {label}
        </h2>
        {cta && (
          <Link
            href={cta.href}
            className="ml-auto text-[10px] tracking-[0.24em] uppercase text-white/40 hover:text-white/85 transition-colors"
            style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
          >
            {cta.label} →
          </Link>
        )}
      </header>
      <div className="text-white/85">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// BriefingCard — live system signals + branch + git_today count
// ---------------------------------------------------------------------------

interface BriefingPayload {
  brief?: string;
  signals?: {
    gitToday?: number;
    branch?: string;
    planningFiles?: number;
    memTotalGb?: number;
    memFreeGb?: number;
  };
  source?: 'local' | 'remote' | 'partial';
}

export function BriefingCard() {
  const [data, setData] = useState<BriefingPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/voice/briefing', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: BriefingPayload | null) => {
        if (cancelled) return;
        setData(d);
        setLoading(false);
      })
      .catch(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const s = data?.signals;
  const memUsedPct = s?.memTotalGb && s?.memFreeGb
    ? Math.round(((s.memTotalGb - s.memFreeGb) / s.memTotalGb) * 100)
    : null;

  return (
    <SignalCard label="Briefing" accent="teal" live={!loading} span="wide" cta={{ href: '/api/voice/briefing', label: 'Raw' }}>
      {loading ? (
        <p className="text-white/40 text-sm">compiling…</p>
      ) : !data ? (
        <p className="text-rose-300/70 text-sm">briefing unavailable</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Branch" value={s?.branch ?? '—'} mono />
            <Stat
              label="Commits / 24h"
              value={s?.gitToday !== undefined ? String(s.gitToday) : '—'}
              accent={s?.gitToday && s.gitToday > 0 ? 'teal' : undefined}
            />
            <Stat
              label="RAM in use"
              value={memUsedPct !== null ? `${memUsedPct}%` : '—'}
              accent={memUsedPct !== null && memUsedPct > 88 ? 'rose' : memUsedPct !== null && memUsedPct > 70 ? 'gold' : undefined}
            />
            <Stat label="Plans" value={s?.planningFiles !== undefined ? String(s.planningFiles) : '—'} />
          </div>
          {data.brief && (
            <p
              className="text-[13px] leading-relaxed text-white/55 italic"
              style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
            >
              {data.brief}
            </p>
          )}
          <p
            className="text-[9px] tracking-[0.32em] uppercase text-white/30"
            style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
          >
            {data.source === 'local' ? 'local — full filesystem awareness' : data.source === 'remote' ? 'remote — public surface only' : 'partial'}
          </p>
        </div>
      )}
    </SignalCard>
  );
}

function Stat({
  label,
  value,
  mono = false,
  accent,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: 'teal' | 'gold' | 'rose';
}) {
  const accentColor = accent === 'teal' ? '#7feaff' : accent === 'gold' ? '#ffe675' : accent === 'rose' ? '#fda4af' : 'rgba(255,255,255,0.92)';
  return (
    <div>
      <div
        className="text-[9px] tracking-[0.28em] uppercase text-white/35 mb-1"
        style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
      >
        {label}
      </div>
      <div
        className={mono ? 'text-[13px]' : 'text-2xl'}
        style={{
          fontFamily: mono ? 'var(--font-mono, monospace)' : 'var(--font-display, var(--font-sans))',
          color: accentColor,
          fontWeight: mono ? 400 : 600,
          letterSpacing: mono ? '0.04em' : '-0.01em',
        }}
      >
        {value}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroPanel — Jarvis call-to-action, links to /room/jarvis
// ---------------------------------------------------------------------------

export function HeroPanel() {
  return (
    <section className="relative md:col-span-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-gradient-to-br from-[#00bcd4]/[0.10] via-[#7dd3fc]/[0.04] to-transparent backdrop-blur-md p-8 min-h-[260px] flex flex-col justify-between">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(0,188,212,0.35) 0%, transparent 70%)' }}
      />
      <div className="relative">
        <p
          className="text-[10px] tracking-[0.36em] uppercase text-[#7feaff]/70 mb-3"
          style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
        >
          Voice Operator
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-[1.05] text-white/95"
          style={{
            fontFamily: 'var(--font-editorial), var(--font-serif), serif',
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
          }}
        >
          Sir.
        </h1>
        <p
          className="mt-3 text-[13px] leading-relaxed text-white/55 max-w-[36ch]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Jarvis is on the room. Six live tools. Sir-cadence prompt. Speak when ready.
        </p>
      </div>
      <div className="relative flex items-center gap-3 mt-6">
        <Link
          href="/room/jarvis"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-[0.28em] uppercase transition-all"
          style={{
            fontFamily: 'var(--font-mono, var(--font-display))',
            color: '#7feaff',
            background: 'rgba(0,188,212,0.14)',
            border: '1px solid rgba(0,188,212,0.32)',
            boxShadow: '0 0 30px rgba(0,188,212,0.18)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse" />
          Enter the Room
        </Link>
        <span
          className="text-[10px] tracking-[0.24em] uppercase text-white/30"
          style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
        >
          Space → speak
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PRsCard — open pull requests via /api/voice/tools list_open_prs
// ---------------------------------------------------------------------------

interface PrItem {
  number: number;
  title: string;
  headRefName: string;
  isDraft: boolean;
}

export function PRsCard() {
  const [prs, setPrs] = useState<PrItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    callTool<{ count: number; prs: PrItem[]; error?: string }>('list_open_prs').then((data) => {
      if (cancelled) return;
      if (!data) {
        setError('PR fetch failed — is `gh` authed?');
        return;
      }
      setPrs(data.prs ?? []);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SignalCard label="Open PRs" accent="gold" live={prs !== null && prs.length > 0} span="normal" cta={{ href: 'https://github.com/frankxai/arcanea-ai-app/pulls', label: 'GitHub' }}>
      {prs === null && !error ? (
        <p className="text-white/40 text-sm">querying gh…</p>
      ) : error ? (
        <p className="text-rose-300/70 text-sm">{error}</p>
      ) : prs && prs.length === 0 ? (
        <p className="text-white/45 text-sm italic" style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}>Clean board, Sir.</p>
      ) : (
        <ol className="space-y-2.5">
          {prs!.slice(0, 6).map((pr) => (
            <li key={pr.number} className="flex items-baseline gap-3 group">
              <span
                className="shrink-0 text-[11px] text-[#ffe675]/80"
                style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}
              >
                #{pr.number}
              </span>
              <a
                href={`https://github.com/frankxai/arcanea-ai-app/pull/${pr.number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-white/80 group-hover:text-white transition-colors truncate"
              >
                {pr.title}
              </a>
              {pr.isDraft && (
                <span className="ml-auto shrink-0 text-[8px] tracking-[0.32em] uppercase text-white/35 px-1.5 py-0.5 rounded border border-white/10">
                  Draft
                </span>
              )}
            </li>
          ))}
        </ol>
      )}
    </SignalCard>
  );
}

// ---------------------------------------------------------------------------
// CommitsCard — last 24h commits
// ---------------------------------------------------------------------------

interface CommitItem {
  hash: string;
  subject: string;
  author: string;
}

export function CommitsCard() {
  const [data, setData] = useState<CommitItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    callTool<{ count: number; commits: CommitItem[] }>('git_today').then((res) => {
      if (cancelled) return;
      setData(res?.commits ?? []);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SignalCard label="Last 24h" accent="teal" live={data !== null && data.length > 0} span="wide">
      {data === null ? (
        <p className="text-white/40 text-sm">querying git…</p>
      ) : data.length === 0 ? (
        <p className="text-white/45 text-sm italic" style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}>No commits yet today.</p>
      ) : (
        <ol className="space-y-2.5">
          {data.slice(0, 7).map((c) => (
            <li key={c.hash} className="flex items-baseline gap-3">
              <span
                className="shrink-0 text-[11px] text-[#7feaff]/80"
                style={{ fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.04em' }}
              >
                {c.hash}
              </span>
              <span className="text-[13px] text-white/85 truncate flex-1">{c.subject}</span>
              <span
                className="shrink-0 text-[10px] text-white/30"
                style={{ fontFamily: 'var(--font-mono, monospace)' }}
              >
                {c.author}
              </span>
            </li>
          ))}
        </ol>
      )}
    </SignalCard>
  );
}

// ---------------------------------------------------------------------------
// PersonaRail — switcher to /room/<id>
// ---------------------------------------------------------------------------

const PERSONA_ROSTER: Array<{ id: string; name: string; tag: string; color: string }> = [
  { id: 'jarvis',   name: 'Jarvis',    tag: 'Voice Operator',   color: '#7dd3fc' },
  { id: 'lumina',   name: 'Lumina',    tag: 'First Light',       color: '#ffd700' },
  { id: 'draconia', name: 'Draconia',  tag: 'Guardian of Fire',  color: '#ef4444' },
  { id: 'lyria',    name: 'Lyria',     tag: 'Guardian of Sight', color: '#a78bfa' },
  { id: 'alera',    name: 'Alera',     tag: 'Guardian of Voice', color: '#00bcd4' },
  { id: 'shinkami', name: 'Shinkami',  tag: 'The Source',        color: '#e0e0e0' },
  { id: 'nero',     name: 'Nero',      tag: 'Primordial Dark',   color: '#6366f1' },
];

export function PersonaRail() {
  return (
    <SignalCard label="Personas" accent="neutral" span="full">
      <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {PERSONA_ROSTER.map((p) => (
          <li key={p.id}>
            <Link
              href={`/room/${p.id}`}
              className="block group relative rounded-xl p-3 transition-all border border-white/[0.05] hover:border-white/[0.14] bg-white/[0.015] hover:bg-white/[0.04]"
            >
              <span
                className="block w-2 h-2 rounded-full mb-2 transition-transform group-hover:scale-125"
                style={{ backgroundColor: p.color, boxShadow: `0 0 12px ${p.color}66` }}
                aria-hidden
              />
              <span
                className="block text-[12px] uppercase tracking-[0.18em] text-white/85"
                style={{ fontFamily: 'var(--font-display, var(--font-sans))', fontWeight: 500 }}
              >
                {p.name}
              </span>
              <span
                className="block text-[9px] tracking-[0.22em] uppercase text-white/35 mt-1"
                style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
              >
                {p.tag}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SignalCard>
  );
}
