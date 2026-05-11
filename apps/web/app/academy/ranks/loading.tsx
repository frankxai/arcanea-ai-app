/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="h-8 w-40 bg-white/[0.04] rounded-full mx-auto mb-6" />
        <div className="h-12 w-64 bg-white/[0.06] rounded-xl mx-auto mb-4" />
        <div className="h-5 w-[28rem] bg-white/[0.04] rounded mx-auto max-w-full" />
      </div>
      {/* Rank progression ladder — 5 ranks */}
      <div className="space-y-4">
        {['Apprentice', 'Mage', 'Master', 'Archmage', 'Luminor'].map((_, i) => (
          <div key={i} className="liquid-glass rounded-2xl border border-white/[0.06] p-6 flex items-center gap-6">
            {/* Rank badge */}
            <div className="w-16 h-16 rounded-full bg-white/[0.06] flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-36 bg-white/[0.08] rounded" />
              <div className="h-3 w-24 bg-white/[0.04] rounded-full" />
              <div className="h-3 w-full bg-white/[0.04] rounded" />
            </div>
            {/* Gates required chip */}
            <div className="w-20 h-8 bg-white/[0.04] rounded-xl flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
