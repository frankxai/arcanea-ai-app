import { Skeleton } from '@/components/ui/skeleton';

export default function ChronicleLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
      {/* Heading skeleton */}
      <Skeleton variant="text" className="w-64 h-8 mb-2" />
      <Skeleton variant="text" className="w-96 h-4 mb-10" />

      {/* Act cards */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[rgba(0,188,212,0.08)] p-6 space-y-4">
            <Skeleton variant="text" className="w-40 h-6" />
            <Skeleton variant="text" className="w-full h-4" />
            <Skeleton variant="text" className="w-3/4 h-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} variant="rect" className="w-full h-28 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
