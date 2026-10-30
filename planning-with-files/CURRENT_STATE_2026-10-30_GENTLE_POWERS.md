# Gentle Powers visual prompt collection

Scope: three generated frames, twelve prompt directions, source-pinned gallery
projection, search, generated-only filter, prompt copy/export and release gate.
Owner: Codex execution agent for Frank Riemer's 30 October request.
Issue: https://github.com/frankxai/arcanea-ai-app/issues/699
Base: `bff204b254b7358f8db8c64ecbf576c099d1c9bd`.
Branch: `agent/codex/gentle-powers-atlas`.
Fiction candidate: https://github.com/frankxai/arcanean-library/pull/7
Fiction candidate SHA: `a3b86663996fe8cb603e26ffea40dd3f58b7cc4e`.

User job: explore appealing original mythic art, understand how composition and
story choices work, then copy a prompt or export a pack for further creation.
Decision: extend the existing visual encyclopedia. Keep artwork primary and
interface restrained. Preserve new characters as proposals; no canon promotion.

Files: apps/web/app/gallery/gentle-powers; conditional link in gallery/page.tsx;
apps/web/data/gentle-powers/collection.json; gentle-powers module and tests in
apps/web/lib/visual-encyclopedia; this execution receipt.

Authorities loaded: root AGENTS, TASTE, DESIGN, .arcanea/CLAUDE, MASTER_PLAN,
CANON_LOCKED; Firstlight 02 current state; agentic-ops architecture decisions
file SHA `60d33d85111734abdf1da4851b0d5aba7bcc588d`; command architecture
projection. AGENT_BRIEF projection returned 404; architecture decisions were
read directly. Arcanean art-direction and image-generation skills applied.

Budget: three built-in image generations, including one identity-preserving
composition revision. No new subscription, model billing rail, infrastructure,
storage bucket, database schema or domain change.

Non-goals: a playable game, Unreal meshes/rigs, accepted canon, new origin
classes, commercial licenses, a replacement DAM or expanded R2 storage.

## Actual artifacts

The owner’s Drive review folder holds a complete ZIP with three PNG masters,
three WebP derivatives, exact generation prompts, twelve direction records,
source notes and a standalone searchable HTML atlas with embedded images:
https://drive.google.com/drive/folders/1e-jy1pC8UTd512EdQxaH8mUDvugXZ-bO

All six images decoded successfully; actual dimensions and SHA-256 verified.
Three records are generated, nine are prompt-only. The second Ilyra shot is a
variant of the first and is not counted as a second character. Research is a
bounded first pass, not an exhaustive survey or a claim of originality clearance.

## Release boundary

`isGentlePowersPublished` requires a public published projection, full fiction
source SHA, twelve unique IDs, exactly three generated assets, three distinct
rendition hashes, public immutable checksum-bound Blob URLs, byte/dimension
metadata and approval records bound to each exact master and rendition.
The route and discovery link both use this gate. Current state returns 404 and
adds no gallery link. Author self-review is not release approval.

Blocked: Vercel project environment metadata returned 403; no local Vercel CLI
or Blob token is available. Existing R2 buckets were inspected but unchanged.
Do not bypass the media architecture with Drive delivery or invented Blob URLs.

Next action: a release operator with the existing Blob write capability uploads
the three prepared derivatives, verifies bytes at the exact URLs, records review
approval lineage, confirms the fiction source review/merge, then updates the
projection through a reviewed PR. Source approval is not canon promotion.

## Verification

- Four focused tests pass: pending-state denial, canon boundary, delivery origin
  and checksum/approval binding, duplicate-result denial, source-pin requirement,
  prompt-only separation and search behavior.
- Scoped ESLint passes, including the modified gallery page.
- Eight workspace dependency builds pass.
- Initial full build/typecheck failed because the sparse checkout omitted an
  existing docs/worldbuilding JSON import. Adding the existing docs directory
  repaired the checkout; no application code was changed to mask that error.
- The rebuilt application production build passes, including TypeScript and
  static page generation (686 pages). Hosted receiving checks remain separate.
- The first tsx CLI test attempt was blocked by an unavailable Unix socket;
  `node --import tsx --test` ran the same tests successfully without that socket.
- Generated MCP dist and next-env changes are unrelated build output and excluded.
- Independent source review, responsive browser screenshots at 375/768/1440,
  live Blob delivery and stable-domain acceptance remain pending. No pass claimed.

Stop condition: preserve a validated draft and all masters while production
delivery access is unavailable. Do not mark a source-only candidate as shipped.
Recovery: revert this collection’s isolated projection and conditional link;
retain masters and fiction history. No data migration needs reversal.
