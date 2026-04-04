export default function ClawDashboardLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-52 rounded-lg bg-white/[0.04] animate-pulse mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
      </div>
    </div>
  );
}
