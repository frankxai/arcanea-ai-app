'use client';

import { m, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  PhFlame,
  PhEye,
  PhScroll,
  PhSkull,
  PhShield,
  PhArrowRight,
  PhCompass,
  PhDiamond,
} from '@/lib/phosphor-icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const EXPLORATIONS = [
  {
    href: '/lore/guardians',
    title: 'The Ten Guardians',
    description: 'Gods and Goddesses who guard the Gates of creation',
    icon: PhShield,
    gradient: 'from-crystal/20 to-brand-primary/10',
    accentColor: 'text-crystal',
    borderColor: 'border-crystal/20 hover:border-crystal/40',
    bgImage: '/guardians/v3/shinkami-hero-v3.webp',
  },
  {
    href: '/lore/gates',
    title: 'The Ten Gates',
    description: 'The journey from Foundation to Source through the ten Gates of creation',
    icon: PhCompass,
    gradient: 'from-gold-bright/20 to-amber-500/10',
    accentColor: 'text-gold-bright',
    borderColor: 'border-gold-bright/20 hover:border-gold-bright/40',
    bgImage: null,
  },
  {
    href: '/lore/godbeasts',
    title: 'The Godbeasts',
    description: 'Primal divine creatures bonded to each Guardian',
    icon: PhEye,
    gradient: 'from-brand-gold/20 to-amber-500/10',
    accentColor: 'text-brand-gold',
    borderColor: 'border-brand-gold/20 hover:border-brand-gold/40',
    bgImage: '/guardians/v2/draconis-godbeast.webp',
  },
  {
    href: '/lore/elements',
    title: 'Five Elements',
    description: 'Fire, Water, Earth, Wind, and the Void/Spirit duality',
    icon: PhFlame,
    gradient: 'from-fire/20 to-orange-500/10',
    accentColor: 'text-fire',
    borderColor: 'border-fire/20 hover:border-fire/40',
    bgImage: null,
  },
  {
    href: '/lore/wisdoms',
    title: 'Seven Wisdoms',
    description: 'Sacred teachings that guide the creative path',
    icon: PhScroll,
    gradient: 'from-brand-primary/20 to-purple-500/10',
    accentColor: 'text-brand-primary',
    borderColor: 'border-brand-primary/20 hover:border-brand-primary/40',
    bgImage: null,
  },
  {
    href: '/lore/malachar',
    title: 'Malachar',
    description: 'The Dark Lord sealed in the Shadowfen — a cautionary tale',
    icon: PhSkull,
    gradient: 'from-red-500/20 to-purple-900/10',
    accentColor: 'text-red-400',
    borderColor: 'border-red-400/20 hover:border-red-400/40',
    bgImage: null,
    darkGradient: true,
  },
  {
    href: '/library',
    title: 'Arcanean Materials',
    description: 'Crystals, metals, and shards born from the Luminor Fallout',
    icon: PhDiamond,
    gradient: 'from-teal-400/20 to-emerald-500/10',
    accentColor: 'text-[#7fffd4]',
    borderColor: 'border-[#7fffd4]/20 hover:border-[#7fffd4]/40',
    bgImage: null,
  },
];

export function LoreExploreGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <PhCompass className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary">
              Explore the Universe
            </span>
          </div>
          <h2 className="text-fluid-3xl md:text-fluid-4xl font-display font-bold mb-4">
            Deeper into Arcanea
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto font-body">
            Every corner of this universe holds wisdom. Choose a path and discover
            the forces that shape all creation.
          </p>
        </m.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXPLORATIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <m.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative block p-6 rounded-2xl liquid-glass border transition-all duration-300 overflow-hidden',
                    'hover-lift',
                    item.borderColor
                  )}
                >
                  {/* Background image (subtle) */}
                  {item.bgImage && (
                    <img
                      src={item.bgImage}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.15] group-hover:opacity-[0.22] transition-opacity duration-500 pointer-events-none select-none"
                    />
                  )}
                  {/* Dark gradient overlay for Malachar */}
                  {'darkGradient' in item && item.darkGradient && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/40 via-purple-950/30 to-black/50 pointer-events-none" />
                  )}
                  {/* Fade-to-card-bg at bottom so text stays readable */}
                  {item.bgImage && (
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-cosmic-deep/80 to-transparent pointer-events-none" />
                  )}

                  <div
                    className={cn(
                      'relative w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                      item.gradient
                    )}
                  >
                    <Icon className={cn('w-6 h-6', item.accentColor)} />
                  </div>
                  <h3 className="relative font-display font-bold text-lg mb-2 group-hover:text-crystal transition-colors">
                    {item.title}
                  </h3>
                  <p className="relative text-sm text-text-secondary mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  <span
                    className={cn(
                      'relative inline-flex items-center gap-1.5 text-sm font-medium',
                      item.accentColor
                    )}
                  >
                    Explore
                    <PhArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </m.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
