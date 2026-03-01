export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="h-8 w-36 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-14 w-80 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[32rem] bg-white/[0.04] rounded mx-auto max-w-full mb-8" />
        <div className="flex justify-center gap-4">
          <div className="h-11 w-40 bg-white/[0.06] rounded-xl" />
          <div className="h-11 w-32 bg-white/[0.04] rounded-xl" />
        </div>
      </div>
      {/* Code editor preview skeleton */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-0 overflow-hidden mb-10">
        {/* Editor chrome bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-white/[0.06]" />
          ))}
          <div className="flex-1 mx-4 h-5 bg-white/[0.04] rounded" />
        </div>
        {/* Code lines */}
        <div className="p-6 space-y-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${40 + (i * 7) % 50}%`, marginLeft: `${(i % 3) * 16}px` }}
            />
          ))}
        </div>
      </div>
      {/* Features row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-xl border border-white/[0.06] p-5 space-y-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/[0.06] mx-auto" />
            <div className="h-4 w-3/4 bg-white/[0.06] rounded mx-auto" />
            <div className="h-3 w-full bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
