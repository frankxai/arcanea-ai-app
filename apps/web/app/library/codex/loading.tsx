export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-32 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-64 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[30rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Codex index — two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar index */}
        <div className="lg:col-span-1 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-8 bg-white/[0.04] rounded-lg" />
          ))}
        </div>
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
              <div className="h-6 w-48 bg-white/[0.08] rounded" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/[0.04] rounded" />
                <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
                <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-6 w-20 bg-white/[0.04] rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
