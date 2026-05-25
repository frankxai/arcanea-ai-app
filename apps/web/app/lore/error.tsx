/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Lore error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-white/80 mb-2">Something went wrong</h2>
      <p className="text-sm text-white/40 mb-6 max-w-md text-center">
        Could not load this page. {error.digest && <span className="font-mono text-xs text-white/20">({error.digest})</span>}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/30 text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
