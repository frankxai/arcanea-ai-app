export default function WorldDetailLoading() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      {/* Hero skeleton */}
      <section className="relative pt-24 pb-10 overflow-hidden">
        <div className="aspect-[3/1] max-h-[360px] w-full bg-white/[0.04] animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
          <div className="flex flex-col gap-4">
            <div className="h-10 w-72 rounded-xl bg-white/[0.06] animate-pulse" />
            <div className="h-5 w-96 rounded-lg bg-white/[0.04] animate-pulse" />
            <div className="flex gap-3 mt-2">
              <div className="h-8 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
              <div className="h-8 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
              <div className="h-8 w-24 rounded-lg bg-white/[0.06] animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Tab bar skeleton */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex gap-6 border-b border-white/[0.06] mb-8">
          {["Overview", "Characters", "Locations", "Timeline", "Creations"].map(
            (tab) => (
              <div
                key={tab}
                className="h-10 rounded-t-lg bg-white/[0.04] animate-pulse"
                style={{ width: `${tab.length * 10 + 24}px` }}
              />
            )
          )}
        </div>
      </section>

      {/* Content skeleton */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main */}
          <div className="space-y-6">
            <div className="h-6 w-48 rounded bg-white/[0.06] animate-pulse" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-white/[0.04] animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-white/[0.04] animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-white/[0.04] animate-pulse" />
            </div>
            <div className="flex gap-2 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-20 rounded-full bg-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4 animate-pulse">
              <div className="h-5 w-32 rounded bg-white/[0.06]" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-white/[0.04]" />
                ))}
              </div>
              <div className="h-10 w-full rounded-xl bg-white/[0.06]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
