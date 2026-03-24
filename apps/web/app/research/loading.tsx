"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function ResearchLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0b0e14]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(127,255,212,0.06),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(120,166,255,0.04),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Hero Skeleton */}
        <section className="mb-20">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm px-8 py-16 sm:px-14 sm:py-20">
            <Skeleton variant="rect" className="w-48 h-8 rounded-full mb-8" />
            <Skeleton variant="text" className="w-80 h-12 mb-3" />
            <Skeleton variant="text" className="w-64 h-12 mb-8" />
            <SkeletonText lines={3} className="max-w-2xl mb-10" />

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mb-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton variant="text" className="w-12 h-8 mb-1" />
                  <Skeleton variant="text" className="w-20 h-3" />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Skeleton variant="rect" className="w-44 h-12 rounded-xl" />
              <Skeleton variant="rect" className="w-40 h-12 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Repos Grid Skeleton */}
        <section className="mb-20">
          <Skeleton variant="text" className="w-24 h-3 mb-2" />
          <Skeleton variant="text" className="w-40 h-8 mb-2" />
          <Skeleton variant="text" className="w-64 h-4 mb-10" />

          {[1, 2, 3, 4].map((group) => (
            <div key={group} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <Skeleton variant="rect" className="w-2 h-2 rounded-full" />
                <Skeleton variant="text" className="w-24 h-4" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Skeleton variant="text" className="w-32 h-5" />
                      <Skeleton variant="rect" className="w-3.5 h-3.5" />
                    </div>
                    <SkeletonText lines={2} className="mb-4" />
                    <div className="flex items-center gap-4">
                      <Skeleton variant="text" className="w-20 h-3" />
                      <Skeleton variant="text" className="w-12 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Tech Stack Skeleton */}
        <section className="mb-20">
          <Skeleton variant="text" className="w-28 h-3 mb-2" />
          <Skeleton variant="text" className="w-48 h-8 mb-10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Skeleton variant="rect" className="w-2 h-2 rounded-full" />
                  <Skeleton variant="text" className="w-24 h-4" />
                </div>
                <Skeleton variant="text" className="w-full h-3" />
              </div>
            ))}
          </div>
        </section>

        {/* Intelligence Section Skeleton */}
        <section className="mb-20">
          <Skeleton variant="text" className="w-24 h-3 mb-2" />
          <Skeleton variant="text" className="w-40 h-8 mb-10" />

          <div className="grid sm:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton variant="rect" className="w-10 h-10 rounded-xl" />
                  <Skeleton variant="text" className="w-32 h-6" />
                </div>
                <SkeletonText lines={3} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
