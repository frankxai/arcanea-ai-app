'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  staggerContainer,
  staggerItem,
  cosmicFadeIn,
  cosmicFadeInUp,
  fadeInViewport,
} from '@/lib/animations'
import {
  Palette,
  Component,
  Sparkles,
  Layers,
  Layout,
  Shield,
  Smartphone,
  Box,
  Brain,
  Telescope,
  ArrowRight,
  Gem,
  Eye,
  Code2,
  Zap,
  Globe,
  Heart,
  Star,
} from 'lucide-react'

const evolutionStages = [
  {
    id: 'v1',
    label: 'Foundation',
    desc: 'The cosmic palette, elemental colors, fluid typography scale, and the font system that gives Arcanea its mythic-yet-modern voice.',
    icon: Palette,
    color: 'from-arcane-crystal to-arcane-water',
    textColor: 'text-arcane-crystal',
    status: 'live',
  },
  {
    id: 'v2',
    label: 'Components',
    desc: 'Buttons, badges, inputs, and cards built with CVA variants — each carrying elemental energy through color, glow, and glass.',
    icon: Component,
    color: 'from-arcane-water to-arcane-void',
    textColor: 'text-arcane-water',
    status: 'live',
  },
  {
    id: 'v3',
    label: 'Motion',
    desc: '40+ CSS keyframes and 30+ Framer Motion variants. Cosmic fades, stagger reveals, floating orbs, and spring physics.',
    icon: Sparkles,
    color: 'from-arcane-void to-arcane-fire',
    textColor: 'text-arcane-void-bright',
    status: 'live',
  },
  {
    id: 'v4',
    label: 'Effects',
    desc: 'Glass morphism tiers, glow text, gradient borders, cosmic mesh backgrounds, interactive mouse-tracking glow cards.',
    icon: Layers,
    color: 'from-arcane-fire to-arcane-gold',
    textColor: 'text-arcane-fire-bright',
    status: 'live',
  },
  {
    id: 'v5',
    label: 'Layout',
    desc: 'Container widths, section spacing, responsive grid patterns, and the spatial rhythm that breathes through every page.',
    icon: Layout,
    color: 'from-arcane-wind to-arcane-crystal',
    textColor: 'text-arcane-wind',
    status: 'live',
  },
  {
    id: 'v6',
    label: 'Guardians',
    desc: 'How each of the Ten Guardians shapes visual identity — elemental palettes, glow signatures, frequency-based design tokens.',
    icon: Shield,
    color: 'from-arcane-gold to-arcane-crystal',
    textColor: 'text-arcane-gold',
    status: 'live',
  },
  {
    id: 'v7',
    label: 'Responsive',
    desc: 'Touch targets, safe areas, reduced motion, high contrast mode, and how the design system adapts to every device and user.',
    icon: Smartphone,
    color: 'from-arcane-earth to-arcane-wind',
    textColor: 'text-arcane-earth-bright',
    status: 'live',
  },
  {
    id: 'v8',
    label: '3D & Spatial',
    desc: 'Three.js integration patterns, WebXR setup, performance optimization, and how 3D extends the design system into space.',
    icon: Box,
    color: 'from-arcane-crystal to-arcane-void',
    textColor: 'text-arcane-crystal',
    status: 'live',
  },
  {
    id: 'v9',
    label: 'AI Patterns',
    desc: 'Multi-LLM routing UI, generation interfaces, cost tracking displays, and the visual language of AI-human collaboration.',
    icon: Brain,
    color: 'from-arcane-void to-arcane-fire',
    textColor: 'text-arcane-void-bright',
    status: 'live',
  },
  {
    id: 'v10',
    label: 'Future Vision',
    desc: 'Where the design system is heading — container queries, view transitions, scroll-driven animations, and the next evolution.',
    icon: Telescope,
    color: 'from-arcane-gold to-arcane-crystal',
    textColor: 'text-arcane-gold',
    status: 'live',
  },
]

