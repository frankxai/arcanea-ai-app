'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  scrollReveal,
  staggerContainer,
  staggerItem,
  cardHover,
} from '@/lib/animations'
import {
  Brain,
  Zap,
  Shield,
  Sparkles,
  Infinity,
  Layers,
  Users,
  Crown,
  ArrowRight,
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Multi-LLM Superagent',
    description: 'Seamlessly switch between Claude, GPT-4, and Gemini based on your task requirements.',
    highlight: 'Intelligent routing',
    gradient: 'from-arcane-fire to-arcane-crystal',
    glow: 'group-hover:shadow-glow-fire',
  },
  {
    icon: Zap,
    title: 'Multi-Modal Generation',
    description: 'Create text, images, videos, and audio all in one unified platform.',
    highlight: 'Create anything',
    gradient: 'from-arcane-crystal to-arcane-water',
    glow: 'group-hover:shadow-glow-crystal',
  },
  {
    icon: Shield,
    title: 'Guardian AI Companions',
    description: '10 specialized AI personalities with unique expertise in creative domains.',
    highlight: '10 AI Guardians',
    gradient: 'from-arcane-void to-arcane-crystal',
    glow: 'group-hover:shadow-glow-void',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Industry-leading AI models optimized for professional creative work.',
    highlight: 'Pro-grade output',
    gradient: 'from-arcane-gold to-arcane-fire',
    glow: 'group-hover:shadow-glow-gold',
  },
  {
    icon: Infinity,
    title: 'Infinite Creativity',
    description: 'Never run out of ideas with AI-powered creative assistance and inspiration.',
    highlight: 'Endless inspiration',
    gradient: 'from-arcane-water to-arcane-crystal',
    glow: 'group-hover:shadow-glow-crystal',
  },
  {
    icon: Layers,
    title: 'Cost Optimization',
    description: 'Smart routing reduces costs by 40% while maintaining premium quality.',
    highlight: 'Save 40% on costs',
    gradient: 'from-arcane-earth to-arcane-gold',
    glow: 'group-hover:shadow-glow-gold',
  },
] as const

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number]
  index: number
}) {
  const Icon = feature.icon
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover="hover"
      variants={cardHover}
      className="group relative glow-card rounded-2xl p-8 cursor-default"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.06] rounded-2xl transition-opacity duration-500`} />

      {/* Icon */}
      <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-display text-white mb-3 group-hover:text-arcane-crystal transition-colors duration-300">
        {feature.title}
      </h3>
      <p className="text-text-secondary font-body leading-relaxed mb-5">
        {feature.description}
      </p>

      {/* Badge */}
      <Badge
        variant="crystal"
        className="text-xs font-sans border-arcane-crystal/20 text-arcane-crystal/80"
      >
        {feature.highlight}
      </Badge>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-br ${feature.gradient}`} />
      </div>
    </motion.div>
  )
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Section background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-void via-cosmic-deep/50 to-cosmic-void" />
      <div className="absolute top-0 w-full section-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-20"
        >
          <Badge
            variant="crystal"
            className="mb-6 text-sm font-sans border-arcane-crystal/20 text-arcane-crystal/80"
          >
            <Crown className="w-4 h-4 mr-2" />
            PREMIUM FEATURES
          </Badge>
          <h2 className="text-fluid-5xl font-display text-white mb-6">
            The Complete AI
            <span className="block text-gradient-crystal">
              Creative Platform
            </span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-3xl mx-auto leading-relaxed font-body">
            Everything you need to bring your creative visions to life, powered by cutting-edge AI
            and enhanced by specialized Guardian personalities.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* CTA background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-arcane-crystal/5 via-transparent to-arcane-void/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-arcane-crystal/50 to-transparent" />

          <div className="relative max-w-3xl mx-auto">
            <h3 className="text-fluid-3xl font-display text-white mb-4">
              Ready to Transform Your Creative Process?
            </h3>
            <p className="text-fluid-lg text-text-secondary mb-10 font-body leading-relaxed">
              Join thousands of creators using Arcanea to build worlds, tell stories,
              and push the boundaries of imagination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold px-8 py-4 text-lg rounded-2xl shadow-glow-crystal hover:shadow-glow-lg transition-shadow"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Creating Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="glass border-arcane-crystal/30 text-arcane-crystal font-sans px-8 py-4 text-lg rounded-2xl hover:border-arcane-crystal/60 transition-all"
              >
                <Users className="w-5 h-5 mr-2" />
                View Creations
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
