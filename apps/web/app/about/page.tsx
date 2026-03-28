import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arcanea is a creator platform for chat, world-building, creative output, and a deep philosophy library. Mythology is the depth layer, not the barrier to entry.",
  openGraph: {
    title: "About Arcanea",
    description:
      "Arcanea helps creators chat with AI, build coherent worlds, and turn imagination into output with a richer underlying philosophy.",
    images: [
      {
        url: "/guardians/v3/shinkami-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Shinkami - Guardian of the Source Gate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/guardians/v3/shinkami-hero-v3.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Arcanea",
  description:
    "Arcanea is a creator platform for chat, world-building, and creative output, shaped by a deep library of philosophy and lore.",
  url: "https://arcanea.ai/about",
  mainEntity: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
    description:
      "Creative intelligence platform for world-builders, with AI partners, creation tools, and a philosophy library.",
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </>
  );
}
