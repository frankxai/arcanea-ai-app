"use client";

import Link from "next/link";
import { Warning, ArrowCounterClockwise, Globe } from "@/lib/phosphor-icons";

export default function AtlasError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] text-white flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center space-y-6 bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Warning className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-medium tracking-tight">
            Corridor Resonance Desynchronized
          </h2>
          <p className="text-sm text-white/60">
            The multiverse cartography matrix encountered an unexpected acoustic
            rift.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors"
          >
            <ArrowCounterClockwise className="w-4 h-4" />
            Recalibrate
          </button>
          <Link
            href="/lore"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-sm font-medium transition-colors text-white/80"
          >
            <Globe className="w-4 h-4" />
            Return to Lore
          </Link>
        </div>
      </div>
    </div>
  );
}
