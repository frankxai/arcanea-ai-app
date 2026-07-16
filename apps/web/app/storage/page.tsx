/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-expressions, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-function-type, react-hooks/exhaustive-deps, react-hooks/set-state-in-effect, react-hooks/rules-of-hooks, react-hooks/purity, react-hooks/refs, react-hooks/static-components, react-hooks/immutability, react-hooks/preserve-manual-memoization, jsx-a11y/alt-text, @next/next/no-img-element, @next/next/no-html-link-for-pages, react/no-unescaped-entities */
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
  title: "Storage & Knowledge Graph",
  description:
    "Markdown + JSONML for content. pgvector for semantic search. Your choice of backend — Supabase, Arweave, S3, Google Drive, or local files. Open standards top to bottom.",
  openGraph: {
    title: "Storage & Knowledge Graph",
    description:
      "Markdown + JSONML for content. pgvector for semantic search. Your choice of backend — Supabase, Arweave, S3, Google Drive, or local files. Open standards top to bottom.",
  },
  alternates: { canonical: "/storage" },
};

export default function StoragePage() {
  return (
    <div className="relative min-h-screen bg-[var(--arc-cosmic-void)] text-white">
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
