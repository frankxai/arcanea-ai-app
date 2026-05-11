/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Introducing Arcanea Prompt Books: Your AI Prompts Deserve a Home",
  description:
    "79 files, 11,579 lines, 10 phases — a complete cross-device prompt management system with context engineering, real-time sync, and Luminor themes.",
  openGraph: {
    title: "Introducing Arcanea Prompt Books: Your AI Prompts Deserve a Home",
    description:
      "A complete cross-device prompt management system with context engineering, real-time sync, and Luminor themes.",
    type: "article",
    publishedTime: "2026-02-01T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Arcanea Prompt Books",
    description:
      "A complete cross-device prompt management system with context engineering and real-time sync.",
  },
  alternates: { canonical: '/blog/arcanea-prompt-books' },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
