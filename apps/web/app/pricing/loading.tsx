import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)]">
      <main className="mx-auto max-w-6xl px-5 pb-28 pt-20 sm:px-8 md:pt-28">
        <Skeleton variant="text" className="mb-6 h-4 w-20" />
        <Skeleton variant="text" className="mb-6 h-14 w-full max-w-xl" />
        <Skeleton variant="text" className="mb-2 h-5 w-full max-w-2xl" />
        <Skeleton variant="text" className="h-5 w-3/4 max-w-lg" />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 sm:p-8">
              <Skeleton variant="text" className="mb-4 h-3 w-40" />
              <Skeleton variant="text" className="mb-3 h-8 w-56" />
              <Skeleton variant="text" className="mb-8 h-4 w-full" />
              <div className="mb-8 space-y-3">
                {[0, 1, 2].map((j) => (
                  <Skeleton key={j} variant="text" className="h-4 w-3/4" />
                ))}
              </div>
              <Skeleton variant="rect" className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
