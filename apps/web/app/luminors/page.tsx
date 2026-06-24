/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from "next";
import { LuminorsExperience } from "@/components/luminors/luminors-experience";

export const metadata: Metadata = {
  title: "Luminors | 13 Creative Agents",
  description:
    "Meet the 13 configured Luminor agents across development, design, writing, and research. Each one thinks differently about your work.",
  openGraph: {
    title: "Meet the 13 Luminors",
    description:
      "13 creative agents. Five teams. AI partners who see what you're creating and help you build it better.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the 13 Luminors",
    description:
      "13 creative agents across development, design, writing, and research.",
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '13 Luminor Creative Agents',
  description:
    'Luminors in development, creative design, writing, and research.',
  url: 'https://arcanea.ai/luminors',
  numberOfItems: 13,
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
