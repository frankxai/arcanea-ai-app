'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export interface ScrollSceneProps {
  children: ReactNode;
  /** Pin the scene while its timeline scrubs. One pinned scene per page, max. */
  pin?: boolean;
  /** Bind the timeline to scroll position. `true` = smooth catch-up (scrub: 1). */
  scrub?: boolean | number;
  /** ScrollTrigger start, e.g. "top top" or "top 80%". */
  start?: string;
  /** ScrollTrigger end, e.g. "+=120%" or "bottom top". */
  end?: string;
  className?: string;
  /**
   * Build the scene's timeline. Receives the GSAP timeline (already wired to the
   * ScrollTrigger) and the scoped root element. Query children off `root`.
   * For scrubbed tweens use `ease: 'none'` — the scroll IS the easing.
   */
  timeline?: (tl: gsap.core.Timeline, root: HTMLDivElement) => void;
}

/**
 * ScrollScene — a scoped GSAP ScrollTrigger timeline wrapper for scroll-driven
 * choreography (pinned sections, parallax, scrubbed media). `useGSAP` handles
 * cleanup (and pin teardown) automatically on unmount.
 *
 * No-op under `prefers-reduced-motion: reduce`: children render in their static
 * composition, which must already tell the story. See the `motion-system` skill.
 */
export function ScrollScene({
  children,
  pin = false,
  scrub = true,
  start = 'top top',
  end = '+=100%',
  className,
  timeline,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start,
          end,
          pin,
          scrub: scrub === true ? 1 : scrub,
        },
      });

      timeline?.(tl, root);
    },
    { scope: ref, dependencies: [pin, scrub, start, end] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
