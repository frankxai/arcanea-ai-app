import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Universe Builder | Create Multi-World Canon | Arcanea",
  description:
    "Build interconnected universes with consistent canon, timelines, and cross-world lore. The ultimate tool for epic multi-world storytelling.",
  openGraph: {
    title: "Universe Builder | Arcanea",
    description:
      "Build interconnected universes with consistent canon, timelines, and cross-world lore for epic storytelling.",
  },
  alternates: { canonical: '/universe-builder' },
};

export default function UniverseBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
