export default function CommandLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 w-56 bg-white/10 rounded-lg" />
        <div className="h-4 w-80 bg-white/5 rounded mt-2" />
      </div>

      {/* Stats bar skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-4"
          >
            <div className="h-3 w-16 bg-white/10 rounded mb-3" />
            <div className="h-8 w-20 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Quick actions skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <div className="h-4 w-24 bg-white/10 rounded mb-2" />
            <div className="h-3 w-40 bg-white/5 rounded" />
          </div>
        ))}
      </div>

      {/* Activity feed skeleton */}
      <div>
        <div className="h-5 w-36 bg-white/10 rounded mb-4" />
        <div className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="flex-1">
                <div className="h-3 w-full max-w-md bg-white/10 rounded" />
              </div>
              <div className="h-3 w-12 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Agents skeleton */}
      <div>
        <div className="h-5 w-20 bg-white/10 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div>
                  <div className="h-3.5 w-24 bg-white/10 rounded mb-1" />
                  <div className="h-2.5 w-16 bg-white/5 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
