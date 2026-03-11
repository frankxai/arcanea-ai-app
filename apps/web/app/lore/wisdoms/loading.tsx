export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-36 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-64 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[28rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Wisdom scroll cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            {/* Scroll icon + category */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06]" />
              <div className="h-4 w-24 bg-white/[0.04] rounded-full" />
            </div>
            {/* Quote placeholder */}
            <div className="pl-4 border-l-2 border-white/[0.06] space-y-2">
              <div className="h-4 w-full bg-white/[0.06] rounded" />
              <div className="h-4 w-4/5 bg-white/[0.06] rounded" />
              <div className="h-4 w-3/4 bg-white/[0.06] rounded" />
            </div>
            {/* Attribution */}
            <div className="h-3 w-32 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
