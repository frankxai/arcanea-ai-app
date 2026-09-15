/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Agents — AI That Creates For You",
  description:
    "Browse and run autonomous AI agents that write stories, build worlds, compose music, design characters, and more. Powered by the Arcanea Intelligence System.",
  openGraph: {
    title: "Arcanea Agents — AI That Creates For You",
    description:
      "Autonomous AI agents for creators. Write, build, compose, design — powered by the Ten Gates.",
  },
  alternates: { canonical: "/agents" },
};

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
