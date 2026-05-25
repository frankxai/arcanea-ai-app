/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { ProtocolContent } from "./protocol-content";

export const metadata: Metadata = {
  title: "Arcanean Protocol — Open standards for agentic creation — Arcanea",
  description:
    "The open-protocol layer for agentic world-building. Agent registry, IP licensing, smart-contract royalties, BYOK inference. MIT licensed. Your sovereignty guaranteed.",
  alternates: { canonical: "/protocol" },
  openGraph: {
    title: "Arcanean Protocol — Open standards for agentic creation — Arcanea",
    description:
      "The open-protocol layer for agentic world-building. Agent registry, IP licensing, smart-contract royalties, BYOK inference. MIT licensed. Your sovereignty guaranteed.",
  },
};

export default function ProtocolPage() {
  return <ProtocolContent />;
}
