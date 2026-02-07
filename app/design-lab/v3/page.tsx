'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  staggerContainer,
  staggerItem,
  cosmicFadeIn,
  cosmicFadeInUp,
  cosmicSlideInLeft,
  cosmicSlideInRight,
  cosmicScale,
  cosmicGlow,
  scrollReveal,
  scrollRevealLeft,
  scrollRevealRight,
  scrollRevealScale,
  fadeInViewport,
  heroTitle,
  heroSubtitle,
  cardHover,
  floatingOrb,
  springTransition,
  gentleSpring,
  bouncySpring,
} from '@/lib/animations'
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Droplets,
  Flame,
  Wind,
  Zap,
  Star,
  Eye,
  Move,
  MousePointer2,
  Timer,
  Waves,
} from 'lucide-react'

// ============================================
// ANIMATION DEMO CARD
// ============================================

function AnimationDemoCard({
  title,
  animationClass,
  token,
  category,
  description,
}: {
  title: string
  animationClass: string
  token: string
  category: string
  description: string
}) {
  const [playing, setPlaying] = useState(false)
  const [key, setKey] = useState(0)

  const replay = useCallback(() => {
    setPlaying(false)
    setKey((k) => k + 1)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPlaying(true)
      })
    })
  }, [])

  const categoryColors: Record<string, string> = {
    Cosmic: 'text-arcane-crystal',
    Water: 'text-arcane-water',
    Fire: 'text-arcane-fire',
    Creation: 'text-arcane-gold',
    UI: 'text-arcane-void-bright',
    Special: 'text-arcane-wind',
  }

  return (
    <div className="glass rounded-2xl overflow-hidden group hover:border-arcane-crystal/20 transition-all">
      {/* Demo area */}
      <div className="h-36 bg-cosmic-void/50 relative flex items-center justify-center overflow-hidden border-b border-white/5">
        <div
          key={key}
          className={`w-16 h-16 rounded-xl bg-gradient-to-br from-arcane-crystal/30 to-arcane-void/30 border border-arcane-crystal/20 flex items-center justify-center ${
            playing ? `animate-${animationClass}` : ''
          }`}
          style={playing ? { animationFillMode: 'both' } : {}}
        >
          <Sparkles className="w-6 h-6 text-arcane-crystal" />
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-sans font-medium text-white text-sm">{title}</h4>
          <span className={`text-[10px] font-mono ${categoryColors[category] || 'text-text-muted'}`}>
            {category}
          </span>
        </div>
        <p className="text-xs text-text-muted">{description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-arcane-crystal/50">.animate-{token}</span>
          <button
            onClick={replay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-arcane-crystal/10 text-arcane-crystal text-xs font-sans hover:bg-arcane-crystal/20 transition-colors"
          >
            <Play className="w-3 h-3" /> Play
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FRAMER MOTION DEMO
// ============================================

function FramerVariantDemo({
  title,
  variant,
  token,
  description,
}: {
  title: string
  variant: Record<string, any>
  token: string
  description: string
}) {
  const controls = useAnimation()
  const [isVisible, setIsVisible] = useState(true)

  const replay = useCallback(async () => {
    setIsVisible(false)
    await controls.start('hidden')
    requestAnimationFrame(() => {
      setIsVisible(true)
      controls.start('visible')
    })
  }, [controls])

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="h-36 bg-cosmic-void/50 relative flex items-center justify-center overflow-hidden border-b border-white/5">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial="hidden"
              animate={controls}
              variants={variant}
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-arcane-void/30 to-arcane-water/30 border border-arcane-void/20 flex items-center justify-center"
            >
              <Star className="w-6 h-6 text-arcane-void-bright" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 space-y-2">
        <h4 className="font-sans font-medium text-white text-sm">{title}</h4>
        <p className="text-xs text-text-muted">{description}</p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-mono text-arcane-void-bright/50">{token}</span>
          <button
            onClick={replay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-arcane-void/10 text-arcane-void-bright text-xs font-sans hover:bg-arcane-void/20 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Replay
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// STAGGER DEMO
// ============================================

function StaggerDemo() {
  const [key, setKey] = useState(0)

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Waves className="w-5 h-5 text-arcane-crystal" />
          <h3 className="font-display text-white">Stagger Container</h3>
        </div>
        <button
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arcane-crystal/10 text-arcane-crystal text-xs font-sans hover:bg-arcane-crystal/20 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Replay
        </button>
      </div>

      <p className="text-sm text-text-secondary font-body">
        Children animate in sequence with configurable delay. Three speeds available.
      </p>

      <motion.div
        key={key}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-5 gap-3"
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="h-16 rounded-xl bg-gradient-to-br from-arcane-crystal/10 to-arcane-water/10 border border-arcane-crystal/10 flex items-center justify-center"
          >
            <span className="text-xs font-mono text-arcane-crystal/60">{i + 1}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex gap-4 text-xs font-mono text-text-muted">
        <span>staggerContainer: <span className="text-arcane-crystal/50">0.1s</span></span>
        <span>staggerContainerFast: <span className="text-arcane-crystal/50">0.06s</span></span>
        <span>staggerContainerSlow: <span className="text-arcane-crystal/50">0.15s</span></span>
      </div>
    </div>
  )
}

// ============================================
// SPRING COMPARISON
// ============================================

function SpringComparison() {
  const [key, setKey] = useState(0)

  const springs = [
    { name: 'Spring', config: springTransition, desc: 'stiffness: 260, damping: 20', color: 'arcane-crystal' },
    { name: 'Gentle', config: gentleSpring, desc: 'stiffness: 120, damping: 14', color: 'arcane-water' },
    { name: 'Bouncy', config: bouncySpring, desc: 'stiffness: 400, damping: 10', color: 'arcane-fire' },
  ]

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-arcane-gold" />
          <h3 className="font-display text-white">Spring Transitions</h3>
        </div>
        <button
          onClick={() => setKey(k => k + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-arcane-gold/10 text-arcane-gold text-xs font-sans hover:bg-arcane-gold/20 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Replay
        </button>
      </div>

      <div className="space-y-4">
        {springs.map((spring) => (
          <div key={`${spring.name}-${key}`} className="flex items-center gap-4">
            <div className="w-20 text-right">
              <p className="text-xs font-sans font-medium text-white">{spring.name}</p>
              <p className="text-[10px] font-mono text-text-muted">{spring.desc}</p>
            </div>
            <div className="flex-1 bg-cosmic-void/50 rounded-xl h-12 relative overflow-hidden border border-white/5">
              <motion.div
                key={key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={spring.config}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border flex items-center justify-center`}
                style={{
                  backgroundColor: `var(--${spring.color})20`,
                  borderColor: `var(--${spring.color})40`,
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: `var(--${spring.color})` }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// FLOATING ORB DEMO
// ============================================

function FloatingOrbDemo() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Move className="w-5 h-5 text-arcane-void-bright" />
        <h3 className="font-display text-white">Floating Orb</h3>
      </div>
      <p className="text-sm text-text-secondary font-body">
        Continuous float animation for ambient decorative elements.
      </p>

      <div className="h-48 bg-cosmic-void/50 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
        {/* Ambient background orbs */}
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="absolute w-32 h-32 rounded-full bg-arcane-crystal/10 blur-3xl"
          style={{ top: '20%', left: '20%' }}
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="absolute w-24 h-24 rounded-full bg-arcane-void/15 blur-2xl"
          style={{ top: '50%', right: '25%' }}
        />

        {/* Main orb */}
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="w-20 h-20 rounded-full bg-gradient-to-br from-arcane-crystal/40 to-arcane-void/40 border border-arcane-crystal/20 shadow-glow-crystal flex items-center justify-center relative z-10"
        >
          <Sparkles className="w-8 h-8 text-arcane-crystal" />
        </motion.div>
      </div>

      <p className="text-xs font-mono text-text-muted text-center">
        floatingOrb: y [-20, 20, -20] / 6s &bull; x [-10, 10, -10] / 8s
      </p>
    </div>
  )
}

// ============================================
// CARD HOVER DEMO
// ============================================

function CardHoverDemo() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <MousePointer2 className="w-5 h-5 text-arcane-water" />
        <h3 className="font-display text-white">Card Hover & Tap</h3>
      </div>
      <p className="text-sm text-text-secondary font-body">
        Scale and lift on hover with shadow enhancement. Tap feedback for touch devices.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { label: 'Hover Me', icon: Eye, variant: cardHover },
        ].map((demo, i) => (
          <motion.div
            key={i}
            variants={demo.variant}
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="w-48 h-32 rounded-xl bg-gradient-to-br from-cosmic-surface to-cosmic-raised border border-white/10 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <demo.icon className="w-6 h-6 text-arcane-crystal" />
            <span className="text-sm font-sans text-white">{demo.label}</span>
            <span className="text-[10px] font-mono text-text-muted">scale: 1.02, y: -8px</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// CSS ANIMATION DATA
// ============================================

const cssAnimations = [
  // Cosmic
  { title: 'Pulse Glow', animationClass: 'pulse-glow', token: 'pulse-glow', category: 'Cosmic', description: 'Box-shadow breathing effect' },
  { title: 'Shimmer', animationClass: 'shimmer', token: 'shimmer', category: 'Cosmic', description: 'Background position sweep' },
  { title: 'Float', animationClass: 'float', token: 'float', category: 'Cosmic', description: 'Vertical hover motion' },
  { title: 'Rotate Slow', animationClass: 'rotate-slow', token: 'rotate-slow', category: 'Cosmic', description: '20s full rotation' },
  { title: 'Energy Flow', animationClass: 'energy-flow', token: 'energy-flow', category: 'Cosmic', description: 'Background position cycling' },
  { title: 'Cosmic Pulse', animationClass: 'cosmic-pulse', token: 'cosmic-pulse', category: 'Cosmic', description: 'Scale & opacity breathing' },
  // Water
  { title: 'Water Flow', animationClass: 'water-flow', token: 'water-flow', category: 'Water', description: 'Fluid X/Y drift motion' },
  { title: 'Wave', animationClass: 'wave', token: 'wave', category: 'Water', description: 'Undulating tilt and sway' },
  { title: 'Ripple', animationClass: 'ripple', token: 'ripple', category: 'Water', description: 'Scale out with fade' },
  // Fire
  { title: 'Fire Flicker', animationClass: 'fire-flicker', token: 'fire-flicker', category: 'Fire', description: 'Opacity & scaleY pulse' },
  { title: 'Flame', animationClass: 'flame', token: 'flame', category: 'Fire', description: 'Rise and dissolve' },
  { title: 'Ember', animationClass: 'ember', token: 'ember', category: 'Fire', description: 'Float up with rotation' },
  // Creation
  { title: 'Prism Rotate', animationClass: 'prism-rotate', token: 'prism-rotate', category: 'Creation', description: 'Hue rotation cycle' },
  { title: 'Radial Pulse', animationClass: 'radial-pulse', token: 'radial-pulse', category: 'Creation', description: 'Expanding ring shadow' },
  // UI
  { title: 'Fade In', animationClass: 'fade-in', token: 'fade-in', category: 'UI', description: 'Simple opacity transition' },
  { title: 'Fade In Up', animationClass: 'fade-in-up', token: 'fade-in-up', category: 'UI', description: 'Opacity + 30px upward' },
  { title: 'Fade In Left', animationClass: 'fade-in-left', token: 'fade-in-left', category: 'UI', description: 'Opacity + 30px from left' },
  { title: 'Scale In', animationClass: 'scale-in', token: 'scale-in', category: 'UI', description: 'Scale from 0.9 to 1' },
  // Special
  { title: 'Glow Breathe', animationClass: 'glow-breathe', token: 'glow-breathe', category: 'Special', description: 'Box-shadow intensity cycling' },
  { title: 'Text Shimmer', animationClass: 'text-shimmer', token: 'text-shimmer', category: 'Special', description: 'Background gradient sweep' },
  { title: 'Border Glow', animationClass: 'border-glow', token: 'border-glow', category: 'Special', description: 'Border color pulsing' },
]

const framerVariants = [
  { title: 'Cosmic Fade In', variant: cosmicFadeIn, token: 'cosmicFadeIn', description: 'Opacity + 30px Y translate' },
  { title: 'Cosmic Fade In Up', variant: cosmicFadeInUp, token: 'cosmicFadeInUp', description: 'Opacity + 60px Y translate' },
  { title: 'Slide In Left', variant: cosmicSlideInLeft, token: 'cosmicSlideInLeft', description: 'From -60px X offset' },
  { title: 'Slide In Right', variant: cosmicSlideInRight, token: 'cosmicSlideInRight', description: 'From +60px X offset' },
  { title: 'Cosmic Scale', variant: cosmicScale, token: 'cosmicScale', description: 'Scale from 0.8 with fade' },
  { title: 'Cosmic Glow', variant: cosmicGlow, token: 'cosmicGlow', description: 'Blur(10px) to clear reveal' },
  { title: 'Scroll Reveal', variant: scrollReveal, token: 'scrollReveal', description: 'Viewport-triggered fade up' },
  { title: 'Scroll Left', variant: scrollRevealLeft, token: 'scrollRevealLeft', description: 'Viewport from -80px left' },
  { title: 'Scroll Right', variant: scrollRevealRight, token: 'scrollRevealRight', description: 'Viewport from +80px right' },
  { title: 'Scroll Scale', variant: scrollRevealScale, token: 'scrollRevealScale', description: 'Viewport scale from 0.85' },
]

// ============================================
// PAGE
// ============================================

export default function DesignLabV3() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = ['All', 'Cosmic', 'Water', 'Fire', 'Creation', 'UI', 'Special']
  const filteredAnimations = activeCategory === 'All'
    ? cssAnimations
    : cssAnimations.filter((a) => a.category === activeCategory)

  return (
    <div className="space-y-20 pb-20">
      {/* === HERO === */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="text-center space-y-6"
      >
        <motion.div variants={cosmicFadeIn}>
          <Badge variant="void" className="font-sans">
            <Sparkles className="w-3 h-3 mr-1" />
            V3 &mdash; Motion
          </Badge>
        </motion.div>

        <motion.h1
          variants={heroTitle}
          className="text-fluid-4xl md:text-fluid-5xl font-display text-gradient-cosmic"
        >
          Animations & Transitions
        </motion.h1>

        <motion.p
          variants={heroSubtitle}
          className="text-fluid-lg text-text-secondary font-body max-w-2xl mx-auto leading-relaxed"
        >
          40+ CSS animations and 15+ Framer Motion variants. Every motion is intentional,
          elemental, and tuned for the cosmic aesthetic.
        </motion.p>
      </motion.section>

      {/* === CSS ANIMATIONS === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-crystal/10 flex items-center justify-center">
              <Timer className="w-4 h-4 text-arcane-crystal" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">CSS Animations</h2>
              <p className="text-sm font-sans text-text-muted">
                Tailwind-config keyframes. Click Play to trigger each animation.
              </p>
            </div>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all ${
                  activeCategory === cat
                    ? 'bg-arcane-crystal/20 text-arcane-crystal border border-arcane-crystal/30'
                    : 'bg-white/5 text-text-secondary hover:text-white border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnimations.map((anim) => (
              <AnimationDemoCard key={anim.token} {...anim} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === FRAMER MOTION VARIANTS === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-arcane-void/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-arcane-void-bright" />
            </div>
            <div>
              <h2 className="text-fluid-2xl font-display text-white">Framer Motion Variants</h2>
              <p className="text-sm font-sans text-text-muted">
                Importable from <span className="font-mono text-arcane-crystal/70">@/lib/animations</span>. Click Replay to trigger.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {framerVariants.map((item) => (
              <FramerVariantDemo key={item.token} {...item} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === STAGGER DEMO === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <StaggerDemo />
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === SPRING COMPARISON === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <SpringComparison />
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === CARD HOVER DEMO === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <CardHoverDemo />
      </motion.section>

      {/* Divider */}
      <div className="section-divider" />

      {/* === FLOATING ORB === */}
      <motion.section {...fadeInViewport} variants={scrollReveal}>
        <FloatingOrbDemo />
      </motion.section>

      {/* === NAVIGATION === */}
      <motion.div
        {...fadeInViewport}
        variants={cosmicFadeInUp}
        className="flex items-center justify-between pt-8"
      >
        <Link href="/design-lab/v2">
          <Button variant="outline" size="lg" className="group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            V2: Components
          </Button>
        </Link>
        <Link href="/design-lab/v4">
          <Button variant="crystal" size="lg" className="group">
            V4: Effects
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
