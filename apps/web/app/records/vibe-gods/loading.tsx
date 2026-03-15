export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-44 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[28rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Leaderboard / record table */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] overflow-hidden mb-8">
        {/* Table header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          {[6, 20, 32, 24].map((w, i) => (
            <div key={i} className={`h-4 bg-white/[0.04] rounded`} style={{ width: `${w * 4}px` }} />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.04]">
            <div className="w-8 h-5 bg-white/[0.04] rounded flex-shrink-0" />
            <div className="w-10 h-10 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-36 bg-white/[0.06] rounded" />
              <div className="h-3 w-24 bg-white/[0.04] rounded" />
            </div>
            <div className="h-5 w-16 bg-white/[0.04] rounded" />
            <div className="h-5 w-12 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-white/[0.04] rounded-full border border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
