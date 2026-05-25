/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Motion utilities for respecting user preferences
 * WCAG 2.3.3 - Animation from Interactions
 */

/**
 * Returns animation variants that respect prefers-reduced-motion
 */
export function getMotionVariants(variants: Record<string, any>) {
  if (typeof window === 'undefined') return variants;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Return simplified variants without motion
    const reduced: Record<string, any> = {};
    Object.keys(variants).forEach(key => {
      reduced[key] = { opacity: variants[key].opacity ?? 1 };
    });
    return reduced;
  }

  return variants;
}

/**
 * Returns transition config that respects prefers-reduced-motion
 */
export function getMotionTransition(transition: any) {
  if (typeof window === 'undefined') return transition;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return { duration: 0.01 };
  }

  return transition;
}

/**
 * Hook to check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
