export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-4 bg-white/[0.04] rounded mb-8" />
        <div className="w-56 h-8 bg-white/[0.08] rounded-xl mb-4" />
        <div className="w-80 h-4 bg-white/[0.04] rounded mb-10" />

        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${60 + (i % 5) * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
