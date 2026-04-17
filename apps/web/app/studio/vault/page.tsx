import type { Metadata } from "next";
import { VaultContent } from "./vault-content";

export const metadata: Metadata = {
  title: "Vault — Your Studio Memory — Arcanea",
  description:
    "Every document you drop into Arcanea Studio lives here. Classified, embedded, searchable. Markdown + JSONML. Yours to export anytime.",
  alternates: { canonical: "/studio/vault" },
};

export default function VaultPage() {
  return <VaultContent />;
}
