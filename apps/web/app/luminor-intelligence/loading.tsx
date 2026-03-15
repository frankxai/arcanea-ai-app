export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-56 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-14 w-96 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[36rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Intelligence capability cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06]" />
            <div className="h-6 w-3/4 bg-white/[0.08] rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/[0.04] rounded" />
              <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* CTA block */}
      <div className="h-48 w-full bg-white/[0.03] rounded-2xl border border-white/[0.06]" />
    </div>
  );
}
