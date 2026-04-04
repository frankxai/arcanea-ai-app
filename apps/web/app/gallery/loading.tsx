export default function GalleryLoading() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <style>{`
        @keyframes shimmer-gallery {
          0% { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
        .gallery-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(0,188,212,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer-gallery 2s infinite;
        }
      `}</style>

      {/* Hero skeleton */}
      <section className="border-b border-white/[0.04] pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="h-3 w-32 rounded-full bg-white/[0.04] gallery-shimmer mb-6" />

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex-1">
              {/* Title */}
              <div className="h-14 w-80 rounded-xl bg-white/[0.06] gallery-shimmer mb-4" />
              {/* Subtitle */}
              <div className="h-5 w-[520px] max-w-full rounded-lg bg-white/[0.04] gallery-shimmer mb-2" />
              <div className="h-5 w-72 rounded-lg bg-white/[0.03] gallery-shimmer mb-5" />
              {/* Pill links */}
              <div className="flex gap-3 flex-wrap">
                {[88, 80, 100, 80].map((w, i) => (
                  <div key={i} className="h-8 rounded-lg bg-white/[0.04] gallery-shimmer" style={{ width: w }} />
                ))}
              </div>
            </div>
            {/* Stats strip */}
            <div className="flex items-center gap-6">
              {[100, 72, 80].map((w, i) => (
                <div key={i} className="h-4 rounded bg-white/[0.04] gallery-shimmer" style={{ width: w }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured companions skeleton */}
      <section className="border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-5 w-44 rounded-lg bg-white/[0.06] gallery-shimmer mb-2" />
              <div className="h-4 w-64 rounded bg-white/[0.04] gallery-shimmer" />
            </div>
            <div className="h-4 w-16 rounded bg-white/[0.04] gallery-shimmer" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-white/[0.06]">
                <div className="aspect-square bg-white/[0.04] gallery-shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-white/[0.06] gallery-shimmer" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.04] gallery-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div className="border-b border-white/[0.08] py-3">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-2">
            {[56, 60, 68, 68, 68, 64].map((w, i) => (
              <div key={i} className="h-8 rounded-full bg-white/[0.04] gallery-shimmer" style={{ width: w }} />
            ))}
          </div>
          <div className="h-8 w-20 rounded-lg bg-white/[0.04] gallery-shimmer" />
        </div>
      </div>

      {/* Element filter row skeleton */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          {[100, 72, 80, 76, 72, 72].map((w, i) => (
            <div key={i} className="h-7 rounded-full bg-white/[0.04] gallery-shimmer" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Masonry-style card grid skeleton */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => {
            // Vary heights to give masonry feel
            const heights = [176, 196, 164, 200, 176, 188, 196, 172, 192, 168, 184, 176];
            const h = heights[i % heights.length];
            return (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]"
              >
                {/* Thumbnail area — varied heights */}
                <div
                  className="bg-white/[0.04] gallery-shimmer"
                  style={{ height: h }}
                />
                {/* Card body */}
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-white/[0.06] gallery-shimmer" />
                  <div className="h-3 w-full rounded bg-white/[0.04] gallery-shimmer" />
                  <div className="h-3 w-2/3 rounded bg-white/[0.03] gallery-shimmer" />
                  {/* Badges */}
                  <div className="flex gap-2 pt-1">
                    <div className="h-5 w-20 rounded-full bg-white/[0.04] gallery-shimmer" />
                    <div className="h-5 w-24 rounded-full bg-white/[0.04] gallery-shimmer" />
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <div className="h-3 w-20 rounded bg-white/[0.04] gallery-shimmer" />
                    <div className="flex gap-3">
                      <div className="h-3 w-10 rounded bg-white/[0.04] gallery-shimmer" />
                      <div className="h-3 w-10 rounded bg-white/[0.04] gallery-shimmer" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
