export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-48 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-80 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[36rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Progress tracker bar */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06]" />
        ))}
      </div>
      {/* Gate detail cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-7 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/[0.06]" />
              <div className="space-y-2">
                <div className="h-5 w-32 bg-white/[0.08] rounded" />
                <div className="h-3 w-20 bg-white/[0.04] rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
            </div>
            <div className="h-8 w-28 bg-white/[0.04] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
