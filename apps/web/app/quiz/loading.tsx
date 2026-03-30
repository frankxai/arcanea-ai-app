export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-2xl animate-pulse space-y-8">
        {/* Title area */}
        <div className="text-center space-y-4">
          <div className="h-4 w-36 bg-white/[0.06] rounded-full mx-auto" />
          <div className="h-10 w-80 bg-white/[0.08] rounded-xl mx-auto" />
          <div className="h-4 w-64 bg-white/[0.04] rounded mx-auto" />
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-white/[0.06] rounded-full" />
        {/* Question card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 space-y-6">
          <div className="h-7 w-3/4 bg-white/[0.08] rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-white/[0.04] border border-white/[0.06]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
