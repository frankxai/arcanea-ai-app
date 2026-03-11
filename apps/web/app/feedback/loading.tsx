export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="h-8 w-32 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-10 w-56 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-80 bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Feedback form skeleton */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-6">
        {/* Type selector */}
        <div className="space-y-2">
          <div className="h-4 w-24 bg-white/[0.06] rounded" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-white/[0.04] rounded-lg" />
            ))}
          </div>
        </div>
        {/* Subject field */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-white/[0.06] rounded" />
          <div className="h-11 w-full bg-white/[0.04] rounded-xl border border-white/[0.04]" />
        </div>
        {/* Message textarea */}
        <div className="space-y-2">
          <div className="h-4 w-20 bg-white/[0.06] rounded" />
          <div className="h-36 w-full bg-white/[0.04] rounded-xl border border-white/[0.04]" />
        </div>
        {/* Rating */}
        <div className="space-y-2">
          <div className="h-4 w-16 bg-white/[0.06] rounded" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-white/[0.04]" />
            ))}
          </div>
        </div>
        {/* Submit */}
        <div className="h-11 w-36 bg-white/[0.06] rounded-xl" />
      </div>
    </div>
  );
}
