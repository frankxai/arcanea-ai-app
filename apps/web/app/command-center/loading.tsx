import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero skeleton */}
        <Skeleton variant="rect" className="w-full h-48 rounded-3xl mb-8" />

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-28 rounded-xl" />
          ))}
        </div>

        {/* Milestones */}
        <Skeleton variant="text" className="w-48 h-8 mb-6" />
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-44 rounded-xl" />
          ))}
        </div>

        {/* Packages */}
        <Skeleton variant="text" className="w-48 h-8 mb-6" />
        <div className="flex gap-3 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="w-28 h-10 rounded-lg" />
          ))}
        </div>
        <Skeleton variant="rect" className="w-full h-64 rounded-xl mb-12" />

        {/* Sprint + Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64 rounded-xl" />
          <Skeleton variant="rect" className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
