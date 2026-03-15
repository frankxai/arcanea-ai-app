import { Skeleton } from '@/components/ui/skeleton'

export default function PromptBooksLoading() {
  return (
    <div className="flex h-[calc(100dvh-4rem)]">
      {/* Sidebar skeleton */}
      <div className="w-72 border-r border-white/[0.06] bg-white/[0.02] p-4 space-y-4">
        <Skeleton variant="rect" className="h-10 w-full rounded-xl" />
        <Skeleton variant="rect" className="h-8 w-full rounded-lg" />
        <div className="space-y-2 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} variant="rect" className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="rect" className="h-8 w-48 rounded-lg" />
          <Skeleton variant="rect" className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} variant="card" className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
