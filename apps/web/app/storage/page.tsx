import type { Metadata } from "next";
import { StorageHero } from "./storage-hero";
import { StorageStack } from "./storage-stack";
import { StorageBackends } from "./storage-backends";
import { StorageFormats } from "./storage-formats";
import { StorageSync } from "./storage-sync";
import { StorageIntegrations } from "./storage-integrations";
import { StoragePerformance } from "./storage-performance";
import { StorageSovereignty } from "./storage-sovereignty";
import { StorageCTA } from "./storage-cta";

export const metadata: Metadata = {
  title: "Storage & Knowledge Graph — Arcanea",
  description:
    "Markdown + JSONML for content. pgvector for semantic search. Your choice of backend — Supabase, Arweave, S3, Google Drive, or local files. Open standards top to bottom.",
  openGraph: {
    title: "Storage & Knowledge Graph — Arcanea",
    description:
      "Markdown + JSONML for content. pgvector for semantic search. Your choice of backend — Supabase, Arweave, S3, Google Drive, or local files. Open standards top to bottom.",
  },
  alternates: { canonical: "/storage" },
};

export default function StoragePage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-white">
      <main>
        <StorageHero />
        <StorageStack />
        <StorageBackends />
        <StorageFormats />
        <StorageSync />
        <StorageIntegrations />
        <StoragePerformance />
        <StorageSovereignty />
        <StorageCTA />
      </main>
    </div>
  );
}
