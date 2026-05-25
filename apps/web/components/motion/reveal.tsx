/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { LazyMotion, domAnimation, m, type Variants } from 'framer-motion';
import { EASE, VIEWPORT } from '@/lib/motion';

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  as?: 'div' | 'section' | 'article' | 'span';
}

/**
 * Scroll-triggered reveal with blur-to-focus and upward motion.
 * Fires once when entering viewport with -80px margin.
 */
export function Reveal({ children, className = '', delay = 0, y = 24, blur = true, as = 'div' }: Props) {
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y,
      filter: blur ? 'blur(12px)' : 'blur(0px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: EASE.smooth, delay },
    },
  };

  const Component = as === 'section' ? m.section : as === 'article' ? m.article : as === 'span' ? m.span : m.div;

  return (
    <LazyMotion features={domAnimation}>
      <Component
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={variants}
      >
        {children}
      </Component>
    </LazyMotion>
  );
}

/**
 * Parent that staggers children reveals. Children should use Reveal or motion components.
 */
export function StaggerReveal({ children, className = '', stagger = 0.08, delay = 0.15 }: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={variants}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
