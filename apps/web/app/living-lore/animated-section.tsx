/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
