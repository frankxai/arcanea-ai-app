/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
export default function CreateWorldLoading() {
  return (
    <main className="min-h-screen bg-[var(--arc-cosmic-void)] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Pulsing orb */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-[var(--arc-brand-atlantean-teal)]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[var(--arc-brand-atlantean-teal)]/30 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--arc-brand-atlantean-teal)] to-[var(--arc-void)] opacity-60" />
        </div>
        {/* Skeleton text */}
        <div className="space-y-3 max-w-md mx-auto">
          <div className="h-8 w-48 mx-auto rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="h-4 w-64 mx-auto rounded bg-white/[0.03] animate-pulse" />
        </div>
      </div>
    </main>
  );
}
