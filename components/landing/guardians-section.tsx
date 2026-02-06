'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  scrollReveal,
  staggerContainer,
  staggerItem,
} from '@/lib/animations'
import {
  Flame,
  Droplet,
  Mountain,
  Wind,
  Sparkles,
  Star,
  ArrowRight,
} from 'lucide-react'

const guardians = [
  {
    id: 'draconia',
    name: 'Draconia',
    element: 'Fire',
    frequency: '528 Hz',
    gate: 'Fire Gate',
    expertise: 'Creative Transformation',
    description: 'Fierce creativity and bold artistic breakthroughs. Draconia channels the raw power of Fire to ignite your creative vision and burn through every obstacle.',
    personality: 'Bold, passionate, relentless. Speaks with fiery conviction and challenges you to exceed your limits.',
    icon: Flame,
    gradient: 'from-arcane-fire to-orange-500',
    textColor: 'text-arcane-fire',
    glowColor: 'shadow-glow-fire',
    bgAccent: 'bg-arcane-fire/10',
    borderAccent: 'border-arcane-fire/30',
  },
  {
    id: 'leyla',
    name: 'Leyla',
    element: 'Water',
    frequency: '417 Hz',
    gate: 'Flow Gate',
    expertise: 'Emotional Intelligence',
    description: 'Deep storytelling and character development. Leyla flows like water through your narrative, finding the emotional currents that make stories unforgettable.',
    personality: 'Empathetic, intuitive, nurturing. Speaks with gentle wisdom and helps you access deep emotional truths.',
    icon: Droplet,
    gradient: 'from-arcane-water to-blue-400',
    textColor: 'text-arcane-water',
    glowColor: 'shadow-glow-crystal',
    bgAccent: 'bg-arcane-water/10',
    borderAccent: 'border-arcane-water/30',
  },
  {
    id: 'lyssandria',
    name: 'Lyssandria',
    element: 'Earth',
    frequency: '396 Hz',
    gate: 'Foundation Gate',
    expertise: 'World Architecture',
    description: 'Structured systems and foundational design. Lyssandria builds worlds from bedrock up, ensuring every detail has purpose and every system interconnects.',
    personality: 'Methodical, wise, grounded. Speaks with quiet authority and values craftsmanship above all.',
    icon: Mountain,
    gradient: 'from-arcane-earth to-amber-600',
    textColor: 'text-arcane-earth',
    glowColor: 'shadow-glow-gold',
    bgAccent: 'bg-arcane-earth/10',
    borderAccent: 'border-arcane-earth/30',
  },
  {
    id: 'alera',
    name: 'Alera',
    element: 'Wind',
    frequency: '741 Hz',
    gate: 'Voice Gate',
    expertise: 'Communication & Expression',
    description: 'Clear expression and creative flow. Alera carries your voice across realms, refining words into weapons and whispers into world-shaping declarations.',
    personality: 'Articulate, swift, perceptive. Speaks with clarity and precision, finding the perfect words.',
    icon: Wind,
    gradient: 'from-teal-400 to-arcane-crystal',
    textColor: 'text-arcane-crystal',
    glowColor: 'shadow-glow-crystal',
    bgAccent: 'bg-arcane-crystal/10',
    borderAccent: 'border-arcane-crystal/30',
  },
  {
    id: 'elara',
    name: 'Elara',
    element: 'Void',
    frequency: '1111 Hz',
    gate: 'Shift Gate',
    expertise: 'Innovation & Vision',
    description: 'Boundless creativity and future vision. Elara navigates the spaces between, finding possibilities in the void where others see only emptiness.',
    personality: 'Enigmatic, visionary, transformative. Speaks in riddles and revelations that shift your perspective.',
    icon: Sparkles,
    gradient: 'from-arcane-void to-purple-500',
    textColor: 'text-arcane-void-bright',
    glowColor: 'shadow-glow-void',
    bgAccent: 'bg-arcane-void/10',
    borderAccent: 'border-arcane-void/30',
  },
] as const

