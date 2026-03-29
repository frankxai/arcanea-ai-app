import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ops Center",
  description:
    "Arcanea Ops Center — system health, repository status, and infrastructure monitoring across the multiverse.",
  openGraph: {
    title: "Ops Center",
    description:
      "Arcanea Ops Center — system health, repository status, and infrastructure monitoring across the multiverse.",
  },
};

export default function OpsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
