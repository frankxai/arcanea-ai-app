import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "AgentHub — Master the Gates, Command the Agents",
  description:
    "Interactive skill tree with 10 Gate branches and 50 skills to unlock. Navigate the star-map, track your mastery, and activate the creative intelligence of Arcanea.",
  openGraph: {
    title: "Arcanea AgentHub — Skyrim-Style Skill Tree",
    description:
      "Ten branches of power. Fifty skills to unlock. Master the Gates and command the Agents.",
  },
  alternates: { canonical: "/agents/hub" },
};

export default function AgentHubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
