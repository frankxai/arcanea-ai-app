export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="flex gap-8">
        {/* Docs sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-4">
          {/* Search */}
          <div className="h-10 w-full bg-white/[0.04] rounded-xl" />
          {/* Nav sections */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 bg-white/[0.06] rounded" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="ml-3 h-4 w-40 bg-white/[0.04] rounded" />
              ))}
            </div>
          ))}
        </aside>
        {/* Docs content */}
        <div className="flex-1 space-y-6">
          {/* Page title */}
          <div className="h-10 w-72 bg-white/[0.08] rounded-xl" />
          {/* Meta */}
          <div className="h-4 w-48 bg-white/[0.04] rounded" />
          {/* Content paragraphs */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              {i % 2 === 0 && <div className="h-6 w-48 bg-white/[0.06] rounded mt-4" />}
              {Array.from({ length: 4 }).map((_, j) => (
                <div
                  key={j}
                  className="h-4 bg-white/[0.04] rounded"
                  style={{ width: `${80 + j * 3}%` }}
                />
              ))}
            </div>
          ))}
          {/* Code block */}
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-5 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-white/[0.04] rounded"
                style={{ width: `${50 + (i * 9) % 40}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
