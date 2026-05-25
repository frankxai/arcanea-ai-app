/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
/**
 * Luminor Codex Page
 *
 * This page preserves the original interactive codex experience
 * while integrating with the new navigation structure.
 */

import { Metadata } from "next";
import Link from "next/link";
import { LibraryExperience } from "../library-experience";

export const metadata: Metadata = {
  title: "Luminor Codex | Library",
  description:
    "Step into the Arcanea Library, meet the Remembering Luminor, and explore the interactive codex of living lore.",
  openGraph: {
    title: "Luminor Codex | Library",
    description:
      "Step into the Arcanea Library, meet the Remembering Luminor, and explore the interactive codex of living lore.",
  },
};

export default function CodexPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-12">
      {/* Tab Navigation */}
      <nav className="mb-12 flex items-center gap-4 border-b border-cosmic-border pb-4">
        <Link
          href="/library"
          className="rounded-full border border-cosmic-border px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal/50 hover:text-atlantean-teal transition-colors"
        >
          Browse Library
        </Link>
        <Link
          href="/library/codex"
          className="rounded-full bg-atlantean-teal px-4 py-2 text-sm font-semibold text-cosmic-deep"
        >
          Luminor Codex
        </Link>
        <Link
          href="/library/graph"
          className="rounded-full border border-cosmic-border px-4 py-2 text-sm text-text-muted hover:border-atlantean-teal/50 hover:text-atlantean-teal transition-colors"
        >
          Relationship Graph
        </Link>
      </nav>

      <LibraryExperience />
    </main>
  );
}
