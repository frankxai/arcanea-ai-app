export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-4 w-20 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-32 bg-white/[0.04] rounded" />
        <div className="h-4 w-4 bg-white/[0.04] rounded" />
        <div className="h-4 w-40 bg-white/[0.06] rounded" />
      </div>
      {/* Prompt detail card */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-6">
        {/* Tags */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-6 w-20 bg-white/[0.04] rounded-full" />
          ))}
        </div>
        {/* Title */}
        <div className="h-9 w-3/4 bg-white/[0.08] rounded-xl" />
        {/* Meta row */}
        <div className="flex items-center gap-6">
          <div className="h-4 w-28 bg-white/[0.04] rounded" />
          <div className="h-4 w-24 bg-white/[0.04] rounded" />
        </div>
        {/* Prompt content box */}
        <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-6 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${70 + (i % 3) * 10}%` }}
            />
          ))}
        </div>
        {/* Action buttons */}
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-white/[0.06] rounded-xl" />
          <div className="h-10 w-24 bg-white/[0.04] rounded-xl" />
          <div className="h-10 w-24 bg-white/[0.04] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
