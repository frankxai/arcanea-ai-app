/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function ShowcaseLoading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)] animate-pulse">
      <div className="max-w-6xl mx-auto px-6 pt-32">
        {/* Hero skeleton */}
        <div className="text-center mb-16">
          <div className="h-4 w-32 mx-auto rounded bg-white/[0.04] mb-6" />
          <div className="h-12 w-96 mx-auto rounded-lg bg-white/[0.03] mb-4" />
          <div className="h-5 w-80 mx-auto rounded bg-white/[0.02]" />
        </div>
        {/* Cards skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
