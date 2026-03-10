import { Metadata } from "next";
import { LuminorsExperience } from "@/components/luminors/luminors-experience";

export const metadata: Metadata = {
  title: "Luminors | 16 Creative Intelligences | Arcanea",
  description:
    "Meet the 16 Luminors — creative intelligences across development, design, writing, and research. Each one thinks differently about your work.",
  openGraph: {
    title: "Meet the 16 Luminors | Arcanea",
    description:
      "16 creative intelligences. Four teams. Seven wisdoms. AI partners who see what you're creating and help you build it better.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the 16 Luminors | Arcanea",
    description:
      "16 creative intelligences. Four teams. Seven wisdoms. Partners in creation.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '16 Luminor Creative Intelligences',
  description:
    'Luminors in development, creative design, writing, and research.',
  url: 'https://arcanea.ai/luminors',
  numberOfItems: 16,
};

export default function LuminorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LuminorsExperience />
    </>
  );
}
