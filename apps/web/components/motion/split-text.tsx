/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { LazyMotion, domAnimation, m, useReducedMotion, type Easing } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EASE } from '@/lib/motion';

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

/**
 * Character-by-character reveal with custom easing.
 * Fails open: text is visible on first paint (opacity: 1), motion refines after.
 * Respects prefers-reduced-motion by skipping character animation entirely.
 */
export function SplitText({ text, className = '', delay = 0, stagger = 0.03, as = 'span' }: Props) {
  const chars = text.split('');
  const Tag: 'h1' | 'h2' | 'h3' | 'p' | 'span' = as;

  // Gate reduced-motion behind mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const prefersReduced = useReducedMotion() && mounted;

  // Reduced motion: render plain text, no animation
  if (prefersReduced) {
    return (
      <LazyMotion features={domAnimation}>
        <Tag className={className}>{text}</Tag>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <Tag className={className} aria-label={text}>
        {chars.map((char, i) => {
          // framer-motion v12 has strict HTMLMotionProps inference — cast span
          // to the element itself to bypass the Omit<..., "ref"> check.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const MSpan = m.span as any;
          return (
            <MSpan
              key={i}
              aria-hidden="true"
              initial={{ opacity: 1, y: '0.3em', filter: 'blur(0px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                ease: EASE.smooth as Easing,
                delay: delay + i * stagger,
              }}
              style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
              {char}
            </MSpan>
          );
        })}
      </Tag>
    </LazyMotion>
  );
}
