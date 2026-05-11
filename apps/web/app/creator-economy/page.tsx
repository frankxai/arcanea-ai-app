/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { CreatorEconomyContent } from "./creator-economy-content";

export const metadata: Metadata = {
  title: "Creator Economy — Make a living from your worlds — Arcanea",
  description:
    "Seven ways to earn on Arcanea. Marketplace, memberships, NFTs, royalties, tokens. You keep 90%+, always.",
  alternates: { canonical: "/creator-economy" },
  openGraph: {
    title: "Creator Economy — Make a living from your worlds — Arcanea",
    description:
      "Seven ways to earn on Arcanea. Marketplace, memberships, NFTs, royalties, tokens. You keep 90%+, always.",
  },
};

export default function CreatorEconomyPage() {
  return <CreatorEconomyContent />;
}
