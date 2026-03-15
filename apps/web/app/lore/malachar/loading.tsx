export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Dark hero — full-width atmospheric block */}
      <div className="h-64 bg-white/[0.03] rounded-2xl border border-white/[0.06] mb-10 flex items-end p-8">
        <div className="space-y-3 w-full">
          <div className="h-10 w-72 bg-white/[0.06] rounded-xl" />
          <div className="h-5 w-96 bg-white/[0.04] rounded max-w-full" />
        </div>
      </div>
      {/* Lore sections */}
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-4">
            <div className="h-6 w-48 bg-white/[0.06] rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/[0.04] rounded" />
              <div className="h-4 w-11/12 bg-white/[0.04] rounded" />
              <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
              <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
