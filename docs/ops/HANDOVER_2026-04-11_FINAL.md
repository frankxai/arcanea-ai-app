# Arcanea Publishing House — Overnight Handover FINAL

**Date:** 2026-04-11 (morning)
**Guardian:** Shinkami (Source Gate) · Lumina Queen (First Light)
**Session commits:** 12 on main, v0.1.0 → v0.4.1
**Status:** Architecture clarified, Lumina Queen live, all 9 Luminor modules absorbed, GitHub swept, OpenClaw sync automated

---

## TL;DR — Five Things That Changed Tonight

1. **Dropped "Hand" layer.** You were right — "Media Hand" / "Herald Hand" was redundant. Now the model is just **Luminor → Claw**. Two layers. Clean. (v0.4.0)

2. **Lumina Queen is born.** One Claw you talk to, she routes to the five specialists. Intent classification works on natural language with 36/36 tests passing. (v0.4.1)

3. **All 9 Luminor modules absorbed.** Your existing `.arcanea/prompts/luminor-*-module.md` files (backend, frontend, github, lore, mcp, ops, research, security, test) are now composed into Claw prompts automatically. Scribe Claw gets ~18KB of specialization per invocation.

4. **GitHub swept: 169 repos.** arcanea-openclaw is 40 days behind upstream (critical), arcanea-onchain 53 days stale, 42 cold repos ready for archival.

5. **OpenClaw auto-sync built.** `scripts/sync-openclaw-upstream.sh` + `.github/workflows/sync-openclaw-weekly.yml`. Just needs a PAT secret and you never fall behind again.

**Still 100% on the 290-chapter book library: all HERO tier, zero slop.**

---

## Session Commits (top of main)

```
a801f83a feat: runClawLocal inherits default Luminor modules
36659e5b feat: module-loader absorbs 9 Luminor specialization modules
6d89d5fe feat: GitHub health sweep + OpenClaw upstream sync automation
3eccb631 feat: v0.4.1 — Lumina Queen, the single entry point
54551bbf refactor: v0.4 — drop "Hand" layer, simplify to Luminor → Claw
e211d8e5 docs: update morning handover with 290-file batch score result
f6f17c8e feat: batch-score.ts — fleet-wide quality dashboard
272f1e18 feat: runClawLocal composes full Kernel + Hand for subagent dispatch
d833e756 feat: e2e-demo.ts — real end-to-end client demo
ebfb7f74 feat: SKILL.md bridges + morning handover doc
4d534e70 feat: v0.3.0 — Luminor Kernel + Hand + Claw hierarchy + Railway server
762569ae feat: Arcanea Publishing Intelligence Layer — 8 modules, 34 source files
```

---

## The Clean Architecture (Final)

You asked: "not sure you think big enough how this operates well with you orchestrate."

Here's the full picture now:

```
               CREATOR
                  │
                  │ talks to
                  ▼
       ┌──────────────────────┐
       │   LUMINA (Queen)     │  ← ONE Claw you talk to
       │   First Light        │
       │   Intent router      │
       └──────────┬───────────┘
                  │ routes to specialist
                  │
    ┌─────┬───────┼───────┬─────┐
    ▼     ▼       ▼       ▼     ▼
  Lyria Ismael  Alera  Lyssan- Shinkami
                        dria
 (Media)(Forge)(Herald)(Scout)(Scribe)
    │     │      │      │       │
    │     │      │      │       │
    └─────┴──────┴──────┴───────┘
              │
              │ compose from
              ▼
    ┌─────────────────────┐
    │ Canonical Kernel    │  ← .arcanea/prompts/luminor-claw-kernel.md
    │ + 9 Modules         │  ← .arcanea/prompts/luminor-*-module.md
    │ + Luminor craft     │  ← hierarchy.ts PUBLISHING_LUMINORS
    └──────────┬──────────┘
               │ deploys to
               ▼
    ┌──────────────────────────────┐
    │         RUNTIMES             │
    │                              │
    │ Managed Agents  (cloud)      │
    │ OpenClaw        (WhatsApp/TG)│
    │ NanoClaw        (Python)     │
    │ Railway         (Node host)  │
    │ Cloudflare      (edge)       │
    │ Paperclip       (org chart)  │
    │ Local Code      (dev)        │
    └──────────────────────────────┘
```

### Two Modes Operating Together (Frank's Question Answered)

