/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import QuizClient from "./quiz-client";

export const metadata: Metadata = {
  title: "What Is Your Origin Class?",
  description:
    "Take the Arcanea Origin Class Quiz and discover the source of your power. Are you an Arcan, Gate-Touched, Celestial, Architect, or one of the five other origins? Eight questions reveal your place in the multiverse.",
  openGraph: {
    title: "What Is Your Origin Class?",
    description:
      "Discover your Arcanean origin in 8 questions. Your power has a source — find it.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is Your Origin Class?",
    description: "Discover your Arcanean origin in 8 questions.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Arcanea Origin Class Quiz",
  description:
    "Take the Arcanea Origin Class Quiz and discover the source of your power. Eight questions reveal your place in the multiverse.",
  url: "https://arcanea.ai/quiz",
  provider: {
    "@type": "Organization",
    name: "Arcanea",
    url: "https://arcanea.ai",
  },
  about: {
    "@type": "Thing",
    name: "Origin Classes",
    description: "Eight archetypes in the Arcanea creative multiverse",
  },
};

export default function QuizPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuizClient />
    </>
  );
}
