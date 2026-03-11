export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-8 animate-pulse">
      <div className="mb-8 h-4 w-32 rounded bg-white/[0.06]" />
      <div className="mb-14">
        <div className="mb-4 h-6 w-40 rounded-full bg-white/[0.06]" />
        <div className="mb-4 h-12 w-80 rounded bg-white/[0.06]" />
        <div className="h-5 w-96 rounded bg-white/[0.04]" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7"
          >
            <div className="mb-4 h-4 w-32 rounded bg-white/[0.06]" />
            <div className="mb-2 h-6 w-48 rounded bg-white/[0.06]" />
            <div className="mb-3 h-4 w-full rounded bg-white/[0.04]" />
            <div className="h-4 w-2/3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
