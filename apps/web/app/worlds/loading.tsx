export default function WorldsLoading() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Hero skeleton */}
      <section className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="h-4 w-32 mx-auto mb-6 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="h-12 w-80 mx-auto mb-4 rounded-xl bg-white/[0.06] animate-pulse" />
          <div className="h-5 w-96 mx-auto mb-10 rounded-lg bg-white/[0.04] animate-pulse" />

          {/* Search skeleton */}
          <div className="h-12 max-w-lg mx-auto rounded-xl bg-white/[0.05] animate-pulse mb-8" />

          {/* Filter pills skeleton */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 rounded-xl bg-white/[0.04] animate-pulse"
                style={{ width: `${70 + i * 10}px` }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Card grid skeleton */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse"
            >
              {/* Image placeholder */}
              <div className="aspect-[16/10] bg-white/[0.04]" />
              {/* Content area */}
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
                <div className="h-4 w-full rounded bg-white/[0.04]" />
                <div className="flex gap-2 mt-4">
                  <div className="h-3 w-3 rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-3 rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-3 rounded-full bg-white/[0.06]" />
                </div>
                <div className="flex justify-between items-center pt-3">
                  <div className="h-4 w-24 rounded bg-white/[0.04]" />
                  <div className="h-8 w-20 rounded-lg bg-white/[0.06]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
