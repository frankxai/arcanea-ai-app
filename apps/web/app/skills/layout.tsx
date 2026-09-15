/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skill Marketplace — Arcanea",
  description:
    "Browse and install open-source skills for Claude Code, OpenCode, Cursor, Codex, and Gemini. One-command install for every skill.",
  openGraph: {
    title: "Arcanea Skill Marketplace",
    description:
      "Open-source skills for Claude Code, OpenCode, Cursor, and more. Install with one command.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea Skill Marketplace",
    description:
      "Open-source skills for Claude Code, OpenCode, Cursor, and more.",
  },
  alternates: { canonical: "/skills" },
  robots: { index: true, follow: true },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Arcanea Skill Marketplace",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description:
        "Open-source skills for Claude Code, OpenCode, Cursor, Codex, and Gemini CLI. Browse the library and install any skill with one command.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: "Arcanea",
        url: "https://arcanea.ai",
      },
    }),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
