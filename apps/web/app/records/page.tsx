'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MusicNotes,
  Play,
  Sparkle,
  ArrowRight,
  Fire,
  Wind,
  Moon,
  Sun,
  MusicNote,
  Lightning,
  Radio,
  Waves,
} from '@phosphor-icons/react';
import type { PhosphorIcon as PhIcon } from '@phosphor-icons/react';
import { MotionProvider, m } from '@/lib/motion';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Release {
  id: string;
  title: string;
  artist: string;
  element: string;
  elementIcon: PhIcon;
  gradient: string;
  accent: string;
  border: string;
  tracks: number;
  duration: string;
  description: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  icon: PhIcon;
  count: number;
  accent: string;
  gradient: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const FEATURED_RELEASES: Release[] = [
  {
    id: 'gate-frequencies',
    title: 'Gate Frequencies Vol. I',
    artist: 'FrankX',
    element: 'Spirit',
    elementIcon: Sun,
    gradient: 'from-amber-500/30 via-yellow-600/20 to-orange-500/10',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    tracks: 10,
    duration: '47:23',
    description: 'Ten tracks aligned to each Gate frequency. Consciousness-expanding ambient compositions from 174 Hz to 1111 Hz.',
  },
  {
    id: 'guardian-anthems',
    title: 'Guardian Anthems',
    artist: 'FrankX',
    element: 'Fire',
    elementIcon: Fire,
    gradient: 'from-red-600/30 via-orange-500/20 to-amber-400/10',
    accent: 'text-orange-400',
    border: 'border-orange-500/30',
    tracks: 10,
    duration: '52:10',
    description: 'Each Guardian receives their anthem. Epic orchestral themes that capture the essence of every Gate keeper.',
  },
  {
    id: 'void-meditations',
    title: 'Void Meditations',
    artist: 'FrankX',
    element: 'Void',
    elementIcon: Moon,
    gradient: 'from-violet-600/30 via-purple-700/20 to-indigo-800/10',
    accent: 'text-violet-400',
    border: 'border-violet-500/30',
    tracks: 7,
    duration: '63:45',
    description: 'Deep ambient journeys into the primordial darkness. Nero-aligned frequencies for meditation and inner exploration.',
  },
  {
    id: 'elemental-battles',
    title: 'Elemental Battles',
    artist: 'FrankX',
    element: 'Wind',
    elementIcon: Wind,
    gradient: 'from-sky-500/30 via-cyan-600/20 to-blue-700/10',
    accent: 'text-sky-400',
    border: 'border-sky-500/30',
    tracks: 8,
    duration: '38:56',
    description: 'High-energy compositions for the arena. Where elemental forces collide in sonic warfare.',
  },
];

const COLLECTIONS: Collection[] = [
  {
    id: 'gate-freq',
    name: 'Gate Frequencies',
    description: 'Ambient tracks aligned to each Gate\'s sacred frequency, from 174 Hz Foundation to 1111 Hz Source.',
    icon: Waves,
    count: 10,
    accent: 'text-[#7fffd4]',
    gradient: 'from-[#7fffd4]/20 to-transparent',
  },
  {
    id: 'guardian-anthems',
    name: 'Guardian Anthems',
    description: 'Epic orchestral themes for each of the ten Guardians. The sonic identity of Arcanea.',
    icon: Radio,
    count: 10,
    accent: 'text-[#ffd700]',
    gradient: 'from-[#ffd700]/20 to-transparent',
  },
  {
    id: 'meditation-journeys',
    name: 'Meditation Journeys',
    description: 'Extended ambient compositions for deep practice. Void-touched soundscapes for inner exploration.',
    icon: Moon,
    count: 7,
    accent: 'text-violet-400',
    gradient: 'from-violet-500/20 to-transparent',
  },
  {
    id: 'battle-hymns',
    name: 'Battle Hymns',
    description: 'High-energy elemental compositions. Fire and Wind clash in sonic storms of creative intensity.',
    icon: Lightning,
    count: 12,
    accent: 'text-orange-400',
    gradient: 'from-orange-500/20 to-transparent',
  },
];

const ELEMENT_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  Fire: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  Water: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  Earth: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  Wind: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  Void: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  Spirit: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
};

// ─── Components ─────────────────────────────────────────────────────────────

