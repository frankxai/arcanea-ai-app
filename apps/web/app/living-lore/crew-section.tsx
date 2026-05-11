/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/design/motion';
import { CrewCard } from '@/components/living-lore/crew-card';
import type { CrewMember } from '@/lib/living-lore/types';

interface Props {
  crew: CrewMember[];
}

export function CrewSection({ crew }: Props) {
  return (
    <LazyMotion features={domAnimation}>
      <m.section
        className="space-y-6"
        variants={staggerContainer('normal')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div>
          <h2 className="text-2xl font-display text-text-primary mb-2">
            The Crew
          </h2>
          <p className="text-text-muted text-sm">
            Seven perspectives on one journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((member) => (
            <m.div key={member.id} variants={staggerItem}>
              <CrewCard member={member} />
            </m.div>
          ))}
        </div>
      </m.section>
    </LazyMotion>
  );
}
