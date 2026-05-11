'use client';

/**
 * Cockpit — Sir's command bridge.
 *
 * Layout: dark holographic backdrop with subtle aurora; asymmetric 12-column
 * grid that steps down to single column on mobile. Header wordmark in
 * Instrument Serif italic; data in JetBrains Mono uppercase tracked.
 *
 * Composition (md+):
 *   row 1:  HERO (4 col)  ·  BRIEFING (8 col)
 *   row 2:  PRs (4 col)   ·  COMMITS (8 col)
 *   row 3:  PERSONAS (12 col)
 *
 * Mobile collapses to single column with the same vertical order.
 *
 * Stagger entry: 60ms per panel via animation-delay (CSS-only).
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  HeroPanel,
  BriefingCard,
  PRsCard,
  CommitsCard,
  PersonaRail,
} from './panels';

function Aurora() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 18% 12%, rgba(0,188,212,0.10) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 82% 88%, rgba(255,215,0,0.06) 0%, transparent 50%), ' +
            'radial-gradient(ellipse at 50% 50%, rgba(125,211,252,0.04) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

function TopFrame() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toTimeString().slice(0, 5));
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="flex items-center justify-between mb-10">
      <div className="flex items-baseline gap-4">
        <Link
          href="/"
          className="text-[10px] tracking-[0.32em] uppercase text-white/30 hover:text-white/85 transition-colors"
          style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
        >
          ← Arcanea
        </Link>
        <span className="text-white/15">/</span>
        <h1
          className="text-2xl text-white/90"
          style={{
            fontFamily: 'var(--font-editorial), var(--font-serif), serif',
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
          }}
        >
          Cockpit
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00bcd4] animate-pulse" />
          <span
            className="text-[10px] tracking-[0.28em] uppercase text-[#7feaff]/70"
            style={{ fontFamily: 'var(--font-mono, var(--font-display))' }}
          >
            Online
          </span>
        </span>
        <span className="w-px h-4 bg-white/10" />
        <span
          className="text-[12px] text-white/55 tabular-nums"
          style={{ fontFamily: 'var(--font-mono, monospace)' }}
        >
          {now}
        </span>
      </div>
    </header>
  );
}

export function CockpitClient() {
  return (
    <main className="relative min-h-screen px-6 sm:px-10 lg:px-14 py-10 sm:py-14">
      <Aurora />
      <div className="max-w-[1400px] mx-auto">
        <TopFrame />
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-5 stagger-cockpit"
          style={{ contain: 'layout' }}
        >
          <HeroPanel />
          <BriefingCard />
          <PRsCard />
          <CommitsCard />
          <PersonaRail />
        </div>
      </div>

      {/* CSS-only stagger reveal — keeps the page server-renderable AND avoids
          hauling in Framer Motion just for an entry animation. */}
      <style jsx>{`
        .stagger-cockpit > * {
          opacity: 0;
          transform: translateY(8px);
          animation: cockpit-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .stagger-cockpit > *:nth-child(1) { animation-delay: 80ms; }
        .stagger-cockpit > *:nth-child(2) { animation-delay: 160ms; }
        .stagger-cockpit > *:nth-child(3) { animation-delay: 240ms; }
        .stagger-cockpit > *:nth-child(4) { animation-delay: 320ms; }
        .stagger-cockpit > *:nth-child(5) { animation-delay: 400ms; }
        @keyframes cockpit-rise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .stagger-cockpit > * {
            opacity: 1;
            transform: none;
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
