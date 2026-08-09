import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const arcEases = {
  expoOut: 'expo.out',
  swift: 'power3.out',
  magnetic: 'back.out(1.7)',
  none: 'none',
} as const;

interface RevealOptions {
  y?: number;
  opacity?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  start?: string;
  end?: string;
  toggleActions?: string;
}

export function revealOnScroll(
  targets: string | HTMLElement | HTMLElement[],
  options: RevealOptions = {}
): gsap.core.Tween[] {
  const {
    y = 32,
    opacity = 0,
    duration = 0.6,
    ease = arcEases.swift,
    stagger = 0,
    start = 'top 88%',
    end = 'top 40%',
    toggleActions = 'play none none reverse',
  } = options;

  const elements = gsap.utils.toArray<HTMLElement>(targets);
  if (!elements.length) return [];

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
        toggleActions,
      },
    })
  );
}

export { gsap, ScrollTrigger, useGSAP };
