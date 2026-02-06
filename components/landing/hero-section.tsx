'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  heroTitle,
  heroSubtitle,
  heroCTA,
  heroStats,
  staggerContainer,
  staggerItem,
  floatingOrb,
} from '@/lib/animations'
import { Sparkles, ArrowRight, Zap, Shield, Layers } from 'lucide-react'

function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      container.style.setProperty('--mouse-x', `${x}%`)
      container.style.setProperty('--mouse-y', `${y}%`)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Interactive mouse glow */}
      <div className="absolute inset-0 bg-hero-glow opacity-50" />

      {/* Aurora gradient background */}
      <div className="absolute inset-0 bg-aurora-gradient bg-[length:400%_400%] animate-aurora opacity-30" />

      {/* Cosmic star field */}
      <div className="absolute inset-0 bg-cosmic-stars opacity-60" />

      {/* Floating orbs */}
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-arcane-crystal/8 blur-[100px]"
      />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-arcane-void/10 blur-[80px]"
        style={{ animationDelay: '2s' }}
      />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute top-[50%] left-[60%] w-[300px] h-[300px] rounded-full bg-arcane-fire/6 blur-[80px]"
        style={{ animationDelay: '4s' }}
      />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(127, 255, 212, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(127, 255, 212, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cosmic-void/80" />
    </div>
  )
}

const stats = [
  { icon: Zap, label: 'Multi-Modal Suite', desc: 'Text, Image, Video, Audio', color: 'text-arcane-crystal' },
  { icon: Shield, label: 'Guardian AI', desc: '10 Specialized Companions', color: 'text-arcane-void-bright' },
  { icon: Layers, label: 'Worldbuilding', desc: 'Characters, Lore, Stories', color: 'text-arcane-fire-bright' },
]

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      <CosmicBackground />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            variants={heroTitle}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <Badge
              variant="crystal"
              className="text-sm px-4 py-1.5 glass border-arcane-crystal/30 text-arcane-crystal font-sans tracking-wider"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              ARCANEA.AI — PREMIUM AI PLATFORM
            </Badge>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            variants={heroTitle}
            initial="hidden"
            animate="visible"
            className="text-fluid-hero font-display text-white mb-8 leading-[0.95] tracking-tight"
          >
            Where AI Becomes
            <span className="block text-gradient-cosmic mt-2">
              Creative Intelligence
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={heroSubtitle}
            initial="hidden"
            animate="visible"
            className="text-fluid-xl font-body text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Multi-LLM superagent, multi-modal generation, and Guardian AI companions
            — all unified in one intelligent spatial platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={heroCTA}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold px-8 py-4 text-lg rounded-2xl shadow-glow-crystal hover:shadow-glow-lg transition-shadow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>

            <Link href="/studio">
              <Button
                variant="ghost"
                size="lg"
                className="glass border-arcane-crystal/30 text-arcane-crystal font-sans px-8 py-4 text-lg rounded-2xl hover:border-arcane-crystal/60 hover:bg-arcane-crystal/5 transition-all"
              >
                Enter Spatial Studio
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={heroStats}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    variants={staggerItem}
                    className="glow-card rounded-2xl p-6 text-center hover-lift"
                  >
                    <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                    <h3 className="text-base font-display text-white mb-1">{stat.label}</h3>
                    <p className="text-sm text-text-muted font-body">{stat.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-sans text-text-muted tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 border-arcane-crystal/30 flex justify-center pt-1.5"
        >
          <motion.div className="w-1 h-1.5 rounded-full bg-arcane-crystal" />
        </motion.div>
      </motion.div>
    </section>
  )
}
