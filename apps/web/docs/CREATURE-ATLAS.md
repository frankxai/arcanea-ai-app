# Creature Atlas — Architecture

## What it is

A multiverse creature encyclopedia: reference catalog (factual documentation, no generated imagery for IP-protected creatures) + Arcanea Variants (wholly original, fully promptable originals inspired by, not copying, protected IP) + a World Graph mapping creatures → worlds → stories → characters.

Contributions follow the **World Repo Standard v1.0** (`.arcanea/lore/atlas/WORLD_REPO_STANDARD.md` in the `arcanea` OSS repo).

## Data model

Six `atlas_*` tables (see `supabase/migrations/20260701000001_creature_atlas.sql`):

| Table | Purpose |
|---|---|
| `atlas_universes` | Fiction universes (Avatar, Studio Ghibli, …) |
| `atlas_creatures` | Reference creatures — documented, not generated |
| `atlas_creature_relationships` | Creature → creature edges (symbiotic, rival, …) |
| `atlas_arcanea_variants` | Arcanea-original creatures inspired by reference ones |
| `atlas_prompt_packs` | Provider-specific generation prompts (variants only) |
| `atlas_contributions` | Community PRs awaiting curator review |

**Key constraint:** `atlas_creatures.promptable` is enforced at the Postgres level:
```sql
constraint atlas_creatures_rights_promptable check (
  (rights_tier in ('factual_reference', 'blocked') and promptable = false)
  or rights_tier not in ('factual_reference', 'blocked')
)
```

## TypeScript layer

- `apps/web/lib/atlas/types.ts` — interfaces matching SQL columns (snake_case)
- `apps/web/lib/atlas/client.ts` — five Supabase query helpers
- `apps/web/lib/atlas/seed/avatar.ts` — Avatar vertical-slice seed constants

## Routes

| Route | Purpose |
|---|---|
| `/atlas` | Universe list + Arcanea Variants gallery |
| `/atlas/[universe]` | Universe detail + creature list (planned) |
| `/atlas/[universe]/[creature]` | Creature detail + variant panel (planned) |

Note: `/bestiary` already exists for Arcanea's creative obstacle bestiary (Procrastinox, etc.) — this is a separate surface.

## Rights boundary rule

```
factual_reference | blocked → promptable = false (DB constraint + TS type + UI gate)
public_domain | licensed | original_arcanea → promptable = true (with appropriate notes)
```

Generated imagery is produced **only** for Arcanea Variants. Prompt packs ship in `.arcanea/gen/prompt-packs/atlas-*.md` in the OSS repo.

## Canon status

All Atlas entries start as `staging`. Promotion to `locked` requires Frank's `/lock-decision` — same flow as Nethyssa and the T0–T4 taxonomy.

## Universe pipeline

- **v1 — shipped:** Avatar: The Last Airbender (7 reference + 3 Arcanea variants)
- **Planned:** Studio Ghibli, Nausicaä of the Valley of the Wind, The Elder Scrolls, Marvel Cosmic

## Agent coordination

- **Claude** — conductor: lore files, gen prompt packs, MCP data types, canon gate
- **Codex** — executor: MCP tool implementations, TypeScript tests

Ledger: `.agent/active-agents.md`
