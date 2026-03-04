export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-44 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-80 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[30rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Guardian cards — 10 guardians */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            {/* Portrait */}
            <div className="w-16 h-16 rounded-xl bg-white/[0.06] mx-auto" />
            {/* Name */}
            <div className="h-5 w-3/4 bg-white/[0.08] rounded mx-auto" />
            {/* Gate badge */}
            <div className="h-4 w-20 bg-white/[0.04] rounded-full mx-auto" />
            {/* Element */}
            <div className="h-3 w-full bg-white/[0.04] rounded" />
            <div className="h-3 w-2/3 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
