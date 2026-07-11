/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { VaultContent } from "./vault-content";

export const metadata: Metadata = {
  title: "Vault — Your Studio Memory",
  description:
    "Every document you drop into Arcanea Studio lives here. Classified, embedded, searchable. Markdown + JSONML. Yours to export anytime.",
  alternates: { canonical: "/studio/vault" },
};

export default function VaultPage() {
  return <VaultContent />;
}
