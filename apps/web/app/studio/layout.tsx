import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creation Studio | Arcanea",
  description:
    "Manifest your creative visions with Guardian-guided intelligence for text, image, music, and code creation.",
  openGraph: {
    title: "Creation Studio | Arcanea",
    description: "Where creators manifest their visions with AI companions.",
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
