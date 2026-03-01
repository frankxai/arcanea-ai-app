export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Profile header */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-white/[0.06] flex-shrink-0" />
          <div className="flex-1 space-y-3">
            {/* Display name */}
            <div className="h-7 w-48 bg-white/[0.08] rounded-xl" />
            {/* Username */}
            <div className="h-4 w-32 bg-white/[0.04] rounded" />
            {/* Bio */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/[0.04] rounded" />
              <div className="h-4 w-4/5 bg-white/[0.04] rounded" />
            </div>
            {/* Guardian + rank badges */}
            <div className="flex gap-3">
              <div className="h-6 w-24 bg-white/[0.04] rounded-full" />
              <div className="h-6 w-20 bg-white/[0.04] rounded-full" />
            </div>
          </div>
          {/* Stats column */}
          <div className="flex sm:flex-col gap-6 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="h-6 w-12 bg-white/[0.06] rounded mx-auto" />
                <div className="h-3 w-16 bg-white/[0.04] rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Creations gallery */}
      <div className="h-5 w-32 bg-white/[0.06] rounded mb-5" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-white/[0.04] border border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
