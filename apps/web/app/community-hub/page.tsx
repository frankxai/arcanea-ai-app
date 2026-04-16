import type { Metadata } from "next";
import { CommunityHubContent } from "./community-hub-content";

export const metadata: Metadata = {
  title: "Community Hub — Where Arcanean creators gather — Arcanea",
  description:
    "Join the Discord, explore Reddit, subscribe via Whop. Creator showcases, leaderboards, events, and the full Arcanea community layer.",
  openGraph: {
    title: "Community Hub — Where Arcanean creators gather — Arcanea",
    description:
      "Join the Discord, explore Reddit, subscribe via Whop. Creator showcases, leaderboards, events, and the full Arcanea community layer.",
  },
  alternates: { canonical: "/community-hub" },
};

export default function CommunityHubPage() {
  return <CommunityHubContent />;
}
