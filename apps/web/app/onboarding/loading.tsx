export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-pulse">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 space-y-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-10 rounded-full"
              style={{
                background: i === 0 ? '#00bcd4' : 'rgba(255,255,255,0.04)',
              }}
            />
          ))}
        </div>

        {/* Heading */}
        <div className="space-y-3 text-center">
          <div className="mx-auto h-8 w-56 rounded-lg bg-white/[0.08]" />
          <div className="mx-auto h-4 w-72 rounded bg-white/[0.04]" />
        </div>

        {/* Card body — option skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-white/[0.06]" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-white/[0.08]" />
                <div className="h-3 w-48 rounded bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>

        {/* CTA button skeleton */}
        <div className="mx-auto h-11 w-full rounded-xl bg-white/[0.06]" />
      </div>
    </div>
  );
}
