export default function UserFlowsLoading() {
  return (
    <div className="min-h-screen bg-cosmic-deep animate-pulse">
      {/* Header */}
      <div className="border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="w-32 h-3 bg-white/[0.04] rounded mb-4" />
          <div className="w-56 h-10 bg-white/[0.08] rounded-xl mb-3" />
          <div className="w-80 h-4 bg-white/[0.04] rounded" />
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-white/[0.04] px-6 py-3">
        <div className="flex gap-2">
          {[120, 100, 140, 110].map((w, i) => (
            <div key={i} className="h-8 rounded-full bg-white/[0.04]" style={{ width: w }} />
          ))}
        </div>
      </div>
      {/* Diagram skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-8 mb-12 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-0 flex-shrink-0">
              <div className="w-44 h-28 rounded-2xl bg-white/[0.04]" />
              {i < 5 && <div className="w-8 h-px bg-white/[0.04] mx-0" />}
            </div>
          ))}
        </div>
        <div className="h-24 rounded-2xl bg-white/[0.04] border border-dashed border-white/[0.08]" />
      </div>
    </div>
  );
}
