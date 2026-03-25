'use client';

import Link from 'next/link';
import { LazyMotion, domMax, m } from 'framer-motion';
import { slideUp } from '@/lib/design/motion';

export function CtaSection() {
  return (
    <LazyMotion features={domMax}>
      <m.section
        className="mt-16 text-center"
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="mx-auto max-w-lg rounded-2xl liquid-glass-elevated p-10">
          <h2 className="font-cinzel text-xl font-semibold text-text-primary mb-3">
            Begin Your Journey
          </h2>
          <p className="text-text-muted text-sm mb-6">
            Step through the first Gate with Ren and the crew.
          </p>
          <Link
            href="/living-lore/chronicle/the-assembly"
            className="inline-flex items-center gap-2 rounded-xl bg-atlantean-teal-aqua/10 border border-atlantean-teal-aqua/30 px-6 py-3 text-sm font-semibold text-atlantean-teal-aqua hover:bg-atlantean-teal-aqua/20 transition-all duration-300"
          >
            Enter the Living Lore
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </m.section>
    </LazyMotion>
  );
}
