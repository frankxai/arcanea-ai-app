"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function LuminorsLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,rgba(13,71,161,0.2),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(0,188,212,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Skeleton */}
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-48 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-80 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-96 h-8 mx-auto mb-12" />

          {/* Team Quick Nav Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                variant="rect"
                className="w-36 h-10 rounded-lg"
              />
            ))}
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <SkeletonText lines={4} />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl border border-white/[0.06] liquid-glass"
                >
                  <Skeleton variant="text" className="w-12 h-8 mx-auto mb-1" />
                  <Skeleton variant="text" className="w-16 h-3 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Teams Skeleton */}
        {["dev", "creative", "writing", "research"].map((team) => (
          <section key={team} className="py-16 border-t border-white/[0.04]">
            <div className="flex items-center gap-4 mb-12">
              <Skeleton variant="rect" className="w-14 h-14 rounded-2xl" />
              <div>
                <Skeleton variant="text" className="w-40 h-6 mb-1" />
                <Skeleton variant="text" className="w-64 h-4" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/[0.06] liquid-glass"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Skeleton variant="text" className="w-32 h-6 mb-2" />
                      <Skeleton variant="text" className="w-24 h-3" />
                    </div>
                    <Skeleton variant="rect" className="w-10 h-10 rounded-xl" />
                  </div>
                  <SkeletonText lines={2} className="mb-4" />
                  <Skeleton
                    variant="rect"
                    className="w-full h-8 rounded-lg mb-4"
                  />
                  <Skeleton variant="text" className="w-3/4 h-4" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
