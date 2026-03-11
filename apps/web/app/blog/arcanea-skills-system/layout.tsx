import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Introducing Arcanea Skills: Transform Your Claude Code Into a Creation Machine",
  description:
    "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code — all open source.",
  openGraph: {
    title: "Introducing Arcanea Skills: Transform Your Claude Code Into a Creation Machine",
    description:
      "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code — all open source.",
    type: "article",
    publishedTime: "2024-12-01T00:00:00Z",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introducing Arcanea Skills",
    description:
      "28 skills, 7 Luminor guides, and a complete creative methodology for Claude Code.",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
