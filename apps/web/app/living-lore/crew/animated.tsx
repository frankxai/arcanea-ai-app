'use client';

import { LazyMotion, domMax, m } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/design/motion';
import { CrewCard } from '@/components/living-lore/crew-card';
import type { CrewMember } from '@/lib/living-lore/types';

interface Props {
  crew: CrewMember[];
}

export function CrewPageAnimated({ crew }: Props) {
  return (
    <LazyMotion features={domMax}>
      <m.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer('normal')}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {crew.map((member) => (
          <m.div key={member.id} variants={staggerItem}>
            <CrewCard member={member} expanded />
          </m.div>
        ))}
      </m.div>
    </LazyMotion>
  );
}
