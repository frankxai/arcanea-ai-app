import type { Metadata } from "next";
import { IntegrationsContent } from "./integrations-content";

// ---------------------------------------------------------------------------
// Metadata — Server Component
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Integrations — The Full Arcanea Stack",
  description:
    "From IDE to blockchain. From Suno to Unreal. Arcanea connects the whole pipeline — IDEs, creative AI, distribution, game engines, and Web3 in one platform.",
  openGraph: {
    title: "Integrations — The Full Arcanea Stack",
    description:
      "From IDE to blockchain. From Suno to Unreal. Arcanea connects the whole pipeline — IDEs, creative AI, distribution, game engines, and Web3 in one platform.",
    url: "/integrations",
  },
  alternates: { canonical: "/integrations" },
};

// ---------------------------------------------------------------------------
// Page — Server Component shell (delegates rendering to client component)
// ---------------------------------------------------------------------------

export default function IntegrationsPage() {
  return <IntegrationsContent />;
}
