/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--arc-cosmic-void)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="pt-20 pb-8 text-center animate-pulse">
          <div className="h-3 w-40 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-10 w-64 mx-auto rounded bg-white/[0.06] mb-4" />
          <div className="h-4 w-48 mx-auto rounded bg-white/[0.06]" />
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-white/[0.04]" />
            ))}
          </div>
        </div>
        <div className="h-[60vh] rounded-2xl bg-white/[0.02] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white/10 animate-ping" />
        </div>
      </div>
    </div>
  );
}
