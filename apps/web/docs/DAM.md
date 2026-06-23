# Digital Asset Management (DAM)

How generated images become DB-backed, reviewable, publishable assets — and how we migrate off the hardcoded `image-registry.ts` without breaking it.

**Status:** the DB layer (`assets` + `asset_generations` tables) is to-build. The registry, the Supabase buckets, and the upload service are real today. This doc describes the target pipeline and the migration path between the two.

---

## Why this exists

Today the source of truth for every canonical image is a hand-edited TypeScript file: `apps/web/lib/media/image-registry.ts`. It builds ~120 `ImageRecord` entries from guardian metadata and file-naming conventions. That works, but it has hard limits:

- Adding an asset means editing TS and shipping a deploy.
- There is no review state — an image is either in the registry (live) or not.
- There is no audit trail of how an image was generated (harness, prompt, dimensions).
- New asset classes (the Leviathan tier, one-off gallery art) don't fit the guardian-keyed builder cleanly.

The fix is a `assets` table in Supabase plus an `asset_generations` audit table. The registry stops being hand-authored and becomes a generated cache/seed — the TypeScript **types stay the contract**, the **rows become the data**.

---

## The pipeline: ingest → store → metadata → approve → publish → analytics

```
  [external harness gen]        Grok Imagine / Codex gpt-image-2 / Antigravity NB2
          │                     (image gen does NOT run from Claude)
          ▼
 1. INGEST     Arcanea Hermes pulls the rendered file + its gen sidecar
          │    (prompt, harness, width, height)
          ▼
 2. STORE      uploadToStorage() → Supabase bucket
          │    (avatars / creations / thumbnails / arcanea-gallery)
          ▼
 3. METADATA   one `assets` row written: category, guardian/godbeast/leviathan,
          │    version, url, storage_path, tags[], harness, prompt, dims
          │    status = 'pending'  ·  one `asset_generations` row appended
          ▼
 4. APPROVE    visual-creation council review → status 'review' → 'approved'
          │    (or rejected; rejected rows are kept, not deleted)
          ▼
 5. PUBLISH    status flips to 'published' — public read unlocks via RLS,
          │    registry cache regenerates to include the row
          ▼
 6. ANALYTICS  (later) impressions / usage logged per asset_id
```

### 1. Ingest — Arcanea Hermes

Hermes is the intake mover. It watches for finished renders from the external harnesses and their gen sidecar metadata, then hands each file to the store step. Hermes never generates — it transports and normalizes. Ingest is the only step that touches the harness output directly.

### 2. Store — Supabase buckets

Uploads go through `apps/web/lib/media/supabase-upload.ts` (`uploadToStorage` / `batchUpload`). Buckets:

| Bucket | Holds |
|---|---|
| `avatars` | creator + character profile images |
| `creations` | user-generated creations |
| `thumbnails` | derived small renditions |
| `arcanea-gallery` | canonical Guardian / Godbeast / Leviathan / Luminor art |

The `arcanea-gallery` bucket mirrors the `/public` directory layout, so the path conversion is mechanical (`publicPathToStoragePath` just strips the leading slash). Canonical flagship art (Guardians, Godbeasts, the new Leviathans) lands in `arcanea-gallery`.

### 3. Metadata — one row per asset

Each stored asset gets exactly one `assets` row. The audit table records the generation event(s) that produced it.

### 4. Approve — the council gate

No asset reaches `published` without passing the visual-creation council review (Brand Guardian / Art Director / Storyteller lenses). The council verdict moves `pending → review → approved`. A rejected asset keeps its row at `status='review'` with the rejection logged — we hide, we don't delete, so the audit trail and the prompt survive.

### 5. Publish — flip the flag

Publishing is a status flip to `'published'`, nothing more. RLS exposes `approved` and `published` rows to public read; the registry cache regenerates to surface the row to the app. No file moves, no URL changes.

### 6. Analytics — later

Once rows are the source of truth, per-asset usage (which guardian hero renders most, which gallery images get clicked) can be logged against `asset_id`. Out of scope for v0.1; called out so the schema leaves room for it.

---

## Schema (to-build)

`assets`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | pk |
| `category` | enum | `guardians` \| `godbeasts` \| `leviathans` \| `gallery` \| `luminors` \| `nft` |
| `guardian` | text null | one of the 10 guardian names |
| `godbeast` | text null | one of the 10 godbeast names |
| `leviathan` | text null | e.g. `nethyssa` (new tier) |
| `version` | text | `v1` \| `v2` \| `v3` (matches `ImageVersion`) |
| `url` | text | public CDN URL |
| `storage_path` | text | path within the bucket |
| `tags` | text[] | freeform |
| `status` | enum | `pending` \| `review` \| `approved` \| `published` |
| `harness` | enum | `grok-imagine` \| `gpt-image-2` \| `nano-banana-pro` \| `nano-banana-2` \| `higgsfield` |
| `prompt` | text | generation prompt |
| `width` | int null | px |
| `height` | int null | px |
| `created_at` | timestamptz | default now() |

