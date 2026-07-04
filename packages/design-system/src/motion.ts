import type { Variants, Transition } from 'framer-motion';
import { easings, durations } from './tokens.js';

export const transitions = {
  base: { duration: durations.base, ease: easings.expoOut } satisfies Transition,
  fast: { duration: durations.fast, ease: easings.swift } satisfies Transition,
  slow: { duration: durations.slow, ease: easings.expoOut } satisfies Transition,
  spring: { type: 'spring', stiffness: 260, damping: 22 } satisfies Transition,
  magnetic: {
    duration: durations.base,
    ease: easings.magnetic,
  } satisfies Transition,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.base },
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transitions.base },
};

export const revealDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  show: { opacity: 1, y: 0, transition: transitions.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: transitions.base },
};

export const staggerContainer = (delayChildren = 0, staggerChildren = 0.06): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren, staggerChildren },
  },
});

export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: durations.slow, ease: easings.expoOut },
  },
};

export const scrollFade: Variants = {
  offscreen: { opacity: 0, y: 40 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easings.expoOut },
  },
};

export const buttonHover = {
  scale: 1.02,
  transition: transitions.fast,
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const magneticHover = (intensity = 1) => ({
  whileHover: { scale: 1 + 0.03 * intensity, transition: transitions.magnetic },
  whileTap: { scale: 1 - 0.02 * intensity, transition: transitions.fast },
});
