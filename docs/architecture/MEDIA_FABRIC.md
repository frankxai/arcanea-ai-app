# Arcanea Media Fabric Decision

## Decision

Arcanea uses the shared Starlight Media Fabric as its canonical DAM control plane.

- R2 private stores originals and unapproved uploads.
- R2 public stores immutable, approved renditions only.
- Supabase stores asset identity, owner, rights, provenance, lifecycle, and usage links.
- A queue-driven Media Steward enriches, deduplicates, tags, and proposes publication; it cannot silently publish, delete, or change rights.

This supersedes the earlier file-size-based three-tier plan. Storage location is determined by ownership and lifecycle, not whether an image happens to be below a threshold.

## Transitional state

Vercel Blob remains only as a contained legacy path while the R2 service is provisioned. The current `imagine` endpoints require a Supabase user and isolate paths by user ID. They are not the canonical DAM and must not be extended for new product flows.

## Non-negotiable asset state machine

`draft → stored → enriched → review → published → archived/deleted`

Public delivery is impossible from a `private` asset. A public rendition is a distinct record, not an arbitrary storage URL.

## Immediate rollout

1. Apply `20260810000001_media_fabric_registry.sql` to the Arcanea Supabase project.
2. Provision isolated staging R2 buckets and Worker secrets through the paired Media Fabric repository.
3. Run `scripts/inventory-legacy-imagine-blob.ts` to create a non-destructive Blob manifest and resolve every legacy object's owner before copying it.
4. Move new generation uploads to the Worker service; preserve prompt/model/provenance at ingest.
5. Migrate existing Blob objects by manifest, validate references, then retire Blob reads.

## Explicitly rejected

- Git as a media system.
- One object store per Vercel project.
- Automatic public publishing from AI outputs.
- A fourth media source of truth in Cloudinary or Supabase Storage.