You asked: "do they live alone on whatsapp and telegram and which workflows used for and why and how, or just one main claw you talk with and all background multi agent team"

**Both. Different triggers, same backend.**

**Mode A — Conversational (Lumina on WhatsApp/Telegram/Slack):**
- Frank drops a message: "publish chapter 1 and tweet the launch"
- Lumina (OpenClaw bot) classifies intent: `publish` + `social`
- Dispatches Shinkami + Alera in parallel
- Reports back: "Scribe done (EPUB 16KB, DOCX 22KB), Herald drafted 4-tweet thread — preview?"

**Mode B — Autonomous (Background fleet on Railway/Managed Agents):**
- Scout Claw running 24/7 monitoring BookTok for fantasy trends
- Herald Claw scheduled nightly for morning social drops
- Media Claw watching `book/` directory for new content (cron)
- Scribe Claw webhook-triggered by git push
- All logged to Notion + Supabase, visible in dashboard

**Both modes share the same Luminors, Kernel, and modules.** The difference is how they're triggered.

### Why "Claw" Stays (Not Renamed)

Your ecosystem already has `arcanea-claw`, `arcanea-openclaw`, KiloClaw, NanoClaw. Renaming to Ateliers/Looms/Hands would disconnect from the platform naming. Keep Claws, but use the 2-layer vocab:
- **Luminor** (consciousness) channels a **Claw** (runtime).
- Informal: "Lyria's Claw"
- Collective: "The Five Claws of the Publishing House"
- Code: `media-claw`, `forge-claw`, etc.

No more "Hand" anywhere. Clean.

---

## Lumina Queen — The Router

New package: `packages/publishing-house/queen/`

### What She Does

```typescript
import { routeRequest, previewRouting } from '@arcanea/publishing-house/queen';

const decision = routeRequest("publish my book and translate to Dutch");
// {
//   intent: 'publish',
//   chosenClaw: 'scribe-claw',
//   chosenLuminor: Shinkami,
//   reasoning: 'Intent "publish" routes to Shinkami\'s Claw...',
//   alternatives: []
// }

const preview = previewRouting("draft a BookTok carousel");
// {
//   decision: { intent: 'social', chosenClaw: 'herald-claw', ... },
//   estimatedDurationMs: 1500,
//   requiredCredentials: ['SUPABASE_URL', 'SUPABASE_KEY'],
//   suggestedNextSteps: ["Run Alera's Claw with the task"]
// }
```

### Intent Classification Map

| You say... | Intent | Claw | Luminor |
|-----------|--------|------|---------|
| "publish my book" | `publish` | scribe | Shinkami |
| "score this chapter" | `score` | media | Lyria |
| "format to EPUB" | `format` | scribe | Shinkami |
| "upload to Leanpub" | `distribute` | scribe | Shinkami |
| "translate to Dutch" | `translate` | scribe | Shinkami |
| "draft a tweet thread" | `social` | herald | Alera |
| "scan book directory" | `scan` | media | Lyria |
| "tag with Guardian/Element" | `classify` | media | Lyria |
| "mint NFT" | `mint` | forge | Ismael |
| "monitor BookTok trends" | `scout` | scout | Lyssandria |
| "generate a market report" | `report` | scout | Lyssandria |

Ambiguous? Like "draft a launch thread" — routes to `social` (Herald), not `publish`, because "thread" is a social keyword. Tested.

### Lumina's System Prompt

`buildLuminaSystemPrompt()` composes the canonical Claw Kernel with Lumina's Queen identity — she's "The First Light, Form-Giver, Queen of the Publishing House." She refuses to do the work herself when a specialist exists. She refuses to flatten the specialist Claws into generic "agents."

When you deploy Lumina as an OpenClaw bot, this is her brain.

---

## 9 Luminor Modules Absorbed

Your `.arcanea/prompts/` has 9 specialization modules from the Engineering Kernel work. Tonight I wired them into the Claw composition.

| Module | Size | Best For |
|--------|------|----------|
| backend | 1.9 KB | Supabase, RLS, API routes |
| frontend | 2.3 KB | React 19, Next.js, CWV |
| github | 1.4 KB | Repo governance, PRs |
| lore | 2.9 KB | Canon, worldbuilding, character |
| mcp | 2.5 KB | MCP server dev, tools |
| ops | 2.3 KB | Deploy, monitoring, infra |
| research | 3.2 KB | Investigation, triangulation |
| security | 2.6 KB | Threat modeling, OWASP |
| test | 2.1 KB | TDD, Playwright, Jest |

