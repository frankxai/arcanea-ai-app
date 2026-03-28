export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-40 h-8 bg-white/[0.08] rounded-xl mb-2" />
          <div className="w-64 h-4 bg-white/[0.04] rounded" />
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-9 bg-white/[0.04] rounded-lg" />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 backdrop-blur-xl border border-white/[0.04] rounded-2xl overflow-hidden"
            >
              <div className="aspect-[4/3] bg-white/[0.04]" />
              <div className="p-4 space-y-2">
                <div className="w-3/4 h-4 bg-white/[0.08] rounded" />
                <div className="w-1/2 h-3 bg-white/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
