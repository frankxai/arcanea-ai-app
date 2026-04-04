export default function BookDocsLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="h-5 w-72 rounded bg-white/[0.03] animate-pulse mb-8" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-white/[0.02] animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
        ))}
      </div>
    </div>
  );
}
