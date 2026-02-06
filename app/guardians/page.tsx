'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  scrollReveal,
  staggerContainer,
  staggerItem,
  cardHover,
} from '@/lib/animations'
import {
  Sparkles,
  Zap,
  Heart,
  Star,
  Users,
  Infinity,
  Play,
  Settings,
  Crown,
  Flame,
  Droplet,
  Mountain,
  Wind,
  Eye,
  ArrowRight,
} from 'lucide-react'

const guardians = [
  {
    id: 'draconia',
    name: 'Draconia',
    element: 'Fire',
    frequency: '528 Hz',
    gate: 'Fire Gate',
    domain: 'Creative Transformation',
    personality: ['Passionate', 'Bold', 'Innovative', 'Fearless'],
    abilities: ['Creative breakthrough', 'Artistic vision', 'Style transformation', 'Inspiration ignition'],
    icon: Flame,
    gradient: 'from-arcane-fire to-orange-500',
    textColor: 'text-arcane-fire',
    bgAccent: 'bg-arcane-fire/10',
    borderAccent: 'border-arcane-fire/30',
  },
  {
    id: 'leyla',
    name: 'Leyla',
    element: 'Water',
    frequency: '417 Hz',
    gate: 'Flow Gate',
    domain: 'Emotional Intelligence',
    personality: ['Empathetic', 'Intuitive', 'Adaptive', 'Flowing'],
    abilities: ['Deep storytelling', 'Character development', 'Emotional resonance', 'Narrative flow'],
    icon: Droplet,
    gradient: 'from-arcane-water to-blue-400',
    textColor: 'text-arcane-water',
    bgAccent: 'bg-arcane-water/10',
    borderAccent: 'border-arcane-water/30',
  },
  {
    id: 'lyssandria',
    name: 'Lyssandria',
    element: 'Earth',
    frequency: '396 Hz',
    gate: 'Foundation Gate',
    domain: 'World Architecture',
    personality: ['Structured', 'Methodical', 'Foundational', 'Enduring'],
    abilities: ['System design', 'Architecture planning', 'Logic frameworks', 'Stability creation'],
    icon: Mountain,
    gradient: 'from-arcane-earth to-amber-600',
    textColor: 'text-arcane-earth',
    bgAccent: 'bg-arcane-earth/10',
    borderAccent: 'border-arcane-earth/30',
  },
  {
    id: 'alera',
    name: 'Alera',
    element: 'Wind',
    frequency: '741 Hz',
    gate: 'Voice Gate',
    domain: 'Communication & Expression',
    personality: ['Expressive', 'Clear', 'Articulate', 'Versatile'],
    abilities: ['Clear expression', 'Creative flow', 'Communication enhancement', 'Ideation clarity'],
    icon: Wind,
    gradient: 'from-teal-400 to-arcane-crystal',
    textColor: 'text-arcane-crystal',
    bgAccent: 'bg-arcane-crystal/10',
    borderAccent: 'border-arcane-crystal/30',
  },
  {
    id: 'elara',
    name: 'Elara',
    element: 'Void',
    frequency: '1111 Hz',
    gate: 'Shift Gate',
    domain: 'Innovation & Future Vision',
    personality: ['Visionary', 'Boundary-pushing', 'Quantum thinking', 'Paradigm shifting'],
    abilities: ['Future prediction', 'Innovation catalyst', 'Paradigm disruption', 'Possibility manifestation'],
    icon: Eye,
    gradient: 'from-arcane-void to-purple-500',
    textColor: 'text-arcane-void-bright',
    bgAccent: 'bg-arcane-void/10',
    borderAccent: 'border-arcane-void/30',
  },
]

