export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 mb-8 mx-auto w-36 h-8" />
          <div className="w-64 h-10 bg-white/8 rounded-xl mx-auto mb-3" />
          <div className="w-48 h-10 bg-white/6 rounded-xl mx-auto mb-6" />
          <div className="w-96 h-5 bg-white/5 rounded mx-auto max-w-full" />
        </div>

        {/* Team filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-white/5 border border-white/5"
              style={{ width: `${70 + i * 12}px` }}
            />
          ))}
        </div>

        {/* Luminor grid — 4 columns, 16 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="card-3d liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-xl bg-white/5" />
              {/* Team badge */}
              <div className="w-16 h-5 rounded-full bg-white/5" />
              {/* Name */}
              <div className="w-28 h-5 bg-white/8 rounded" />
              {/* Title */}
              <div className="w-20 h-3 bg-white/5 rounded" />
              {/* Specialty text */}
              <div className="space-y-1.5">
                <div className="w-full h-3 bg-white/5 rounded" />
                <div className="w-3/4 h-3 bg-white/5 rounded" />
              </div>
              {/* CTA row */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="w-24 h-3 bg-white/5 rounded" />
                <div className="w-4 h-4 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="h-10 w-44 rounded-xl bg-white/5 border border-white/5" />
          <div className="h-10 w-40 rounded-xl bg-white/5 border border-white/5" />
        </div>
      </main>
    </div>
  );
}
