export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-40 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-96 bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Frequency bar */}
      <div className="h-10 w-full bg-white/[0.03] rounded-xl mb-10" />
      {/* Gate cards — 10 gates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-5 space-y-3">
            <div className="w-10 h-10 rounded-full bg-white/[0.06]" />
            <div className="h-5 w-3/4 bg-white/[0.06] rounded" />
            <div className="h-3 w-full bg-white/[0.04] rounded" />
            <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
            <div className="h-4 w-20 bg-white/[0.04] rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