const designPrinciples = [
  {
    icon: Eye,
    title: 'Cosmic Clarity',
    desc: 'Every element serves a purpose. Dark backgrounds with luminous accents guide the eye through information hierarchy.',
  },
  {
    icon: Sparkles,
    title: 'Mythic Modernity',
    desc: 'Cinzel display type meets Inter UI sans. Ancient gravitas blended with pixel-perfect precision.',
  },
  {
    icon: Heart,
    title: 'Elemental Emotion',
    desc: 'Five elements, ten guardians — each with distinct color, glow, and motion signatures that users feel before they read.',
  },
  {
    icon: Zap,
    title: 'Performance First',
    desc: 'Glass blur reduced on mobile. Animations respect prefers-reduced-motion. Every effect is earned, not decorative.',
  },
  {
    icon: Globe,
    title: 'Universal Access',
    desc: 'WCAG focus states, high-contrast mode, safe-area insets, 44px touch targets. Magic for everyone.',
  },
  {
    icon: Code2,
    title: 'Developer Joy',
    desc: 'CVA variants, Tailwind utilities, typed animation exports. Build with the system, not against it.',
  },
]

const systemStats = [
  { label: 'Color Tokens', value: '45+', sublabel: '6 cosmic + 7 elemental + academies' },
  { label: 'CSS Animations', value: '40+', sublabel: 'Keyframes across 4 element families' },
  { label: 'Motion Variants', value: '30+', sublabel: 'Framer Motion exports in animations.ts' },
  { label: 'Component Variants', value: '20+', sublabel: 'Button + Badge elemental variants' },
  { label: 'Fluid Type Sizes', value: '11', sublabel: 'From fluid-xs (0.7rem) to hero (7rem)' },
  { label: 'Glass Tiers', value: '3', sublabel: 'Subtle, standard, strong morphism' },
]

