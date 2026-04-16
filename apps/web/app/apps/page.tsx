import { Metadata } from "next";
import { AppsContent } from "./apps-content";

export const metadata: Metadata = {
  title: "Apps — Install once. Create forever. — Arcanea",
  description:
    "One-click connectors to the tools you already use. AI models, game engines, social channels, storage — your creative stack, wired together.",
  openGraph: {
    title: "Apps — Install once. Create forever. — Arcanea",
    description:
      "One-click connectors to the tools you already use. AI models, game engines, social channels, storage — your creative stack, wired together.",
  },
  alternates: { canonical: "/apps" },
};

export default function AppsPage() {
  return <AppsContent />;
}
