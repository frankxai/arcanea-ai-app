export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="h-8 w-48 bg-white/[0.06] rounded-xl" />
        <div className="h-4 w-72 bg-white/[0.04] rounded" />
      </div>
      {/* Settings sections */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            <div className="h-5 w-40 bg-white/[0.08] rounded" />
            <div className="h-px w-full bg-white/[0.04]" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-white/[0.06] rounded" />
                    <div className="h-3 w-52 bg-white/[0.04] rounded" />
                  </div>
                  <div className="h-6 w-10 bg-white/[0.06] rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Save button */}
      <div className="mt-8 h-11 w-36 bg-white/[0.06] rounded-xl" />
    </div>
  );
}
