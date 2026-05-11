/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Arcanean Library Exports
 * Central export file for utilities and animations
 */

// Utilities
export { cn, formatDate, truncate, debounce, generateId } from './utils';

// Theme Utilities
export {
  getAcademyTheme,
  applyAcademyTheme,
  getCurrentAcademyTheme,
  interpolateColor,
  isBreakpoint,
  getCurrentBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  getAcademyClasses,
  prefersReducedMotion,
  getAnimationClass,
  ACADEMY_THEMES,
  BREAKPOINTS,
} from './theme-utils';
export type { Academy, AcademyTheme, Breakpoint } from './theme-utils';

// Animations
export {
  // Cosmic
  cosmicFadeIn,
  cosmicSlideUp,
  cosmicGlow,
  shimmerEffect,
  // Atlantean
  atlanteanFlow,
  atlanteanRipple,
  atlanteanWave,
  // Draconic
  draconicFlame,
  draconicSoar,
  draconicEmber,
  // Creation
  creationPrism,
  creationRadialPulse,
  creationFrequency,
  // Containers
  staggerContainer,
  staggerItem,
  // Success/Error
  successPulse,
  errorShake,
  // Loading
  magicalSpinner,
  pulseLoader,
  // Modal
  modalBackdrop,
  modalContent,
  // Transitions
  transitions,
  // Utilities
  getStaggerDelay,
  getAcademyAnimation,
  // Particles
  defaultParticleConfig,
  atlanteanParticles,
  draconicParticles,
  creationParticles,
} from './animations';
export type { ParticleConfig } from './animations';
