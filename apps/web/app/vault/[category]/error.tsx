/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <svg className="h-8 w-8" fill="none" stroke="var(--arc-fire)" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">Failed to load vault</h2>
      <p className="mb-6 text-sm text-[var(--arc-text-muted)]">The vault data could not be fetched. Try again.</p>
      <button onClick={reset} className="rounded-lg px-6 py-2.5 text-sm font-medium text-white bg-[var(--arc-brand-cosmic-blue)] hover:bg-[var(--arc-brand-cosmic-blue)] transition-colors">
        Try again
      </button>
    </div>
  );
}
