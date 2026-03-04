export default function GateDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <div className="h-3 w-16 rounded bg-white/[0.06]" />
        <div className="h-3 w-2 rounded bg-white/[0.04]" />
        <div className="h-3 w-20 rounded bg-white/[0.06]" />
        <div className="h-3 w-2 rounded bg-white/[0.04]" />
        <div className="h-3 w-24 rounded bg-white/[0.06]" />
      </div>

      {/* Hero skeleton */}
      <div className="mb-12 rounded-3xl liquid-glass border border-white/[0.06] p-10 md:p-14">
        <div className="mb-6 h-6 w-32 rounded-full bg-white/[0.06]" />
        <div className="mb-4 h-14 w-3/4 rounded-2xl bg-white/[0.06]" />
        <div className="mb-2 h-5 w-2/4 rounded-xl bg-white/[0.04]" />
        <div className="mb-8 h-5 w-1/3 rounded-xl bg-white/[0.04]" />
        <div className="flex gap-4">
          <div className="h-12 w-40 rounded-2xl bg-white/[0.06]" />
          <div className="h-12 w-32 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>

      {/* Two-col content skeleton */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-2xl liquid-glass border border-white/[0.06] p-7 space-y-4">
          <div className="h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-6 w-32 rounded-xl bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
            <div className="h-3 w-4/6 rounded bg-white/[0.04]" />
          </div>
        </div>
        <div className="rounded-2xl liquid-glass border border-white/[0.06] p-7 space-y-4">
          <div className="h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-6 w-32 rounded-xl bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-5/6 rounded bg-white/[0.04]" />
            <div className="h-3 w-4/6 rounded bg-white/[0.04]" />
          </div>
        </div>
      </div>

      {/* Teachings skeleton */}
      <div className="rounded-2xl liquid-glass border border-white/[0.06] p-7 mb-8 space-y-3">
        <div className="h-4 w-32 rounded bg-white/[0.06]" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 h-4 w-4 rounded-full bg-white/[0.06] shrink-0" />
            <div className="h-4 w-full rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Navigation skeleton */}
      <div className="flex justify-between">
        <div className="h-12 w-40 rounded-2xl bg-white/[0.04]" />
        <div className="h-12 w-40 rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
