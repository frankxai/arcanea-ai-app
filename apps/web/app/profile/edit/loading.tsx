export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="mb-10 space-y-3">
        <div className="h-9 w-48 bg-white/[0.06] rounded-xl" />
        <div className="h-4 w-64 bg-white/[0.04] rounded" />
      </div>
      {/* Avatar section */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-6 mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-xl bg-white/[0.06] flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-4 w-40 bg-white/[0.04] rounded" />
          <div className="h-8 w-32 bg-white/[0.04] rounded-lg" />
        </div>
      </div>
      {/* Edit form */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-28 bg-white/[0.06] rounded" />
            <div className={`w-full bg-white/[0.04] rounded-xl border border-white/[0.04] ${i === 2 ? 'h-24' : 'h-11'}`} />
          </div>
        ))}
        {/* Guardian selector */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/[0.06] rounded" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-full bg-white/[0.04] rounded-lg" />
            ))}
          </div>
        </div>
        {/* Save button */}
        <div className="h-11 w-32 bg-white/[0.06] rounded-xl" />
      </div>
    </div>
  );
}
