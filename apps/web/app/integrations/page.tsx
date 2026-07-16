/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { IntegrationsContent } from "./integrations-content";

// ---------------------------------------------------------------------------
// Metadata — Server Component
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Integrations Status",
  description:
    "Arcanea integration status by category: live, beta, and planned tools labeled by what is actually wired today.",
  openGraph: {
    title: "Integrations Status",
    description:
      "Live, beta, and planned integration map for Arcanea's creator stack.",
    url: "/integrations",
  },
  alternates: { canonical: "/integrations" },
};

// ---------------------------------------------------------------------------
// Page — Server Component shell (delegates rendering to client component)
// ---------------------------------------------------------------------------

export default function IntegrationsPage() {
  return <IntegrationsContent />;
}
