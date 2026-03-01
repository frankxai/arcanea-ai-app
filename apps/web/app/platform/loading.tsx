export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="h-8 w-48 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-14 w-[30rem] bg-white/[0.06] rounded-xl mx-auto mb-4 max-w-full" />
        <div className="h-5 w-[36rem] bg-white/[0.04] rounded mx-auto max-w-full mb-8" />
        <div className="flex justify-center gap-4">
          <div className="h-11 w-36 bg-white/[0.06] rounded-xl" />
          <div className="h-11 w-32 bg-white/[0.04] rounded-xl" />
        </div>
      </div>
      {/* Platform feature blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-7 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.06]" />
            <div className="h-6 w-2/3 bg-white/[0.08] rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/[0.04] rounded" />
              <div className="h-4 w-4/5 bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
      {/* Capability list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-2/3 bg-white/[0.06] rounded" />
              <div className="h-3 w-full bg-white/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
