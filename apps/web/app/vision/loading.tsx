"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function VisionLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(0,188,212,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(255,215,0,0.1),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Skeleton */}
        <section className="pt-20 pb-16 text-center">
          <Skeleton variant="rect" className="w-32 h-8 rounded-full mx-auto mb-8" />
          <Skeleton variant="text" className="w-64 h-12 mx-auto mb-3" />
          <Skeleton variant="text" className="w-48 h-12 mx-auto mb-6" />
          <SkeletonText lines={2} className="max-w-3xl mx-auto mb-8" />
          <Skeleton variant="text" className="w-96 h-4 mx-auto" />
        </section>

        {/* Six Layers Grid Skeleton */}
        <section className="py-20">
          <div className="text-center mb-14">
            <Skeleton variant="text" className="w-72 h-10 mx-auto mb-4" />
            <SkeletonText lines={2} className="max-w-2xl mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl"
              >
                <Skeleton variant="rect" className="w-12 h-12 rounded-xl mb-4" />
                <Skeleton variant="text" className="w-32 h-6 mb-2" />
                <SkeletonText lines={3} />
              </div>
            ))}
          </div>
        </section>

        {/* Creator Journey Skeleton */}
        <section className="py-20">
          <div className="text-center mb-14">
            <Skeleton variant="text" className="w-64 h-10 mx-auto mb-4" />
            <SkeletonText lines={1} className="max-w-md mx-auto" />
          </div>

          <div className="hidden lg:flex items-start justify-between gap-2 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center text-center min-w-[140px]">
                <Skeleton variant="rect" className="w-10 h-10 rounded-full mb-3" />
                <Skeleton variant="text" className="w-20 h-4 mb-1" />
                <Skeleton variant="text" className="w-36 h-3" />
              </div>
            ))}
          </div>

          <div className="lg:hidden space-y-4 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06]"
              >
                <Skeleton variant="rect" className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton variant="text" className="w-20 h-4 mb-1" />
                  <Skeleton variant="text" className="w-full h-3" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Source Section Skeleton */}
        <section className="py-20">
          <div className="p-10 md:p-14 rounded-3xl border border-white/[0.06] bg-white/[0.02]">
            <div className="max-w-3xl mx-auto text-center">
              <Skeleton variant="rect" className="w-32 h-7 rounded-full mx-auto mb-6" />
              <Skeleton variant="text" className="w-64 h-10 mx-auto mb-8" />

              <div className="grid grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <Skeleton variant="text" className="w-12 h-8 mx-auto mb-1" />
                    <Skeleton variant="text" className="w-16 h-3 mx-auto" />
                  </div>
                ))}
              </div>

              <SkeletonText lines={3} className="mb-4" />
              <Skeleton variant="text" className="w-3/4 h-4 mx-auto" />
            </div>
          </div>
        </section>

        {/* Guardians Grid Skeleton */}
        <section className="py-20">
          <div className="text-center mb-14">
            <Skeleton variant="text" className="w-72 h-10 mx-auto mb-4" />
            <SkeletonText lines={2} className="max-w-2xl mx-auto" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-white/[0.06] text-center"
              >
                <Skeleton variant="text" className="w-20 h-4 mx-auto mb-1" />
                <Skeleton variant="text" className="w-16 h-3 mx-auto mb-2" />
                <Skeleton variant="text" className="w-full h-3 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Skeleton */}
        <section className="py-20 pb-28">
          <div className="p-10 md:p-16 rounded-3xl border border-white/[0.06] bg-white/[0.02] text-center">
            <Skeleton variant="text" className="w-72 h-12 mx-auto mb-4" />
            <SkeletonText lines={2} className="max-w-xl mx-auto mb-10" />
            <div className="flex flex-wrap justify-center gap-4">
              <Skeleton variant="rect" className="w-40 h-12 rounded-xl" />
              <Skeleton variant="rect" className="w-44 h-12 rounded-xl" />
              <Skeleton variant="rect" className="w-40 h-12 rounded-xl" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
