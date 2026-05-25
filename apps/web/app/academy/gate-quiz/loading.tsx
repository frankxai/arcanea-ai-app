/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="h-8 w-40 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-10 w-72 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[24rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Gate selector */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-white/[0.04] rounded-full border border-white/[0.04]" />
        ))}
      </div>
      {/* Quiz card */}
      <div className="liquid-glass rounded-2xl border border-white/[0.06] p-8 space-y-6">
        {/* Gate info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-white/[0.08] rounded" />
            <div className="h-3 w-24 bg-white/[0.04] rounded-full" />
          </div>
        </div>
        {/* Question */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-white/[0.06] rounded" />
          <div className="h-5 w-3/4 bg-white/[0.06] rounded" />
        </div>
        {/* Options */}
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-full bg-white/[0.04] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
