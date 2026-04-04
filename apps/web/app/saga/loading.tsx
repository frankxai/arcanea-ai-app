export default function SagaLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 w-40 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-72 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-6 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04] p-6">
              <div className="h-32 w-24 rounded-xl bg-white/[0.03] shrink-0" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-5 w-2/3 rounded bg-white/[0.04]" />
                <div className="h-3 w-full rounded bg-white/[0.02]" />
                <div className="h-3 w-4/5 rounded bg-white/[0.02]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
