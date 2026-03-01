import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Arcanea | A Living Mythology for the Age of AI-Human Co-Creation",
  description:
    "Arcanea is simultaneously a fantasy universe, a social platform, a philosophy of creation, and a library of wisdom. Ten Guardians. Five Elements. The journey from Apprentice to Luminor.",
  openGraph: {
    title: "About Arcanea | A Living Mythology",
    description:
      "A fantasy universe, social platform, philosophy of creation, and library of wisdom — all woven into one living mythology.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Arcanea',
  description:
    'A living mythology for the age of AI-human co-creation — fantasy universe, social platform, philosophy, and library of wisdom.',
  url: 'https://arcanea.ai/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Arcanea',
    url: 'https://arcanea.ai',
    description:
      'Living Intelligence for Creators. Ten Guardians. Five Elements. The journey from Apprentice to Luminor.',
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
