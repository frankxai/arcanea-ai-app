'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  scrollReveal,
  staggerContainer,
  staggerItem,
  floatingOrb,
} from '@/lib/animations'
import {
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Crown,
  Play,
  Shield,
} from 'lucide-react'

export default function CTASection() {
  const [email, setEmail] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-void to-cosmic-deep" />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-arcane-crystal/5 blur-[120px]"
      />
      <motion.div
        variants={floatingOrb}
        animate="animate"
        className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-arcane-fire/5 blur-[100px]"
        style={{ animationDelay: '3s' }}
      />
      <div className="absolute top-0 w-full section-divider" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center"
        >
          {/* Header */}
          <Badge
            variant="crystal"
            className="mb-6 text-sm font-sans border-arcane-crystal/20 text-arcane-crystal/80"
          >
            <Crown className="w-4 h-4 mr-2" />
            START YOUR JOURNEY
          </Badge>

          <h2 className="text-fluid-5xl font-display text-white mb-6 leading-[0.95]">
            Ready to Create
            <span className="block text-gradient-cosmic mt-2">
              Something Amazing?
            </span>
          </h2>

          <p className="text-fluid-xl text-text-secondary mb-14 max-w-3xl mx-auto leading-relaxed font-body">
            Join thousands of creators who are already using Arcanea to build
            worlds, tell stories, and push the boundaries of imagination.
          </p>
        </motion.div>

        {/* Email Signup Card */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="glass rounded-3xl p-8 md:p-12 mb-14 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-arcane-crystal/5 via-transparent to-arcane-fire/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-arcane-crystal/50 to-transparent" />

          <div className="relative text-center">
            <h3 className="text-fluid-2xl font-display text-white mb-3">
              Start Your Creative Journey
            </h3>
            <p className="text-text-secondary font-body mb-8">
              Get instant access to all Guardian AI companions and start creating today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-xl glass border border-white/10 text-white placeholder-text-muted font-sans text-sm focus:outline-none focus:border-arcane-crystal/50 focus:ring-1 focus:ring-arcane-crystal/20 transition-all"
              />
              <Button
                size="lg"
                className="group bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold px-8 rounded-xl shadow-glow-crystal hover:shadow-glow-lg transition-shadow whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-xs text-text-muted font-sans mt-4">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14"
        >
          {[
            { icon: Users, value: '10,000+', label: 'Active Creators', color: 'text-arcane-crystal' },
            { icon: Zap, value: '1M+', label: 'AI Generations', color: 'text-arcane-fire-bright' },
            { icon: Crown, value: '98%', label: 'Satisfaction Rate', color: 'text-arcane-gold' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="glow-card rounded-2xl p-6 text-center"
              >
                <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-3`} />
                <div className={`text-fluid-2xl font-display text-white mb-1`}>
                  {stat.value}
                </div>
                <div className="text-text-muted font-sans text-sm">{stat.label}</div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Button
            size="lg"
            className="group bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold px-8 py-4 text-lg rounded-2xl shadow-glow-crystal hover:shadow-glow-lg transition-shadow"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Watch Demo
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="group glass border-arcane-crystal/30 text-arcane-crystal font-sans px-8 py-4 text-lg rounded-2xl hover:border-arcane-crystal/60 transition-all"
          >
            Explore Gallery
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap justify-center items-center gap-6"
        >
          {[
            { icon: Shield, label: 'Secure Payment' },
            { icon: Zap, label: 'Instant Access' },
            { icon: Users, label: '24/7 Support' },
            { icon: Crown, label: 'Premium Quality' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-center gap-2 text-text-muted">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-sans">{item.label}</span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
