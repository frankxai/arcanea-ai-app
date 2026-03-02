import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creation Studio | Arcanea",
  description:
    "Create text, images, music, and code with AI-assisted tools. Write, design, compose, and build.",
  openGraph: {
    title: "Creation Studio | Arcanea",
    description: "Create text, images, music, and code with AI-assisted tools.",
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
