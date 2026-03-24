import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Community — Join the Creative Civilization',
  description:
    'Not just users — co-creators. Contribute lore, agents, skills, code, art, music. 27 repos, 35 npm packages, 54 skills, 200K+ words of lore. Built in the open.',
  openGraph: {
    title: 'Arcanea Community — Join the Creative Civilization',
    description:
      'Not just users — co-creators. Contribute lore, agents, skills, code, art, music. 27 repos, 35 npm packages, 54 skills, 200K+ words of lore.',
    type: 'website',
    images: [
      {
        url: '/guardians/v3/elara-hero-v3.webp',
        width: 1024,
        height: 1024,
        alt: 'Elara — Guardian of the Starweave Gate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Creative Civilization — Arcanea Community',
    description:
      'Not just users — co-creators. 27 repos, 35 npm packages, 54 skills, 200K+ words. Built in the open.',
    images: ['/guardians/v3/elara-hero-v3.webp'],
  },
  alternates: { canonical: '/community' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Community — Join the Creative Civilization",
  description:
    "Not just users — co-creators. Contribute lore, agents, skills, code, art, music. 27 repos, 35 npm packages, 54 skills, 200K+ words of lore.",
  url: "https://arcanea.ai/community",
  publisher: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
  about: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
    description:
      "Creative multiverse platform where creators chat with AI, build fantasy worlds, share what they make, and turn imagination into products.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
