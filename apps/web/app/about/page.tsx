import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arcanea is a creative multiverse — chat with AI, build fantasy worlds, share what you make, and turn imagination into products. Six layers, one ecosystem.",
  openGraph: {
    title: "About Arcanea — The Creative Multiverse",
    description:
      "Chat with AI. Build fantasy worlds. Share what you make. Turn imagination into products. Six layers, one creative multiverse.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Arcanea',
  description:
    'A creative multiverse where creators chat with AI, build fantasy worlds, contribute to an open-source civilization, and turn imagination into products.',
  url: 'https://arcanea.ai/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
    description:
      'Creative multiverse platform. Six layers: Chat, Worlds, Feed, OSS, Community, Academy. 200K+ words of creative philosophy. Open source.',
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
