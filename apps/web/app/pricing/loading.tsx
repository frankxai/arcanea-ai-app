"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#09090b]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top,rgba(13,71,161,0.25),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(0,188,212,0.15),transparent_50%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        <section className="pt-20 pb-16 text-center">
          <Skeleton
            variant="rect"
            className="w-52 h-8 rounded-full mx-auto mb-8"
          />
          <Skeleton variant="text" className="w-96 h-12 mx-auto mb-4" />
          <Skeleton variant="text" className="w-full max-w-lg h-8 mx-auto mb-2" />
          <Skeleton variant="text" className="w-3/4 max-w-md h-6 mx-auto mb-8" />
        </section>

        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/[0.06] liquid-glass"
              >
                <Skeleton variant="text" className="w-20 h-4 mb-2" />
                <Skeleton variant="text" className="w-28 h-7 mb-2" />
                <Skeleton variant="text" className="w-20 h-10 mb-2" />
                <Skeleton variant="text" className="w-full h-4 mb-6" />
                {i === 2 && (
                  <div className="space-y-2 mb-6">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} variant="rect" className="w-full h-14 rounded-xl" />
                    ))}
                  </div>
                )}
                <div className="space-y-3 mb-8">
                  {Array.from({ length: i === 3 ? 7 : 5 }).map((_, j) => (
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
