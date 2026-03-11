/**
 * Arcanea Motion System v2.0
 *
 * Codified durations, M3 spatial curves, spring physics presets,
 * and stagger configs. All values respect prefers-reduced-motion
 * when consumed through the helper functions below.
 *
 * Inspired by Material Design 3 + Apple HIG guidelines.
 */

import type { Transition, Variants } from 'framer-motion';

/* ----------------------------------------------------------------
   DURATIONS — Named tiers (seconds)
   ---------------------------------------------------------------- */
export const durations = {
  instant: 0.1,   // 100ms — micro-interactions, toggles
  fast: 0.2,      // 200ms — hover states, small feedback
  normal: 0.35,   // 350ms — component animations (DEFAULT)
  slow: 0.5,      // 500ms — page section reveals
  slowest: 0.7,   // 700ms — hero entrances, dramatic moments
} as const;

/* ----------------------------------------------------------------
   M3 SPATIAL CURVES — Material Design 3 easing
   ---------------------------------------------------------------- */
export const m3Curves = {
  /** Elements entering the screen */
  emphasized: [0.2, 0, 0, 1] as const,
  /** Arrival / deceleration phase */
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  /** Exit / acceleration phase */
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
  /** General-purpose component animation */
  standard: [0.2, 0, 0, 1] as const,
  /** Standard deceleration */
  standardDecelerate: [0, 0, 0, 1] as const,
  /** Standard acceleration */
  standardAccelerate: [0.3, 0, 1, 1] as const,
} as const;

/* ----------------------------------------------------------------
   SPRING PHYSICS — Named presets
   ---------------------------------------------------------------- */
export const springs = {
  /** Floating, gentle movement */
  gentle: { type: 'spring' as const, stiffness: 150, damping: 20, mass: 1 },
  /** Crisp UI feedback */
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8 },
  /** Playful brand moments */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 15, mass: 0.9 },
  /** Heavy modals, panels */
  heavy: { type: 'spring' as const, stiffness: 100, damping: 25, mass: 1.2 },
  /** Drag / swipe interactions */
  interactive: { type: 'spring' as const, stiffness: 500, damping: 35, mass: 0.7 },
  /** List reordering */
  fluid: { type: 'spring' as const, stiffness: 200, damping: 22, mass: 1 },
} as const;

/* ----------------------------------------------------------------
   STAGGER CONFIGS — For orchestrating child animations
   ---------------------------------------------------------------- */
export const staggers = {
  fast: { staggerChildren: 0.04, delayChildren: 0.05 },
  normal: { staggerChildren: 0.07, delayChildren: 0.1 },
  slow: { staggerChildren: 0.12, delayChildren: 0.15 },
  dramatic: { staggerChildren: 0.18, delayChildren: 0.2 },
} as const;

/* ----------------------------------------------------------------
   TRANSITION PRESETS — Drop-in transition objects
   ---------------------------------------------------------------- */
export const transitions = {
  /** Default smooth transition */
  smooth: {
    duration: durations.normal,
    ease: m3Curves.emphasized,
  } satisfies Transition,

  /** Quick UI feedback */
  snappy: {
    duration: durations.fast,
    ease: m3Curves.standard,
  } satisfies Transition,

  /** Entrance animation */
  enter: {
    duration: durations.slow,
    ease: m3Curves.emphasizedDecelerate,
  } satisfies Transition,

  /** Exit animation */
  exit: {
    duration: durations.fast,
    ease: m3Curves.emphasizedAccelerate,
  } satisfies Transition,

  /** Hero / dramatic reveal */
  hero: {
    duration: durations.slowest,
    ease: m3Curves.emphasized,
  } satisfies Transition,

  /** Spring-based default */
  spring: springs.snappy,

  /** Bouncy spring */
  springBouncy: springs.bouncy,
} as const;

/* ----------------------------------------------------------------
   VARIANT PRESETS — Common animation patterns
   ---------------------------------------------------------------- */

/** Fade + scale in */
export const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.smooth,
  },
};

/** Slide up + fade in */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
  },
};

/** Stagger container (use with staggers.* config) */
export const staggerContainer = (
  speed: keyof typeof staggers = 'normal'
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: staggers[speed],
  },
});

/** Stagger child item */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

/* ----------------------------------------------------------------
   HOVER / TAP PRESETS — For interactive elements
   ---------------------------------------------------------------- */
export const hoverPresets = {
  /** Subtle lift */
  lift: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: springs.snappy,
  },
  /** Button press */
  press: {
    whileHover: { scale: 1.03, y: -1 },
    whileTap: { scale: 0.97 },
    transition: springs.interactive,
  },
  /** Card hover */
  card: {
    whileHover: { scale: 1.01, y: -4 },
    whileTap: { scale: 0.99 },
    transition: springs.gentle,
  },
  /** No motion (reduced-motion fallback) */
  none: {
    whileHover: {},
    whileTap: {},
    transition: { duration: 0 },
  },
} as const;
