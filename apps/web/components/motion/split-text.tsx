'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';
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
 * Each character animates in with a slight upward motion.
 */
export function SplitText({ text, className = '', delay = 0, stagger = 0.03, as = 'span' }: Props) {
  const chars = text.split('');
  const Tag: 'h1' | 'h2' | 'h3' | 'p' | 'span' = as;

  return (
    <LazyMotion features={domAnimation}>
      <Tag className={className} aria-label={text}>
        {chars.map((char, i) => (
          <m.span
            key={i}
            aria-hidden="true"
            initial={{ opacity: 0, y: '0.4em', filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.5,
              ease: EASE.smooth,
              delay: delay + i * stagger,
            }}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char}
          </m.span>
        ))}
      </Tag>
    </LazyMotion>
  );
}
