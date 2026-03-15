export default function Loading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Skeleton */}
        <section className="pt-20 pb-12 lg:pt-28 lg:pb-16">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="animate-pulse space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.04] w-32 h-8" />
              <div className="h-14 bg-white/[0.06] rounded-lg w-3/4" />
              <div className="h-6 bg-white/[0.06] rounded-lg w-1/2" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-white/[0.06] rounded-xl w-32" />
                <div className="h-12 bg-white/[0.06] rounded-xl w-44" />
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Focus Skeleton */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/[0.06] rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-white/[0.06] rounded w-24 mb-2" />
                <div className="h-5 bg-white/[0.06] rounded w-3/4" />
                <div className="h-3 bg-white/[0.06] rounded w-1/2 mt-2" />
              </div>
              <div className="text-right">
                <div className="h-6 bg-white/[0.06] rounded w-12" />
                <div className="h-3 bg-white/[0.06] rounded w-16 mt-2" />
              </div>
            </div>
          </div>
        </section>

        {/* Goals & Milestones Skeleton */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-white/[0.06] rounded w-32 mb-6" />
                <div className="space-y-4">
                  <div>
                    <div className="h-4 bg-white/[0.06] rounded w-3/4 mb-2" />
                    <div className="h-1.5 bg-white/[0.06] rounded-full w-full" />
                  </div>
                  <div>
                    <div className="h-4 bg-white/[0.06] rounded w-2/3 mb-2" />
                    <div className="h-1.5 bg-white/[0.06] rounded-full w-full" />
                  </div>
                  <div>
                    <div className="h-4 bg-white/[0.06] rounded w-1/2 mb-2" />
                    <div className="h-1.5 bg-white/[0.06] rounded-full w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creative Areas Skeleton */}
        <section className="py-8 border-t border-white/[0.04]">
          <div className="h-5 bg-white/[0.06] rounded w-40 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/[0.06] rounded-xl" />
                  <div>
                    <div className="h-4 bg-white/[0.06] rounded w-20 mb-1" />
                    <div className="h-3 bg-white/[0.06] rounded w-28" />
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Achievements Skeleton */}
        <section className="py-8 border-t border-white/[0.04] pb-16">
          <div className="h-5 bg-white/[0.06] rounded w-32 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-5 animate-pulse">
                <div className="w-12 h-12 bg-white/[0.06] rounded-xl mx-auto mb-3" />
                <div className="h-4 bg-white/[0.06] rounded w-24 mx-auto mb-2" />
                <div className="h-3 bg-white/[0.06] rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
