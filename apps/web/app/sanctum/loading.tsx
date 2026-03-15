export default function Loading() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-pulse">
      {/* Hero skeleton */}
      <section className="px-6 pb-12 pt-24 text-center md:pt-32">
        <div className="mx-auto mb-4 h-4 w-24 rounded bg-white/[0.04]" />
        <div className="mx-auto mb-4 h-10 w-80 rounded-xl bg-white/[0.04]" />
        <div className="mx-auto mb-6 h-4 w-96 max-w-full rounded bg-white/[0.04]" />
        <div className="mx-auto h-10 w-40 rounded-xl bg-white/[0.04]" />
      </section>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-6 h-6 w-48 rounded bg-white/[0.04]" />
        <div className="mb-2 h-3 w-72 rounded bg-white/[0.04]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-white/[0.06]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-white/[0.06]" />
                  <div className="h-3 w-16 rounded bg-white/[0.04]" />
                </div>
              </div>
              <div className="mb-3 h-3 w-full rounded bg-white/[0.04]" />
              <div className="mb-4 flex gap-1.5">
                <div className="h-5 w-14 rounded-full bg-white/[0.04]" />
                <div className="h-5 w-12 rounded-full bg-white/[0.04]" />
              </div>
              <div className="h-8 w-full rounded-lg bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
