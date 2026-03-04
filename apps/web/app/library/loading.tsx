export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-52 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-14 w-80 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[36rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <div className="flex-1 h-12 bg-white/[0.04] rounded-xl" />
        <div className="h-12 w-32 bg-white/[0.04] rounded-xl" />
      </div>
      {/* Collection grid — 17 collections shown as book spines */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {Array.from({ length: 17 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-5 space-y-3">
            <div className="w-10 h-14 rounded-lg bg-white/[0.06] mx-auto" />
            <div className="h-4 w-3/4 bg-white/[0.06] rounded mx-auto" />
            <div className="h-3 w-1/2 bg-white/[0.04] rounded mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
