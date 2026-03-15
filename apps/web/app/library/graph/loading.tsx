export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-white/[0.06] rounded-xl" />
          <div className="h-4 w-80 bg-white/[0.04] rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 bg-white/[0.04] rounded-lg" />
          <div className="h-9 w-24 bg-white/[0.04] rounded-lg" />
        </div>
      </div>
      {/* Force-directed graph placeholder */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] h-[60vh] relative overflow-hidden">
        {/* Simulated nodes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-white/[0.08]"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
          />
        ))}
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-5 w-40 bg-white/[0.04] rounded" />
        </div>
      </div>
      {/* Legend row */}
      <div className="flex flex-wrap gap-4 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/[0.06]" />
            <div className="h-3 w-20 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
