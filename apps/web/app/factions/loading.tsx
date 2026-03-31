export default function FactionsLoading() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero skeleton */}
        <div className="text-center mb-20 space-y-4">
          <div
            className="h-3 w-32 rounded-full mx-auto animate-pulse"
            style={{ background: 'rgba(255,215,0,0.15)' }}
          />
          <div
            className="h-14 w-80 rounded-xl mx-auto animate-pulse"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <div
            className="h-4 w-96 rounded-full mx-auto animate-pulse"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        </div>

        {/* Grid skeleton — 8 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 space-y-4 animate-pulse"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                animationDelay: `${i * 0.07}s`,
              }}
            >
              <div
                className="h-5 w-20 rounded-full"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
              <div
                className="h-7 w-36 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <div
                className="h-3 w-28 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
              <div className="space-y-2">
                <div
                  className="h-3 w-full rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                <div
                  className="h-3 w-4/5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
                <div
                  className="h-3 w-3/4 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
