export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-48 h-8 bg-white/[0.08] rounded-xl mx-auto mb-2" />
          <div className="w-72 h-4 bg-white/[0.04] rounded mx-auto" />
        </div>

        {/* Tabs */}
        <div className="flex gap-3 justify-center mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-24 h-9 bg-white/[0.04] rounded-lg" />
          ))}
        </div>

        {/* Leaderboard rows */}
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-black/40 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-8 h-6 bg-white/[0.08] rounded" />
              <div className="w-10 h-10 rounded-full bg-white/[0.04]" />
              <div className="flex-1 space-y-1.5">
                <div className="w-32 h-4 bg-white/[0.08] rounded" />
                <div className="w-20 h-3 bg-white/[0.04] rounded" />
              </div>
              <div className="w-16 h-5 bg-white/[0.04] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
