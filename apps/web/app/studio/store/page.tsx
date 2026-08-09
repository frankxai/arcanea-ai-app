import { notFound } from "next/navigation";

/**
 * A0 trust purge (2026-08-10): simulated Stripe / credit / on-chain store
 * must not ship beside real commerce. Route intentionally unreachable.
 */
export default function StudioStoreRemovedPage() {
  notFound();
}
