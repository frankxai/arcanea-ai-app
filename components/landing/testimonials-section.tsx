'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import {
  scrollReveal,
  staggerContainer,
  staggerItem,
  cardHover,
} from '@/lib/animations'
import { CheckCircle, Star, Quote, MessageSquare } from 'lucide-react'

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Fantasy Author',
    content:
      "Arcanea's Guardian AI transformed my worldbuilding process. Draconia's creative guidance helped me break through writer's block and create characters with real depth.",
    avatar: 'AC',
    rating: 5,
    result: 'Published 3 fantasy novels',
    gradient: 'from-arcane-fire to-orange-500',
  },
  {
    name: 'Maya Patel',
    role: 'Game Developer',
    content:
      'The multi-modal generation suite is incredible. I can generate character art, location maps, and story elements all in one platform. It saves me hours every day.',
    avatar: 'MP',
    rating: 5,
    result: 'Launched successful indie RPG',
    gradient: 'from-arcane-crystal to-arcane-water',
  },
  {
    name: 'Sam Rivera',
    role: 'Community Manager',
    content:
      "Our community engagement increased 300% using Arcanea's tools. The Guardian AI personalities make our events more engaging and the templates help new creators.",
    avatar: 'SR',
    rating: 5,
    result: '50K+ active community members',
    gradient: 'from-arcane-void to-purple-500',
  },
  {
    name: 'Jordan Kim',
    role: 'Creative Director',
    content:
      "As a professional studio, we need tools that deliver quality consistently. Arcanea's intelligent routing and cost optimization cut our costs by 40% while improving quality.",
    avatar: 'JK',
    rating: 4,
    result: '200+ projects delivered',
    gradient: 'from-arcane-gold to-arcane-fire',
  },
] as const

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number]
  index: number
}) {
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
      {/* Quote icon */}
      <Quote className="absolute top-6 right-6 w-8 h-8 text-white/5 group-hover:text-arcane-crystal/10 transition-colors duration-500" />

      {/* Avatar + Info */}
      <div className="flex items-start gap-4 mb-5">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-sm font-display text-white shadow-lg flex-shrink-0`}>
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-display text-white">
            {testimonial.name}
          </h4>
          <p className="text-sm text-text-muted font-sans">{testimonial.role}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < testimonial.rating
                  ? 'text-arcane-gold fill-arcane-gold'
                  : 'text-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quote */}
      <blockquote className="text-text-secondary font-body leading-relaxed mb-5 text-sm">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      {/* Result badge */}
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-arcane-crystal flex-shrink-0" />
        <span className="text-sm font-sans font-medium text-arcane-crystal">
          {testimonial.result}
        </span>
      </div>
    </motion.div>
  )
}

const stats = [
  { value: '50K+', label: 'Active Users', color: 'text-arcane-crystal' },
  { value: '1M+', label: 'Generations', color: 'text-arcane-fire-bright' },
  { value: '99.9%', label: 'Satisfaction', color: 'text-arcane-earth' },
  { value: '4.9', label: 'Average Rating', color: 'text-arcane-gold', hasStar: true },
]

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
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
            <MessageSquare className="w-4 h-4 mr-2" />
            CREATOR STORIES
          </Badge>
          <h2 className="text-fluid-5xl font-display text-white mb-6">
            Trusted by Creators
            <span className="block text-gradient-crystal">
              Worldwide
            </span>
          </h2>
          <p className="text-fluid-lg text-text-secondary max-w-3xl mx-auto leading-relaxed font-body">
            Join thousands of worldbuilders who use Arcanea to transform their
            creative vision into reality.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="glow-card rounded-2xl p-6 text-center"
            >
              <div className={`text-fluid-2xl font-display ${stat.color} mb-1`}>
                {stat.value}
                {'hasStar' in stat && <Star className="w-4 h-4 inline ml-1 fill-arcane-gold text-arcane-gold" />}
              </div>
              <div className="text-text-muted font-sans text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          variants={scrollReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex flex-wrap justify-center gap-4"
        >
          {[
            { icon: CheckCircle, label: '30-Day Money Back Guarantee' },
            { icon: Star, label: '50K+ Happy Creators' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full"
              >
                <Icon className="w-4 h-4 text-arcane-crystal" />
                <span className="text-sm font-sans font-medium text-text-secondary">
                  {item.label}
                </span>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
