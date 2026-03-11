export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-8 animate-pulse">
      <div className="mb-8 h-4 w-40 rounded bg-white/[0.06]" />
      <div className="mb-12 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 md:p-12">
        <div className="mb-4 h-6 w-36 rounded-full bg-white/[0.06]" />
        <div className="mb-3 h-12 w-72 rounded bg-white/[0.06]" />
        <div className="mb-2 h-5 w-96 rounded bg-white/[0.04]" />
        <div className="h-5 w-80 rounded bg-white/[0.04]" />
      </div>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7"
          >
            <div className="mb-4 h-5 w-32 rounded bg-white/[0.06]" />
            <div className="mb-2 h-7 w-56 rounded bg-white/[0.06]" />
            <div className="mb-4 h-4 w-72 rounded bg-white/[0.04]" />
            <div className="border-t border-white/[0.05] pt-4">
              <div className="mb-2 h-4 w-full rounded bg-white/[0.04]" />
              <div className="mb-2 h-4 w-5/6 rounded bg-white/[0.04]" />
              <div className="h-4 w-4/6 rounded bg-white/[0.04]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
