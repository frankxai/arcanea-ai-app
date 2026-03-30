import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Challenges",
  description:
    "Compete in creative challenges — writing, art, music, and code — with elemental spellbooks and prizes in the Arcanea arena.",
  openGraph: {
    title: "Challenges | Arcanea",
    description:
      "Compete in creative challenges — writing, art, music, and code — with elemental spellbooks and prizes in the Arcanea arena.",
  },
  alternates: { canonical: "/challenges" },
};

export default function ChallengesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