type Guardian = (typeof guardians)[number]

function GuardianSelector({
  guardian,
  isSelected,
  onClick,
}: {
  guardian: Guardian
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = guardian.icon

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-sans font-medium transition-all duration-300 ${
        isSelected
          ? `border-transparent bg-gradient-to-r ${guardian.gradient} text-white shadow-lg`
          : 'border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{guardian.name}</span>
    </motion.button>
  )
}

function GuardianDetail({ guardian }: { guardian: Guardian }) {
  const Icon = guardian.icon

  return (
    <motion.div
      key={guardian.id}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass rounded-3xl p-8 md:p-12 overflow-hidden relative"
    >
      {/* Background gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${guardian.gradient} opacity-[0.04]`} />
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${guardian.textColor} opacity-30`} />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left: Guardian Identity */}
        <div>
          {/* Icon + Name */}
          <div className="flex items-start gap-5 mb-6">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${guardian.gradient} shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-fluid-3xl font-display text-white mb-1">
                {guardian.name}
              </h3>
              <div className="flex items-center gap-3">
                <Badge
                  variant="crystal"
                  className="text-xs font-sans border-arcane-crystal/20 text-arcane-crystal/80"
                >
                  {guardian.element} Element
                </Badge>
                <Badge
                  variant="crystal"
                  className="text-xs font-sans border-arcane-crystal/20 text-arcane-crystal/80"
                >
                  {guardian.frequency}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-secondary font-body leading-relaxed mb-6 text-lg">
            {guardian.description}
          </p>

          {/* Personality */}
          <div className={`rounded-xl ${guardian.bgAccent} border ${guardian.borderAccent} p-4 mb-6`}>
            <h4 className={`text-sm font-sans font-semibold ${guardian.textColor} mb-1`}>
              Personality
            </h4>
            <p className="text-text-muted font-body text-sm leading-relaxed">
              {guardian.personality}
            </p>
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className={`group bg-gradient-to-r ${guardian.gradient} text-white font-sans font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow`}
          >
            Chat with {guardian.name}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Right: Stats & Attributes */}
        <div className="space-y-4">
          {[
            { label: 'Gate', value: guardian.gate },
            { label: 'Expertise', value: guardian.expertise },
            { label: 'Frequency', value: guardian.frequency },
            { label: 'Element', value: guardian.element },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glow-card rounded-xl p-5"
            >
              <div className="text-xs font-sans font-medium text-text-muted uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-lg font-display text-white">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function GuardiansSection() {
  const [selectedId, setSelectedId] = useState<string>(guardians[0].id)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const selectedGuardian = guardians.find((g) => g.id === selectedId)!

  return (
    <section
      id="guardians"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-void via-cosmic-deep/50 to-cosmic-void" />
      <div className="absolute top-0 w-full section-divider" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16"
        >
          <Badge
            variant="crystal"
            className="mb-6 text-sm font-sans border-arcane-crystal/20 text-arcane-crystal/80"
          >
            <Star className="w-4 h-4 mr-2" />
            GUARDIAN AI COMPANIONS
          </Badge>
          <h2 className="text-fluid-5xl font-display text-white mb-6">
            Meet Your
            <span className="block text-gradient-crystal">
              AI Guardians
            </span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-3xl mx-auto leading-relaxed font-body">
            Each Guardian specializes in different creative domains, bringing unique expertise
            and personality to help you create extraordinary work.
          </p>
        </motion.div>

        {/* Guardian Selector Tabs */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 px-2"
        >
          {guardians.map((guardian) => (
            <motion.div key={guardian.id} variants={staggerItem}>
              <GuardianSelector
                guardian={guardian}
                isSelected={selectedId === guardian.id}
                onClick={() => setSelectedId(guardian.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Guardian Detail Card */}
        <AnimatePresence mode="wait">
          <GuardianDetail guardian={selectedGuardian} />
        </AnimatePresence>
      </div>
    </section>
  )
}