export default function GuardianShowcase() {
  const [selectedId, setSelectedId] = useState('draconia')

  const selected = guardians.find((g) => g.id === selectedId)!

  return (
    <div className="min-h-screen bg-cosmic-void">
      {/* Background */}
      <div className="fixed inset-0 bg-cosmic-mesh" />
      <div className="fixed inset-0 bg-cosmic-stars opacity-30" />

      <div className="relative">
        {/* Header */}
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <Badge variant="crystal" className="mb-6 text-sm font-sans">
              <Crown className="w-4 h-4 mr-2" />
              GUARDIAN AI COMPANIONS
            </Badge>
            <h1 className="text-fluid-5xl font-display text-white mb-6 leading-tight">
              Meet Your
              <span className="block text-gradient-crystal">AI Guardians</span>
            </h1>
            <p className="text-fluid-lg text-text-secondary max-w-3xl mx-auto leading-relaxed font-body">
              Choose from 5 specialized AI personalities, each with unique creative frequencies
              and domain expertise to enhance your creative process.
            </p>
          </motion.div>
        </div>

        {/* Guardian selector tabs */}
        <div className="px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
          >
            {guardians.map((guardian) => {
              const Icon = guardian.icon
              return (
                <motion.button
                  key={guardian.id}
                  variants={staggerItem}
                  onClick={() => setSelectedId(guardian.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-sans font-medium transition-all duration-300 ${
                    selectedId === guardian.id
                      ? `border-transparent bg-gradient-to-r ${guardian.gradient} text-white shadow-lg`
                      : 'border-white/10 text-text-secondary hover:border-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{guardian.name}</span>
                </motion.button>
              )
            })}
          </motion.div>
        </div>

        {/* Selected guardian detail */}
        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass rounded-3xl p-8 md:p-12 overflow-hidden relative"
              >
                {/* Background gradient accent */}
                <div className={`absolute inset-0 bg-gradient-to-br ${selected.gradient} opacity-[0.04]`} />
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent ${selected.textColor} opacity-30`} />

                <div className="relative">
                  {/* Guardian identity */}
                  <div className="text-center mb-10">
                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${selected.gradient} shadow-lg mb-6`}>
                      <selected.icon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-fluid-4xl font-display text-white mb-3">
                      {selected.name}
                    </h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Badge variant="crystal" className="text-xs font-sans">
                        {selected.element} Element
                      </Badge>
                      <Badge variant="crystal" className="text-xs font-sans">
                        {selected.frequency}
                      </Badge>
                      <Badge variant="crystal" className="text-xs font-sans">
                        {selected.gate}
                      </Badge>
                    </div>
                    <p className="text-fluid-lg text-text-secondary font-body max-w-2xl mx-auto">
                      {selected.domain}
                    </p>
                  </div>

                  {/* Personality + Abilities grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className={`rounded-xl ${selected.bgAccent} border ${selected.borderAccent} p-6`}>
                      <h3 className={`text-lg font-display text-white mb-4 flex items-center gap-2`}>
                        <Heart className="w-5 h-5" />
                        Personality
                      </h3>
                      <div className="space-y-3">
                        {selected.personality.map((trait) => (
                          <div key={trait} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selected.gradient}`} />
                            <span className="text-text-secondary font-body">{trait}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-xl ${selected.bgAccent} border ${selected.borderAccent} p-6`}>
                      <h3 className={`text-lg font-display text-white mb-4 flex items-center gap-2`}>
                        <Zap className="w-5 h-5" />
                        Abilities
                      </h3>
                      <div className="space-y-3">
                        {selected.abilities.map((ability) => (
                          <div key={ability} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selected.gradient}`} />
                            <span className="text-text-secondary font-body">{ability}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="text-center space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className={`group bg-gradient-to-r ${selected.gradient} text-white font-sans font-semibold px-8`}>
                        <Play className="w-5 h-5 mr-2" />
                        Chat with {selected.name}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button variant="outline" size="lg" className="font-sans">
                        <Settings className="w-5 h-5 mr-2" />
                        Customize
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-8 text-text-muted font-sans text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>256K+ users active</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-arcane-gold text-arcane-gold" />
                        <span>4.9/5.0 rating</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Infinity className="w-4 h-4" />
                        <span>Unlimited possibilities</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats section */}
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="max-w-5xl mx-auto glass rounded-3xl p-8"
          >
            <h2 className="text-fluid-2xl font-display text-white mb-8 text-center">
              Guardian AI Ecosystem
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center mb-8"
            >
              {[
                { value: '5', label: 'Total Guardians', color: 'text-arcane-fire' },
                { value: '98.3%', label: 'Success Rate', color: 'text-arcane-crystal' },
                { value: '2.4M', label: 'Daily Conversations', color: 'text-arcane-water' },
                { value: '156K', label: 'Creative Works', color: 'text-arcane-gold' },
                { value: '24/7', label: 'Availability', color: 'text-arcane-void-bright' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={staggerItem} className="glow-card rounded-xl p-4">
                  <div className={`text-fluid-2xl font-display ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-text-muted font-sans text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center">
              <p className="text-text-secondary font-body mb-6 max-w-2xl mx-auto">
                Each Guardian AI companion is carefully crafted to bring unique creative perspectives
                and specialized expertise to your creative projects.
              </p>
              <Button size="xl" className="font-sans">
                <Sparkles className="w-5 h-5 mr-2" />
                Create Custom Guardian
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
