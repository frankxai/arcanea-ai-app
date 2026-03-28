export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-4 bg-white/[0.04] rounded mb-8" />

        {/* Portrait */}
        <div className="w-48 h-48 rounded-2xl bg-white/[0.04] mx-auto mb-8" />

        {/* Name and title */}
        <div className="text-center mb-8">
          <div className="w-40 h-7 bg-white/[0.08] rounded-xl mx-auto mb-2" />
          <div className="w-56 h-4 bg-white/[0.04] rounded mx-auto" />
        </div>

        {/* Bio lines */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${75 + (i % 3) * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
