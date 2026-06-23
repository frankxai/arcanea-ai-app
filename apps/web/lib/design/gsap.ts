/**
 * Arcanea GSAP foundation — the surgical-cinematic companion to
 * `lib/design/motion.ts` (Framer Motion).
 *
 * Doctrine: Framer Motion stays the site-wide default — declarative,
 * component-scoped, SSR-safe, and the React-native choice for the ~280
 * surfaces that already use it. GSAP is reserved for the handful of
 * scroll-driven cinematic moments where ScrollTrigger genuinely beats
 * Framer's `useScroll`: long pinned / scrubbed sequences and per-element
 * scroll reveals. Two runtimes is a deliberate, bounded trade — not a
 * migration.
 *
 * Every helper here is reduced-motion-safe BY CONSTRUCTION. Under
 * `prefers-reduced-motion: reduce` the target jumps straight to its final,
 * visible resting state with NO tween and NO ScrollTrigger — it is never
 * left at `opacity: 0` waiting for a scroll an assistive-tech user may never
 * perform. Animate only as an enhancement on top of content that is already
 * legible.
 *
 * Easing tokens mirror the cubic-béziers in `@arcanea/design-system` so GSAP
 * and Framer surfaces share one motion personality.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Idempotent plugin registration. Safe to call from every GSAP component's
// module scope — only the first call does work, and only in the browser.
let registered = false;
export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Imperative reduced-motion check, callable inside a `useGSAP` effect.
 * (The app's `usePrefersReducedMotion` is a render-time hook; GSAP setup runs
 * in an effect, so it needs a plain function instead.)
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * GSAP string easings tuned to match the design-system cubic-bézier tokens,
 * so a GSAP reveal feels identical to a Framer `expoOut` reveal.
 */
export const arcEases = {
  expoOut: 'expo.out', //      ≈ tokens.easings.expoOut  [0.22, 1, 0.36, 1]
  swift: 'power3.out', //      ≈ tokens.easings.swift    [0.16, 1, 0.3, 1]
  magnetic: 'back.out(1.7)', // ≈ tokens.easings.magnetic [0.34, 1.56, 0.64, 1]
  none: 'none',
} as const;

export interface RevealOnScrollOptions {
  /** Starting vertical offset in px (animates to 0). */
  y?: number;
  /** Starting opacity (animates to 1). */
  opacity?: number;
  /** Tween duration in seconds (ignored when `scrub` is set). */
  duration?: number;
  /** GSAP easing string — use `arcEases.*`. */
  ease?: string;
  /** Per-element delay in seconds, applied as index * stagger. */
  stagger?: number;
  /** ScrollTrigger `start`. */
  start?: string;
  /** ScrollTrigger `end`. */
  end?: string;
  /** Link progress to scroll position (number = smoothing seconds). */
  scrub?: boolean | number;
  /** ScrollTrigger `toggleActions` (used only when not scrubbing). */
  toggleActions?: string;
  /** Play once and forget (disables reverse-on-scroll-up). */
  once?: boolean;
}

/**
 * Per-element scroll reveal. Each target animates FROM (`y`, `opacity`) to its
 * natural resting state as it enters the viewport. The resting state is the
 * element's real layout, so markup must NOT pre-hide targets with an
 * `opacity-0` class — that would defeat the reduced-motion / no-JS fallback.
 *
 * Call inside `useGSAP(() => revealOnScroll('.card', …), { scope: ref })`.
 *
 * @returns the created tweens (empty under reduced motion).
 */
export function revealOnScroll(
  targets: gsap.DOMTarget,
  {
    y = 32,
    opacity = 0,
    duration = 0.7,
    ease = arcEases.expoOut,
    stagger,
    start = 'top 85%',
    end = 'top 45%',
    scrub = false,
    toggleActions = 'play none none reverse',
    once = false,
  }: RevealOnScrollOptions = {},
): gsap.core.Tween[] {
  const elements = gsap.utils.toArray<HTMLElement>(targets);
  if (elements.length === 0) return [];

  // Reduced motion: jump straight to the visible resting state. No tween,
  // no ScrollTrigger, no chance of content stranded at opacity 0.
  if (prefersReducedMotion()) {
    gsap.set(elements, { clearProps: 'transform', opacity: 1, y: 0 });
    return [];
  }

  return elements.map((el, i) =>
    gsap.from(el, {
      opacity,
      y,
      duration,
      ease,
      delay: stagger ? i * stagger : 0,
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
        toggleActions: scrub ? undefined : toggleActions,
        once,
      },
    }),
  );
}

export { gsap, ScrollTrigger, useGSAP };
