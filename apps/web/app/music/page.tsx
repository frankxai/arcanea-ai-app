import type { Metadata } from "next";
import { MusicContent } from "./music-content";

export const metadata: Metadata = {
  title: "Music",
  description:
    "AI-composed soundscapes inspired by the Ten Gates and the mythology of Arcanea. Original music by FrankX — frequencies of creation, flowing through ambient, orchestral, and electronic worlds.",
};

export default function MusicPage() {
  return <MusicContent />;
}
