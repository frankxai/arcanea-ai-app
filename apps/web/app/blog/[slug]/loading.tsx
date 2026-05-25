/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cosmic-void" />
        <div className="absolute inset-0 bg-cosmic-mesh" />
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-4 mb-10">
          <div className="h-4 bg-white/[0.06] rounded w-32" />
          <div className="h-12 bg-white/[0.06] rounded w-3/4" />
          <div className="flex gap-4">
            <div className="h-4 bg-white/[0.06] rounded w-24" />
            <div className="h-4 bg-white/[0.06] rounded w-24" />
            <div className="h-4 bg-white/[0.06] rounded w-24" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="card-3d liquid-glass rounded-2xl p-6 sm:p-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-white/[0.06] rounded w-full" />
            <div className="h-4 bg-white/[0.06] rounded w-full" />
            <div className="h-4 bg-white/[0.06] rounded w-3/4" />
            <div className="h-32 bg-white/[0.06] rounded w-full my-8" />
            <div className="h-4 bg-white/[0.06] rounded w-full" />
            <div className="h-4 bg-white/[0.06] rounded w-full" />
            <div className="h-4 bg-white/[0.06] rounded w-5/6" />
          </div>
        </div>
      </main>
    </div>
  );
}
