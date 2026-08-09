import { notFound } from "next/navigation";

/**
 * Trust purge (2026-08-10): community hub removed until backed by real
 * channels and live stats — no demo social layer in production.
 */
export default function CommunityHubRemovedPage() {
  notFound();
}