function ReleaseCard({ release, index }: { release: Release; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const badge = ELEMENT_BADGES[release.element];
  const Icon = release.elementIcon;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover art placeholder — gradient */}
      <div className={`relative aspect-square bg-gradient-to-br ${release.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <MusicNotes
              className={`w-20 h-20 ${release.accent} opacity-20 transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`}
              weight="thin"
            />
          </div>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Play className="w-6 h-6 text-white ml-0.5" weight="fill" />
          </button>
        </div>

        {/* Element badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full ${badge.bg} ${badge.text} border ${badge.border} backdrop-blur-sm`}>
            <Icon className="w-3 h-3" weight="fill" />
            {release.element}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-white text-base mb-1 group-hover:text-[#7fffd4] transition-colors">
          {release.title}
        </h3>
        <p className="text-sm text-white/50 font-mono mb-3">{release.artist}</p>
        <p className="text-sm text-white/40 leading-relaxed mb-4">
          {release.description}
        </p>
        <div className="flex items-center justify-between text-xs text-white/30 font-mono">
          <span>{release.tracks} tracks</span>
          <span>{release.duration}</span>
        </div>
      </div>
    </m.div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function RecordsPage() {
  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(127,255,212,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(120,166,255,0.04),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <section className="mb-20">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-16 sm:px-14 sm:py-20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-[#78a6ff]/6 pointer-events-none" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7fffd4]/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#78a6ff]/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#7fffd4]/30 bg-[#7fffd4]/10 mb-8">
                  <MusicNotes className="w-4 h-4 text-[#7fffd4]" weight="fill" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#7fffd4]">
                    Arcanea Records
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight text-white">
                  Frequency-aligned music
                  <span className="block bg-gradient-to-r from-[#7fffd4] via-[#78a6ff] to-violet-400 bg-clip-text text-transparent">
                    for consciousness evolution
                  </span>
                </h1>

                <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-10">
                  Original compositions tuned to the ten Gate frequencies. Each track is crafted
                  to align with the Arcanean progression system — from the grounding 174 Hz of Foundation
                  to the transcendent 1111 Hz of Source.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#1DB954] text-white font-semibold hover:brightness-110 transition-all"
                  >
                    <Play className="w-5 h-5" weight="fill" />
                    Listen on Spotify
                  </a>
                  <Link
                    href="/studio/music"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    <Sparkle className="w-4 h-4 text-[#ffd700]" weight="fill" />
                    Create Your Own
                  </Link>
                </div>

                {/* Suno AI badge */}
                <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-white/40">
                  <Waves className="w-3.5 h-3.5" />
                  Powered by Suno AI
                </div>
              </div>
            </m.div>
          </section>

          {/* ── Featured Releases ────────────────────────────────────── */}
          <section className="mb-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Section 01</p>
                <h2 className="text-2xl font-display font-bold text-white">Featured Releases</h2>
                <p className="text-white/40 text-sm mt-1">Original compositions from the Arcanea universe</p>
              </div>
              <Link
                href="/records/all"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#7fffd4] transition-colors"
              >
                View all releases <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_RELEASES.map((release, i) => (
                <ReleaseCard key={release.id} release={release} index={i} />
              ))}
            </div>
          </section>

          {/* ── Collections ──────────────────────────────────────────── */}
          <section className="mb-20">
            <div className="mb-10">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Section 02</p>
              <h2 className="text-2xl font-display font-bold text-white">Collections</h2>
              <p className="text-white/40 text-sm mt-1">Browse by genre and purpose</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {COLLECTIONS.map((col, i) => {
                const Icon = col.icon;
                return (
                  <m.div
                    key={col.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all p-6"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                        <Icon className={`w-6 h-6 ${col.accent}`} weight="duotone" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display font-semibold text-white group-hover:text-[#7fffd4] transition-colors">
                            {col.name}
                          </h3>
                          <span className="text-xs font-mono text-white/25 px-2 py-0.5 rounded-full bg-white/[0.04]">
                            {col.count} tracks
                          </span>
                        </div>
                        <p className="text-sm text-white/40 leading-relaxed">{col.description}</p>
                      </div>
                    </div>
                  </m.div>
                );
              })}
            </div>
          </section>

          {/* ── Now Playing / Frequency Bar ───────────────────────────── */}
          <section className="mb-20">
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7fffd4]/5 via-transparent to-[#78a6ff]/5 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <Waves className="w-5 h-5 text-[#7fffd4]" weight="duotone" />
                  <h3 className="text-sm font-mono tracking-widest uppercase text-[#7fffd4]">
                    Gate Frequency Guide
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { gate: 'Foundation', hz: '174', color: 'bg-amber-500/20 text-amber-400 border-amber-500/20' },
                    { gate: 'Flow', hz: '285', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20' },
                    { gate: 'Fire', hz: '396', color: 'bg-red-500/20 text-red-400 border-red-500/20' },
                    { gate: 'Heart', hz: '417', color: 'bg-pink-500/20 text-pink-400 border-pink-500/20' },
                    { gate: 'Voice', hz: '528', color: 'bg-sky-500/20 text-sky-400 border-sky-500/20' },
                    { gate: 'Sight', hz: '639', color: 'bg-violet-500/20 text-violet-400 border-violet-500/20' },
                    { gate: 'Crown', hz: '741', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' },
                    { gate: 'Starweave', hz: '852', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' },
                    { gate: 'Unity', hz: '963', color: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/20' },
                    { gate: 'Source', hz: '1111', color: 'bg-white/10 text-white/80 border-white/20' },
                  ].map((g) => (
                    <div key={g.gate} className={`rounded-lg border px-3 py-2.5 text-center ${g.color}`}>
                      <p className="text-[10px] font-mono uppercase tracking-wider opacity-70">{g.gate}</p>
                      <p className="text-lg font-display font-bold">{g.hz}</p>
                      <p className="text-[10px] font-mono opacity-50">Hz</p>
                    </div>
                  ))}
                </div>
              </div>
            </m.div>
          </section>

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <section>
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-violet-500/6 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7fffd4]/30 to-transparent" />

              <div className="relative px-8 py-16 sm:px-14 text-center">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[#7fffd4]/10 border border-[#7fffd4]/20">
                  <MusicNote className="w-7 h-7 text-[#7fffd4]" weight="duotone" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                  Create your own frequency
                </h2>
                <p className="text-white/40 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                  Every creator carries a unique frequency. Use the Arcanea Studio
                  to compose music aligned with your creative journey through the Gates.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="https://open.spotify.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#1DB954] text-white font-semibold hover:brightness-110 transition-all"
                  >
                    <Play className="w-5 h-5" weight="fill" />
                    Listen on Spotify
                  </a>
                  <Link
                    href="/studio/music"
                    className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    <Sparkle className="w-4 h-4 text-[#ffd700]" weight="fill" />
                    Create Your Own
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