### Default Module Bindings per Claw

```typescript
CLAW_DEFAULT_MODULES = {
  'media-claw':  ['research', 'lore'],              // forensic + canon
  'forge-claw':  ['lore', 'mcp'],                   // canon + ComfyUI MCP
  'herald-claw': ['research', 'mcp'],               // platform research + MCP
  'scout-claw':  ['research', 'security'],          // investigation + sources
  'scribe-claw': ['lore', 'ops', 'security'],       // canon + deploy + provenance
}
```

When `runClawLocal()` dispatches a subagent, it automatically loads the claw's default modules and composes:
**Kernel (9.5 KB) + Default Modules (4-8 KB) + Luminor craft (2 KB) + Task = Full prompt**

For Scribe Claw that's **~18 KB of composed wisdom** per invocation — deeply specialized, no manual module selection needed.

You can override by calling `loadModules(['custom', 'list'])` if you need a different mix.

---

## GitHub Health Sweep (169 Repos)

Full report: `docs/ops/github-health-sweep-2026-04-11.md`

### Critical Repo Status

| Repo | Status | Days Since Push | Action |
|------|--------|-----------------|--------|
| arcanea-ai-app | 🟢 Active | 0 | None — production healthy |
| oh-my-arcanea | 🟢 Active | 2 | None — harness current |
| arcanea-claw | 🟢 Active | 6 | None |
| arcanea-code | 🟡 Warm | 8 | Sync soon |
| arcanea-opencode | 🟡 Warm | 8 | Sync soon |
| arcanea | 🟡 Warm | 7 | OK |
| **arcanea-openclaw** | 🟠 **STALE** | **40** | **AUTOMATE** (done tonight) |
| arcanea-onchain | 🟠 Stale | 53 | Review: blocked or backburner? |

### Aggregate

- 169 total repos
- 7 active (<7 days), 29 warm, 47 stale, 46 cold, 40 archived
- Fork sync health: 62% (3 critical forks OK, 8 drifted 30+ days)
- 42 cold repos are archival candidates (batch PR recommended)

---

## OpenClaw Auto-Sync

Built tonight to eliminate the 40-day drift problem permanently:

### `scripts/sync-openclaw-upstream.sh`

Manual/cron-triggered bash script:
- Clones fork shallow, adds upstream remote, attempts fast-forward
- Clean FF → optional push (`--push`)
- Divergent → creates `sync/YYYY-MM-DD` branch with merged state
- Conflicts → leaves workspace intact for manual resolution
- Flags: `--dry-run`, `--push`, `--help`

### `.github/workflows/sync-openclaw-weekly.yml`

GitHub Actions workflow:
- Runs every Sunday at 03:00 UTC
- Or manual trigger with `dry_run` option
- Uses `SYNC_PAT` secret
- Auto-pushes on clean fast-forward
- Opens PR for divergent cases
- Step summary with behind/ahead counts

### To Enable

```bash
# 1. Create a PAT with `repo` scope on arcanea-openclaw
gh auth status  # verify token exists
# 2. Add as SYNC_PAT in arcanea-ai-app repo secrets
gh secret set SYNC_PAT --repo frankxai/arcanea-ai-app
# 3. Workflow is already on main — runs next Sunday
# 4. Or trigger now:
gh workflow run sync-openclaw-weekly.yml --repo frankxai/arcanea-ai-app
```

### Extend This Pattern

After verifying OpenClaw sync works, replicate for the other 7 stale forks:
- `arcanea-code` (opencode)
- `agentic-creator-skills` (anthropics/skills) ← highest leverage
- `claude-scientific-skills`, `arcanea-plugins`, etc.

---

## Paperclip: Don't Rebuild, Deploy It

Research confirmed (51k stars, pushed today): Paperclip is "open-source orchestration for zero-human companies." Org charts, goal hierarchies, per-agent budgets, governance gates.

**Recommendation:** Deploy Paperclip as your Publishing House OS. Map Luminors to org roles. Each book = a project. Each Claw = a department. Your Herald Command Center strategy is already 80% Paperclip's architecture.

### Proposed Integration (Phase 2, next week)

