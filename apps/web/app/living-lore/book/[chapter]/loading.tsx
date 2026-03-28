export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <div className="w-20 h-4 bg-white/[0.04] rounded mb-8" />

        {/* Chapter header */}
        <div className="mb-10">
          <div className="w-24 h-4 bg-white/[0.04] rounded mb-3" />
          <div className="w-72 h-8 bg-white/[0.08] rounded-xl mb-3" />
          <div className="w-40 h-3 bg-white/[0.04] rounded" />
        </div>

        {/* Content lines */}
        <div className="space-y-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${70 + (i % 3) * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
