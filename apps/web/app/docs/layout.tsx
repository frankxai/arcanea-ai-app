import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Developer documentation for the Arcanea platform — SDK quickstart, API reference, Luminor integration, and deployment guides.",
  openGraph: {
    title: "Documentation | Arcanea",
    description:
      "Developer documentation for the Arcanea platform — SDK quickstart, API reference, Luminor integration, and deployment guides.",
  },
  alternates: { canonical: "/docs" },
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
