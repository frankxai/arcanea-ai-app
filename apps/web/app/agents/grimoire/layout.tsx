/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Grimoire — Your Personal Creative Universe",
  description:
    "Answer ten questions. Wake up to a complete creative universe. Mythology-powered AI agents build your world, characters, magic system, and stories overnight.",
  openGraph: {
    title: "The Grimoire — Your Personal Creative Universe",
    description:
      "Mythology-powered AI agents build your complete creative universe overnight. Characters, magic systems, factions, and stories — all from ten questions.",
  },
  alternates: { canonical: "/agents/grimoire" },
};

export default function GrimoireLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
