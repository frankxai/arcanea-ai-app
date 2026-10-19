"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useIdleReady } from "./idle-mount";

// Site-wide extras that nothing in the first viewport depends on. Their code
// is only requested after load + idle, so it stays out of the critical path.
const GlobalGlowTracker = dynamic(
  () =>
    import("@/components/ui/global-glow-tracker").then(
      (mod) => mod.GlobalGlowTracker,
    ),
  { ssr: false },
);
const LuminaBubble = dynamic(
  () =>
    import("@/components/lumina/lumina-bubble").then((mod) => mod.LuminaBubble),
  { ssr: false },
);
const CommandPalette = dynamic(
  () =>
    import("@/components/command-palette").then((mod) => mod.CommandPalette),
  { ssr: false },
);

// The glow only makes sense with a real pointer. It is never loaded on touch
// screens, on phones (< 768px) or when the user prefers reduced motion.
const GLOW_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribeGlowQuery(onChange: () => void) {
  const mql = window.matchMedia(GLOW_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function DeferredGlowTracker() {
  const ready = useIdleReady();
  const allowed = useSyncExternalStore(
    subscribeGlowQuery,
    () => window.matchMedia(GLOW_QUERY).matches,
    () => false,
  );

  return ready && allowed ? <GlobalGlowTracker /> : null;
}

export function DeferredOverlays() {
  const idle = useIdleReady();
  const [openedByKey, setOpenedByKey] = useState(false);
  const mounted = idle || openedByKey;

  // Until the palette has loaded, a tiny listener keeps Cmd/Ctrl+K working:
  // the first press loads the palette and opens it straight away.
  useEffect(() => {
    if (mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenedByKey(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mounted]);

  if (!mounted) return null;
  return (
    <>
      {/* Fixed bottom-right, out of the layout flow: mounting it later
          cannot shift any content. */}
      <LuminaBubble />
      <CommandPalette initialOpen={openedByKey} />
    </>
  );
}

/**
 * The CSS background (gradient blobs and noise) is texture on top of the
 * server-rendered base colour and fallback gradient. It is mounted after idle
 * and fades in over 300ms (opacity only); with reduced motion it appears at
 * its final state with no transition.
 */
export function DeferredBackground({
  fallback,
  children,
}: {
  fallback: ReactNode;
  children: ReactNode;
}) {
  const ready = useIdleReady();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // Two frames so the layer is painted at opacity 0 before it fades in.
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setShown(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [ready]);

  return (
    <>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
          shown ? "opacity-0" : "opacity-100"
        }`}
      >
        {fallback}
      </div>
      {ready && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 -z-10 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            shown ? "opacity-100" : "opacity-0"
          }`}
        >
          {children}
        </div>
      )}
    </>
  );
}
