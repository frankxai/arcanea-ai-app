import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Creations",
  description:
    "Browse and share AI-generated creations — images, stories, music, and code — from the Arcanea creative community.",
  openGraph: {
    title: "Creations | Arcanea",
    description:
      "Browse and share AI-generated creations — images, stories, music, and code — from the Arcanea creative community.",
  },
  alternates: { canonical: "/creations" },
};

export default function CreationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
