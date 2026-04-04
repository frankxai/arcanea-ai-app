import type { Metadata } from "next";
import { PageTransition } from "./page-transition";

export const metadata: Metadata = {
  title: "Explore Worlds — Arcanea",
  description:
    "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  openGraph: {
    title: "Explore Worlds — Arcanea",
    description:
      "Discover living universes built by creators. Fork, star, and build on each other's worlds.",
  },
};

export default function WorldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
