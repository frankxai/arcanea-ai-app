/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
import type { Metadata } from "next";
import { MusicContent } from "./music-content";

export const metadata: Metadata = {
  title: "Music",
  description:
    "AI-composed soundscapes inspired by the Ten Gates and the mythology of Arcanea. Original music by FrankX — frequencies of creation, flowing through ambient, orchestral, and electronic worlds.",
  openGraph: {
    title: "Music — Arcanea Soundscapes",
    description:
      "Original AI-composed music inspired by the Ten Gates. Ambient, orchestral, and electronic worlds of creation.",
  },
  alternates: { canonical: "/music" },
};

export default function MusicPage() {
  return <MusicContent />;
}
