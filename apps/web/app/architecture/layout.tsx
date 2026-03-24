import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Architecture — Arcanea Intelligence OS",
  description:
    "Interactive visualization of the Arcanea ecosystem: Intelligence OS hierarchy, Guardian routing, memory architecture, and agent orchestration across 27 repos and 17+ AI models.",
  openGraph: {
    title: "System Architecture — Arcanea",
    description:
      "Explore the Arcanea Intelligence OS — Guardian routing, memory systems, and multi-agent orchestration visualized as interactive graphs.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "System Architecture — Arcanea Intelligence OS",
  description:
    "Interactive visualization of the Arcanea ecosystem: Intelligence OS hierarchy, Guardian routing, memory architecture, and agent orchestration.",
  url: "https://arcanea.ai/architecture",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

export default function ArchitectureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
