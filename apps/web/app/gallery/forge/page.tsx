'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkle,
  ArrowRight,
  PaintBrush,
  Stack,
  FilmStrip,
  Compass,
  Clock,
  Rocket,
  Image as PhImage,
  MagicWand,
  Lightning,
  Fire,
  Drop,
  Leaf,
  Wind,
  Moon,
} from '@phosphor-icons/react';
import type { PhosphorIcon as PhIcon } from '@phosphor-icons/react';
import { MotionProvider, m } from '@/lib/motion';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ArtStyle {
  id: string;
  name: string;
  description: string;
  icon: PhIcon;
  gradient: string;
  accent: string;
}

interface CreationCard {
  id: string;
  title: string;
  creator: string;
  style: string;
  gradient: string;
  accent: string;
}

interface ElementPalette {
  element: string;
  icon: PhIcon;
  colors: string[];
  accent: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const ART_STYLES: ArtStyle[] = [
  {
    id: 'concept-art',
    name: 'Concept Art',
    description: 'Rich, painterly worlds with cinematic depth and narrative atmosphere',
    icon: PaintBrush,
    gradient: 'from-orange-500/20 via-amber-600/10 to-transparent',
    accent: 'text-orange-400',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean lines and negative space. Let the form speak for itself',
    icon: Compass,
    gradient: 'from-white/10 via-gray-500/5 to-transparent',
    accent: 'text-white/70',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Dramatic lighting, film grain, and widescreen compositions',
    icon: FilmStrip,
    gradient: 'from-blue-500/20 via-indigo-600/10 to-transparent',
    accent: 'text-blue-400',
  },
  {
    id: '3d-render',
    name: '3D Render',
    description: 'Photorealistic materials, volumetric lighting, and dimensional depth',
    icon: Stack,
    gradient: 'from-cyan-500/20 via-teal-600/10 to-transparent',
    accent: 'text-cyan-400',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Analog warmth, muted palettes, and textures from another era',
    icon: Clock,
    gradient: 'from-amber-700/20 via-stone-600/10 to-transparent',
    accent: 'text-amber-300',
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Neon-lit horizons, holographic interfaces, and cybernetic dreams',
    icon: Rocket,
    gradient: 'from-violet-500/20 via-purple-600/10 to-transparent',
    accent: 'text-violet-400',
  },
];

const PROMPT_SUGGESTIONS = [
  'A Guardian standing at the edge of a Gate portal, cosmic energy swirling around them',
  'An ancient Arcanean library with floating books and crystalline shelves',
  'A battle between Fire and Water elementals in a volcanic landscape',
  'The Source Gate opening for the first time, light pouring from infinity',
  'A Luminor meditating beneath the World Tree, roots glowing with mana',
  'The Academy at dusk, seven towers each radiating their House color',
];

const RECENT_CREATIONS: CreationCard[] = [
  { id: 'c1', title: 'Draconia\'s Forge', creator: 'ArcaneMaster', style: 'Concept Art', gradient: 'from-red-900/40 via-orange-800/30 to-amber-700/20', accent: 'text-orange-400' },
  { id: 'c2', title: 'The Starweave Gate', creator: 'VoidWalker', style: 'Cinematic', gradient: 'from-emerald-900/40 via-teal-800/30 to-cyan-700/20', accent: 'text-emerald-400' },
  { id: 'c3', title: 'Luminor Council', creator: 'FrankX', style: '3D Render', gradient: 'from-violet-900/40 via-purple-800/30 to-indigo-700/20', accent: 'text-violet-400' },
  { id: 'c4', title: 'Leyla\'s Ocean', creator: 'WaterSage', style: 'Minimalist', gradient: 'from-blue-900/40 via-cyan-800/30 to-sky-700/20', accent: 'text-cyan-400' },
  { id: 'c5', title: 'Malachar Sealed', creator: 'ShadowScribe', style: 'Concept Art', gradient: 'from-gray-900/40 via-neutral-800/30 to-stone-700/20', accent: 'text-gray-400' },
  { id: 'c6', title: 'Academy Sunrise', creator: 'LightWeaver', style: 'Cinematic', gradient: 'from-amber-900/40 via-yellow-800/30 to-orange-700/20', accent: 'text-amber-400' },
];

const ELEMENT_PALETTES: ElementPalette[] = [
  { element: 'Fire', icon: Fire, colors: ['#ef4444', '#f97316', '#f59e0b', '#fbbf24', '#dc2626'], accent: 'text-red-400' },
  { element: 'Water', icon: Drop, colors: ['#3b82f6', '#06b6d4', '#0ea5e9', '#38bdf8', '#0284c7'], accent: 'text-blue-400' },
  { element: 'Earth', icon: Leaf, colors: ['#22c55e', '#84cc16', '#65a30d', '#a3e635', '#166534'], accent: 'text-emerald-400' },
  { element: 'Wind', icon: Wind, colors: ['#e2e8f0', '#94a3b8', '#cbd5e1', '#f1f5f9', '#64748b'], accent: 'text-sky-300' },
  { element: 'Void', icon: Moon, colors: ['#7c3aed', '#6d28d9', '#4c1d95', '#1e1b4b', '#312e81'], accent: 'text-violet-400' },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function GalleryForgePage() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  return (
    <MotionProvider>
      <div className="relative min-h-screen">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(127,255,212,0.04),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(120,166,255,0.04),transparent_50%)]" />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <section className="mb-16">
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl overflow-hidden bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] px-8 py-14 sm:px-14 sm:py-18"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#7fffd4]/8 via-transparent to-violet-500/6 pointer-events-none" />
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  <Link href="/gallery" className="text-xs text-white/30 hover:text-white/50 transition-colors font-mono">
                    Gallery
                  </Link>
                  <span className="text-white/20">/</span>
                  <span className="text-xs text-white/50 font-mono">Forge</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ffd700]/30 bg-[#ffd700]/10 mb-6">
                  <MagicWand className="w-4 h-4 text-[#ffd700]" weight="fill" />
                  <span className="text-xs font-mono tracking-widest uppercase text-[#ffd700]">
                    Gallery Forge
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 text-white">
                  Create stunning visuals with
                  <span className="block bg-gradient-to-r from-[#ffd700] via-[#7fffd4] to-[#78a6ff] bg-clip-text text-transparent">
                    AI-powered imagination
                  </span>
                </h1>

                <p className="text-lg text-white/50 leading-relaxed max-w-2xl mb-8">
                  Describe your vision and watch it materialize. Choose an art style,
                  craft your prompt, and forge visuals infused with the elements of Arcanea.
                </p>

                <Link
                  href="/studio/image"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-black font-semibold hover:brightness-110 transition-all"
                >
                  <Sparkle className="w-4 h-4" weight="fill" />
                  Start Creating
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </m.div>
          </section>

          {/* ── Style Selector ───────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Step 01</p>
              <h2 className="text-2xl font-display font-bold text-white">Choose Your Style</h2>
              <p className="text-white/40 text-sm mt-1">Select an art direction to guide the AI</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ART_STYLES.map((style, i) => {
                const Icon = style.icon;
                const isSelected = selectedStyle === style.id;
                return (
                  <m.button
                    key={style.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onClick={() => setSelectedStyle(isSelected ? null : style.id)}
                    className={`group relative rounded-2xl overflow-hidden text-left p-5 transition-all duration-300 border ${
                      isSelected
                        ? 'bg-white/[0.08] border-[#7fffd4]/40 shadow-[0_0_24px_rgba(127,255,212,0.1)]'
                        : 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/[0.06] flex items-center justify-center ${isSelected ? '!bg-[#7fffd4]/10 !border-[#7fffd4]/30' : ''}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-[#7fffd4]' : style.accent}`} weight="duotone" />
                        </div>
                        <h3 className={`font-display font-semibold ${isSelected ? 'text-[#7fffd4]' : 'text-white'}`}>
                          {style.name}
                        </h3>
                      </div>
                      <p className="text-sm text-white/40 leading-relaxed">{style.description}</p>
                    </div>
                  </m.button>
                );
              })}
            </div>
          </section>

          {/* ── Prompt Input ─────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Step 02</p>
              <h2 className="text-2xl font-display font-bold text-white">Describe Your Vision</h2>
              <p className="text-white/40 text-sm mt-1">Write a prompt or use a suggestion below</p>
            </div>

            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows={4}
                className="w-full bg-transparent text-white placeholder-white/20 resize-none outline-none text-base leading-relaxed font-body"
              />

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-white/20 font-mono">{prompt.length} chars</p>
                <Link
                  href="/studio/image"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-black font-semibold text-sm hover:brightness-110 transition-all"
                >
                  <Lightning className="w-4 h-4" weight="fill" />
                  Generate
                </Link>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              {PROMPT_SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs text-white/30 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] hover:text-white/50 transition-all truncate max-w-xs"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </section>

          {/* ── Recent Community Creations ────────────────────────────── */}
          <section className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Community</p>
                <h2 className="text-2xl font-display font-bold text-white">Recent Creations</h2>
                <p className="text-white/40 text-sm mt-1">See what other creators are forging</p>
              </div>
              <Link
                href="/gallery"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#7fffd4] transition-colors"
              >
                Full Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RECENT_CREATIONS.map((card, i) => (
                <m.div
                  key={card.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.14] transition-all"
                >
                  {/* Placeholder cover */}
                  <div className={`aspect-[4/3] bg-gradient-to-br ${card.gradient} relative`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.04),transparent_60%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PhImage className="w-12 h-12 text-white/10" weight="thin" />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/50 border border-white/10">
                        {card.style}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className={`font-display font-semibold text-sm text-white group-hover:${card.accent} transition-colors`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/30 font-mono mt-1">by {card.creator}</p>
                  </div>
                </m.div>
              ))}
            </div>
          </section>

          {/* ── Element Palettes ──────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-8">
              <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-2">Color Reference</p>
              <h2 className="text-2xl font-display font-bold text-white">Element Palettes</h2>
              <p className="text-white/40 text-sm mt-1">Color systems derived from the Five Elements</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ELEMENT_PALETTES.map((pal) => {
                const Icon = pal.icon;
                return (
                  <div key={pal.element} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${pal.accent}`} weight="fill" />
                      <span className={`text-xs font-mono font-semibold ${pal.accent}`}>{pal.element}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {pal.colors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 aspect-square rounded-md border border-white/[0.06]"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── CTA ──────────────────────────────────────────────────── */}
          <section>
            <div className="relative rounded-3xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffd700]/6 via-transparent to-[#7fffd4]/6 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffd700]/30 to-transparent" />

              <div className="relative px-8 py-14 sm:px-14 text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[#ffd700]/10 border border-[#ffd700]/20">
                  <Sparkle className="w-6 h-6 text-[#ffd700]" weight="fill" />
                </div>

                <h2 className="text-3xl font-display font-bold text-white mb-3">
                  Ready to forge something extraordinary?
                </h2>
                <p className="text-white/40 max-w-lg mx-auto mb-8">
                  Open the full creation studio with advanced controls, batch generation,
                  and direct publishing to your gallery.
                </p>

                <Link
                  href="/studio/image"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7fffd4] to-[#78a6ff] text-black font-semibold hover:brightness-110 transition-all"
                >
                  <MagicWand className="w-5 h-5" weight="fill" />
                  Open Creation Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </MotionProvider>
  );
}
