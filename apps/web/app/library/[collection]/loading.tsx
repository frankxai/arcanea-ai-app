export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-20 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-32 bg-white/[0.06] rounded" />
      </div>
      {/* Collection hero */}
      <div className="flex items-start gap-6 mb-10">
        <div className="w-20 h-28 rounded-xl bg-white/[0.06] flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-8 w-64 bg-white/[0.08] rounded-xl" />
          <div className="h-4 w-32 bg-white/[0.04] rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/[0.04] rounded" />
            <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
          </div>
        </div>
      </div>
      {/* Text list */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-xl border border-white/[0.06] p-5 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 bg-white/[0.06] rounded" />
              <div className="h-3 w-1/3 bg-white/[0.04] rounded" />
            </div>
            <div className="h-4 w-4 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
