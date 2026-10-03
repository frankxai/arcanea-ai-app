# Sovereign Depths collection

An original Arcanea worldbuilding collection: 24 bosses, 12 dungeons, individual artwork and authored encounter/book connections. The collection remains STAGING; individual records and narrative links retain STAGING or EXPERIMENTAL status. The public interface labels this as worldbuilding concepts.

## One record source

`apps/web/lib/visual-encyclopedia/sovereign-depths.ts` composes the metadata, two boss batches and dungeon JSON files under `sovereign-depths/`; the result is validated by `sovereign-depths-schema.ts`. The gallery, detail pages and read-only API consume the same parsed records. The module sits beside the existing visual encyclopedia, while removing mandatory Gate allocation from this collection. It does not change the existing 130-entry catalog or its publication receipts.

| Surface                                              | Contract                                                                                                                                 |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/gallery/sovereign-depths`                          | Search/filter all works and open individual dossiers                                                                                     |
| `/gallery/sovereign-depths/[entry]`                  | Static dossier with full artwork, histories, reciprocal links and encounter or traversal design                                          |
| `/api/lore/sovereign-depths`                         | Defaults to zero proposal records; accepts `includeProposals=true`, `kind=all\|boss\|dungeon`, `query`, `id`, `includeExperimental=true` |
| `search_sovereign_depths`                            | Registered by the existing MCP CLI for stdio and HTTP transports; reads the fixed public API with explicit proposal opt-in               |
| `.arcanea/skills/creative/sovereign-depths/SKILL.md` | Canonical art/encounter/review workflow                                                                                                  |
| `.claude/skills/creative/sovereign-depths/SKILL.md`  | Adapter discovered by the existing Arcanea plugin                                                                                        |

MCP input example:

```json
{
  "includeProposals": true,
  "kind": "boss",
  "id": "b01"
}
```

The returned envelope includes `schemaVersion`, `collectionId`, `canonStatus`, `source`, `notice`, `includeProposals`, `includeExperimental`, `total`, `entries`, four proposed `series` and `factions`. Retrieval does not write to creator worlds, memory or canon. No model summary becomes an authoritative assertion. An upstream response changing this collection to LOCKED is rejected by this version of the MCP reader; approving canon requires a deliberate versioned contract change.

The skill adapter and MCP CLI change are implemented in this repository. The patch changeset records the MCP package release requirement; a Git merge or website deployment alone does not publish a new npm package or refresh an already installed external plugin.

## Media and provenance

Delivery uses separate WebP files in `apps/web/public/images/sovereign-depths/`. Record IDs and filenames match. Each record carries original-master and rendition hashes, dimensions, alternative text and prompt identity. Original generation and review evidence remain separate artifacts. Asset verification checks actual file bytes, WebP dimensions and unique hashes before publication. It also recomputes the native Git blob hash and matches the immutable upload manifest, preventing a stale pre-repair upload from being committed.

This is checked-in public collection delivery, not a fabricated Starlight registry publication. The registry-backed publication contract of the older encyclopedia remains unchanged. Migrating this collection into that registry requires real rights/review records and real receipts.

## Verification and release

```sh
node scripts/verify-sovereign-depths.mjs
pnpm --dir apps/web exec tsx --test lib/visual-encyclopedia/sovereign-depths.test.ts
pnpm --dir packages/arcanea-mcp build
node --test packages/arcanea-mcp/tests/sovereign-depths.test.mjs
```

The existing CI build job runs asset/relationship validation and starts the actual built Next app for desktop (1440px), mobile (375px) and reduced-motion browser verification, including search/filter/reset/dossier navigation, API opt-in counts, all 36 delivered image hashes and the protected MCP boundary. Screenshots and machine-readable evidence are uploaded as CI artifacts. Its package-test glob discovers the MCP tests. Existing build/typecheck/lint gates remain required. Preview inspection must verify filter/search/detail navigation, full image delivery and mobile readability before promotion. A game prototype or published book is outside this release's implemented scope.

Experimental records and stories require a second explicit `includeExperimental=true` opt-in. `includeProposals=true` alone returns only STAGING records with no nested EXPERIMENTAL claim objects (including stories and mythologies). Relationship links never promote the status of their targets.
