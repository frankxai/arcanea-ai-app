# Arcanea Media Fabric Boundary

## Decision

Arcanea is a product consumer of the shared Starlight Media Platform; it is not the cross-brand DAM database.

- The reviewed implementation and canonical schema live in [`frankxai/agentic-ops/media-platform`](https://github.com/frankxai/agentic-ops/tree/agent/codex/media-control-plane/media-platform).
- Cloudflare R2 stores canonical private source objects and immutable approved public renditions.
- A dedicated shared Starlight Supabase project stores asset identity, rights, provenance, lifecycle, lineage, reviews, and usage links.
- Arcanea's Supabase project remains product-local business and authentication state. This repository does not install duplicate cross-brand media tables.
- A queue-driven Media Steward may enrich, deduplicate, tag, and propose review; it cannot grant rights, approve publication, publish, delete, or expose private bytes through MCP.

This supersedes the earlier file-size-based three-tier plan. Storage placement follows ownership, sensitivity, rights, and lifecycle—not an arbitrary file-size threshold.

## Transitional state

Vercel Blob remains a contained legacy path only while the shared R2 service is provisioned. The current `imagine` endpoints require a Supabase user and isolate paths by user ID. They are not the canonical DAM and must not be extended for new product flows.

Existing unscoped `imagine/` objects are quarantined from user galleries until an inventory manifest assigns an owner and retention outcome. Unknown ownership must never be guessed.

## Release state

The shared platform controls the state machine and publication gate:

`ingested → enriched → proposed → approved → published → archived/revoked`

A private source object is never made public directly. Publication creates or promotes a prepared rendition only after the shared registry authorizes both commercial rights and an approved publication review.

## Rollout

1. Review and merge [agentic-ops PR #14](https://github.com/frankxai/agentic-ops/pull/14).
2. Provision a dedicated shared Starlight Supabase project and apply the shared migration from `agentic-ops/media-platform/supabase/migrations/`.
3. Provision the shared Cloudflare R2 buckets, Queues/DLQ, edge Worker, control Worker, and production Access/OAuth boundary.
4. Run `scripts/inventory-legacy-imagine-blob.ts` to produce a non-destructive manifest and resolve every legacy object's owner, rights, and retention decision.
5. Send new generation uploads through the control Worker, preserving prompt, model, creator, checksum, provenance, and source relationship at ingest.
6. Copy legacy objects by manifest, verify checksums and application references, exercise rollback, then retire Blob reads after a measured dual-read period.

## Non-negotiable boundaries

- No raw AI output is automatically public.
- No Cloudinary, Supabase Storage, Drive, Git, or product-local Blob namespace becomes another canonical source.
- No product client receives Cloudflare account credentials or the Supabase service-role key.
- No cross-brand registry is coupled to one product's `auth.users` table.
- No legacy object is deleted until checksum, reference, delivery, retention, and rollback evidence is recorded.
