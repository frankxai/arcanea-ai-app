/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Skeleton } from '@/components/ui/skeleton';

export default function CrewLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
      {/* Heading skeleton */}
      <Skeleton variant="text" className="w-48 h-8 mb-2" />
      <Skeleton variant="text" className="w-80 h-4 mb-10" />

      {/* Crew card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-[rgba(0,188,212,0.08)] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="w-12 h-12 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-28 h-5" />
                <Skeleton variant="text" className="w-20 h-3" />
              </div>
            </div>
            <Skeleton variant="text" className="w-full h-3" />
            <Skeleton variant="text" className="w-2/3 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
