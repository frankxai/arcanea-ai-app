/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      <div className="max-w-4xl mx-auto px-6 animate-pulse">
        <div className="pt-8"><div className="h-3 w-32 rounded bg-white/[0.06]" /></div>
        <div className="flex gap-2 mt-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full bg-white/[0.04]" />
          ))}
        </div>
        <div className="h-8 w-48 rounded bg-white/[0.06] mb-2" />
        <div className="h-4 w-32 rounded bg-white/[0.04] mb-10" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-white/[0.03]" />
          ))}
        </div>
      </div>
    </div>
  );
}
