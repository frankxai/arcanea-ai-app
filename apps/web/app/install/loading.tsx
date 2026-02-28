"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function InstallLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-deep" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,136,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.15),transparent_50%)]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/[0.04] bg-cosmic-deep/80 backdrop-blur-xl">
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

      <main className="max-w-7xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-32 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-80 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-full h-8 mx-auto mb-2" />
          <Skeleton variant="text" className="w-2/3 h-8 mx-auto mb-8" />
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <Skeleton
                  variant="rect"
                  className="w-12 h-12 rounded-xl mb-4"
                />
                <Skeleton variant="text" className="w-20 h-6 mb-2" />
                <Skeleton variant="text" className="w-full h-4 mb-4" />
                <Skeleton variant="rect" className="w-full h-10 rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <Skeleton
                  variant="rect"
                  className="w-8 h-8 rounded-full mb-4"
                />
                <Skeleton variant="text" className="w-24 h-6 mb-2" />
                <Skeleton variant="text" className="w-full h-4 mb-4" />
                <Skeleton variant="rect" className="w-full h-8 rounded-lg" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
