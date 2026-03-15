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
        <section className="pt-20 pb-16 lg:pt-28 lg:pb-20">
          <div className="relative liquid-glass rounded-3xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20">
            <div className="animate-pulse space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.04] w-36 h-8" />
              <div className="h-14 bg-white/[0.06] rounded-lg w-3/4" />
              <div className="h-6 bg-white/[0.06] rounded-lg w-1/2" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-white/[0.06] rounded-xl w-40" />
                <div className="h-12 bg-white/[0.06] rounded-xl w-40" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Skeleton */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="h-4 bg-white/[0.06] rounded w-32 mb-10" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="h-10 bg-white/[0.06] rounded-lg w-16 mb-4" />
                <div className="w-10 h-10 bg-white/[0.06] rounded-xl mb-4" />
                <div className="h-6 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/[0.06] rounded w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Categories Skeleton */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="h-4 bg-white/[0.06] rounded w-40 mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-white/[0.06] rounded-xl mb-4" />
                <div className="h-5 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/[0.06] rounded w-full mb-2" />
                <div className="h-3 bg-white/[0.06] rounded w-20" />
              </div>
            ))}
          </div>
        </section>

        {/* Projects Skeleton */}
        <section className="py-12 border-t border-white/[0.04]">
          <div className="h-4 bg-white/[0.06] rounded w-48 mb-10" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-5 bg-white/[0.06] rounded w-20" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-white/[0.06] rounded w-8" />
                    <div className="h-4 bg-white/[0.06] rounded w-12" />
                  </div>
                </div>
                <div className="h-6 bg-white/[0.06] rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/[0.06] rounded w-full mb-2" />
                <div className="h-4 bg-white/[0.06] rounded w-2/3" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Skeleton */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="animate-pulse text-center mx-auto max-w-xl">
              <div className="w-8 h-8 bg-white/[0.06] rounded mx-auto mb-6" />
              <div className="h-8 bg-white/[0.06] rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-white/[0.06] rounded w-3/4 mx-auto mb-8" />
              <div className="h-12 bg-white/[0.06] rounded-xl w-40 mx-auto" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
