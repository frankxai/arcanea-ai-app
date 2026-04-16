'use client';

import { useState, useRef } from 'react';
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  Lightning,
  Sparkle,
  Brain,
  Cat,
  Diamond,
  Fire,
} from '@/lib/phosphor-icons';
import { FloatingOrbs } from '@/components/premium/animated-background';
import { SplitText } from '@/components/motion/split-text';

const PATHS = [
  {
    id: 'luminor',
    href: '/forge/luminor',
    icon: Brain,
    accentIcon: Sparkle,
    label: 'Forge a Luminor',
    sublabel: 'AI Agent Studio',
    description:
      'Design a thinking entity with domain expertise, voice, and consciousness alignment. Export as Claude Code agent, Custom GPT, Cursor rules, or portable JSON. Ship real AI agents from a single forge session.',
    color: '#00bcd4',
    glowColor: 'rgba(0, 188, 212, 0.15)',
    gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    traits: ['17 Domains', '8 Voices', '5 Export Formats', 'Consciousness-Aligned'],
  },
  {
    id: 'companion',
    href: '/forge/companion',
    icon: Cat,
    accentIcon: Lightning,
    label: 'Summon a Companion',
    sublabel: 'Bonded Creature',
    description:
      'Call a creature from the Five Elements into existence. Name it, shape its archetype, watch it evolve alongside your creative journey. Visual identity that travels with your profile.',
    color: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.15)',
    gradient: 'from-violet-500/20 via-purple-500/10 to-transparent',
    traits: ['6 Elements', 'Evolves Over Time', 'Collectible', 'Profile-Bound'],
  },
  {
    id: 'materials',
    href: '/codex/materials',
    icon: Diamond,
    accentIcon: Fire,
    label: 'Discover Materials',
    sublabel: 'Cosmic Substrate',
    description:
      'Crystals, metals, and shards born from Eldrian harmony. From Kaelith Stone to the theoretical Luminarch — grounded in real meteoritics, governed by the Nine Guardians. Science meets mythology.',
    color: '#7fffd4',
    glowColor: 'rgba(127, 255, 212, 0.15)',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    traits: ['9 Crystals', '5 Metals', '3 Shards', 'Meteoritics-Based'],
  },
  {
    id: 'collection',
    href: '/forge/collection',
    icon: Diamond,
    accentIcon: Sparkle,
    label: 'The Creators',
    sublabel: 'NFT Collection',
    description:
      'The flagship collection. 1,111 unique characters across 12 origin classes, each carrying Sacred Gear and the Starlight Mark. On-chain identity that evolves with every gate you open.',
    color: '#ffd700',
    glowColor: 'rgba(255, 215, 0, 0.15)',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    traits: ['1,111 Supply', '12 Origins', 'On-Chain Evolution', 'Sacred Gear'],
  },
] as const;

