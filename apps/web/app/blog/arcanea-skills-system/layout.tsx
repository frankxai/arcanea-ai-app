/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Introducing Arcanea Skills: Transform Your Claude Code Into a Creation Machine",
  description:
    "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code — all open source.",
  openGraph: {
    title: "Introducing Arcanea Skills: Transform Your Claude Code Into a Creation Machine",
    description:
      "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code — all open source.",
    type: "article",
    publishedTime: "2024-12-01T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Arcanea Skills",
    description:
      "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code.",
  },
  alternates: { canonical: '/blog/arcanea-skills-system' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
