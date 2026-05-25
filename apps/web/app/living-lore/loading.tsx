/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Skeleton } from '@/components/ui/skeleton';

export default function LivingLoreLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 pt-8">
      {/* Hero skeleton */}
      <Skeleton variant="rect" className="w-full h-32 mb-8" />

      {/* Section heading */}
      <Skeleton variant="text" className="w-48 h-6 mb-6" />

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} variant="rect" className="w-full h-48 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
