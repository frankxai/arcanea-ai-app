/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
'use client';

import Link from 'next/link';

export default function ChallengeError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h2 className="font-display text-2xl font-bold text-white mb-3">Challenge not found</h2>
        <p className="text-white/40 text-sm mb-6">{error.message || 'This challenge may have ended or the link is incorrect.'}</p>
        <div className="flex justify-center gap-3">
          <button onClick={reset} className="px-4 py-2 rounded-xl border border-white/10 text-sm text-white/60 hover:bg-white/5 transition-colors">Try again</button>
          <Link href="/challenges" className="px-4 py-2 rounded-xl bg-[var(--arc-brand-atlantean-teal)]/10 border border-[var(--arc-brand-atlantean-teal)]/20 text-sm text-[var(--arc-brand-atlantean-teal)] hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors">All challenges</Link>
        </div>
      </div>
    </div>
  );
}
