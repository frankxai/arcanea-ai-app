import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Records",
  description:
    "Arcanea Records — AI-generated music, soundscapes, and elemental compositions. Listen to the sounds of the creative multiverse.",
  openGraph: {
    title: "Records | Arcanea",
    description:
      "Arcanea Records — AI-generated music, soundscapes, and elemental compositions. Listen to the sounds of the creative multiverse.",
  },
  alternates: { canonical: "/records" },
};

export default function RecordsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
