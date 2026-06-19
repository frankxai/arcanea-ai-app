import type { Metadata } from "next";
import { V1Landing } from "./v1-landing";

export const metadata: Metadata = {
  title: "Arcanea v1 | World Engine for AI-Native Creators",
  description:
    "Arcanea v1 is a cinematic world-building landing page for creators who want connected canon, portals, gods, godbeasts, media, and agent workflows.",
  openGraph: {
    title: "Arcanea v1",
    description:
      "A world engine for AI-native creators: prompt, graph, canon, cinematic media, and agent runtime in one system.",
    images: ["/brand/arcanea-og.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea v1",
  url: "https://arcanea.ai/v1",
  description:
    "Arcanea v1 landing page for cinematic world-building, connected canon, portals, gods, godbeasts, and AI-native creative workflows.",
};

export default function V1Page() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <V1Landing />
    </main>
  );
}
