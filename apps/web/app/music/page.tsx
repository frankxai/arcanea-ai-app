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
