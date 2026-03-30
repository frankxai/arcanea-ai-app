import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Products — Infrastructure for the Agent Economy",
  description:
    "Memory, skills, identity, creative APIs, orchestration, and world-building. Everything your AI agent needs in one platform.",
  openGraph: {
    title: "Products — Infrastructure for the Agent Economy",
    description:
      "Memory, skills, identity, creative APIs, orchestration, and world-building. Everything your AI agent needs in one platform.",
  },
  alternates: { canonical: "/products" },
};

export default function ProductsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
