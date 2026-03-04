export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="h-8 w-36 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-10 w-64 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-80 bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Assessment card */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-white/[0.04] rounded" />
          <div className="h-4 w-12 bg-white/[0.04] rounded" />
        </div>
        <div className="h-2 w-full bg-white/[0.04] rounded-full">
          <div className="h-2 w-1/3 bg-white/[0.08] rounded-full" />
        </div>
        {/* Question block */}
        <div className="space-y-3">
          <div className="h-6 w-full bg-white/[0.06] rounded" />
          <div className="h-6 w-4/5 bg-white/[0.06] rounded" />
        </div>
        {/* Answer choices */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 w-full bg-white/[0.04] rounded-xl border border-white/[0.04]" />
          ))}
        </div>
        {/* CTA */}
        <div className="h-11 w-36 bg-white/[0.06] rounded-xl" />
      </div>
    </div>
  );
}
