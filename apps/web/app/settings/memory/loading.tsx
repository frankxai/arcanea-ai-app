export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-44 h-8 bg-white/[0.08] rounded-xl mb-2" />
          <div className="w-64 h-4 bg-white/[0.04] rounded" />
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <div className="w-32 h-9 bg-white/[0.04] rounded-lg" />
          <div className="flex-1 h-9 bg-white/[0.04] rounded-lg" />
        </div>

        {/* Memory items */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/[0.04] rounded-2xl p-4 space-y-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-16 h-5 bg-white/[0.08] rounded" />
                <div className="w-20 h-3 bg-white/[0.04] rounded" />
              </div>
              <div className="w-full h-4 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
