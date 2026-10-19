"use client";

import { useEffect, useState } from "react";

/**
 * True once the page has loaded and the browser has had an idle moment
 * (requestIdleCallback, with a timeout so it always fires). Used to keep
 * non-critical, site-wide UI out of the work that runs before the first
 * content paints.
 */
export function useIdleReady(timeoutMs = 2000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timerId: number | undefined;

    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => setReady(true), {
          timeout: timeoutMs,
        });
      } else {
        timerId = window.setTimeout(() => setReady(true), 200);
      }
    };

    if (document.readyState === "complete") {
      schedule();
    } else {
      window.addEventListener("load", schedule, { once: true });
    }

    return () => {
      window.removeEventListener("load", schedule);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [timeoutMs]);

  return ready;
}
