# Current State — 2026-05-05 (Sprint W19 Day 2 / Synthesis Pass)

> Supersedes `CURRENT_STATE_2026-04-21_CORTEX.md` after a 14-day gap.
> Authoritative snapshot of all active systems as of W19 day 2.
> Cross-references: `SPRINT_2026-W19_2026-05-04.md` (canonical sprint),
> `LAS_TIERRAS_OVERNIGHT_PLAN_2026-05-05.md`, `JARVIS_DEMO_RUNBOOK_2026-05-04.md`,
> `HANDOVER_MULTILINGUAL_2026-05-03.md`, `VOICE_BACKLOG_2026-05-04.md`,
> `ULTIMATE_JARVIS_PLAN_2026-04-30.md` (substrate).

## TL;DR

Inflection week. Five concurrent ships closed inside W18: `@starlight/multilingual` v0.1.0, the bilingual Mädchen book (first native-language original), JARVIS voice library + demo runbook, Las Tierras Wave 1 visual parity merge, Sprint W19 cost-discipline scaffold. **Gate 0 silently slipped April 30 (€0)** — Wed May 7 EOD is the binary decision point: book €1 from one shipped surface or formally reset. Working tree carries 2,229 dirty lines (CRLF mirage suspected; commit-or-revert pending). Frank-hand carryovers from Apr 29 (vhdx compact, .npmrc rotate, ~/.claude commit, 21→≤5 instances) remain open.

Coordination model locked for W19: **one Lumina/Opus session = swarm queen; subagents in worktrees = workers**. Linear deliberately NOT introduced — adding a 4th tool while Capture is broken makes it worse.

## Verification chain (this pass, 2026-05-05)

- Local HEAD = `93758678` on `feat/las-tierras-overnight-2026-05-05` ✓
- 24+ commits in window 2026-04-22 → 2026-05-05 verified via `git log --oneline` ✓
- Working tree dirty: 2,229 status lines (matches Apr 30 + 92 line drift)
- WSL `df -h`: 476G/476G (vhdx still uncompacted from Apr 29)
- `pnpm` build / lint / typecheck NOT re-run this pass
- `:7373` voice-operator service NOT booted (per Apr 30 plan; demo path uses Groq direct)
- Capture/Council pipeline cold ≥14 days now (Apr 21 → May 5)

---

## Active systems status board (≥20 surfaces)

### Books / Library

