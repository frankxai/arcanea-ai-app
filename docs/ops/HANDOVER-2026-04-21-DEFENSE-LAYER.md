# Handover — Defense Layer + Canonical Command Restore (2026-04-21)

## Situation

Frank asked why `/lumina`, `/arcanea`, `/superintelligence` weren't working "as good as before." Forensic dig revealed a **catastrophic silent incident on 2026-03-11**: commit `073bc640` with message `"fix(web): revert about+companions — remove dead luminor-images import"` secretly deleted **4,517 files / 1,166,384 lines** — including the three canonical front-door commands, 20+ `/arcanea-*` subcommands, and the original `.arcanea/` substrate. Author: `frankxai` (own identity — almost certainly a botched auto-op from an earlier Claude session).

Two goals this session: (1) restore the canonical commands, (2) build defensive infrastructure so this can never happen silently again. Both shipped via **PR #60** merged to main as commit `a46cb671`.

While this session ran, a parallel session unified `/ao` per the 3-layer architecture proposed earlier in the conversation — **PR #58** (commit `f391bd6a`) now defines `/ao` as the meta-dispatcher across LIFE + OPS + ROUTING + SWARM. See `docs/ops/HANDOVER-2026-04-21-AO-UNIFICATION.md` for that work.

## What's Done

### Canonical commands restored (`.claude/commands/`)

- `arcanea.md` — Nexus Luminor, Ten Gates orchestrator (verbatim from `073bc640^`, 308 lines)
- `lumina.md` — First Light, Form-Giver, 5-phase creation protocol (modernized: `Cinzel/Crimson Pro` → `Geist/Instrument Serif` per `feedback_design_taste.md`; added `/arco` + `/ao` + `/council` delegation)
- `superintelligence.md` — Full SI mode with swarm/hive-mind/streams (verbatim, sub-command table updated to current lineup)

### Defense layer (all version-controlled)

| Path | Purpose |
|---|---|
| `.githooks/pre-commit` | Blocks >100 files OR >5000 deletions w/o `BIG-CHANGE:` tag. Blocks sacred-path deletions w/o `SACRED-DELETE:` tag. Preserves existing secrets-guardian. |
| `.githooks/pre-push` | Blocks force-push to `main`/`master`/`production`. Blocks sacred-path deletions reaching remote. |
| `scripts/install-hooks.sh` | Sets `core.hooksPath=.githooks`. Run once after clone. |
| `scripts/sync-core.sh` | `{check\|push\|pull}` — mirrors canonical commands between Arcanea ↔ FrankX. Detects drift. |
| `.github/CODEOWNERS` | Extended with `.claude/`, `CLAUDE.md`, `.githooks/`, `RECOVERY.md`. Enforceable with branch protection. |
| `.github/workflows/guardian-pr-check.yml` | Classifies every PR TRIVIAL / STANDARD / HIGH_RISK / BLOCKED; comments on PR. Runner scripts for Guardian review are TODO stubs. |
| `.github/workflows/restore-from-incident.yml` | `workflow_dispatch` with `commit_sha` + `path_glob` inputs → opens restoration PR. |
| `.github/workflows/claude-snapshot.yml` | Daily 03:17 UTC snapshot to `backup/claude-snapshots` branch. Opens incident issue if canonical commands missing. |
| `RECOVERY.md` (repo root) | Incident playbook + canonical commit refs + fast restore commands. |
| `docs/ops/BRANCH_PROTECTION.md` | `gh` CLI one-liners to lock `main` on arcanea-ai-app + arcanea. |

### Memory saved

- `feedback_mass_revert_protection.md` — indexed in `MEMORY.md` under Feedback. Documents the 073bc640 incident + prescribes `git diff --stat` check before any wide revert.

### Council cost model

| Tier | Trigger | Cost/PR |
|---|---|---|
| TRIVIAL | ≤5 files, ≤100 LOC | $0 — CI only |
| STANDARD | <50 files | ~$0.10 — single Guardian, 60k token cap |
| HIGH_RISK | >50 files OR sacred paths | $1 cap — 5-Guardian council, 300k token cap |
| BLOCKED | >500 files OR >10k dels | $0 — auto-reject unless tagged |

