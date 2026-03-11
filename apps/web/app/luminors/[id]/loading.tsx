export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Back nav */}
      <div className="h-8 w-32 bg-white/[0.04] rounded-lg mb-8" />
      {/* Luminor hero */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 flex flex-col md:flex-row gap-8 mb-8">
        {/* Portrait */}
        <div className="w-32 h-32 rounded-2xl bg-white/[0.06] flex-shrink-0 mx-auto md:mx-0" />
        <div className="flex-1 space-y-4">
          {/* Team badge */}
          <div className="h-6 w-20 bg-white/[0.04] rounded-full" />
          {/* Name */}
          <div className="h-9 w-56 bg-white/[0.08] rounded-xl" />
          {/* Title */}
          <div className="h-5 w-36 bg-white/[0.04] rounded" />
          {/* Bio lines */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/[0.04] rounded" />
            <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
            <div className="h-4 w-4/5 bg-white/[0.04] rounded" />
          </div>
          {/* CTA */}
          <div className="h-11 w-40 bg-white/[0.06] rounded-xl" />
        </div>
      </div>
      {/* Specialties grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-xl border border-white/[0.06] p-5 space-y-3">
            <div className="h-5 w-36 bg-white/[0.06] rounded" />
            <div className="h-4 w-full bg-white/[0.04] rounded" />
            <div className="h-4 w-3/4 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
