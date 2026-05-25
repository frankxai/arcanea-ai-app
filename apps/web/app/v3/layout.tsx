/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcanea — Creative Intelligence Platform",
  description:
    "A creative multiverse: chat with AI, build worlds, compose music, write stories. Development, design, writing, and research — creation tools that work the way you think.",
  robots: { index: false },
  alternates: { canonical: '/v3' },
};

export default function V3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
