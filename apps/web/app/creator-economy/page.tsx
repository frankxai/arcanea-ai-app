import type { Metadata } from "next";
import { CreatorEconomyContent } from "./creator-economy-content";

export const metadata: Metadata = {
  title: "Creator Economy — Make a living from your worlds — Arcanea",
  description:
    "Seven ways to earn on Arcanea. Marketplace, memberships, NFTs, royalties, tokens. You keep 90%+, always.",
  alternates: { canonical: "/creator-economy" },
  openGraph: {
    title: "Creator Economy — Make a living from your worlds — Arcanea",
    description:
      "Seven ways to earn on Arcanea. Marketplace, memberships, NFTs, royalties, tokens. You keep 90%+, always.",
  },
};

export default function CreatorEconomyPage() {
  return <CreatorEconomyContent />;
}
