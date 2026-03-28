export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="w-36 h-8 bg-white/[0.08] rounded-xl mb-2" />
          <div className="w-56 h-4 bg-white/[0.04] rounded" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/[0.04] rounded-2xl p-5"
            >
              <div className="w-20 h-3 bg-white/[0.04] rounded mb-3" />
              <div className="w-16 h-7 bg-white/[0.08] rounded" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 border border-white/[0.04] rounded-2xl p-6"
            >
              <div className="w-32 h-5 bg-white/[0.08] rounded mb-4" />
              <div className="w-full h-48 bg-white/[0.02] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
