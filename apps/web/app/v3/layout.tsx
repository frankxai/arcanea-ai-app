import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Arcanea — Creative Intelligence Platform",
  description:
    "A creative multiverse: chat with AI, build worlds, compose music, write stories. Development, design, writing, and research — creation tools that work the way you think.",
  robots: { index: false },
};

export default function V3Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
