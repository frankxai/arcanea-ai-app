'use client'

import { useState, useRef } from 'react'
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
  Check,
  Crown,
  Zap,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

const plans = [
  {
    name: 'Creator',
    description: 'Perfect for individual creators and hobbyists',
    price: { monthly: 19, yearly: 199 },
    originalPrice: { monthly: 29, yearly: 299 },
    features: [
      '1,000 AI credits per month',
      'Basic LLM models (Claude, GPT-3.5)',
      'Standard image generation',
      '3 Guardian AI companions',
      'Community access',
      'Basic analytics',
    ],
    gradient: 'from-arcane-water to-arcane-crystal',
    accentColor: 'text-arcane-water',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For serious creators and small teams',
    price: { monthly: 49, yearly: 499 },
    originalPrice: { monthly: 79, yearly: 799 },
    features: [
      '5,000 AI credits per month',
      'Advanced LLM models (GPT-4, Claude 3.5)',
      'Premium image generation',
      'All 10 Guardian AI companions',
      'Video generation (10 mins)',
      'Audio generation (30 mins)',
      'Priority support',
      'Advanced analytics',
    ],
    gradient: 'from-arcane-crystal to-arcane-fire',
    accentColor: 'text-arcane-crystal',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large teams and organizations',
    price: { monthly: 199, yearly: 1999 },
    originalPrice: { monthly: null, yearly: null },
    features: [
      'Unlimited AI credits',
      'All AI models and providers',
      'Unlimited generations',
      'Custom Guardian personalities',
      'API access',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
    ],
    gradient: 'from-arcane-gold to-arcane-fire',
    accentColor: 'text-arcane-gold',
    popular: false,
  },
] as const

type Plan = (typeof plans)[number]

function PricingCard({
  plan,
  billingCycle,
  index,
}: {
  plan: Plan
  billingCycle: 'monthly' | 'yearly'
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const price = plan.price[billingCycle]
  const originalPrice = plan.originalPrice[billingCycle]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover="hover"
      variants={cardHover}
      className={`relative group glow-card rounded-2xl overflow-hidden ${
        plan.popular ? 'lg:scale-105 z-10' : ''
      }`}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div className="absolute -top-px left-0 right-0 h-px">
          <div className={`h-[2px] bg-gradient-to-r ${plan.gradient}`} />
        </div>
      )}

      {/* Popular label */}
      {plan.popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Badge className={`bg-gradient-to-r ${plan.gradient} text-white font-sans text-xs px-4 py-1 shadow-lg`}>
            <Star className="w-3 h-3 mr-1.5" />
            MOST POPULAR
          </Badge>
        </div>
      )}

      <div className="p-8 pt-10">
        {/* Plan header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-display text-white mb-2">
            {plan.name}
          </h3>
          <p className="text-sm text-text-muted font-body mb-6">
            {plan.description}
          </p>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-fluid-3xl font-display text-white">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-lg text-text-muted line-through font-body">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-text-muted font-sans">
            per {billingCycle === 'monthly' ? 'month' : 'year'}
          </p>
        </div>

        {/* Divider */}
        <div className={`h-px mb-8 bg-gradient-to-r from-transparent ${plan.popular ? 'via-arcane-crystal/30' : 'via-white/10'} to-transparent`} />

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className={`w-4 h-4 ${plan.accentColor} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-text-secondary font-body">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button
          size="lg"
          className={`w-full rounded-xl font-sans font-semibold transition-all ${
            plan.popular
              ? `bg-gradient-to-r ${plan.gradient} text-cosmic-void shadow-glow-crystal hover:shadow-glow-lg`
              : 'glass border-arcane-crystal/30 text-arcane-crystal hover:border-arcane-crystal/60'
          }`}
        >
          {plan.popular && <Sparkles className="w-4 h-4 mr-2" />}
          Start {plan.name} Plan
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-void via-cosmic-deep/30 to-cosmic-void" />
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
            <Crown className="w-4 h-4 mr-2" />
            PRICING PLANS
          </Badge>
          <h2 className="text-fluid-5xl font-display text-white mb-6">
            Choose Your
            <span className="block text-gradient-gold">
              Creative Power
            </span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-3xl mx-auto leading-relaxed font-body mb-10">
            Select the perfect plan for your creative journey. All plans include core features with scalable benefits.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center glass rounded-full p-1 gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void shadow-glow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full font-sans text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void shadow-glow-sm'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              Yearly
              <Badge
                variant="crystal"
                className="text-[10px] border-arcane-crystal/20 text-arcane-crystal/80 font-sans"
              >
                Save 30%
              </Badge>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 mb-20 items-start">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billingCycle={billingCycle}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="glass rounded-3xl p-10 md:p-14 text-center overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-arcane-crystal/5 via-transparent to-arcane-gold/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-arcane-crystal/50 to-transparent" />

          <div className="relative">
            <h3 className="text-fluid-2xl font-display text-white mb-8">
              Trusted by Creators Worldwide
            </h3>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10"
            >
              {[
                { value: '10K+', label: 'Active Users', color: 'text-arcane-crystal' },
                { value: '1M+', label: 'Generations', color: 'text-arcane-fire-bright' },
                { value: '98%', label: 'Satisfaction', color: 'text-arcane-gold' },
              ].map((stat) => (
                <motion.div key={stat.label} variants={staggerItem} className="text-center">
                  <div className={`text-fluid-3xl font-display ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-text-muted font-sans text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <Button
              size="lg"
              className="group bg-gradient-to-r from-arcane-crystal to-arcane-water text-cosmic-void font-sans font-semibold px-8 py-4 text-lg rounded-2xl shadow-glow-crystal hover:shadow-glow-lg transition-shadow"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
