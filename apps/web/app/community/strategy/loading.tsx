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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-44 h-8" />
              <div className="h-14 bg-white/10 rounded-lg w-3/4" />
              <div className="h-6 bg-white/10 rounded-lg w-1/2" />
              <div className="flex gap-4 mt-8">
                <div className="h-12 bg-white/10 rounded-xl w-36" />
                <div className="h-12 bg-white/10 rounded-xl w-40" />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="py-8 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="liquid-glass rounded-xl p-4 animate-pulse">
                <div className="w-5 h-5 bg-white/10 rounded mx-auto mb-2" />
                <div className="h-6 bg-white/10 rounded w-12 mx-auto" />
                <div className="h-3 bg-white/10 rounded w-24 mx-auto mt-2" />
              </div>
            ))}
          </div>
        </section>

        {/* Proposals Skeleton */}
        <section className="py-12 border-t border-white/5">
          <div className="h-4 bg-white/10 rounded w-40 mb-10" />
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="flex gap-3">
                    <div className="h-5 bg-white/10 rounded w-16" />
                    <div className="h-5 bg-white/10 rounded w-20" />
                  </div>
                  <div className="h-4 bg-white/10 rounded w-16" />
                </div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/10 rounded w-full mb-4" />
                <div className="h-2 bg-white/10 rounded-full w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Roles Skeleton */}
        <section className="py-12 border-t border-white/5">
          <div className="h-4 bg-white/10 rounded w-40 mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-3d liquid-glass rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-xl mx-auto mb-4" />
                <div className="h-5 bg-white/10 rounded w-24 mx-auto mb-2" />
                <div className="h-3 bg-white/10 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </section>

        {/* History Skeleton */}
        <section className="py-12 border-t border-white/5">
          <div className="h-4 bg-white/10 rounded w-32 mb-10" />
          <div className="card-3d liquid-glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <div className="h-4 bg-white/10 rounded w-full" />
            </div>
            <div className="p-6 border-b border-white/5">
              <div className="h-4 bg-white/10 rounded w-full" />
            </div>
            <div className="p-6">
              <div className="h-4 bg-white/10 rounded w-full" />
            </div>
          </div>
        </section>

        {/* CTA Skeleton */}
        <section className="py-16 border-t border-white/5 pb-24">
          <div className="liquid-glass rounded-3xl overflow-hidden p-10 sm:p-14">
            <div className="animate-pulse text-center mx-auto max-w-xl">
              <div className="w-8 h-8 bg-white/10 rounded mx-auto mb-6" />
              <div className="h-8 bg-white/10 rounded w-1/2 mx-auto mb-4" />
              <div className="h-4 bg-white/10 rounded w-3/4 mx-auto mb-8" />
              <div className="h-12 bg-white/10 rounded-xl w-44 mx-auto" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