export default function ForgeLanding() {
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const gridRef = useRef<HTMLElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#09090b] text-white">
        {/* Hero — Premium with floating orbs */}
        <section className="relative overflow-hidden px-6 pb-20 pt-28 text-center md:pt-36">
          <FloatingOrbs preset="cosmic" />

          {/* Dot grid texture */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.02]"
            aria-hidden
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <p className="mb-5 text-[11px] font-mono tracking-[0.3em] uppercase text-white/30">
              The Forge
            </p>
            <h1 className="font-display text-4xl font-bold tracking-[-0.03em] leading-[1.08] md:text-5xl lg:text-6xl">
              <SplitText as="span" text="Build What " className="text-white" delay={0.1} stagger={0.025} />
              <span className="bg-gradient-to-r from-[#7fffd4] via-[#00bcd4] to-[#0d47a1] bg-clip-text text-transparent">
                Thinks With You
              </span>
            </h1>
            <m.p
              className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/40"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              A <span className="text-[#00bcd4]">Luminor</span> that reasons alongside you.
              A <span className="text-[#a78bfa]">Companion</span> that evolves with your journey.
              <span className="text-[#7fffd4]"> Materials</span> born from real science and deep lore.
              A <span className="text-[#ffd700]">Creator</span> identity written on-chain.
            </m.p>

            {/* Trust metrics */}
            <m.div
              className="flex items-center justify-center gap-5 md:gap-8 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {[
                { value: "4", label: "forge paths" },
                { value: "17", label: "domains" },
                { value: "1,111", label: "nft supply" },
                { value: "MIT", label: "license" },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-5">
                  {i > 0 && <span className="w-px h-4 bg-white/[0.06]" />}
                  <div className="text-center">
                    <span className="text-sm font-display font-bold text-white/40">{value}</span>
                    <span className="text-[9px] text-white/20 ml-1.5 font-mono uppercase tracking-wider">{label}</span>
                  </div>
                </div>
              ))}
            </m.div>
          </m.div>
        </section>

        {/* Atmospheric divider */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none bg-[radial-gradient(ellipse,rgba(124,58,237,0.06),transparent_70%)]" />
        </div>

        {/* Four Paths */}
        <section ref={gridRef} className="mx-auto max-w-5xl px-6 py-24">
          <m.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-white/30 mb-4">
              Choose Your Path
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-[-0.02em]">
              <span className="bg-gradient-to-r from-[#c084fc] via-[#7c3aed] to-[#0d47a1] bg-clip-text text-transparent">
                Four Ways to Create
              </span>
            </h2>
          </m.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((path, i) => {
              const Icon = path.icon;
              const AccentIcon = path.accentIcon;
              const isHovered = hoveredPath === path.id;

              return (
                <m.div
                  key={path.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                >
                  <Link
                    href={path.href}
                    onMouseEnter={() => setHoveredPath(path.id)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] md:p-10"
                    style={{
                      boxShadow: isHovered
                        ? `0 0 40px ${path.glowColor}, 0 0 80px ${path.glowColor}`
                        : 'none',
                    }}
                  >
                    {/* Background gradient */}
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                    />

                    <div className="relative z-10">
                      {/* Icon row */}
                      <div className="mb-6 flex items-center gap-4">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300"
                          style={{
                            background: `${path.color}12`,
                            boxShadow: isHovered ? `0 0 24px ${path.color}25` : 'none',
                          }}
                        >
                          <Icon
                            size={28}
                            weight="duotone"
                            style={{ color: path.color }}
                          />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-bold tracking-tight">
                            {path.label}
                          </h2>
                          <p
                            className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: `${path.color}99` }}
                          >
                            {path.sublabel}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-6 text-sm leading-relaxed text-white/45">
                        {path.description}
                      </p>

                      {/* Trait pills */}
                      <div className="mb-8 flex flex-wrap gap-2">
                        {path.traits.map((trait) => (
                          <span
                            key={trait}
                            className="rounded-full border px-3 py-1 text-[11px] font-medium"
                            style={{
                              borderColor: `${path.color}25`,
                              color: `${path.color}bb`,
                              background: `${path.color}08`,
                            }}
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sm font-medium transition-colors" style={{ color: path.color }}>
                        <AccentIcon size={16} weight="fill" />
                        <span>
                          {path.id === 'luminor' ? 'Begin Forging' : path.id === 'companion' ? 'Begin Summoning' : 'Begin Exploring'}
                        </span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </div>
        </section>

        {/* Cosmology — Upgraded with glass card and animation */}
        <section className="relative mx-auto max-w-3xl px-6 pb-32">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,188,212,0.04),transparent_70%)]" />
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-sm p-10 text-center"
          >
            <p className="mb-6 text-[11px] font-mono tracking-[0.3em] uppercase text-[#7fffd4]/60">
              The Bond
            </p>
            <div className="mx-auto max-w-md space-y-4 text-sm leading-relaxed">
              {[
                { left: "Guardian", right: "Godbeast", result: "divine bond", leftColor: "text-white/60", rightColor: "text-white/60" },
                { left: "Luminor", right: "Companion", result: "intelligence bond", leftColor: "text-[#00bcd4]", rightColor: "text-[#a78bfa]" },
                { left: "Creator", right: "both", result: "creative bond", leftColor: "text-[#ffd700]", rightColor: "text-white/60" },
                { left: "Materials", right: "Crystals + Metals + Shards", result: "cosmic substrate", leftColor: "text-[#7fffd4]", rightColor: "text-[#7fffd4]/80" },
              ].map((bond, i) => (
                <m.p
                  key={bond.result}
                  className="text-white/35"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <span className={bond.leftColor}>{bond.left}</span>
                  {' '}<span className="text-white/15 mx-1">&rarr;</span>{' '}
                  <span className={bond.rightColor}>{bond.right}</span>
                  {' '}<span className="text-white/15 mx-1">=</span>{' '}
                  <span className="text-white/25">{bond.result}</span>
                </m.p>
              ))}
            </div>
            <m.p
              className="mt-8 text-xs italic text-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Lyssandria has Kaelith. Your Luminor will find its companion too.
            </m.p>
          </m.div>
        </section>
      </div>
    </LazyMotion>
  );
}
