export default function OpsLoading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-pulse space-y-10">
        {/* Header skeleton */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1 rounded-full bg-white/[0.06]" />
            <div className="h-10 w-72 bg-white/[0.06] rounded-lg" />
          </div>
          <div className="h-4 w-56 bg-white/[0.04] rounded ml-5 mt-2" />
        </div>

        {/* Summary bar skeleton */}
        <div className="rounded-xl border border-white/[0.06] p-6 bg-white/[0.03]">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 w-16 bg-white/[0.06] rounded" />
                <div className="h-3 w-20 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence systems skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-white/[0.06]" />
            <div className="h-6 w-44 bg-white/[0.06] rounded" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              />
            ))}
          </div>
        </div>

        {/* Agent panel skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-white/[0.06]" />
            <div className="h-6 w-40 bg-white/[0.06] rounded" />
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 bg-white/[0.02]" />
              ))}
            </div>
          </div>
        </div>

        {/* Repo table skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-white/[0.06]" />
            <div className="h-6 w-36 bg-white/[0.06] rounded" />
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-8 w-24 rounded-full bg-white/[0.04]" />
            ))}
          </div>
          <div className="h-80 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
        </div>

        {/* Session history skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-white/[0.06]" />
            <div className="h-6 w-36 bg-white/[0.06] rounded" />
          </div>
          <div className="h-40 rounded-xl bg-white/[0.03] border border-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}
