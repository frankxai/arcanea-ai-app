export default function MaterialsLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="h-10 w-44 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-72 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
