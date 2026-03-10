'use client'

export function SkeletonCard({ height = 280 }: { height?: number }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(15,15,24,0.7)',
        border: '1px solid rgba(139,92,246,0.1)',
      }}
      aria-hidden="true"
    >
      {/* Image skeleton */}
      <div
        className="skeleton-shimmer"
        style={{ height: `${height}px` }}
      />
      {/* Footer skeleton */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-full skeleton-shimmer shrink-0"
          style={{ background: 'rgba(139,92,246,0.1)' }}
        />
        <div className="flex-1 flex flex-col gap-1.5">
          <div
            className="h-3.5 rounded skeleton-shimmer"
            style={{ width: '65%', background: 'rgba(139,92,246,0.08)' }}
          />
          <div
            className="h-2.5 rounded skeleton-shimmer"
            style={{ width: '40%', background: 'rgba(139,92,246,0.06)' }}
          />
        </div>
      </div>
    </div>
  )
}

const SKELETON_HEIGHTS = [280, 360, 220, 310, 260, 400, 240, 320]

export function SkeletonGrid() {
  const col2 = SKELETON_HEIGHTS.filter((_, i) => i < 4)
  const col3 = SKELETON_HEIGHTS.filter((_, i) => i < 6)

  return (
    <div className="w-full" aria-label="Loading creations" aria-busy="true">
      {/* 2-col mobile */}
      <div className="flex gap-4 sm:hidden">
        {[col2.filter((_, i) => i % 2 === 0), col2.filter((_, i) => i % 2 === 1)].map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((h, i) => <SkeletonCard key={i} height={h} />)}
          </div>
        ))}
      </div>

      {/* 3-col sm-lg */}
      <div className="hidden sm:flex lg:hidden gap-4">
        {[
          col3.filter((_, i) => i % 3 === 0),
          col3.filter((_, i) => i % 3 === 1),
          col3.filter((_, i) => i % 3 === 2),
        ].map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((h, i) => <SkeletonCard key={i} height={h} />)}
          </div>
        ))}
      </div>

      {/* 4-col lg+ */}
      <div className="hidden lg:flex gap-4">
        {[
          SKELETON_HEIGHTS.filter((_, i) => i % 4 === 0),
          SKELETON_HEIGHTS.filter((_, i) => i % 4 === 1),
          SKELETON_HEIGHTS.filter((_, i) => i % 4 === 2),
          SKELETON_HEIGHTS.filter((_, i) => i % 4 === 3),
        ].map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map((h, i) => <SkeletonCard key={i} height={h} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

export function InfiniteScrollLoader() {
  return (
    <div
      className="flex flex-col items-center gap-4 py-12"
      aria-label="Loading more creations"
      aria-busy="true"
    >
      {/* Pulsing orb */}
      <div className="relative">
        <div
          className="w-12 h-12 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            animation: 'glow-pulse 1.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#8b5cf6',
            borderRightColor: 'rgba(139,92,246,0.3)',
            animation: 'spin 1s linear infinite',
          }}
          aria-hidden="true"
        />
      </div>
      <p className="text-sm tracking-widest uppercase" style={{ color: '#4a3f64' }}>
        Summoning more creations...
      </p>

      {/* Mini skeleton row */}
      <div className="flex gap-3 mt-2">
        {[120, 100, 140, 110].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full skeleton-shimmer"
            style={{ width: `${w}px`, background: 'rgba(139,92,246,0.08)' }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
