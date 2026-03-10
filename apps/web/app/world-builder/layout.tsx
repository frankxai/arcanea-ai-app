import { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Builder | Create Immersive Worlds",
  description:
    "Design and build immersive creative worlds with AI assistance. Define geography, cultures, magic systems, and lore for your stories and games.",
  openGraph: {
    title: "World Builder",
    description:
      "Design immersive creative worlds with AI. Geography, cultures, magic systems, and lore — all in one builder.",
  },
};

export default function WorldBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
