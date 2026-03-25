'use client';

import { useCallback, useRef } from 'react';

/**
 * Lightweight hook for tracking bonds during chat sessions.
 *
 * Tracks when a user has been chatting with a crew member and sends
 * a bond update after a 30-second inactivity period (session end).
 *
 * Usage: call `trackMessage()` each time the user sends a message.
 * The hook will automatically debounce and POST to the bonds API.
 */
export function useBondTracker(crewMemberId: string) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageCountRef = useRef(0);
  const hasFlushedRef = useRef(false);

  const flush = useCallback(async () => {
    if (hasFlushedRef.current || messageCountRef.current === 0) return;
    hasFlushedRef.current = true;

    try {
      await fetch('/api/living-lore/bonds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crewMemberId,
          interactionType: 'chat',
        }),
      });
    } catch {
      // Silently fail — bond tracking is non-critical
    }
  }, [crewMemberId]);

  const trackMessage = useCallback(() => {
    messageCountRef.current += 1;

    // Reset the debounce timer on each new message
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // After 30 seconds of silence, flush the bond update
    timerRef.current = setTimeout(() => {
      flush();
    }, 30_000);

    // Reset flushed state so a new session can trigger another update
    hasFlushedRef.current = false;
  }, [flush]);

  return { trackMessage };
}
