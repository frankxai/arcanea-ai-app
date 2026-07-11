/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import { Metadata } from 'next';
import { AcademyContent } from './academy-content';

export const metadata: Metadata = {
  title: "Academy — Master the Ten Gates",
  description:
    "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  openGraph: {
    title: "Academy — Master the Ten Gates",
    description:
      "Master the art of world-building through the Ten Gates. Structured courses, exercises, and creative progression from Apprentice to Luminor.",
  },
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  return <AcademyContent />;
}