`asset_generations` — append-only audit of every gen attempt (one asset can have several): the harness, prompt, dimensions, and the resulting `asset_id`. This is what the Web3 loop also writes to (see WEB3-EXECUTION.md).

**RLS:** owner-scoped write; public read limited to rows where `status IN ('approved','published')`. Pending and in-review assets are private to the owner.

---

## Migration: hardcoded registry → DB-backed table

The registry does not get deleted. It gets demoted from *author* to *cache*.

| | Current | To-build |
|---|---|---|
| Source of truth | `image-registry.ts` (hand-edited) | `assets` table rows |
| Add an asset | edit TS, deploy | Hermes ingest → council → publish |
| Review state | none (in-or-out) | `status` column |
| Gen provenance | none | `asset_generations` audit |
| Types | `ImageRecord`, `ImageCategory`, `GuardianName`, … | **unchanged — still the contract** |
| Helper API | `getGuardianHero`, `getGalleryImages`, `filterImages`, … | **unchanged signatures**, backed by rows |
| New categories | guardian-keyed only | `leviathans`, `nft` added to enum |

Migration steps:

1. **Add `'leviathans'` to `ImageCategory`** (and the new tier fields) in `image-registry.ts` so the type contract covers the new asset class first.
2. **Seed the table from the registry.** A one-time script reads `MEDIA_REGISTRY` and inserts an `assets` row per `ImageRecord` (all seeded as `status='published'` since they're already live). This makes the DB a strict superset of today's registry — zero behavior change.
3. **Generate the registry from the table.** Replace the hand-authored array with a build step (or runtime fetch) that materializes `MEDIA_REGISTRY` from published rows. The helper functions (`getGuardianHero`, `filterImages`, etc.) keep their exact signatures — they now filter rows instead of a literal array.
4. **Cut over writes.** New assets flow through Hermes → council → publish. The TS file stops being edited by hand.

The contract is the type, not the literal. As long as `ImageRecord` and the helper signatures hold, callers across the app never change.

---

## New: the Leviathan tier and `/leviathans/`

Nethyssa is the first **Leviathan** — a new flagship tier of Wild Godbeast, distinct from the ten Gate Godbeasts. Leviathans are **not** Gate-bound: they have no guardian, no frequency, no gate. This is why the existing guardian-keyed registry builders don't fit them and why `leviathans` is its own category.

**Canon status: STAGING.** Nethyssa is not yet LOCKED in `CANON_LOCKED.md`. Treat her as provisional until Frank runs `/lock-decision` on the Nethyssa STAGING block.

Asset path: `/leviathans/{name}-{variant}.webp` → bucket `arcanea-gallery/leviathans/...`. First asset: `/leviathans/nethyssa-hero.webp`.

`assets` row shape for Nethyssa:

```
category:     'leviathans'
guardian:     null
godbeast:     null
leviathan:    'nethyssa'
version:      'v1'
storage_path: 'leviathans/nethyssa-hero.webp'
status:       'pending'   → council → 'published'
harness:      e.g. 'nano-banana-pro'
```

### Nethyss Pearl — material card

The Leviathan tier carries its own signature material, used for NFT trait metadata and art direction.

| Field | Value |
|---|---|
| Material | Nethyss Pearl |
| Bearer | Nethyssa (Leviathan, 1/1) |
| Look | deep abyssal nacre — black-green base with a slow internal current of bioluminescent teal |
| Reads as | pressure, depth, the unformed ocean — Void-adjacent but oceanic, not stellar |
| Palette anchor | Atlantean Teal (#00bcd4) over near-black (#09090b) |
| Trait use | `Material: Nethyss Pearl` in the Leviathans NFT metadata (see WEB3-EXECUTION.md) |
| Canon | STAGING — provisional until locked |

---

## Where things live

- Registry + types + helpers: `apps/web/lib/media/image-registry.ts`
- Upload service + buckets: `apps/web/lib/media/supabase-upload.ts`
- Web3 mint / IP-register loop: `apps/web/docs/WEB3-EXECUTION.md`
- The three recurring loops (lore / asset / web3): documented in `WEB3-EXECUTION.md` and the lore canon files under `.arcanea/lore/`

Built on SIP.
