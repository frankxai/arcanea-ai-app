import type { Metadata } from "next";
import { GuardianGallery } from "@/components/gallery/guardian-gallery";

export const metadata: Metadata = {
  title: "Guardians of the Ten Gates | Arcanea Gallery",
  description:
    "Behold the ten divine Guardians of Arcanea — God/Goddess portraits, Godbeast companions, and gallery art across every Gate from Foundation to Source.",
  openGraph: {
    title: "Guardians of the Ten Gates — Arcanea",
    description:
      "76 artworks spanning all ten Guardians, their divine-bond Godbeasts, and gallery variations. From Lyssandria at Foundation to Shinkami at Source.",
    type: "website",
    images: [
      {
        url: "/guardians/v3/shinkami-hero-v3.webp",
        width: 1024,
        height: 1024,
        alt: "Shinkami — Guardian of the Source Gate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guardians of the Ten Gates — Arcanea",
    description:
      "10 divine Guardians × 10 Godbeasts × gallery variations. Every artwork from the Arcanea canon.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Guardians of the Ten Gates",
  description:
    "Canonical artwork for all ten Guardians of Arcanea — ultra-quality hero portraits, divine-bond art, Godbeast companions, and gallery variations.",
  url: "https://arcanea.ai/gallery/guardians",
  numberOfItems: 76,
  about: {
    "@type": "Thing",
    name: "Arcanea — Ten Gates and Ten Guardians",
    description:
      "The ten divine Gate-keepers of Arcanea, each aligned to a frequency from Foundation to Source.",
  },
};

export default function GuardiansGalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GuardianGallery />
    </>
  );
}
