export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-52 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[30rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-white/[0.04] rounded-full border border-white/[0.04]" />
        ))}
      </div>
      {/* Bestiary entries — creative obstacles as creatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 space-y-4">
            {/* Creature illustration */}
            <div className="h-36 w-full rounded-xl bg-white/[0.04]" />
            {/* Type badge */}
            <div className="h-5 w-20 bg-white/[0.04] rounded-full" />
            {/* Name */}
            <div className="h-6 w-3/4 bg-white/[0.08] rounded" />
            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/[0.04] rounded" />
              <div className="h-3 w-5/6 bg-white/[0.04] rounded" />
            </div>
            {/* Weakness tag */}
            <div className="h-4 w-32 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
