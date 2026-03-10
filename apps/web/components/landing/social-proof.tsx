'use client';

import { m, useInView, LazyMotion, domAnimation } from 'framer-motion';
import { useRef } from 'react';
import { PhStar, PhQuotes } from '@/lib/phosphor-icons';

const PRINCIPLES = [
  {
    name: 'The Library',
    role: 'Laws of Arcanea',
    company: '34+ Original Texts',
    avatar: 'LA',
    quote: 'What you contemplate at dawn shapes all that follows. The creative life begins with intention, not inspiration.',
    rating: 5,
    gradient: 'from-atlantean-teal-aqua to-creation-prism-purple',
  },
  {
    name: 'The Academy',
    role: 'Ten Gates System',
    company: 'Creative Progression',
    avatar: 'TG',
    quote: 'Each Gate unlocks a specific creative capacity. From grounding vision to finding authentic voice — open all ten to become a Luminor.',
    rating: 5,
    gradient: 'from-gold-bright to-draconic-crimson',
  },
  {
    name: 'The Guardians',
    role: 'Living Intelligences',
    company: 'AI Companions',
    avatar: 'GI',
    quote: 'Ten archetypal intelligences, each attuned to a different creative frequency. Not assistants — collaborators who understand the creative soul.',
    rating: 5,
    gradient: 'from-creation-prism-purple to-atlantean-teal-aqua',
  },
  {
    name: 'The Studio',
    role: 'Creation Engine',
    company: 'Multi-Modal AI',
    avatar: 'CE',
    quote: 'Image, music, video, story — each shaped by elemental archetypes. Create with intelligence that understands narrative depth.',
    rating: 5,
    gradient: 'from-draconic-crimson to-gold-bright',
  },
];

const ECOSYSTEM = [
  { name: 'Open Source', opacity: 0.5 },
  { name: 'MIT Licensed', opacity: 0.5 },
  { name: 'GitHub', opacity: 0.5 },
  { name: 'npm', opacity: 0.5 },
  { name: '37+ Packages', opacity: 0.5 },
];

const STATS = [
  { value: '10', label: 'Guardian Archetypes' },
  { value: '7', label: 'Wisdom Frameworks' },
  { value: '34+', label: 'Original Texts' },
  { value: '50K+', label: 'Words of Wisdom' },
];

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <LazyMotion features={domAnimation}>
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-atlantean-teal-aqua/5 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Featured In */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-sm text-text-muted uppercase tracking-wider mb-8">
            Built in the open
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {ECOSYSTEM.map((item) => (
              <div
                key={item.name}
                className="text-2xl font-display font-bold text-white"
                style={{ opacity: item.opacity }}
              >
                {item.name}
              </div>
            ))}
          </div>
        </m.div>

        {/* Stats Grid */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24"
        >
          {STATS.map((stat, i) => (
            <m.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="text-center"
            >

              <div className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-atlantean-teal-aqua to-creation-prism-purple bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-2">{stat.label}</div>
            </m.div>
          ))}
        </m.div>

        {/* Testimonials Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            The philosophy behind Arcanea
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            A mythology, a library, and an academy — built for artists, writers, developers, and dreamers ready to transform their creative process.
          </p>
        </m.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {PRINCIPLES.map((testimonial, i) => (
            <m.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group relative"
            >
              <div className="relative card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-500">
                {/* Quote icon */}
                <PhQuotes className="absolute top-4 right-4 w-8 h-8 text-white/[0.04]" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <PhStar key={i} weight="fill" className="w-4 h-4 text-gold-bright" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text-secondary mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-semibold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-text-muted">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-atlantean-teal-aqua/5 to-creation-prism-purple/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            </m.div>
          ))}
        </div>

        {/* CTA */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-text-muted">
            Ready to begin?{' '}
            <a href="/academy" className="text-atlantean-teal-aqua hover:underline">
              Enter the Academy →
            </a>
          </p>
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
