import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Agents — AI That Creates For You",
  description:
    "Browse and run autonomous AI agents that write stories, build worlds, compose music, design characters, and more. Powered by the Arcanea Intelligence System.",
  openGraph: {
    title: "Arcanea Agents — AI That Creates For You",
    description:
      "Autonomous AI agents for creators. Write, build, compose, design — powered by the Ten Gates.",
  },
  alternates: { canonical: "/agents" },
};

export default function AgentsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
