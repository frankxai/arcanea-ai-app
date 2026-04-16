import { Metadata } from "next";
import { ProtocolContent } from "./protocol-content";

export const metadata: Metadata = {
  title: "Arcanean Protocol — Open standards for agentic creation — Arcanea",
  description:
    "The open-protocol layer for agentic world-building. Agent registry, IP licensing, smart-contract royalties, BYOK inference. MIT licensed. Your sovereignty guaranteed.",
  alternates: { canonical: "/protocol" },
  openGraph: {
    title: "Arcanean Protocol — Open standards for agentic creation — Arcanea",
    description:
      "The open-protocol layer for agentic world-building. Agent registry, IP licensing, smart-contract royalties, BYOK inference. MIT licensed. Your sovereignty guaranteed.",
  },
};

export default function ProtocolPage() {
  return <ProtocolContent />;
}
