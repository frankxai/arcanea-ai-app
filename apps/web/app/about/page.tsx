import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Arcanea | Creative Intelligence Platform",
  description:
    "Arcanea is a creation platform built on original mythology and philosophy. Sixteen creative intelligences. A library of 34 texts. Tools that think with you.",
  openGraph: {
    title: "About Arcanea | Creative Intelligence Platform",
    description:
      "A creation platform built on original mythology and philosophy. Sixteen creative intelligences, a library of original texts, and tools that think with you.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Arcanea',
  description:
    'A creation platform built on original mythology and philosophy — sixteen creative intelligences, a library of 34 texts, and tools that think with you.',
  url: 'https://arcanea.ai/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
    description:
      'Creative Intelligence Platform. Sixteen intelligences, each with a distinct philosophy. A library of original texts. Tools that think with you.',
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