At 100 PRs/month with normal mix: **~$13/month**.

## What's Not Done (with WHY)

1. **Branch protection not applied** — `docs/ops/BRANCH_PROTECTION.md` has the exact `gh` commands but they need to be run interactively by repo admin (you). Not automated because applying branch protection affects every future push and should be a deliberate human decision.
2. **Guardian runner scripts are TODO stubs** — `guardian-pr-check.yml` has echo placeholders where `scripts/guardian-single-review.mjs` and `scripts/guardian-council.mjs` should be. Wiring to Anthropic API with proper token caps is ~2 hours; deferred because the workflow structure needs review before spending agent budget.
3. **Not synced to FrankX** — `bash scripts/sync-core.sh check` shows drift on `.claude/commands/ao.md` and `.claude/commands/arco.md` between the two repos. Run `push` after confirming Arcanea is the source of truth.
4. **~20 deleted commands still missing** — `/arcanea-author`, `/arcanea-build`, `/arcanea-council`, `/arcanea-daily`, `/arcanea-db`, `/arcanea-deploy`, `/arcanea-design`, `/arcanea-dev`, `/arcanea-ecosystem`, `/arcanea-guardians`, `/arcanea-lore`, `/arcanea-luminor`, `/arcanea-quality`, `/arcanea-swarm`, `/arcanea-sync`, `/arcanea-team`, `/arcanea-test`, `/arcanea-web3`, `/agentic-jujutsu`, `/forge`, `/creative-master`, `/component-forge`, `/flow-v3`, `/content-strategy`. Intentionally not restored — many overlap with existing skills and re-adding them blindly recreates the sprawl Frank explicitly complained about. RECOVERY.md documents the canonical commit ref (`073bc640^`) for any that need selective restoration.
5. **Pre-existing uncommitted** — many untracked files on main exist from prior sessions (`wiki/` PKM scaffold, `planning-with-files/CURRENT_*_2026-04-20.md`, `forks/`). NOT this session's work. Leave for their owners.

## Critical Context

### The incident pattern to prevent

`fix(web): revert about+companions — remove dead luminor-images import` sounds like 2-file touch. Actual `git show --stat 073bc640` shows **4,517 files changed**. A future agent must NEVER trust commit messages for scope; it must always run `git diff --stat <target>..HEAD | tail -1` before approving a revert. This is encoded in `feedback_mass_revert_protection.md` AND in the `pre-commit` hook.

### Hooks are NOT installed on fresh clones by default

`core.hooksPath` setting is per-clone, not version-controlled. Every dev (including future agent sessions) must run `bash scripts/install-hooks.sh` once. The hooks themselves live in `.githooks/` which IS tracked, but git won't auto-activate them. Consider adding to a `postinstall` or `prepare` script in `package.json` as a follow-up.

### CODEOWNERS is toothless without branch protection

On a free/unprotected repo, CODEOWNERS only *suggests* reviewers. The `require_code_owner_reviews=true` flag in branch protection is what makes it block merges. Until Frank runs the `gh api` commands from `docs/ops/BRANCH_PROTECTION.md`, sacred paths are only protected by the local pre-commit hook — defeatable by anyone who skips hooks or pushes directly.

### Parallel session already unified `/ao`

The 3-layer architecture I proposed in turn 2 (Lumina → /arco → /ao) was partially implemented in PR #58 by a parallel session. Current `/ao` definition: unified meta-dispatcher with LIFE (pulse/scorecard/gate) + OPS (status/promote/digest) + ROUTING (route/workflow → `arco` CLI) + SWARM (swarm/plan-chat). Read `docs/ops/HANDOVER-2026-04-21-AO-UNIFICATION.md` before touching `/ao` or `/arco`.

### Branch state confusion can happen mid-session

