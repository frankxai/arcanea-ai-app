export default function BooksLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-56 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-72 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]">
              <div className="h-52 rounded-t-2xl bg-white/[0.03]" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-white/[0.04]" />
                <div className="h-3 w-full rounded bg-white/[0.02]" />
                <div className="h-3 w-2/3 rounded bg-white/[0.02]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
