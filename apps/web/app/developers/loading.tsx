export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Hero skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
        <div className="h-6 w-32 bg-white/[0.04] rounded-full mx-auto mb-4" />
        <div className="h-10 w-[28rem] max-w-full bg-white/[0.04] rounded-lg mx-auto mb-3" />
        <div className="h-5 w-[36rem] max-w-full bg-white/[0.04] rounded mx-auto mb-8" />
        <div className="flex justify-center gap-4">
          <div className="h-10 w-36 bg-white/[0.06] rounded-lg" />
          <div className="h-10 w-36 bg-white/[0.04] rounded-lg" />
        </div>
      </section>

      {/* Quick start grid skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="h-7 w-40 bg-white/[0.04] rounded-lg mb-6" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 bg-white/[0.04] rounded-2xl border border-white/[0.04]" />
          ))}
        </div>
      </section>

      {/* API docs skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="h-7 w-48 bg-white/[0.04] rounded-lg mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/[0.04] rounded-xl border border-white/[0.04]" />
          ))}
        </div>
      </section>

      {/* MCP cards skeleton */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="h-7 w-36 bg-white/[0.04] rounded-lg mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-white/[0.04] rounded-2xl border border-white/[0.04]" />
          ))}
        </div>
      </section>
    </div>
  );
}
