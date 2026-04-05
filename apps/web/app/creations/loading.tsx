export default function CreationsLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-44 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-64 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]">
              <div className="h-48 rounded-t-2xl bg-white/[0.03]" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/[0.04]" />
                <div className="h-3 w-1/2 rounded bg-white/[0.02]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
