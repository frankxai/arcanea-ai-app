/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { DistributeContent } from "./distribute-content";

export const metadata: Metadata = {
  title: "Distribute — Publish Everywhere",
  description:
    "Your world generates a chapter. It posts to Discord, trims to X, becomes a Reel, gets archived to YouTube — automatically. One creation, every channel.",
  openGraph: {
    title: "Distribute — Publish Everywhere",
    description:
      "Your world generates a chapter. It posts to Discord, trims to X, becomes a Reel, gets archived to YouTube — automatically.",
  },
  alternates: { canonical: "/distribute" },
};

export default function DistributePage() {
  return <DistributeContent />;
}
