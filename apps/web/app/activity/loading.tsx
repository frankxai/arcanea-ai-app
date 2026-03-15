export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04]" />
            <div className="w-28 h-8 bg-white/[0.08] rounded-xl" />
          </div>
          <div className="w-52 h-4 bg-white/[0.04] rounded" />
        </div>

        {/* Activity feed items */}
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4"
            >
              {/* Action icon */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex-shrink-0" />

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <div
                  className="h-4 bg-white/[0.08] rounded"
                  style={{ width: `${140 + (i % 4) * 30}px`, maxWidth: "100%" }}
                />
                <div className="w-16 h-3 bg-white/[0.04] rounded" />
              </div>

              {/* Timestamp */}
              <div className="w-14 h-3 bg-white/[0.04] rounded flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
