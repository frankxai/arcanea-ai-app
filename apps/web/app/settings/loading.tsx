export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="h-9 w-36 bg-white/[0.06] rounded-xl" />
        <div className="h-4 w-64 bg-white/[0.04] rounded" />
      </div>
      <div className="flex gap-8">
        {/* Settings sidebar nav */}
        <aside className="hidden md:block w-52 flex-shrink-0 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-full bg-white/[0.04] rounded-lg" />
          ))}
        </aside>
        {/* Settings content */}
        <div className="flex-1 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-5">
              <div className="h-5 w-36 bg-white/[0.08] rounded" />
              <div className="h-px w-full bg-white/[0.04]" />
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-40 bg-white/[0.06] rounded" />
                    <div className="h-3 w-56 bg-white/[0.04] rounded" />
                  </div>
                  <div className="h-9 w-24 bg-white/[0.04] rounded-lg" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
