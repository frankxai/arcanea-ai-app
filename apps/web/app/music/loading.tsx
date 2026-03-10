export default function MusicLoading() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Hero skeleton */}
      <div className="relative px-6 pt-24 pb-16 text-center">
        <div className="mx-auto max-w-3xl space-y-6 animate-pulse">
          {/* Eyebrow */}
          <div className="mx-auto h-5 w-44 rounded-full bg-white/[0.06]" />
          {/* Title */}
          <div className="mx-auto h-14 w-3/4 rounded-xl bg-white/[0.08]" />
          {/* Subtitle */}
          <div className="mx-auto h-5 w-2/3 rounded bg-white/[0.05]" />
          <div className="mx-auto h-5 w-1/2 rounded bg-white/[0.04]" />

          {/* Stats bar */}
          <div className="mx-auto mt-8 flex w-fit items-center gap-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-8 py-4">
            <div className="h-4 w-24 rounded bg-white/[0.06]" />
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="h-4 w-28 rounded bg-white/[0.06]" />
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="h-4 w-36 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* Track grid skeleton */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Track number */}
                  <div className="h-4 w-6 rounded bg-white/[0.04]" />
                  {/* Title */}
                  <div className="h-5 w-36 rounded bg-white/[0.08]" />
                </div>
                {/* Duration */}
                <div className="h-4 w-10 rounded bg-white/[0.05]" />
              </div>

              {/* Genre badge */}
              <div className="mb-4 h-5 w-28 rounded-full bg-white/[0.05]" />

              {/* Description lines */}
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-white/[0.04]" />
                <div className="h-3 w-4/5 rounded bg-white/[0.03]" />
              </div>

              {/* Play button */}
              <div className="mt-5 flex justify-end">
                <div className="h-10 w-10 rounded-full bg-white/[0.05]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