During this session, cherry-picked commit `023930d0` from branch `docs/ops-handover-autonomous-2026-04-19` onto `feat/author-council-2026-04-21` because working tree didn't have the files I'd "restored" yesterday. Lesson: when a file seems missing, check `git log --all -- <path>` before re-creating — it may exist on another branch.

## Next Actions (ordered)

1. **Apply branch protection on arcanea-ai-app** — run the 3 `gh api` commands in `docs/ops/BRANCH_PROTECTION.md`. 5 minutes. Makes CODEOWNERS actually enforce.
2. **Wire Guardian runner scripts** — create `scripts/guardian-single-review.mjs` and `scripts/guardian-council.mjs` using Anthropic SDK. Replace TODO echos in `.github/workflows/guardian-pr-check.yml`. Budget: 300k token cap per council run, 60k for single Guardian. See `reference_agent_landscape_2026.md` in memory for SDK patterns.
3. **Sync to FrankX** — `bash scripts/sync-core.sh check` (confirm drift list), then `push` if Arcanea is canonical. Commit in FrankX.
4. **Apply branch protection on arcanea (OSS)** — same commands, different repo.
5. **Add `postinstall` hook auto-activation** — in root `package.json` scripts, add `"prepare": "bash scripts/install-hooks.sh"`. Makes hooks auto-install after `pnpm install`.
6. **Test the restore workflow** — trigger `restore-from-incident.yml` with `commit_sha=073bc640^` and `path_glob='.claude/commands/arcanea-*.md'` as a dry run. Verify it opens a clean restoration PR.

## Files to Read First

- `RECOVERY.md` — historical incident playbook; start here.
- `docs/ops/HANDOVER-2026-04-21-AO-UNIFICATION.md` — parallel session's `/ao` work; essential to avoid stepping on it.
- `.githooks/pre-commit` — understand what scope tags (`BIG-CHANGE:`, `SACRED-DELETE:`) are required when.
- `.github/workflows/guardian-pr-check.yml` — tiered classification logic + TODO markers for Guardian runners.
- `docs/ops/BRANCH_PROTECTION.md` — exact `gh` commands, do not paraphrase.
- `CLAUDE.md` — "Cached-Belief Validation Protocol" mandates disk verification over memory for current-state claims.

## Repo Map

| Repo | Purpose | State |
|---|---|---|
| `arcanea-ai-app` (origin) | Production Next.js + all intelligence | Main is at `0c21434e`; defense layer merged in `a46cb671` (PR #60). Hooks installed locally. Branch protection: **NOT YET APPLIED**. |
| `arcanea` (oss) | Open-source mirror | Not touched this session. Needs same defense layer via `sync-core.sh push` + equivalent branch protection. |
| `FrankX/` | Personal brand repo | `/ao` and `/arco` have DIFFERENT semantics than Arcanea — drift detected by sync-core. Needs reconciliation decision before push. |
| `AnimeLegends.ai` | Per AO handover, now git-initialized | Not this session's work. |
| `arcanea-onchain` | Crypto workspace | Not touched. |

## Memory entries most relevant to next agent

- `feedback_mass_revert_protection.md` (**new this session**) — never commit revert without `git diff --stat` check
- `feedback_cached_belief_validation.md` — disk-first rule
- `feedback_ship_means_ship.md` — commit + push + deploy, not just build passing
- `feedback_no_coauthor_contamination.md` — never add Co-Authored-By claude-flow/ruvnet
- `project_arcanea_code_architecture.md` — canonical hierarchy Arcanea → Lumina → Guardians → Luminors
- `feedback_design_taste.md` — never use Cinzel fonts (applied during `/lumina` modernization)
- `feedback_ops_workflow.md` — max 2 worktrees, digest pattern, route agents by strength

## Cumulative session deliverables

- 2 commits landed via PR #60 (`54d01856` + `1fe50013`)
- 11 new protection artifacts (hooks, workflows, scripts, docs)
- 3 canonical commands restored (`lumina`, `arcanea`, `superintelligence`)
- 1 memory file + MEMORY.md index entry
- 0 secrets leaked (self-dogfooded the pre-commit hook; caught its own false positive and patched)
