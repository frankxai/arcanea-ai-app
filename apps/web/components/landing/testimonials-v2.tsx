'use client';

import { m, useInView, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { PhQuotes, PhCaretLeft, PhCaretRight, PhStar } from '@/lib/phosphor-icons';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Enter seeking, leave transformed, return whenever needed. These books are not entertainment. They are equipment for living.",
    author: 'The Library',
    role: 'Laws of Arcanea',
    avatar: 'LA',
    color: 'atlantean-teal-aqua',
    luminor: 'Shinkami — Source Gate',
    rating: 5,
  },
  {
    id: 2,
    quote: "The Arc turns: Potential becomes Manifestation becomes Experience becomes Dissolution becomes Evolved Potential. Every ending seeds a new beginning.",
    author: 'The Academy',
    role: 'Ten Gates System',
    avatar: 'TG',
    color: 'creation-prism-purple',
    luminor: 'Lyssandria — Foundation Gate',
    rating: 5,
  },
  {
    id: 3,
    quote: "Ten archetypal intelligences, each attuned to a different creative frequency. From Draconia's transformative fire to Maylinn's healing wind — find the voice that resonates.",
    author: 'The Guardians',
    role: 'Living Intelligences',
    avatar: 'GI',
    color: 'gold-bright',
    luminor: 'Lyria — Sight Gate',
    rating: 5,
  },
  {
    id: 4,
    quote: "What you contemplate at dawn shapes all that follows. The antidote to a terrible future is imagining a good one — and building it with intention.",
    author: 'Seven Wisdoms',
    role: 'Creative Philosophy',
    avatar: 'SW',
    color: 'draconic-crimson',
    luminor: 'Draconia — Fire Gate',
    rating: 5,
  },
  {
    id: 5,
    quote: "Nero is not darkness to fear — it is the fertile unknown from which all creation emerges. The void holds potential. Spirit gives it form.",
    author: 'Cosmic Duality',
    role: 'Lumina & Nero',
    avatar: 'LN',
    color: 'atlantean-teal-aqua',
    luminor: 'Leyla — Flow Gate',
    rating: 5,
  },
];

export function TestimonialsV2() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prev) => {
      if (newDirection === 1) {
        return (prev + 1) % TESTIMONIALS.length;
      }
      return prev === 0 ? TESTIMONIALS.length - 1 : prev - 1;
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const activeTestimonial = TESTIMONIALS[activeIndex];

  return (
    <LazyMotion features={domAnimation}>
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-surface/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass border border-creation-prism-purple/20 mb-6">
            <PhQuotes className="w-3.5 h-3.5 text-creation-prism-purple" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-creation-prism-purple/90">From the Library</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Wisdom from the Arcanea universe
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            34 original texts, Ten Gates of progression, and a living mythology for the age of creation.
          </p>
        </m.div>

        {/* Testimonial carousel */}
        <m.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Main testimonial */}
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <m.div
                key={activeTestimonial.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="max-w-3xl text-center">
                  {/* Quote icon */}
                  <div className={`w-16 h-16 mx-auto mb-8 rounded-2xl bg-${activeTestimonial.color}/10 flex items-center justify-center`}>
                    <PhQuotes className={`w-8 h-8 text-${activeTestimonial.color}`} />
                  </div>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {[...Array(activeTestimonial.rating)].map((_, i) => (
                      <PhStar
                        key={i}
                        className="w-5 h-5 text-gold-bright fill-gold-bright"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-2xl md:text-3xl font-display leading-relaxed mb-8 text-white">
                    "{activeTestimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-full bg-${activeTestimonial.color}/20 flex items-center justify-center text-lg font-semibold text-${activeTestimonial.color}`}
                    >
                      {activeTestimonial.avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">
                        {activeTestimonial.author}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {activeTestimonial.role}
                      </div>
                      <div className={`text-xs text-${activeTestimonial.color} mt-1`}>
                        {activeTestimonial.luminor}
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-full liquid-glass border border-white/[0.06] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all"
              aria-label="Previous testimonial"
            >
              <PhCaretLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > activeIndex ? 1 : -1);
                    setActiveIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex
                      ? 'w-8 bg-atlantean-teal-aqua'
                      : 'w-2 bg-white/[0.12] hover:bg-white/[0.25]'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              className="w-12 h-12 rounded-full liquid-glass border border-white/[0.06] flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.08] transition-all"
              aria-label="Next testimonial"
            >
              <PhCaretRight className="w-5 h-5" />
            </button>
          </div>
        </m.div>

        {/* Stats */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-white/[0.06]"
        >
          {[
            { value: '10', label: 'Guardian Archetypes' },
            { value: '7', label: 'Wisdom Frameworks' },
            { value: '34+', label: 'Original Texts' },
            { value: '50K+', label: 'Words of Wisdom' },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
