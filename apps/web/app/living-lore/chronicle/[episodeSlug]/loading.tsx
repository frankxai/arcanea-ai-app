export default function Loading() {
  return (
    <div className="min-h-screen py-24 px-4 animate-pulse">
      <div className="max-w-2xl mx-auto">
        <div className="w-20 h-4 bg-white/[0.04] rounded mb-8" />
        <div className="w-64 h-8 bg-white/[0.08] rounded-xl mb-4" />
        <div className="w-48 h-4 bg-white/[0.04] rounded mb-10" />

        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-white/[0.04] rounded"
              style={{ width: `${65 + (i % 4) * 8}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
