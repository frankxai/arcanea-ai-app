/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
"use client";

import Link from "next/link";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[var(--arc-cosmic-void)] px-4 py-12">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--arc-fire)]/20 bg-[var(--arc-fire)]/10">
        <svg
          className="h-6 w-6 text-[var(--arc-fire)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h2 className="mb-2 font-display text-xl font-bold text-[var(--arc-brand-atlantean-teal)]">
        Chat Unavailable
      </h2>

      <p className="mb-1 max-w-sm text-center text-sm text-[var(--arc-text-secondary)]">
        Something went wrong loading the chat.
      </p>

      {error.message && (
        <p className="mb-6 max-w-sm break-all text-center font-mono text-xs text-[var(--arc-fire)]/70">
          {error.message}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg border border-[var(--arc-brand-atlantean-teal)]/40 bg-[var(--arc-brand-atlantean-teal)]/12 px-5 py-2.5 text-sm font-semibold text-[var(--arc-brand-atlantean-teal)] transition-colors hover:bg-[var(--arc-brand-atlantean-teal)]/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/40"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/[0.1] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--arc-brand-atlantean-teal)]/30"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
