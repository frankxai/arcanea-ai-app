import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About Arcanea | A Living Mythology for the Age of AI-Human Co-Creation",
  description:
    "Arcanea is simultaneously a fantasy universe, a social platform, a philosophy of creation, and a library of wisdom. Ten Guardians. Five Elements. The journey from Apprentice to Luminor.",
  openGraph: {
    title: "About Arcanea | A Living Mythology",
    description:
      "A fantasy universe, social platform, philosophy of creation, and library of wisdom — all woven into one living mythology.",
    images: ["/og-about.png"],
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
