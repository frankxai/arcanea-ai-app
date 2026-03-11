export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-36 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-64 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[32rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Five element cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-4">
            {/* Element symbol */}
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06]" />
            {/* Element name */}
            <div className="h-6 w-1/2 bg-white/[0.08] rounded" />
            {/* Domain */}
            <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-5/6 bg-white/[0.04] rounded" />
              <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
            </div>
            {/* Color chip row */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="w-6 h-6 rounded-full bg-white/[0.06]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
