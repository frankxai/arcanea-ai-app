/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * World Analytics — Track views, engagement, and discovery metrics.
 * Lightweight client-side tracking that writes to Supabase.
 */

/**
 * Record a world view. Call from the detail page on mount.
 * Uses navigator.sendBeacon for non-blocking fire-and-forget.
 */
export function trackWorldView(worldId: string) {
  if (typeof navigator === 'undefined') return;

  try {
    navigator.sendBeacon(
      '/api/worlds/track',
      JSON.stringify({ worldId, event: 'view' })
    );
  } catch {
    // Silent — analytics should never break UX
  }
}

/**
 * Record a world interaction (star, fork, character chat).
 */
export function trackWorldInteraction(worldId: string, action: 'star' | 'fork' | 'chat' | 'generate') {
  if (typeof navigator === 'undefined') return;

  try {
    navigator.sendBeacon(
      '/api/worlds/track',
      JSON.stringify({ worldId, event: action })
    );
  } catch {
    // Silent
  }
}
