---
title: Connected Ecosystem Trilogy — Foundation, Author Council Wiring, Public Author Surface
date: 2026-05-11
status: draft (awaiting Frank's review)
owner: Frank (with Claude Opus 4.7)
scope: Project C → Project A → Project B (sequenced; one trilogy spec, three implementation plans)
supersedes: hand-coded constellation-data.ts, duplicate repo registries, four overlapping author-council slash commands
related:
  - .arcanea/audits/2026-05-06-plugin-overlap.md
  - .arcanea/audits/2026-05-06-repo-architecture.md
  - .arcanea/audits/2026-05-07-strategic-charter-v2.md
  - apps/web/CLAUDE.md
  - packages/author-council/package.json
---

# Connected Ecosystem Trilogy

> **Trilogy thesis**: Arcanea has the parts but not the wiring. The Author Council is built and orphaned. The `/ecosystem` page is polished but its data is forked across three files. Two books shipped without the Council in the loop. This spec closes those loops with one foundation move (C) plus two follow-ons (A, B) that depend on it.

## Why now

Verified on disk 2026-05-11 (this turn):

- `packages/author-council` v0.1.0 — 10 author voices, 8 rosters, 4 deliberation modes, MCP server. **Zero consumers** in `apps/` or other `packages/`. One book reference: `book/forge-of-ruin/council-audits/2026-04-21-chapter-01-arcanea-council.md` (single chapter, 19 days stale).
- 4 overlapping slash commands: `/arcanea-author`, `/arcanea-author-council`, `/author-council`, `/fiction-author-council`. Plugin-overlap audit (2026-05-06) flagged this surface for consolidation.
- `apps/web/app/ecosystem/page.tsx` (24 KB, last edited 2026-05-10) — premium UI shell, but reads from **three** disconnected sources: `public-repo-registry.ts`, `lib/ops/repo-registry.ts` (duplicate), and `constellation-data.ts` (192 lines hand-coded; mislabels Author Council as "Author OS").
- `.arcanea/config/repos.json` — already canonical for repo metadata. Updated 2026-05-10. Not yet enriched with gate/hemisphere/layer fields.
- Two books shipped (Mädchen, Las Tierras) without Author Council in the publishing pipeline.

The pattern: **strong substrates + drifted consumers + zero closed loops**. The trilogy fixes that pattern, not just the symptoms.

## Trilogy overview

| # | Project | Lever | Ships |
|---|---|---|---|
| **C** | Connected Ecosystem Foundation | Single source of truth + generator + 3-view public render | A consumable map of the whole system that doesn't drift |
| **A** | Author Council Wiring | Wire `@arcanea/author-council` into book pipeline + collapse 4 slash commands → 1 | Future books auto-get Council audits; orphan flag clears on `/ecosystem` |
| **B** | `/author` Public Surface | First user-facing Council product — paste chapter → live deliberation | First public-facing Council product; ecosystem map sells it via direct link |

**Sequence rationale**: C unblocks A and B (both produce signal that C displays). A is mechanical once C exists. B is a clean Next.js surface once A's MCP wiring is solid.

---

# Project C — Connected Ecosystem Foundation

## C.1 Goals

1. **One source of truth** for repo + product metadata across the Arcanea ecosystem.
2. **Self-healing**: stale data is mechanically detected (CI) and auto-refreshed where derivable.
3. **Three views, one schema** on `/ecosystem`: Layered (substrate → product → surface), Ten Gates (lore-native), Arc ⊕ Nea (creation ⊕ economy).
4. **Honest status pills**: every node carries a status (`built`, `shipped`, `wip`, `orphan`, `sunset`, `external`) that reflects reality. Orphans are visible.
5. **Cross-repo coverage**: in-monorepo packages + sibling repos (arcanea-onchain, arcanea-records, oh-my-arcanea, SIS, etc.) + external integrations.

## C.2 Non-goals (this project)

- Not building a graph database. YAML/JSON + TypeScript module is sufficient.
- Not crawling the web for product mentions. Inventory is curated.
- Not replacing `repos.json`. Extending it.
- Not migrating to a new design system. Reuses existing premium components (LiquidGlass, AuroraGradient, Magnetic, Reveal).

## C.3 Current state (verified disk facts)

| Asset | Path | Status |
|---|---|---|
| Canonical repo registry | `.arcanea/config/repos.json` | Live; consumed by web | 
| Web repo adapter | `apps/web/lib/public-repo-registry.ts` (104 lines) | Reads `repos.json` → typed exports |
| Duplicate web registry | `apps/web/lib/ops/repo-registry.ts` (243 lines) | **To remove**; drift risk |
| Constellation data | `apps/web/app/ecosystem/constellation-data.ts` (192 lines) | **To remove**; hand-coded, drifted |
| Layered view component | `apps/web/app/ecosystem/layer-cards.tsx` (96 lines) | Keep + extend with edge-on-hover |
| Page shell | `apps/web/app/ecosystem/page.tsx` (24 KB) | Keep shell + premium UI; refactor data sources |

## C.4 Design

### C.4.1 Data model

**Source files (canonical):**

```
.arcanea/config/
├── repos.json              # KEEP. Existing schema. Extend with optional fields:
│                           #   layer, gate, hemisphere, status_override
└── manifest.yaml           # NEW. Curated overlay for things not derivable.
```

**`repos.json` extension** (additive — backwards-compatible):

```json
{
  "name": "arcanea-ai-app",
  "...existing fields...": "...",
  "layer": "surface",
  "gate": "unity",
  "hemisphere": "seam",
  "status_override": null
}
```

**`manifest.yaml`** structure (new file):

```yaml
# Curated nodes that don't map 1:1 to a repo.
# (Packages within the monorepo, MCP servers, agents, integrations.)
nodes:
  - id: author-council
    name: "@arcanea/author-council"
    layer: product
    gate: soul
    hemisphere: arc
    repo: packages/author-council
    description: "10 author voices · 8 rosters · 4 deliberation modes"
    consumes:
      - sis
      - design-system
      - anthropic-sdk
    consumed_by: []           # generator detects from grep; explicit list overrides
    owner: frank
    links:
      package: packages/author-council
      mcp: packages/author-council/src/mcp/server.ts
    last_curated: 2026-05-11

  - id: anthropic-sdk
    name: "Anthropic SDK"
    layer: substrate
    gate: source
    hemisphere: seam
    description: "External — Claude Sonnet/Opus/Haiku via @anthropic-ai/sdk"
    is_external: true
    links:
      docs: "https://docs.anthropic.com"

  # ... continues for every product, agent, integration
```

**Generated file (do not edit):**

```
apps/web/lib/ecosystem/
└── derived.ts              # AUTO-GENERATED by `arcanea-ecosystem build`
                            # TypeScript module so web imports natively (no YAML loader)
```

**`derived.ts` shape:**

```ts
export type Layer = 'substrate' | 'product' | 'surface';
export type Gate = 'source' | 'form' | 'pattern' | 'voice' | 'vision'
                 | 'story' | 'world' | 'soul' | 'unity' | 'mastery';
export type Hemisphere = 'arc' | 'nea' | 'seam';
export type Status = 'built' | 'shipped' | 'wip' | 'orphan' | 'sunset' | 'external';

export interface EcosystemNode {
  id: string;
  name: string;
  description: string;
  layer: Layer;
  gate: Gate;
  hemisphere: Hemisphere;
  status: Status;
  repo?: string;             // monorepo path or sibling repo URL
  github?: string;
  publicUrl?: string;
  packageVersion?: string;
  lastCommitAt?: string;     // ISO
  lastVerifiedAt: string;    // ISO — generator timestamp
  consumes: string[];        // node ids
  consumedBy: string[];      // node ids
  isExternal: boolean;
  owner?: string;
  links: Record<string, string>;
}

export interface EcosystemEdge {
  source: string;
  target: string;
  kind: 'consumes' | 'bridges' | 'routes' | 'references';
}

export const NODES: EcosystemNode[];
export const EDGES: EcosystemEdge[];
export const GENERATED_AT: string;
```

### C.4.2 Generator

**Location**: `packages/orchestrator/src/ecosystem/` (reuse existing package — Frank already maintains it; no new package boundary needed).

```
packages/orchestrator/src/ecosystem/
├── build.ts            # entry — orchestrates scan → enrich → merge → write
├── scan-monorepo.ts    # walks packages/, apps/ — package.json, MCP servers, slash commands
├── scan-siblings.ts    # iterates repos.json — git log, package version
├── enrich-github.ts    # GitHub API: open PRs, latest release, deploy URL
├── merge.ts            # repos.json + manifest.yaml + scans → EcosystemNode[]
├── infer-status.ts     # rule engine: orphan if consumedBy.length === 0 && layer !== 'surface', etc.
├── write.ts            # emits derived.ts (formatted via prettier)
└── verify.ts           # diff existing derived.ts vs freshly-generated; exit 1 on drift
```

**CLI** (added to existing orchestrator CLI):

```bash
pnpm -F @arcanea/orchestrator ecosystem:build      # write derived.ts
pnpm -F @arcanea/orchestrator ecosystem:verify     # CI gate; fails on drift
pnpm -F @arcanea/orchestrator ecosystem:list       # print summary table
```

**Status inference rules** (default, overridable per-node via `status_override`):

| Condition | Inferred status |
|---|---|
| `is_external: true` | `external` |
| `consumedBy.length === 0` and `layer === 'product'` | `orphan` |
| `lastCommitAt` > 90 days ago and not external | `wip` (warning) |
| `lastCommitAt` > 365 days ago | `sunset` |
| Has `publicUrl` and matching deployed Vercel project | `shipped` |
| Has package + non-zero `consumedBy` | `built` |

### C.4.3 Public render

**Page**: `apps/web/app/ecosystem/page.tsx` — keeps premium shell + opengraph image.

**New top-bar:**

```tsx
<ViewSwitcher value={view} onChange={setView}>
  <Tab value="layered">Layered</Tab>
  <Tab value="gates">Ten Gates</Tab>
  <Tab value="arc-nea">Arc ⊕ Nea</Tab>
</ViewSwitcher>

<FilterBar>
  <Filter name="status" options={['all', 'shipped', 'built', 'wip', 'orphan']} />
  <Filter name="hemisphere" options={['all', 'arc', 'nea', 'seam']} />
  <Filter name="gate" options={[...TEN_GATES]} />
</FilterBar>
```

**Three view components:**

```
apps/web/app/ecosystem/
├── views/
│   ├── layered-view.tsx       # extends layer-cards.tsx; adds edge-on-hover
│   ├── gates-view.tsx         # NEW. SVG wheel; click sector → drawer
│   └── arc-nea-view.tsx       # NEW. Split hemispheres; seam highlights bridges
├── node-drawer.tsx            # NEW. Shared right-side drawer for node details
└── view-switcher.tsx          # NEW.
```

**`<NodeDrawer>` content** (one drawer, used by all 3 views):

- Status pill (with color: orphan = amber, sunset = red, shipped = teal, etc.)
- Repo path / GitHub link / public URL / Vercel project link
- Package version, last commit (relative)
- Consumes (clickable chips → focus that node)
- Consumed by (clickable chips)
- Owner
- Action buttons:
  - "View on GitHub"
  - "Open in Vercel" (if `vercel` field present)
  - "View MCP tools" (if `mcp_server` field)
  - **For orphans**: "How to wire" → links to a per-node TODO doc in `.arcanea/ecosystem/todo/<id>.md`

### C.4.4 Maintenance

**CI**: `.github/workflows/ecosystem-verify.yml` — on every PR touching `.arcanea/config/`, `packages/*/package.json`, `apps/web/app/ecosystem/**`, runs `ecosystem:verify`. Fails if `derived.ts` is stale.

**Weekly cron**: GitHub Action runs `ecosystem:build` weekly + opens a PR with the diff. Frank reviews the PR (typically 1-line diff for last-commit timestamps; significant changes trigger conversation).

**Stale-curation lint**: warning (not failure) if any `manifest.yaml` node has `last_curated` > 60 days. Encourages periodic review without blocking.

## C.5 Files added / modified / deleted (Project C)

**Added** (10 files):
- `.arcanea/config/manifest.yaml`
- `packages/orchestrator/src/ecosystem/{build,scan-monorepo,scan-siblings,enrich-github,merge,infer-status,write,verify}.ts`
- `apps/web/lib/ecosystem/derived.ts` (generated)
- `apps/web/app/ecosystem/views/{gates-view,arc-nea-view}.tsx`
- `apps/web/app/ecosystem/node-drawer.tsx`
- `apps/web/app/ecosystem/view-switcher.tsx`
- `.github/workflows/ecosystem-verify.yml`
- `.github/workflows/ecosystem-weekly-refresh.yml`

**Modified** (5 files):
- `.arcanea/config/repos.json` — additive: `layer`, `gate`, `hemisphere`, `status_override` per repo
- `apps/web/lib/public-repo-registry.ts` — thin adapter over `derived.ts`
- `apps/web/app/ecosystem/page.tsx` — wire view switcher + filters; data from `derived.ts`
- `apps/web/app/ecosystem/layer-cards.tsx` — add edge-on-hover
- `packages/orchestrator/package.json` — new bin entry, new scripts

**Deleted** (2 files):
- `apps/web/app/ecosystem/constellation-data.ts` (192 lines hand-coded — superseded)
- `apps/web/lib/ops/repo-registry.ts` (243 lines duplicate — superseded)

## C.6 Acceptance criteria (Project C)

- [ ] `pnpm -F @arcanea/orchestrator ecosystem:build` runs in <30s on a clean checkout
- [ ] `derived.ts` committed and consumed by `apps/web/lib/public-repo-registry.ts` + `apps/web/app/ecosystem/page.tsx` — no other data sources for ecosystem
- [ ] CI gate (`ecosystem-verify`) passes on a PR that touches a tracked file and updates `derived.ts`; fails if `derived.ts` is stale
- [ ] `/ecosystem` renders three views; switcher + filters work; node drawer shows full details; orphan pills visible
- [ ] Author Council shows status `orphan` until Project A ships, then auto-flips to `built` on the next generator run
- [ ] No build/lint/typecheck regressions in `apps/web`
- [ ] Lighthouse mobile score for `/ecosystem` ≥ existing baseline
- [ ] Spec link in `.arcanea/audits/2026-05-06-plugin-overlap.md` follow-up section

---

# Project A — Author Council Wiring

## A.1 Goals

1. **Make `@arcanea/author-council` a live dependency of the books pipeline** — Mädchen, Las Tierras, Forge of Ruin all auto-trigger Council audits at chapter milestones.
2. **Collapse 4 overlapping slash commands** → 1 (`/author-council`) with subcommands.
3. **Auto-clear orphan flag** on `/ecosystem` (mechanically, via Project C generator).

## A.2 Current state (verified disk facts)

- `packages/author-council` v0.1.0 — protocol + 10 voices + 8 rosters + MCP server. Solid.
- Slash commands (4 files in `.claude/commands/`):
  - `arcanea-author.md`
  - `arcanea-author-council.md`
  - `author-council.md`
  - `fiction-author-council.md`
- One book consumer: `book/forge-of-ruin/council-audits/2026-04-21-chapter-01-arcanea-council.md` (single chapter, 19 days stale, audit was hand-run not pipeline-triggered).
- `apps/web/app/api/author/[bookSlug]/publish/route.ts` exists (Author Studio publish-to-git endpoint per `apps/web/CLAUDE.md`). This is the natural integration seam.

## A.3 Design

### A.3.1 Pipeline integration

**Trigger**: book chapter draft committed to `book/<slug>/chapters/<chapter>.md` OR published via Author Studio's `/api/author/[bookSlug]/publish`.

**Flow**:

```
chapter committed → hook (.arcanea/hooks/post-chapter-commit.sh)
  → invokes packages/orchestrator CLI: `orchestrator author-council run`
  → which calls @arcanea/author-council MCP with {book, chapter, roster}
  → MCP returns audit JSON
  → writes book/<slug>/council-audits/<YYYY-MM-DD>-<chapter>.md
  → opens GitHub issue if any voice flags a blocker
```

**Roster mapping** (per-book, in `book/<slug>/.author-council.yaml`):

```yaml
# book/forge-of-ruin/.author-council.yaml
roster: arcanea               # or fiction, mythic, magic-system, etc.
mode: deliberation            # or critique, synthesis, debate
trigger: on_chapter_commit    # or manual_only, on_milestone
voices_override: []           # optional pin-set
blocker_threshold: 2          # if N voices flag, open issue
```

For the existing books:
- `book/das-maedchen-drei-sprachen/.author-council.yaml` — roster: `mythic`, mode: `critique` (children's literature lens)
- `book/las-tierras-de-luz/.author-council.yaml` — roster: `fiction` + Spanish-literature voices
- `book/forge-of-ruin/.author-council.yaml` — roster: `arcanea` (full council)

### A.3.2 Slash command consolidation

**Keep**: `.claude/commands/author-council.md` (canonical).

**New shape:**

```
/author-council                         # default — runs council on current chapter
/author-council list                    # shows rosters
/author-council run <book> <chapter>    # explicit
/author-council audit <book>            # all chapters
/author-council voices                  # list available authors
```

**Deprecate** (delete after one-week deprecation notice in skill description):
- `arcanea-author.md`
- `arcanea-author-council.md`
- `fiction-author-council.md`

Each deleted command's file gets replaced with a single-line redirect note pointing to `/author-council` for one week, then removed.

### A.3.3 Manifest update

After A ships, `.arcanea/config/manifest.yaml` for the `author-council` node gets:

```yaml
- id: author-council
  consumed_by:
    - book-pipeline
    - author-studio-publish
    - slash:author-council
```

…which the Project C generator picks up → status flips from `orphan` → `built`.

## A.4 Files added / modified / deleted (Project A)

**Added** (5 files):
- `.arcanea/hooks/post-chapter-commit.sh`
- `book/das-maedchen-drei-sprachen/.author-council.yaml`
- `book/las-tierras-de-luz/.author-council.yaml`
- `book/forge-of-ruin/.author-council.yaml`
- `packages/orchestrator/src/commands/author-council.ts`

**Modified** (3 files):
- `.claude/commands/author-council.md` — promoted to canonical, expanded subcommands
- `packages/orchestrator/package.json` — new CLI subcommand
- `apps/web/app/api/author/[bookSlug]/publish/route.ts` — call author-council MCP after successful publish, write audit alongside chapter

**Deleted** (3 files, after 1-week deprecation):
- `.claude/commands/arcanea-author.md`
- `.claude/commands/arcanea-author-council.md`
- `.claude/commands/fiction-author-council.md`

## A.5 Acceptance criteria (Project A)

- [ ] Committing any chapter to `book/<slug>/chapters/` runs the council and writes an audit file
- [ ] `/author-council` slash command works for the 4 subcommands; deprecated commands redirect for one week then are removed
- [ ] Author Studio "Publish to Git" automatically attaches a Council audit to the same commit
- [ ] Generator (Project C) detects new consumers → `author-council` status flips to `built` on `/ecosystem`
- [ ] Three existing books each have a `.author-council.yaml` with their chosen roster
- [ ] Audit files follow a stable filename convention so the web app can list them per-book

---

# Project B — `/author` Public Surface

## B.1 Goals

1. **First user-facing Council product**: visitors paste a chapter, pick a roster, see live deliberation.
2. **BYOK by default** (per Frank's chat-UX preference: BYOK public access, clean errors).
3. **Click-through from `/ecosystem`**: the Author Council node has a "Try it" CTA → `/author`.

## B.2 Design

### B.2.1 Page

`apps/web/app/author/page.tsx` — composed of:

1. **Hero** — headline ("The Author Council"), subhead, premium UI (LiquidGlass + AuroraGradient). Mirrors `/ecosystem` aesthetic for consistency.
2. **Roster picker** — dropdown of 8 rosters from `manifest.yaml`. Each option shows the voices it includes.
3. **Mode picker** — deliberation / critique / synthesis / debate.
4. **Input** — Tiptap editor (per Frank's `feedback_editor_choice.md` — Novel/Tiptap chosen). Paste or type a chapter (limit ~10K words).
5. **Run button** — calls `/api/author-council/run` (streamed response).
6. **Output stream** — each voice's contribution appears as a card; ordering follows mode rules.
7. **Save / Export** — save to vault (if signed in); export Markdown/PDF.

### B.2.2 API route

`apps/web/app/api/author-council/run/route.ts`:

```ts
// POST /api/author-council/run
// Body: { roster: string, mode: string, text: string, byok?: { provider: string, key: string } }
// Returns: text/event-stream of voice contributions
```

Calls `@arcanea/author-council` MCP via stdio (or via the Vercel AI Gateway if BYOK key is for a hosted provider). Rate-limited per IP (10/day anon, 100/day signed-in, unlimited with BYOK).

### B.2.3 Wiring back to `/ecosystem`

In Project C's `manifest.yaml`:

```yaml
- id: author-council
  links:
    try_live: /author
```

`<NodeDrawer>` shows a "Try live" button when `links.try_live` is set.

## B.3 Files added / modified (Project B)

**Added** (8 files):
- `apps/web/app/author/page.tsx`
- `apps/web/app/author/hero.tsx`
- `apps/web/app/author/roster-picker.tsx`
- `apps/web/app/author/mode-picker.tsx`
- `apps/web/app/author/council-stream.tsx`
- `apps/web/app/author/voice-card.tsx`
- `apps/web/app/api/author-council/run/route.ts`
- `apps/web/lib/author-council/client.ts` (typed wrapper around the MCP/AI Gateway call)

**Modified** (1 file):
- `.arcanea/config/manifest.yaml` — add `links.try_live: /author` to author-council node

## B.4 Acceptance criteria (Project B)

- [ ] `/author` renders, accepts a chapter, runs the Council, streams contributions back
- [ ] BYOK works: a user with their own Anthropic key bypasses rate limit
- [ ] Anonymous rate limit enforced; clean error UI on hit
- [ ] `/ecosystem` Author Council drawer shows "Try live" → `/author`
- [ ] Lighthouse mobile score ≥ existing baseline for new routes
- [ ] No PII or chapter content logged server-side; storage only on user-initiated save

---

# Out of scope (entire trilogy)

- Mobile native app for the Council
- Marketplace / payment for Council voices
- Voice-to-voice editorial dialog (multi-turn back-and-forth between voices)
- Video / podcast output of deliberations
- Cross-book continuity audits (compare two books for tone drift)
- Onchain provenance for Council audits (could be a future Nea-side project)

# Risks & mitigations

| Risk | Mitigation |
|---|---|
| Generator falsely flags an active node as `orphan` | `status_override` field in `repos.json` / `manifest.yaml`; CI shows the diff so Frank reviews before merge |
| Web build slows down due to `derived.ts` being large | Keep `derived.ts` < 500 KB by excluding heavy fields from the bundle (last commit message bodies, etc.); tree-shakable exports |
| Slash-command deprecation breaks muscle memory | One-week redirect period; `/author-council` is the simplest and most discoverable name |
| Rate limit on Council API gets abused | Per-IP and per-session limits; honest error messages; BYOK escape hatch |
| GitHub API rate limit during weekly refresh | Use authenticated requests (already have `GITHUB_TOKEN`); cache last-commit-date for 1h |
| Three views fragment user attention on `/ecosystem` | Default to Layered; remember last-chosen view in `localStorage`; switcher always visible |

# Open questions (for Frank during spec review)

1. **Naming**: `/author` or `/council` for the public surface? Both are reasonable.
2. **Council audit visibility**: should book council audits be public (visible at `/library/<book>/audits`) or private (in-repo only)? Frank's "drafts are live beta" memory suggests public.
3. **Voice attribution**: should the Council voices be branded with their real-world author names (Sanderson, Tolkien, etc.) on the public `/author` page, or rebranded to Arcanea-native names to avoid attribution issues? Legal/IP question.
4. **Onchain anchor for audits** (out-of-scope but worth noting): should each council audit get a hash anchored to `arcanea-onchain`'s IP Registry? Future trilogy chapter.
5. **Telemetry**: do we wire PostHog from day 1 on `/ecosystem` and `/author`? Per `feedback_observability_silent_in_prod.md`, the answer is yes.

# Sequencing

```
Week 1 (this week): Project C
  - C.4.1 data model (manifest.yaml + repos.json extension)
  - C.4.2 generator
  - CI gate
  - Generator commits derived.ts; web reads from it
  - Layered view (existing) renders from derived.ts; orphan pills visible

Week 2: Project C polish + Project A start
  - C.4.3 Ten Gates view
  - C.4.3 Arc/Nea view
  - C.4.3 NodeDrawer
  - A.3.1 hook + per-book .author-council.yaml
  - A.3.2 slash command consolidation

Week 3: Project A finish + Project B start
  - A.3.1 Author Studio publish wiring
  - A deprecation period for old slash commands
  - B.2.1 /author page scaffold
  - B.2.2 API route

Week 4: Project B finish + telemetry
  - B BYOK + rate limit
  - PostHog wired on /ecosystem and /author
  - Documentation in .arcanea/ecosystem/README.md
  - Update .arcanea/audits/2026-05-06-plugin-overlap.md with "resolved" footer
```

# Success metric (whole trilogy)

> By 2026-06-08 (4 weeks): visiting `arcanea.ai/ecosystem`, switching to the Ten Gates view, clicking "Soul" → seeing Author Council with status `built` (not `orphan`) → clicking "Try live" → landing on `/author` → pasting Mädchen chapter 1 → seeing all 10 voices stream their critique → exporting the result. End-to-end. With telemetry capturing every step.

That is the connected experience.

---

*Spec authored 2026-05-11. Awaiting Frank's review before invoking writing-plans for Project C implementation plan.*
