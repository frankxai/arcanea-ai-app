"use client";

import dynamic from "next/dynamic";

const GlobalGlowTracker = dynamic(
  () => import("@/components/ui/global-glow-tracker").then((m) => m.GlobalGlowTracker),
  { ssr: false },
);

export function GlobalGlowTrackerLazy() {
  return <GlobalGlowTracker />;
}
