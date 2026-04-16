import type { Metadata } from "next";
import { DistributeContent } from "./distribute-content";

export const metadata: Metadata = {
  title: "Distribute — Publish Everywhere | Arcanea",
  description:
    "Your world generates a chapter. It posts to Discord, trims to X, becomes a Reel, gets archived to YouTube — automatically. One creation, every channel.",
  openGraph: {
    title: "Distribute — Publish Everywhere | Arcanea",
    description:
      "Your world generates a chapter. It posts to Discord, trims to X, becomes a Reel, gets archived to YouTube — automatically.",
  },
  alternates: { canonical: "/distribute" },
};

export default function DistributePage() {
  return <DistributeContent />;
}
