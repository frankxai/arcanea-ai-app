/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collection Not Found",
  description: "This collection does not exist in the Library of Arcanea.",
  robots: { index: false, follow: true },
};

export default function CollectionNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-[8rem] md:text-[10rem] font-display font-bold leading-none text-white/[0.04] select-none mb-6">
        404
      </h1>

      <p className="text-lg text-text-secondary max-w-md mb-2">
        This collection hasn&apos;t been written yet.
      </p>
      <p className="text-sm text-text-muted max-w-sm mb-10">
        The Library holds 17 collections of wisdom, but this path leads nowhere.
        Perhaps the text you seek lives under a different name.
      </p>

      <div className="flex gap-4">
        <Link
          href="/library"
          className="px-5 py-2.5 rounded-xl border border-[var(--arc-brand-atlantean-teal)]/30 bg-[var(--arc-brand-atlantean-teal)]/10 text-[var(--arc-brand-atlantean-teal)] text-sm font-medium hover:bg-[var(--arc-brand-atlantean-teal)]/20 transition-colors"
        >
          Browse the Library
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-white/[0.08] text-text-secondary text-sm font-medium hover:bg-white/[0.04] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
