import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Reference — Arcanea",
  description:
    "Complete API documentation for Arcanea — Memory, Creative, Agent, and Ops endpoints with examples in cURL and TypeScript.",
  openGraph: {
    title: "API Reference | Arcanea",
    description:
      "Complete API documentation for Memory, Creative, Agent, and Ops endpoints. Interactive examples in cURL and TypeScript.",
    type: "website",
    url: "https://arcanea.ai/docs/api",
  },
  alternates: { canonical: "/docs/api" },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea API Reference",
    description:
      "Complete API documentation for Memory, Creative, Agent, and Ops endpoints.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  name: "Arcanea API Reference",
  description:
    "Complete API documentation for Arcanea — Memory, Creative, Agent, and Ops endpoints with examples in cURL and TypeScript.",
  url: "https://arcanea.ai/docs/api",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
};

export default function ApiDocsLayout({
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
