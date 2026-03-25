import { Skeleton } from '@/components/ui/skeleton';

export default function JournalLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
      {/* Heading skeleton */}
      <Skeleton variant="text" className="w-48 h-8 mb-2" />
      <Skeleton variant="text" className="w-72 h-4 mb-10" />

      {/* Rank card skeleton */}
      <div className="rounded-xl border border-[rgba(0,188,212,0.08)] p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circle" className="w-16 h-16 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-32 h-6" />
            <Skeleton variant="text" className="w-48 h-4" />
          </div>
        </div>
        <Skeleton variant="rect" className="w-full h-3 rounded-full" />
      </div>

      {/* Gates grid skeleton */}
      <Skeleton variant="text" className="w-32 h-6 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="w-full h-24 rounded-lg" />
        ))}
      </div>

      {/* Bonds list skeleton */}
      <Skeleton variant="text" className="w-28 h-6 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-[rgba(0,188,212,0.08)] p-4">
            <Skeleton variant="circle" className="w-10 h-10 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-36 h-4" />
              <Skeleton variant="text" className="w-24 h-3" />
            </div>
            <Skeleton variant="rect" className="w-16 h-6 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
