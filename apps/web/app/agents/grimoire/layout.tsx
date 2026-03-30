import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "The Grimoire — Your Personal Creative Universe",
  description:
    "Answer ten questions. Wake up to a complete creative universe. Mythology-powered AI agents build your world, characters, magic system, and stories overnight.",
  openGraph: {
    title: "The Grimoire — Your Personal Creative Universe",
    description:
      "Mythology-powered AI agents build your complete creative universe overnight. Characters, magic systems, factions, and stories — all from ten questions.",
  },
  alternates: { canonical: "/agents/grimoire" },
};

export default function GrimoireLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
