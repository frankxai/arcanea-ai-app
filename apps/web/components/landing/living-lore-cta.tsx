'use client';

import Link from 'next/link';
import { LazyMotion, domMax, m } from 'framer-motion';
import {
  slideUp,
  staggerContainer,
  staggerItem,
  hoverPresets,
} from '@/lib/design/motion';
import { CREW } from '@/lib/living-lore/crew-data';

/**
 * Compact CTA section for the homepage that introduces the Living Lore crew
 * and links to the "Meet the Crew" onboarding experience.
 */
export function LivingLoreCTA() {
  return (
    <LazyMotion features={domMax}>
      <m.section
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="w-full"
      >
        <div className="liquid-glass rounded-2xl p-8 md:p-12 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(127,255,212,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-[radial-gradient(circle,rgba(147,112,219,0.05)_0%,transparent_70%)] blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <p className="text-xs uppercase tracking-[0.25em] text-text-muted mb-3">
              The Living Lore
            </p>
            <h2 className="font-display text-2xl md:text-3xl text-text-primary mb-2">
              Follow seven beings through the Ten Gates
            </h2>
            <p className="text-text-muted text-sm max-w-lg mb-8">
              A crew of unlikely companions. A story that responds to you.
              Choose your companion and begin.
            </p>

            {/* Crew avatar row */}
            <m.div
              variants={staggerContainer('fast')}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-8"
            >
              {CREW.map((member) => (
                <m.div
                  key={member.id}
                  variants={staggerItem}
                  className="group relative"
                >
                  <div
                    className="w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center text-lg md:text-xl transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${member.color}25, ${member.color}08)`,
                      boxShadow: `0 0 20px ${member.color}15`,
                    }}
                    title={member.name}
                  >
                    {member.avatar}
                  </div>
                </m.div>
              ))}
            </m.div>

            {/* CTA button */}
            <Link
              href="/living-lore/meet"
              className="inline-flex items-center gap-2 liquid-glass-elevated rounded-xl px-6 py-3 text-sm font-semibold text-atlantean-teal-aqua hover:brightness-110 transition-all duration-200 glow-soft"
            >
              Meet the Crew
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </m.section>
    </LazyMotion>
  );
}
