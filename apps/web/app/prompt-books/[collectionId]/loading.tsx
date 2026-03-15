export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-28 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-40 bg-white/[0.06] rounded" />
      </div>
      {/* Collection header */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-72 bg-white/[0.08] rounded-xl" />
          <div className="h-4 w-48 bg-white/[0.04] rounded" />
          <div className="h-4 w-full bg-white/[0.04] rounded" />
        </div>
      </div>
      {/* Prompt cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 bg-white/[0.08] rounded" />
              <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
              <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="h-5 w-14 bg-white/[0.04] rounded-full" />
                ))}
              </div>
              <div className="h-8 w-20 bg-white/[0.06] rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
