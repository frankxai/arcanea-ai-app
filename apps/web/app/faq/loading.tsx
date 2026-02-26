"use client";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function FAQLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_left,rgba(127,255,212,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/5 bg-cosmic-deep/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="rect" className="w-10 h-10 rounded-xl" />
              <Skeleton variant="text" className="w-24 h-6" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Skeleton variant="text" className="w-16 h-4" />
              <Skeleton variant="text" className="w-16 h-4" />
              <Skeleton variant="rect" className="w-32 h-9 rounded-lg" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-48 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-80 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-full h-8 mx-auto mb-2" />
          <Skeleton variant="text" className="w-2/3 h-8 mx-auto mb-8" />
        </section>

        <section className="py-8">
          <Skeleton variant="rect" className="w-full h-14 rounded-2xl" />
        </section>

        <div className="space-y-16 py-8">
          {[1, 2, 3, 4].map((category) => (
            <section key={category}>
              <div className="flex items-center gap-3 mb-8">
                <Skeleton variant="rect" className="w-8 h-8 rounded-lg" />
                <Skeleton variant="text" className="w-32 h-6" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((faq) => (
                  <div
                    key={faq}
                    className="p-6 rounded-2xl border border-white/10 bg-cosmic-surface/30"
                  >
                    <Skeleton variant="text" className="w-3/4 h-5" />
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
