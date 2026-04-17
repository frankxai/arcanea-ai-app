'use client';

import { LazyMotion, domAnimation, m, type Easing } from 'framer-motion';
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
        {chars.map((char, i) => {
          // framer-motion v12 has strict HTMLMotionProps inference — cast span
          // to the element itself to bypass the Omit<..., "ref"> check.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const MSpan = m.span as any;
          return (
            <MSpan
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: '0.4em', filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.5,
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