| Surface | Status | Notes |
|---|---|---|
| Das Mädchen, das drei Sprachen hörte | ✅ SHIPPED | First native-language original (German first, English mirror). NB2 cover + 10 chapter spreads + Welle 1-3 polish + `/print` route. Sets visual gold standard. |
| Las Tierras de Luz Wave 1 | ✅ MERGED (PR #86) | Visual parity with Mädchen + Ana Cecilia Cancino full-name lock + cover-v2 + Spanish description. |
| Las Tierras Wave 2 (Council line-edit) | 🟡 UNBLOCKED | Per-chapter cuts mapped Ch 1-12; "miracle-then-explanation" signature flaw across all 5 council reviewers. ~3h work. |
| Las Tierras Wave 3 (depth/tension/dialogue/hooks) | 🟡 UNBLOCKED | First-line hooks + 25% dialogue minimum + magical flora/fauna currency check. ~4h work. |
| Las Tierras Wave 4 (Aurevaldan substrate) | 🔴 BLOCKED ON FRANK | Partial commit `7d60a6a5` weaves Lumes/Eldrian/phenakite/Aiyala as Bela's folk-cosmology. Sign-off vs hold-for-Book-2 pending. |
| Forge of Ruin / Tides of Silence / Heart of Pyrathis / Song of Van Linh / Hall of White | 🟢 BIBLEs SHIPPED | Author Team pattern; awaiting prose passes. |
| Open Library `/authors` | 🟡 SCAFFOLDED | `c15061ed` Apr 29 — first public-facing authors surface. |

### Multilingual / i18n

| Surface | Status | Notes |
|---|---|---|
| `@starlight/multilingual` v0.1.0 | ✅ SHIPPED LOCAL | 9 modules, 133 unit tests passing. JSON-LD XSS fix, Unicode regex, Polish Ł asciiSlug, longest-match resolution. NOT on npm yet (LICENSE pending). |
| `@arcanea/multilingual-config` | ✅ SHIPPED LOCAL | Sibling — Arcanea-specific locale config. |
| i18n Phase 2A foundation (apps/web) | ✅ MERGED (PR #87) | en+de scaffold for homepage + library + about. Commit `47b56040` May 5 01:50. |
| i18n Phase 2 full migration | 🟡 NEXT | Per Sprint W19 task #9. Spec ready. |
| i18n Phase 3 (es + ja) | ⏳ PLANNED | Per Sprint W19 task #26 — after Phase 2 lands. |
| Skill `multilingual` | ✅ GLOBAL + LOCAL | `~/.claude/skills/multilingual/SKILL.md` + project copy (gitignored). Renamed from `arcanea-i18n`. |
| Reviewer items (8 total) | 🟡 OPEN | LICENSE, generic LocaleConfig<L>, ContentSlugInput strict mode, clock injection, etc. Pre-standalone-repo-extract. |

### Voice / Cognition / Jarvis

| Surface | Status | Notes |
|---|---|---|
| `/room/jarvis` persona (cloud) | ✅ LIVE | Sky steel `#7dd3fc`, Sir/mountain-king voice, "Sir. Standing by." greeting. PR #80 May 5 00:27. |
| Groq full-stack pipeline (Whisper + Llama 3.3 70B + PlayAI Atlas) | ✅ SHIPPED | Single `GROQ_API_KEY` covers STT+LLM+TTS. $0 demo cost on free tier. OpenAI fallback. |
| Mic on/off pill toggle | ✅ SHIPPED | M shortcut, dims orb glow when off, stops in-flight recording. |
| `/api/voice/briefing` Node-runtime endpoint | ✅ SHIPPED | Returns git activity + branch + planning files + memory snapshot on local; Vercel returns remote-mode placeholder. |
| `/api/voice/cognition` bridge endpoint | ✅ SHIPPED | Routes through SIS voice-operator at `COGNITION_BRIDGE_URL`. 503 cta:'no-bridge' when unset. |
| `@arcanea/presence` v0.1.0 (HUD overlay + Brain Atlas) | ✅ EXTRACTED LOCAL | `packages/presence/` — 6 source files. NOT on npm. apps/web import switch = remaining sub-step. |
| SIS voice-operator `:7373` | 🔴 NOT BOOTED | 40+ Python files exist; Frank-hand boot per `VOICE_OPERATOR_BOOT_RUNBOOK_2026-04-30.md` pending. |
| VOICE-1 tool calling (`open_url`, `git_status`, `system_status`, `explain_arcanea`, `write_note`) | ⏳ PLANNED | Per `VOICE_BACKLOG_2026-05-04.md`. |
| VOICE-2 migrate Jarvis brain → SIS voice-operator | ⏳ PLANNED | Whisper download ~12 min on first run. |
| VOICE-3 HUD overlay state machine on `/room/jarvis` | ⏳ PLANNED | A5/A6 substrate ready. |
| Wake word — clap detection canon | ✅ LOCKED | NO Picovoice. Path closed. Polish, not replace. |

### Intelligence / Cortex / Surfaces

| Surface | Status | Notes |
|---|---|---|
| `/intelligence` route | ✅ LIVE | Apr 26. Council Mode (1 prompt → 5 voices) + 22-agent registry at `apps/web/lib/intelligence/agents.ts`. |
| Council Mode (5 chat calls/summon) | ✅ LIVE | Existing 30/min/IP rate limit; further metering deferred. |
| 22-agent registry (`apps/web/lib/intelligence/agents.ts`) | ✅ CANONICAL | User-facing single source of truth. |
| Brain Atlas (3D HTML, Three.js r162) | ✅ SHIPPED | Standalone at vibeclubs.ai/arcanea-brain-3d.html. 12 lobes, 2048 neurons. Distinct from `packages/presence/brain-atlas.tsx`. |
| Aesthetic direction | ✅ LOCKED | 3D neural realism (BR2049 / Arrival / Allen Brain Atlas). Banned vocab: anime/cel-shade/Ghibli/Akira. |

### Sprint W19 cost discipline

| Surface | Status | Notes |
|---|---|---|
| `VERCEL_FORCE_NO_BUILD_CACHE` removal | ✅ SHIPPED (PR #76) | Every previous preview build was cold = primary cost driver. |
| `scripts/vercel-ignore-build.sh` | ✅ SHIPPED | Frank wires in dashboard (Settings → Git → Ignored Build Step). |
| Dependabot tightening (group caps + react-major-blocked + PR limit 5→3) | ✅ SHIPPED | Mega-PR #75 (43 deps) closed; recreate next Mon at smaller scope. |
| CTO policy + Renovate + PR template | ✅ SHIPPED (PR #81) | `c359b2da`. |
| pnpm-lock regen for `packages/multilingual` | ✅ SHIPPED (PR #85) | `e45262c5`. |
| e2e LiquidGlass selectors + eslint pin + repos.json | ✅ SHIPPED (PR #78) | `d75a8a20`. |

### Storage / Ops carryovers (Apr 29 → still open)

| Item | Status | Notes |
|---|---|---|
| `/pp` slash command + disk-hotspots probe | ✅ SHIPPED | `aaabeec` in `frankxai/claude-code-config` + `9e40cb7` in Arcanea. |
| WSL2 vhdx compact | 🔴 FRANK-HAND | `scripts/compact-wsl-admin.ps1` ready; needs admin elevation. |
| `.npmrc` plaintext token rotate | 🔴 FRANK-HAND | `npm token revoke` + new + env var/1Password. |
| Review + commit/discard 18+ uncommitted `~/.claude/` | 🔴 FRANK-HAND | Agents won't touch user processes. |
| Drop concurrent Claude Code instances 21 → ≤5 | 🔴 FRANK-HAND | RAM critical. ~9.5 GB at 95% per last `/pp`. |
| Working tree commit-or-revert (2,229 dirty lines) | 🔴 FRANK-HAND | CRLF mirage suspected; verify before any large commit. |

### Capture / Council pipeline

| Item | Status | Notes |
|---|---|---|
| Capture pipeline | 🔴 COLD ≥14 DAYS | Apr 21 → May 5. Sprint W19 task #11 = diagnose. |
| `daily-brief.md` Slack target | 🔴 BROKEN | `#ops` should be `#arcanea`. Small fix, Sprint W19 task #12. |
| Day-3 silence BLOCKER notification | 🔴 MISSING | Sprint W19 task #13. New feature. |

### Architectural foundations

| Package | Status | Notes |
|---|---|---|
| `@arcanea/router-spec` v1.0.2 | ✅ npm | 14 models, 16 tasks, 7 surfaces. |
| `@arcanea/orchestrator` v0.1.0 | 🟡 LOCAL ONLY | NOT on npm. `/arco` + `/ao` shipped in FrankX. |
| `@arcanea/starlight-intelligence-system` v6.0.1 | ✅ npm | Primary substrate. |
| `@arcanea/design-system` v0.3.0 | ✅ npm | 5 primitives + Lighthouse CI. |
| `@arcanea/publishing-house` v0.5.0 | ✅ npm | 6 books with BIBLEs + 3 canon tiers staging. |
| `@arcanea/presence` v0.1.0 | 🟡 LOCAL ONLY | Not on npm. Apr 30. |
| `@starlight/multilingual` v0.1.0 | 🟡 LOCAL ONLY | Not on npm (LICENSE pending). May 3. |
| TypeScript 0 errors (typecheck CI gate) | ✅ BLOCKING | Stable since Apr 18 push. |
| 13-Surface Model + ArcaneaClaws (5 social agents) | ✅ LOCKED | Cascade-default-ON Creator Forge. |

### Vercel prod env — voice-key gap (still)

Has: `OPENROUTER_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `AI_GATEWAY_API_KEY`, `XAI_API_KEY`.
Missing (the voice keys): `GROQ_API_KEY`, `OPENAI_API_KEY`, `ELEVENLABS_API_KEY`, `ANTHROPIC_API_KEY`. Hosted `/room` returns structured 503 cta:'byok' until added; local Groq direct path works.

---

## Gate 0 — silently MISSED Apr 30 (€0)

**Decision Wed 2026-05-07 EOD:** book €1 from one of 13 surfaces, OR officially reset Gate 0 to a new dated deadline. **No more silent slips.** This is a single decision, not a build task.

Gate 0 conditions (per Apr 20 backlog):
1. GenCreator.ai live on custom domain — STATUS UNVERIFIED.
2. 3+ OSS templates with 10+ GitHub stars — STATUS UNVERIFIED.
3. First €1 revenue — **NOT MET (€0)**.
4. Meta-repo with CI/CD green — ✓ DONE.
5. Whop storefront configured — STATUS UNVERIFIED.

**BV formation:** June 1, 2026 — **27 days** from today. Cash gap is no longer hypothetical.

---

## Known issues / debt (consolidated)

1. Working tree 2,229 dirty lines + untracked `apps/dashboard/` scaffold — Frank's commit-or-revert call required.
2. `.npmrc` plaintext `_authToken=npm_...` — security debt since Apr 29.
3. SIS git 11 commits ahead unpushed (per Apr 30; not re-verified).
4. Vercel voice-key gap (4 missing keys).
5. Capture/Council pipeline cold 14+ days.
6. WSL2 Ubuntu 24.04.3 — 50 GB vhdx, 46 GB used, no code activity 7+ days, all `repos/*` clones duplicate Windows side. Decision: keep / archive / unregister.
7. ≥17 of 21 Claude Code instances still running (~9.5 GB RAM, 95%).
8. 8 reviewer items on `@starlight/multilingual` before standalone repo extract.
9. Vercel `vercel-ignore-build.sh` not yet wired in dashboard (Frank-hand).
10. Council Mode 5 chat calls/summon — existing 30/min/IP rate limit; consider further metering before scale.

---

## Coordination model (W19, locked unless overridden)

**One Lumina (Opus) session = swarm queen.** Coordinates, decides, writes plans.
**Subagents (Sonnet/Haiku) inside that session = workers.** Per-repo execution in isolated worktrees. Honors `feedback_ops_workflow` (max 4-5 instances) + `CLAUDE.md` (16 GB RAM).

Per-repo state where work happens. Cross-repo dashboard = `SPRINT_2026-W19_2026-05-04.md` primary. Persistent wisdom = Obsidian vault. Captured runtime prompts = Notion (when Capture restored).

Daily rhythm: `/dawn` morning · `/handover` evening (`docs/ops/HANDOVER-YYYY-MM-DD.md`) · `/repo-triage` Friday → single digest.

---

## Excluded from W19 (deferred)

- FrankX rebuild, Anime Legends sprint, Vault extension v2 (sequential, not parallel).
- Founding Circle launch (needs Gate 0 decision first).
- Council redesign beyond Slack channel fix.
- New product surfaces (Music IS, Vibeclubs, GenCreator) until existing ones cost-disciplined.
- `@arcanea/router-spec` v1.1, arcanea-code TUI fork, Windows PowerShell `install.sh` transpile, `@arcanea/orchestrator-pro` monetization fork.

---

## Memory state at this pass

- Last consolidation: 2026-05-05 03:30 UTC+2 (nightly automated).
- 39 active memory files indexed in `MEMORY.md`.
- New since last CURRENT_STATE: `project_sprint_w19`, `project_multilingual_starlight`, `project_books_maedchen`, `project_las_tierras_overnight`, `project_ultimate_jarvis_plan` (revised), `project_storage_emergency`, `project_oracle_exit` (revised).

## Next authoritative doc

`SPRINT_2026-W19_2026-05-04.md` remains canonical sprint home through May 10. Next CURRENT_STATE pass: 2026-05-12 (W19 close + W20 cut).
