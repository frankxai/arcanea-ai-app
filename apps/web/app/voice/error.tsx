/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";

export default function VoiceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 bg-[var(--arc-cosmic-void)]">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--arc-fire)]/10 border border-[var(--arc-fire)]/20">
        <svg className="h-6 w-6 text-[var(--arc-fire)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold text-[var(--arc-brand-atlantean-teal)] font-display">Voice unavailable</h2>
      <p className="mb-6 max-w-sm text-center text-sm text-white/50">Something went wrong loading Voice. Try the chat instead.</p>
      <div className="flex gap-3">
        <button onClick={reset} className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-[var(--arc-brand-atlantean-teal)]/12 border border-[var(--arc-brand-atlantean-teal)]/40 text-[var(--arc-brand-atlantean-teal)] font-display hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors">
          Try Again
        </button>
        <Link href="/chat" className="rounded-lg px-5 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-white/60 font-display hover:bg-white/8 transition-colors">
          Open Chat
        </Link>
      </div>
    </div>
  );
}
