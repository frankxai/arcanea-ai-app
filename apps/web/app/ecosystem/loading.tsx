import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

export default function EcosystemLoading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(0,188,212,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(13,71,161,0.08),transparent_55%)]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Skeleton */}
        <section className="mb-16">
          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl px-8 py-14 sm:px-14 sm:py-20">
            <Skeleton variant="rect" className="w-40 h-8 rounded-full mb-8" />
            <Skeleton variant="text" className="w-72 h-12 mb-3" />
            <Skeleton variant="text" className="w-56 h-12 mb-3" />
            <Skeleton variant="text" className="w-64 h-12 mb-8" />
            <SkeletonText lines={3} className="max-w-2xl mb-10" />
            <div className="flex gap-4">
              <Skeleton variant="rect" className="w-56 h-12 rounded-xl" />
              <Skeleton variant="rect" className="w-40 h-12 rounded-xl" />
            </div>
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="mb-16">
          <Skeleton variant="text" className="w-24 h-3 mb-2" />
          <Skeleton variant="text" className="w-48 h-8 mb-10" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl p-7"
              >
                <div className="flex items-start justify-between mb-5">
                  <Skeleton variant="rect" className="w-12 h-12 rounded-xl" />
                  <Skeleton variant="rect" className="w-24 h-6 rounded-full" />
                </div>
                <Skeleton variant="text" className="w-28 h-3 mb-2" />
                <Skeleton variant="text" className="w-40 h-6 mb-4" />
                <SkeletonText lines={3} className="mb-6" />
                <Skeleton variant="text" className="w-24 h-4" />
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Skeleton */}
        <section className="mb-16">
          <Skeleton variant="text" className="w-32 h-3 mb-2" />
          <Skeleton variant="text" className="w-64 h-8 mb-10" />

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl p-7"
              >
                <Skeleton variant="rect" className="w-10 h-10 rounded-xl mb-5" />
                <Skeleton variant="text" className="w-32 h-7 mb-3" />
                <SkeletonText lines={2} className="mb-5" />
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].slice(0, i + 1).map((j) => (
                    <Skeleton
                      key={j}
                      variant="rect"
                      className="w-24 h-7 rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
