"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ArchitectureLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton variant="text" className="w-64 h-10 mb-3" />
          <Skeleton variant="text" className="w-96 h-5" />
        </div>

        {/* Tabs Skeleton */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              variant="rect"
              className="w-32 h-9 rounded-lg flex-shrink-0"
            />
          ))}
        </div>

        {/* Graph Area Skeleton */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl overflow-hidden">
          <Skeleton variant="rect" className="w-full h-[600px]" />
        </div>

        {/* Legend Skeleton */}
        <div className="mt-6 flex flex-wrap gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton variant="rect" className="w-3 h-3 rounded-full" />
              <Skeleton variant="text" className="w-24 h-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
