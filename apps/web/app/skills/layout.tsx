import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills Marketplace — 75+ Creation Skills",
  description:
    "Browse and install 75+ production-grade skills for Claude Code, Cursor, and other AI agents. Development, creative writing, orchestration, and Arcanea world-building.",
  openGraph: {
    title: "Arcanea Skills Marketplace",
    description:
      "75+ skills for creation. Development, creative, intelligence, platform, and Arcanea world-building skills.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcanea Skills Marketplace",
    description: "75+ production-grade skills for Claude Code and AI agents.",
  },
  alternates: { canonical: "/skills" },
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Arcanea Skills Marketplace",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description:
        "75+ production-grade skills for Claude Code and AI coding agents. Categories include development, creative writing, AI orchestration, platform tooling, and Arcanea world-building.",
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
