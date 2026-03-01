"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function ChangelogLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-4xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-32 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-72 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-full h-8 mx-auto mb-2" />
          <Skeleton variant="text" className="w-2/3 h-8 mx-auto mb-8" />
        </section>

        <section className="py-16">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton variant="rect" className="w-16 h-6 rounded-full" />
                  <Skeleton variant="text" className="w-20 h-4" />
                </div>
                <Skeleton variant="text" className="w-3/4 h-6 mb-2" />
                <Skeleton variant="text" className="w-full h-4 mb-4" />
                <div className="space-y-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} variant="text" className="w-full h-4" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 border-t border-white/[0.04]">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/[0.06] liquid-glass text-center"
              >
                <Skeleton variant="text" className="w-12 h-8 mx-auto mb-1" />
                <Skeleton variant="text" className="w-16 h-4 mx-auto" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