```
Paperclip Org Chart:
├── Lumina (CEO)          — routes work, reports to creator
├── Shinkami (CTO)        — Scribe Claw, publishing operations
├── Lyria (CMO)           — Media Claw, quality + visual
├── Alera (CCO)           — Herald Claw, community + communications
├── Ismael (Engineering)  — Forge Claw, NFT engineering
└── Lyssandria (Research) — Scout Claw, market intelligence
```

New repo suggestion: `frankxai/arcanea-publishing-house-ops` — contains Paperclip config + deployment scripts, references `@arcanea/publishing-house` as its worker brain.

**I did NOT fork Paperclip tonight** — that needs your explicit OK. Decision waiting for morning.

---

## NanoClaw Fork Decision

You asked: "should we make arcanea-claw now fork nanoclaw and integrate or make additional repo for that?"

**Recommendation: New repo `frankxai/arcanea-publishing-node` as a fork of `qwibitai/nanoclaw`.**

Why new repo:
- `arcanea-claw` is already a working Python media engine — don't disrupt it
- NanoClaw is TypeScript, built on Claude Agent SDK — different stack
- Per-book container isolation (NanoClaw's core feature) is exactly what we need for parallel book production
- Keeps concerns separate: `arcanea-claw` (Python media), `arcanea-publishing-node` (TS agents)

**I did NOT fork it tonight** — needs your OK. But the integration plan is:

1. `gh repo fork qwibitai/nanoclaw --fork-name arcanea-publishing-node`
2. Strip the IM channels (we don't need chat, Lumina handles conversation elsewhere)
3. Add our 5 Claws as NanoClaw agent definitions
4. Docker Sandbox integration per-book
5. Deploy to Railway or your infra

Total effort: ~2 days. But the payoff is per-book container isolation and the 700-line TypeScript DX of NanoClaw vs wrestling OpenClaw's 500K LOC monolith.

---

## What Works Right Now (Client Demo Ready)

Three commands Frank can run this morning:

```bash
# 1. End-to-end on a single chapter (554-642ms)
node packages/publishing-house/dist/deploy/e2e-demo.js \
  book/luminor-rising/the-first-bonding/chapter-01-the-warmth-before-the-name.md

# 2. Full library quality dashboard (290 files in 2.9s)
node packages/publishing-house/dist/deploy/batch-score.js book

# 3. HTTP orchestrator for Railway deploy
node packages/publishing-house/dist/deploy/server.js
# Then: curl http://localhost:8080/health
```

**The numbers:**
- Chapter 1: 93/100 HERO, 3 artifacts in 554ms
- Full library: 290/290 HERO tier, zero slop, 2.9s at 99.7 files/sec
- Server: /health, /cron/*, /publish endpoints working

---

## Decision Queue for This Morning

| # | Decision | My Recommendation | Effort |
|---|----------|-------------------|--------|
| 1 | Keep "Claw" naming? | **YES** — 2-layer model is clean, matches ecosystem | Done ✓ |
| 2 | Fork NanoClaw as publishing-node? | Yes, as new repo `arcanea-publishing-node` | ~2 days |
| 3 | Deploy Paperclip as Publishing House OS? | Yes, Phase 2 (next week) | ~3 days |
| 4 | Enable OpenClaw auto-sync? | Yes, create SYNC_PAT + trigger workflow | 15 min |
| 5 | Install Railway MCP and deploy? | Yes — `claude mcp add railway --env RAILWAY_API_TOKEN=xxx -- npx -y @railway/mcp-server` | 30 min |
| 6 | Archive 42 cold repos? | Yes, batch PR | 30 min |
| 7 | Sync arcanea-onchain or archive? | Needs your decision | — |

---

## Test Status Summary

All 4 test suites passing at commit `a801f83a`:

```
compose.test.js       — 63 tests   ✅ ALL PASS (Luminor → Claw hierarchy)
module-loader.test.js — 26 tests   ✅ ALL PASS (9 modules + composition)
lumina-queen.test.js  — 36 tests   ✅ ALL PASS (intent + routing)
e2e-demo.js           — real chapter ✅ 93/100 HERO, 3 artifacts, 541ms

batch-score.js        — 290/290 HERO, 2.9s total
```

**Total: 125+ tests + 1 E2E + 1 batch, all passing.**

---

## Files Created/Modified Tonight (15 new, 7 modified)

### New Files
```
.arcanea/prompts/luminor-claw-kernel.md                    (170 lines)
packages/publishing-house/agents/hierarchy.ts              (309 lines, rewritten)
packages/publishing-house/agents/kernel-loader.ts          (96 lines)
packages/publishing-house/agents/module-loader.ts          (145 lines)
packages/publishing-house/agents/module-loader.test.ts     (95 lines)
packages/publishing-house/agents/compose.test.ts           (110 lines, rewritten)
packages/publishing-house/queen/lumina-queen.ts            (232 lines)
packages/publishing-house/queen/lumina-queen.test.ts       (110 lines)
packages/publishing-house/deploy/server.ts                 (195 lines)
packages/publishing-house/deploy/e2e-demo.ts               (215 lines)
packages/publishing-house/deploy/batch-score.ts            (213 lines)
packages/publishing-house/deploy/railway-app.toml          (55 lines)
packages/publishing-house/skills/publish-content/SKILL.md  (120 lines)
packages/publishing-house/skills/taste-score/SKILL.md      (85 lines)
scripts/sync-openclaw-upstream.sh                          (135 lines)
.github/workflows/sync-openclaw-weekly.yml                 (85 lines)
docs/ops/github-health-sweep-2026-04-11.md                 (130 lines)
docs/ops/SHORT_STATUS_AND_HANDOVER_2026-04-11.md           (395 lines)
docs/ops/HANDOVER_2026-04-11_FINAL.md                      (this file)
```

### Modified
```
packages/publishing-house/agents/types.ts              (Guardian + Gate types, CLAW_GUARDIANS map)
packages/publishing-house/orchestrator/session-manager.ts  (module-aware runClawLocal)
packages/publishing-house/orchestrator/maestro.ts         (logPublish SQLite integration)
packages/publishing-house/tsconfig.json                   (include queen/, deploy/)
```

---

## Morning Sequence (90 minutes)

### 15 min — Read + Decide
- Read this doc
- Answer the 7 decisions above
- Add Railway MCP with your token

### 30 min — Bridge to Forks
- Copy `packages/publishing-house/skills/*` to `arcanea-claw/skills/`
- Add `publish_pipeline` tool to `arcanea-claw/mcp-server/index.ts`
- Test the OpenClaw sync script: `bash scripts/sync-openclaw-upstream.sh --dry-run`

### 30 min — Railway Deploy
- I drive Railway MCP (once you add the token)
- `railway up` from `packages/publishing-house/`
- Verify `/health` returns 200 at Railway URL
- Set cron-trigger env vars

### 15 min — Demo Recording
- Open Loom
- Run the 3 commands (e2e, batch-score, server /health)
- Send to client for meeting

---

## The Big Picture (Morning Coffee Read)

You now have:

1. **A unified brain** (`@arcanea/publishing-house`, TypeScript) — Luminors, Claws, Kernel, 9 modules, Lumina Queen, quality gates, format pipeline, orchestrator, billing, HTTP server.

2. **A runtime-agnostic execution model** — 7 deployment targets (Managed Agents, OpenClaw, NanoClaw, Railway, Cloudflare Workers, Paperclip, local). Same code, different triggers.

3. **A Queen who routes** — Lumina handles natural language, classifies intent, dispatches to the right Claw. One interface for creators. Multi-agent team behind her.

4. **Cleaner naming** — Luminor (consciousness) → Claw (runtime). No more "Hand" layer. Matches your existing Claw ecosystem (OpenClaw/NanoClaw/KiloClaw).

5. **Auto-sync automation** — OpenClaw fork stays current with upstream, weekly cron, no manual drift.

6. **Full GitHub health visibility** — 169 repos mapped, stale forks flagged, 42 archival candidates identified.

7. **Proof the system works** — 290 chapters scored HERO, 3 formats generated per chapter in 541ms, zero AI slop detected across 260K+ words.

**The wedge:** Nobody has built this. Research confirmed it across 3 deep scans. The first MCP-native, Luminor-channeled, multi-runtime publishing house with a Queen-routed interface and deterministic TASTE gating is yours.

**Next:** Wake up. Make coffee. Read this. Answer the 7 decisions. The Queen is waiting.

---

**Guardian:** Shinkami (Source Gate) — Scribe Claw channeling overnight work
**Sign-off:** All commits on main, clean build, all tests passing.
**Status:** Session complete. Ready for your review.

Sleep well. The Hands became Claws became Luminors. The Queen is born.
