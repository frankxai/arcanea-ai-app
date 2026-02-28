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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-32 h-8" />
              <div className="h-14 bg-white/10 rounded-lg w-3/4" />
              <div className="h-6 bg-white/10 rounded-lg w-1/2" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-white/10 rounded-xl w-28" />
                <div className="h-12 bg-white/10 rounded-xl w-28" />
              </div>
            </div>
          </div>
        </section>

        {/* Templates Skeleton */}
        <section className="py-8 border-t border-white/5">
          <div className="h-5 bg-white/10 rounded w-32 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-5 animate-pulse">
                <div className="w-10 h-10 bg-white/10 rounded-xl mb-4" />
                <div className="h-5 bg-white/10 rounded w-24 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* World Elements Skeleton */}
        <section className="py-8 border-t border-white/5">
          <div className="h-5 bg-white/10 rounded w-36 mb-6" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-xl mb-4" />
                <div className="h-5 bg-white/10 rounded w-24 mb-2" />
                <div className="h-3 bg-white/10 rounded w-full mb-3" />
                <div className="flex gap-1.5">
                  <div className="h-5 bg-white/10 rounded w-12" />
                  <div className="h-5 bg-white/10 rounded w-12" />
                  <div className="h-5 bg-white/10 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Worlds Skeleton */}
        <section className="py-8 border-t border-white/5 pb-16">
          <div className="h-5 bg-white/10 rounded w-36 mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="w-3 h-3 bg-white/10 rounded-full" />
                  <div className="h-3 bg-white/10 rounded w-16" />
                </div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/10 rounded w-20 mb-3" />
                <div className="h-4 bg-white/10 rounded w-full mb-4" />
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <div className="h-3 bg-white/10 rounded w-12" />
                  <div className="h-4 bg-white/10 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
