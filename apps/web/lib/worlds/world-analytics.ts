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
