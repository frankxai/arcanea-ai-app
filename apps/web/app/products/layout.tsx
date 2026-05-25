/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Products — Infrastructure for the Agent Economy",
  description:
    "Memory, skills, identity, creative APIs, orchestration, and world-building. Everything your AI agent needs in one platform.",
  openGraph: {
    title: "Products — Infrastructure for the Agent Economy",
    description:
      "Memory, skills, identity, creative APIs, orchestration, and world-building. Everything your AI agent needs in one platform.",
  },
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
