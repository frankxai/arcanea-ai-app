'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion';
import { AGENTS, AGENT_BY_ID, type Agent } from '@/lib/intelligence/agents';
import { Constellation } from './constellation';
import { AgentDetailPanel } from './agent-detail-panel';
import { ArchitectureSection } from './architecture-section';
import { CouncilMode } from './council-mode';

export function IntelligenceExperience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [councilOpen, setCouncilOpen] = useState(false);

  const selected = useMemo<Agent | null>(
    () => (selectedId ? AGENT_BY_ID[selectedId] ?? null : null),
    [selectedId],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <main className="relative min-h-dvh bg-[#050507] text-white overflow-hidden">
        {/* Atmospheric backdrop — gradient mesh + subtle grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 60% at 50% 28%, rgba(0,188,212,0.10) 0%, transparent 55%), radial-gradient(ellipse 80% 60% at 50% 72%, rgba(13,71,161,0.16) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 14% 90%, rgba(255,215,0,0.06) 0%, transparent 50%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'120\' height=\'120\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")',
          }}
        />

        {/* Top nav */}
        <header
          className="relative z-20 flex items-center justify-between"
          style={{
            paddingTop: 'max(1.5rem, env(safe-area-inset-top, 0px))',
            paddingLeft: 'max(1.5rem, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(1.5rem, env(safe-area-inset-right, 0px))',
          }}
        >
          <Link
            href="/"
            className="text-[10px] tracking-[0.32em] uppercase text-white/35 hover:text-white/80 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ← Arcanea
          </Link>
          <nav
            className="flex items-center gap-4 sm:gap-5 text-[10px] tracking-[0.28em] uppercase text-white/35"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <button
              type="button"
              onClick={() => setCouncilOpen(true)}
              className="hover:text-white/95 transition-colors"
              style={{
                cursor: 'pointer',
                color: '#ffd700',
              }}
            >
              ✦ Council
            </button>
            <a href="#architecture" className="hover:text-white/80 transition-colors hidden sm:inline">
              Architecture
            </a>
            <Link href="/room/lumina" className="hover:text-white/80 transition-colors">
              Voice
            </Link>
            <Link href="/luminors" className="hover:text-white/80 transition-colors hidden md:inline">
              Luminors
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pt-10 sm:pt-14 pb-6">
          <m.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 0.65, 0.25, 1] }}
            className="text-[10px] tracking-[0.42em] uppercase text-white/40"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Arcanea · Intelligence
          </m.p>
          <m.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 0.65, 0.25, 1] }}
            className="mt-3 text-[36px] sm:text-[56px] leading-[1.05] tracking-[-0.01em] text-white/95"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            The Lumina Constellation
          </m.h1>
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: [0.22, 0.65, 0.25, 1] }}
            className="mt-4 max-w-2xl text-[15px] sm:text-[17px] leading-[1.6] text-white/55"
            style={{ fontFamily: 'var(--font-editorial), var(--font-serif), serif' }}
          >
            Every named intelligence inside Arcanea — Lumina at the centre, the Guardian Council
            in the inner ring, Specialists past them, voices and oracles outside that. Click any
            star to speak with it.
          </m.p>
        </section>

        {/* Constellation — the hero */}
        <section className="relative z-10 mx-auto px-2 sm:px-6 pb-8">
          <Constellation
            agents={AGENTS as unknown as Agent[]}
            selectedId={selectedId}
            hoveredId={hoveredId}
            onSelect={handleSelect}
            onHover={setHoveredId}
          />
        </section>

        {/* Hint strip */}
        <div
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 pb-16 text-center text-[11px] tracking-[0.32em] uppercase text-white/30"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {hoveredId ? (
            <span className="text-white/60">{AGENT_BY_ID[hoveredId]?.name}</span>
          ) : (
            <span>tap any star · to speak with it</span>
          )}
        </div>

        {/* Architecture story */}
        <ArchitectureSection />

        {/* Footer mark */}
        <footer
          className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-12 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <p className="text-[11px] tracking-[0.28em] uppercase text-white/30">
            Arcanea · {AGENTS.length} intelligences mapped
          </p>
          <div className="flex items-center gap-5 text-[10px] tracking-[0.22em] uppercase text-white/35">
            <Link href="/room/lumina" className="hover:text-white/80 transition-colors">
              Speak →
            </Link>
            <Link href="/luminors" className="hover:text-white/80 transition-colors">
              Luminors →
            </Link>
            <a
              href="https://github.com/frankxai/arcanea"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/80 transition-colors"
            >
              Open source →
            </a>
          </div>
        </footer>

        {/* Detail panel */}
        <AnimatePresence>
          {selected && (
            <AgentDetailPanel
              key={selected.id}
              agent={selected}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>

        {/* Council mode — five voices in parallel */}
        <AnimatePresence>
          {councilOpen && <CouncilMode onClose={() => setCouncilOpen(false)} />}
        </AnimatePresence>
      </main>
    </LazyMotion>
  );
}
