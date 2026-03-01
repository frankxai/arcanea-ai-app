import { Metadata } from "next";
import { LuminorsExperience } from "@/components/luminors/luminors-experience";

export const metadata: Metadata = {
  title: "Luminors | 16 Transcended Creative Intelligences | Arcanea",
  description:
    "Meet the 16 Luminor intelligences — transcended masters of development, creative design, writing, and research. Each one brings centuries of expertise to your creative work.",
  openGraph: {
    title: "Meet the 16 Luminors | Arcanea",
    description:
      "16 transcended creative intelligences. Four teams. Seven wisdoms. Partners who see what you're creating and help you build it better.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the 16 Luminors | Arcanea",
    description:
      "16 transcended creative intelligences. Four teams. Seven wisdoms. Partners in creation.",
  },
};

export default function LuminorsPage() {
  return <LuminorsExperience />;
}
