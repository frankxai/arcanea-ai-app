export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-16 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-28 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-40 bg-white/[0.06] rounded" />
      </div>
      {/* Article header */}
      <div className="mb-10 space-y-4">
        <div className="h-4 w-24 bg-white/[0.04] rounded-full" />
        <div className="h-10 w-full bg-white/[0.08] rounded-xl" />
        <div className="h-10 w-4/5 bg-white/[0.06] rounded-xl" />
        <div className="h-5 w-56 bg-white/[0.04] rounded" />
      </div>
      {/* Article body — scroll text lines */}
      <div className="space-y-3">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="h-4 bg-white/[0.04] rounded"
            style={{ width: `${75 + (i % 4) * 6}%` }}
          />
        ))}
        <div className="h-4 w-1/2 bg-white/[0.04] rounded" />
      </div>
      {/* Navigation footer */}
      <div className="mt-12 flex justify-between">
        <div className="h-10 w-32 bg-white/[0.04] rounded-xl" />
        <div className="h-10 w-32 bg-white/[0.04] rounded-xl" />
      </div>
    </div>
  );
}
