'use client';

import Link from 'next/link';
import { LazyMotion, domMax, m } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/design/motion';

export function QuickAccessSection() {
  return (
    <LazyMotion features={domMax}>
      <m.section
        className="mt-16"
        variants={staggerContainer('fast')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <m.div variants={staggerItem}>
            <Link
              href="/living-lore/chronicle"
              className="group block rounded-2xl liquid-glass p-6 hover:border-atlantean-teal-aqua/20 hover:shadow-[0_0_20px_rgba(127,255,212,0.12)] transition-all duration-300"
            >
              <p className="font-cinzel text-sm font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors">
                The Chronicle
              </p>
              <p className="text-xs text-text-muted mt-1">
                Read episodes. Experience the story.
              </p>
            </Link>
          </m.div>
          <m.div variants={staggerItem}>
            <Link
              href="/living-lore/crew"
              className="group block rounded-2xl liquid-glass p-6 hover:border-atlantean-teal-aqua/20 hover:shadow-[0_0_20px_rgba(127,255,212,0.12)] transition-all duration-300"
            >
              <p className="font-cinzel text-sm font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors">
                Meet the Crew
              </p>
              <p className="text-xs text-text-muted mt-1">
                Chat with characters. Build bonds.
              </p>
            </Link>
          </m.div>
          <m.div variants={staggerItem}>
            <Link
              href="/living-lore/journal"
              className="group block rounded-2xl liquid-glass p-6 hover:border-atlantean-teal-aqua/20 hover:shadow-[0_0_20px_rgba(127,255,212,0.12)] transition-all duration-300"
            >
              <p className="font-cinzel text-sm font-semibold text-text-primary group-hover:text-atlantean-teal-aqua transition-colors">
                Your Journey
              </p>
              <p className="text-xs text-text-muted mt-1">
                Track progress. See your bonds grow.
              </p>
            </Link>
          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  );
}
