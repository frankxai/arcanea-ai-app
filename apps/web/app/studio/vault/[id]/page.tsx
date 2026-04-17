import type { Metadata } from "next";
import { VaultDetailContent } from "./detail-content";

export const metadata: Metadata = {
  title: "Vault document — Arcanea Studio",
  description:
    "Full view of a Studio vault document — markdown, metadata, related items, and editing.",
  robots: { index: false, follow: false },
};

export default async function VaultDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VaultDetailContent documentId={id} />;
}
