export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-44 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[32rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Seven Academy Houses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-7 space-y-4">
            {/* House crest */}
            <div className="w-14 h-14 rounded-2xl bg-white/[0.06]" />
            {/* House name */}
            <div className="h-6 w-2/3 bg-white/[0.08] rounded" />
            {/* Element badge */}
            <div className="h-4 w-24 bg-white/[0.04] rounded-full" />
            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-5/6 bg-white/[0.04] rounded" />
            </div>
            {/* Traits row */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-6 w-16 bg-white/[0.04] rounded-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
