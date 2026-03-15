export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="pt-20 pb-20 lg:pt-28 lg:pb-28">
          <div className="liquid-glass rounded-3xl border border-white/[0.04] px-8 py-16 sm:px-16 sm:py-20 lg:px-20 lg:py-24">
            <div className="max-w-4xl">
              <div className="w-32 h-8 rounded-full bg-white/[0.04] mb-8" />
              <div className="w-56 h-10 bg-white/[0.08] rounded-xl mb-3" />
              <div className="w-40 h-10 bg-white/[0.06] rounded-xl mb-6" />
              <div className="space-y-2 mb-10 max-w-2xl">
                <div className="w-full h-4 bg-white/[0.04] rounded" />
                <div className="w-full h-4 bg-white/[0.04] rounded" />
                <div className="w-3/4 h-4 bg-white/[0.04] rounded" />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-36 rounded-xl bg-white/[0.08]" />
                <div className="h-12 w-40 rounded-xl bg-white/[0.04] border border-white/[0.04]" />
              </div>
            </div>
          </div>
        </section>

        {/* Community Spaces */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="mb-12">
            <div className="w-36 h-7 rounded-full bg-white/[0.04] mb-5" />
            <div className="w-56 h-8 bg-white/[0.08] rounded-xl mb-4" />
            <div className="w-80 h-4 bg-white/[0.04] rounded max-w-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-5"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04]" />
                  <div className="w-20 h-6 rounded-full bg-white/[0.04]" />
                </div>
                <div className="w-24 h-5 bg-white/[0.08] rounded" />
                <div className="w-48 h-3 bg-white/[0.04] rounded" />
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-2/3 h-3 bg-white/[0.04] rounded" />
                </div>
                <div className="space-y-1.5">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="w-48 h-3 bg-white/[0.03] rounded" />
                  ))}
                </div>
                <div className="w-24 h-4 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="mb-12">
            <div className="w-28 h-7 rounded-full bg-white/[0.04] mb-5" />
            <div className="w-52 h-8 bg-white/[0.08] rounded-xl mb-4" />
            <div className="w-72 h-4 bg-white/[0.04] rounded max-w-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
                <div className="w-16 h-5 rounded-full bg-white/[0.04]" />
                <div className="w-36 h-4 bg-white/[0.08] rounded" />
                <div className="w-20 h-3 bg-white/[0.04] rounded" />
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-2/3 h-3 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Creator Spotlight */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="mb-12">
            <div className="w-36 h-7 rounded-full bg-white/[0.04] mb-5" />
            <div className="w-48 h-8 bg-white/[0.08] rounded-xl mb-4" />
            <div className="w-72 h-4 bg-white/[0.04] rounded max-w-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-7 space-y-5"
              >
                <div className="w-20 h-6 rounded-full bg-white/[0.04]" />
                <div className="w-full h-28 rounded-xl bg-white/[0.04]" />
                <div className="w-36 h-5 bg-white/[0.08] rounded" />
                <div className="w-24 h-3 bg-white/[0.04] rounded" />
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
                </div>
                <div className="pt-4 border-t border-white/[0.04]">
                  <div className="w-28 h-3 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contributions */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="mb-12">
            <div className="w-28 h-7 rounded-full bg-white/[0.04] mb-5" />
            <div className="w-52 h-8 bg-white/[0.08] rounded-xl mb-4" />
            <div className="w-72 h-4 bg-white/[0.04] rounded max-w-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04]" />
                <div className="w-36 h-5 bg-white/[0.08] rounded" />
                <div className="space-y-1.5">
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-full h-3 bg-white/[0.04] rounded" />
                  <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 border-t border-white/[0.04]">
          <div className="liquid-glass rounded-3xl border border-white/[0.04] p-10 sm:p-14">
            <div className="max-w-2xl">
              <div className="w-28 h-7 rounded-full bg-white/[0.04] mb-6" />
              <div className="w-48 h-8 bg-white/[0.08] rounded-xl mb-2" />
              <div className="w-40 h-8 bg-white/[0.06] rounded-xl mb-4" />
              <div className="space-y-2 mb-8 max-w-xl">
                <div className="w-full h-4 bg-white/[0.04] rounded" />
                <div className="w-3/4 h-4 bg-white/[0.04] rounded" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-12 rounded-xl bg-white/[0.04]" />
                <div className="w-28 h-12 rounded-xl bg-white/[0.08]" />
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy footer */}
        <section className="py-16 pb-24 border-t border-white/[0.04]">
          <div className="rounded-3xl overflow-hidden">
            <div className="h-0.5 w-full bg-white/[0.04]" />
            <div className="px-8 py-16 sm:px-14 sm:py-20 text-center">
              <div className="flex justify-center gap-5 mb-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-white/[0.04]" />
                ))}
              </div>
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="w-96 h-8 bg-white/[0.08] rounded-xl mx-auto max-w-full" />
                <div className="w-72 h-8 bg-white/[0.06] rounded-xl mx-auto max-w-full" />
                <div className="w-32 h-6 bg-white/[0.04] rounded mx-auto mt-6" />
                <div className="space-y-2 mt-6 max-w-xl mx-auto">
                  <div className="w-full h-4 bg-white/[0.04] rounded" />
                  <div className="w-full h-4 bg-white/[0.04] rounded" />
                  <div className="w-3/4 h-4 bg-white/[0.04] rounded mx-auto" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-12">
                <div className="h-12 w-44 rounded-xl bg-white/[0.08]" />
                <div className="h-12 w-44 rounded-xl bg-white/[0.04] border border-white/[0.04]" />
              </div>
            </div>
            <div className="h-0.5 w-full bg-white/[0.04]" />
          </div>
        </section>
      </main>
    </div>
  );
}
