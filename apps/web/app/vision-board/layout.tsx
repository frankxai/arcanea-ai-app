import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision Board",
  description:
    "Map your creative vision, set goals, and track your journey through the Ten Gates. A personal space for creative intention and manifestation.",
  openGraph: {
    title: "Vision Board | Arcanea",
    description:
      "Map your creative vision, set goals, and track your journey through the Ten Gates of Arcanea.",
  },
};

export default function VisionBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
