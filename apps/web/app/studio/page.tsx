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
