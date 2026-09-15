/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { StudioHub } from "./studio-hub";

export const metadata: Metadata = {
  title: "Studio — Universal Creative Workspace — Arcanea",
  description:
    "Drop anything in. Transform everything. The Studio ingests files, URLs, and connected sources — classifies, stores in Markdown + JSONML, and routes to your world graph. Open formats. Semantic search. Yours forever.",
  openGraph: {
    title: "Studio — Universal Creative Workspace — Arcanea",
    description:
      "Drop anything in. Transform everything. The Studio ingests files, URLs, and connected sources — classifies, stores in Markdown + JSONML, and routes to your world graph.",
  },
  alternates: { canonical: "/studio" },
};

export default function StudioPage() {
  return <StudioHub />;
}
