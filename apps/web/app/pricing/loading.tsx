"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,188,212,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-48 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-96 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-full h-8 mx-auto mb-2" />
          <Skeleton variant="text" className="w-3/4 h-8 mx-auto mb-8" />
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <Skeleton variant="text" className="w-24 h-6 mb-2" />
                <Skeleton variant="text" className="w-16 h-10 mb-2" />
                <Skeleton variant="text" className="w-full h-4 mb-4" />
                <div className="space-y-3 mb-8">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} variant="text" className="w-full h-4" />
                  ))}
                </div>
                <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
