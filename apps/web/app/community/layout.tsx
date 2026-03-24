import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arcanea Community — Join the Creative Civilization',
  description: 'Connect with creators, share your work, and build together in the Arcanea community. Join a civilization of creative minds shaping the future.',
  openGraph: {
    title: 'Arcanea Community — Join the Creative Civilization',
    description: 'Connect with creators, share your work, and build together in the Arcanea community. Join a civilization of creative minds shaping the future.',
    type: 'website',
  },
  alternates: { canonical: '/community' },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Arcanea Community — Join the Creative Civilization",
  description:
    "Connect with creators, share your work, and build together in the Arcanea community. Join a civilization of creative minds shaping the future.",
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
