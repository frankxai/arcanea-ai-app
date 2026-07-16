/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AgentHub — Master the Gates, Command the Agents",
  description:
    "Interactive skill tree with 10 Gate branches and 50 skills to unlock. Navigate the star-map, track your mastery, and activate the creative intelligence of Arcanea.", // facts-ok: Academy skill-tree nodes
  openGraph: {
    title: "Arcanea AgentHub — Skyrim-Style Skill Tree",
    description:
      "Ten branches of power. Fifty skills to unlock. Master the Gates and command the Agents.",
  },
  alternates: { canonical: "/agents/hub" },
};

export default function AgentHubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
