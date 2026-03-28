'use client';

import type { ReactNode } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { slideUp } from '@/lib/design/motion';

interface Props {
  children: ReactNode;
  className?: string;
}

export function AnimatedSection({ children, className }: Props) {
  return (
    <LazyMotion features={domAnimation}>
      <m.section
        className={className}
        variants={slideUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {children}
      </m.section>
    </LazyMotion>
  );
}
