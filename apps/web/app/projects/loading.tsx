/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function ProjectsLoading() {
  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-44 rounded-lg bg-white/[0.04] animate-pulse mb-3" />
        <div className="h-5 w-64 rounded bg-white/[0.03] animate-pulse mb-12" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-white/[0.02] animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      </div>
    </div>
  );
}
