export default function ShowcaseLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] animate-pulse">
      <div className="max-w-6xl mx-auto px-6 pt-32">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-4 w-32 mx-auto rounded bg-white/[0.04] mb-6" />
          <div className="h-12 w-96 mx-auto rounded-lg bg-white/[0.03] mb-4" />
          <div className="h-5 w-80 mx-auto rounded bg-white/[0.02]" />
        </div>
        {/* Cards skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
