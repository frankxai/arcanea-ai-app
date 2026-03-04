export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-36 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[28rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Godbeast feature cards — tall illustrative layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 flex gap-5">
            {/* Beast image placeholder */}
            <div className="w-20 h-20 rounded-xl bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-2/3 bg-white/[0.08] rounded" />
              <div className="h-4 w-24 bg-white/[0.04] rounded-full" />
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
