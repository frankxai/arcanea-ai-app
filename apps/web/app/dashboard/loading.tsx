export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-8">
      {/* Welcome skeleton */}
      <div className="space-y-2">
        <div className="h-10 w-80 bg-white/[0.06] rounded-xl" />
        <div className="h-5 w-56 bg-white/[0.04] rounded" />
        <div className="h-4 w-40 bg-white/[0.03] rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column */}
        <div className="flex-1 space-y-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <div className="h-5 w-20 bg-white/[0.06] rounded" />
                  <div className="h-3 w-16 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            <div className="h-6 w-32 bg-white/[0.06] rounded" />
            <div className="flex flex-col sm:flex-row gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-12 rounded-xl bg-white/[0.04]"
                />
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-3">
            <div className="h-6 w-36 bg-white/[0.06] rounded" />
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-48 bg-white/[0.06] rounded" />
                    <div className="h-3 w-24 bg-white/[0.04] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="lg:w-72 flex-shrink-0 space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06]" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 bg-white/[0.06] rounded" />
                <div className="h-3 w-20 bg-white/[0.04] rounded" />
              </div>
            </div>
            <div className="w-full aspect-square rounded-xl bg-white/[0.03]" />
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-3/4 bg-white/[0.04] rounded" />
            </div>
            <div className="h-10 w-full rounded-xl bg-white/[0.04]" />
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
            <div className="h-5 w-28 bg-white/[0.06] rounded" />
            <div className="space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/[0.06]" />
                  <div className="h-3 w-20 bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
