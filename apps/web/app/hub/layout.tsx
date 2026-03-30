import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hub",
  description:
    "The Arcanea Hub — guides, creator tools, and platform updates in one place. Everything you need to build in the multiverse.",
  openGraph: {
    title: "Hub | Arcanea",
    description:
      "The Arcanea Hub — guides, creator tools, and platform updates in one place.",
  },
  alternates: { canonical: "/hub" },
};

export default function HubLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
