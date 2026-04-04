export default function LoreBookLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-32 rounded bg-white/[0.04] animate-pulse mb-8" />
        <div className="h-12 w-3/4 rounded-lg bg-white/[0.04] animate-pulse mb-4" />
        <div className="h-5 w-48 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/[0.02] animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
