/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      <div className="max-w-5xl mx-auto px-6 animate-pulse">
        <div className="pt-20 pb-16 text-center">
          <div className="h-3 w-24 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-12 w-80 mx-auto rounded bg-white/[0.06] mb-6" />
          <div className="h-4 w-96 mx-auto rounded bg-white/[0.04]" />
        </div>
        <div className="space-y-2 mb-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
