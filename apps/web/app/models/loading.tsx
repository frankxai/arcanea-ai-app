/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function ModelsArenaLoading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] animate-pulse">
      <div className="max-w-7xl mx-auto px-6 pt-32">
        {/* Hero skeleton */}
        <div className="text-center mb-20">
          <div className="h-3 w-28 mx-auto rounded bg-white/[0.04] mb-5" />
          <div className="h-14 w-80 mx-auto rounded-lg bg-white/[0.03] mb-4" />
          <div className="h-5 w-96 mx-auto rounded bg-white/[0.02]" />
        </div>
        {/* Section heading skeleton */}
        <div className="mb-10">
          <div className="h-3 w-24 rounded bg-white/[0.04] mb-3" />
          <div className="h-8 w-64 rounded-lg bg-white/[0.03] mb-2" />
          <div className="h-4 w-80 rounded bg-white/[0.02]" />
        </div>
        {/* Free models grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-24">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>
        {/* Table skeleton */}
        <div className="mb-10">
          <div className="h-3 w-20 rounded bg-white/[0.04] mb-3" />
          <div className="h-8 w-56 rounded-lg bg-white/[0.03]" />
        </div>
        <div className="rounded-2xl border border-white/[0.04] overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-12 border-b border-white/[0.03] bg-white/[0.01]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