export default function DesignLabHub() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="text-center pt-8"
      >
        <motion.div variants={cosmicFadeIn}>
          <Badge variant="crystal" className="mb-6 font-sans text-xs tracking-wider px-4 py-1">
            <Gem className="w-3.5 h-3.5 mr-2" />
            BUILDING IN PUBLIC
          </Badge>
        </motion.div>

        <motion.h1
          variants={cosmicFadeInUp}
          className="text-fluid-5xl font-display text-white mb-6 leading-tight"
        >
          The Arcanean
          <span className="block text-gradient-cosmic">Design System</span>
        </motion.h1>

        <motion.p
          variants={cosmicFadeIn}
          className="text-fluid-lg font-body text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          A living design system born from cosmic mythology and built for modern creators.
          Follow our journey from first pixel to full platform — every decision documented,
          every evolution shared.
        </motion.p>

        <motion.div variants={cosmicFadeIn} className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-arcane-crystal animate-pulse-glow" />
            <span className="text-sm font-sans text-text-secondary">Next.js 16</span>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-arcane-fire animate-pulse-glow animation-delay-200" />
            <span className="text-sm font-sans text-text-secondary">React 19</span>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-arcane-void animate-pulse-glow animation-delay-500" />
            <span className="text-sm font-sans text-text-secondary">Tailwind CSS 3.4</span>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-arcane-gold animate-pulse-glow animation-delay-700" />
            <span className="text-sm font-sans text-text-secondary">Framer Motion 12</span>
          </div>
        </motion.div>
      </motion.section>

      {/* System Stats */}
      <motion.section
        variants={staggerContainer}
        {...fadeInViewport}
      >
        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {systemStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="glow-card rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-display text-gradient-crystal mb-1">{stat.value}</div>
              <div className="text-sm font-sans text-white mb-1">{stat.label}</div>
              <div className="text-xs font-sans text-text-muted">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Design Principles */}
      <motion.section
        variants={staggerContainer}
        {...fadeInViewport}
      >
        <motion.div variants={cosmicFadeIn} className="text-center mb-10">
          <Badge variant="void" className="mb-4 font-sans text-xs tracking-wider px-3 py-1">
            PRINCIPLES
          </Badge>
          <h2 className="text-fluid-3xl font-display text-white mb-3">Design Philosophy</h2>
          <p className="text-fluid-base font-body text-text-secondary max-w-2xl mx-auto">
            Six principles guide every design decision in Arcanea — from color choice to animation timing.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {designPrinciples.map((principle) => {
            const Icon = principle.icon
            return (
              <motion.div
                key={principle.title}
                variants={staggerItem}
                className="glow-card rounded-2xl p-6 hover-lift"
              >
                <Icon className="w-6 h-6 text-arcane-crystal mb-4" />
                <h3 className="text-lg font-display text-white mb-2">{principle.title}</h3>
                <p className="text-sm font-body text-text-secondary leading-relaxed">{principle.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Evolution Stages */}
      <motion.section
        variants={staggerContainer}
        {...fadeInViewport}
      >
        <motion.div variants={cosmicFadeIn} className="text-center mb-10">
          <Badge variant="gold" className="mb-4 font-sans text-xs tracking-wider px-3 py-1">
            <Star className="w-3 h-3 mr-1.5" />
            EVOLUTION
          </Badge>
          <h2 className="text-fluid-3xl font-display text-white mb-3">
            Ten Stages of Design
          </h2>
          <p className="text-fluid-base font-body text-text-secondary max-w-2xl mx-auto">
            Each stage documents a layer of the design system — from foundational colors
            to the future of spatial computing. Explore them all.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {evolutionStages.map((stage, i) => {
            const Icon = stage.icon
            return (
              <motion.div key={stage.id} variants={staggerItem}>
                <Link href={`/design-lab/${stage.id}`} className="group block">
                  <div className="glow-card rounded-2xl p-6 hover-lift relative overflow-hidden">
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${stage.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-arcane-crystal/30 transition-colors">
                        <Icon className={`w-6 h-6 ${stage.textColor}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-text-muted">{stage.id}</span>
                          <Badge
                            variant={stage.status === 'live' ? 'crystal' : 'secondary'}
                            className="text-[9px] px-1.5 py-0 font-sans"
                          >
                            {stage.status === 'live' ? 'LIVE' : 'COMING'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-display text-white mb-1 group-hover:text-arcane-crystal transition-colors">
                          {stage.label}
                        </h3>
                        <p className="text-sm font-body text-text-secondary leading-relaxed">{stage.desc}</p>
                      </div>

                      <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-arcane-crystal group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.section>

      {/* How We Think */}
      <motion.section
        variants={staggerContainer}
        {...fadeInViewport}
        className="glass rounded-3xl p-8 lg:p-12 border-gradient"
      >
        <motion.div variants={cosmicFadeIn}>
          <Badge variant="fire" className="mb-6 font-sans text-xs tracking-wider px-3 py-1">
            PROCESS
          </Badge>
          <h2 className="text-fluid-2xl font-display text-white mb-4">
            How We Build
          </h2>
          <p className="text-fluid-base font-body text-text-secondary max-w-3xl mb-8 leading-relaxed">
            Building Arcanea&apos;s design system is an act of world-building itself. Every token, every animation,
            every component carries the mythology forward. Here&apos;s our process:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-crystal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-crystal">01</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">Lore-Driven Tokens</h4>
                  <p className="text-sm font-body text-text-secondary">Colors come from elements. Frequencies set animation timings. The mythology IS the specification.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-fire/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-fire">02</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">AI-Augmented Design</h4>
                  <p className="text-sm font-body text-text-secondary">Claude Code agents generate components, test variants, and iterate on patterns at superhuman speed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-void/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-void-bright">03</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">Build in Public</h4>
                  <p className="text-sm font-body text-text-secondary">Every evolution stage is documented, versioned, and shared. The community watches the design system grow.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-gold">04</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">Performance Budgets</h4>
                  <p className="text-sm font-body text-text-secondary">Glass blur gets reduced on mobile. Animations disable gracefully. Every visual costs CPU, so we budget carefully.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-wind/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-wind">05</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">Variant-Driven Components</h4>
                  <p className="text-sm font-body text-text-secondary">Every component uses CVA. No one-off styles. The elemental system makes variants natural and predictable.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-arcane-water/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-mono text-arcane-water">06</span>
                </div>
                <div>
                  <h4 className="font-display text-white text-sm mb-1">Continuous Evolution</h4>
                  <p className="text-sm font-body text-text-secondary">The design system is never &quot;done.&quot; It evolves with the platform, the mythology, and the community&apos;s needs.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* CTA */}
      <motion.section
        variants={cosmicFadeIn}
        {...fadeInViewport}
        className="text-center py-8"
      >
        <h2 className="text-fluid-2xl font-display text-white mb-4">
          Start Exploring
        </h2>
        <p className="text-fluid-base font-body text-text-secondary max-w-xl mx-auto mb-8">
          Dive into the design system. Start with the Foundation or jump to whatever sparks your curiosity.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/design-lab/v1">
            <Button className="rounded-2xl font-sans">
              <Palette className="w-4 h-4 mr-2" />
              Start with Foundation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="https://github.com/arcanea" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-2xl font-sans">
              <Code2 className="w-4 h-4 mr-2" />
              View Source
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}
