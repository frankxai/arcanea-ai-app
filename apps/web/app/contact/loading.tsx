/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-12 w-48 bg-white/[0.04] rounded-xl mb-4" />
      <div className="h-4 w-72 bg-white/[0.04] rounded mb-12" />
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="h-12 bg-white/[0.04] rounded-xl" />
          <div className="h-12 bg-white/[0.04] rounded-xl" />
        </div>
        <div className="h-12 bg-white/[0.04] rounded-xl" />
        <div className="h-12 bg-white/[0.04] rounded-xl" />
        <div className="h-36 bg-white/[0.04] rounded-xl" />
        <div className="h-12 w-40 bg-white/[0.06] rounded-xl" />
      </div>
    </div>
  );
}
