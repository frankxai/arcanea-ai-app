# Post-Session Excellence Plan — 2026-05-11

> Written at end of Claude Code Opus 4.7 [1m] session that landed 4 PRs (#103, #105, #106, #107) plus 3 dependabot merges. This file is **self-contained** — if context compacts, reading this restores everything.

---

## 30-second state of the world

- **`main` at `1d939abb`.** Healthy. Vercel auto-deploys clean.
- **What's live**: cognition bridge (`/room?via=local`), Sir's command bridge (`/cockpit`), 1817-file brand-color-token migration with Inter→Geist corruption fix (230 sites repaired), multi-agent context (`GEMINI.md`, `OPENCODE_INSTRUCTIONS.md`, `.agents/`, codex-claude bridge script), `.arcanea/` luminor onchain+mobile modules, trilogy planning docs, design-fence gate split (`check_code` vs `check_all`), router-spec `@types/node` fix.
- **No other AI agent is actively working** as of session end (confirmed with Frank). Lingering `feat-author-council-wiring` + `multi-pr` worktrees are zombies from past sessions.
- **One real outstanding feature PR**: #108 (trilogy Project C — connected ecosystem foundation). 22 commits, ~100% plan match, SAFE_TO_MERGE after one rebase + 2-line workflow fix.

---

## Excellence stack (use this filter on every action)

Per memory `feedback_quality_standard.md` (7 gates):
1. **First Principles** — does it solve the real underlying problem
2. **Voice** — does it sound like Frank/Arcanea (not generic AI)
3. **Design** — Atlantean Teal, Cosmic Blue, Arcanean Gold, #09090b background, Geist/Instrument Serif/JetBrains Mono only
4. **Performance** — CWV targets, no `pnpm dev` left running
5. **Journey** — does the user experience flow
6. **Engineering** — TypeScript strict, no `any`, tests where they matter, lockfile co-committed with package.json
7. **Strategy** — foundations over monetization (per `project_may_foundations_2026.md` — May = pure foundations month, reject single-storefront monetization push)

Plus three hard rules from memory:
- **Cached-belief validation**: verify current state via Read/Bash before citing memory
- **Cross-tab race safety**: re-verify branch + status before commit/push
- **Audit before stash**: inspect dirty WIP before stashing (handovers rot)

---

## P0 — within the next hour

### 1. Land PR #108 (trilogy Project C — ecosystem foundation)

**Status**: 22 commits, ~100% match of Tasks 1–25 in `docs/superpowers/plans/2026-05-11-connected-ecosystem-trilogy.md`. CI shows 4 failures, 3 are infra/inherited, 1 is real.

**Real fix needed (2 lines, 2 files)**:
```yaml
# In .github/workflows/ecosystem-verify.yml AND .github/workflows/ecosystem-weekly-refresh.yml
# REMOVE this block from the pnpm/action-setup step:
        with:
          version: 9
```
The root `package.json` already declares `"packageManager": "pnpm@8.15.0"` — action-setup picks that up automatically. The hard-pin to 9 in these two files causes `ERR_PNPM_BAD_PM_VERSION` mismatch.

**Inherited fix (no action needed)**: Test+build fails because PR #108 branched at `31ead7bb` (pre-#107). Main now has `@types/node@^25.6.2` in router-spec since `a9961b96`. Rebase resolves it automatically — no separate commit needed.

**Sequence to land**:
```bash
# In Arcanea repo root, on main:
git fetch origin
gh pr checkout 108
git rebase origin/main  # pulls @types/node fix + design-fence + everything from #107
# Resolve any conflicts (likely none — #108 doesn't touch the files my session changed)
# Edit .github/workflows/ecosystem-verify.yml + ecosystem-weekly-refresh.yml — remove `with: version: 9`
git add .github/workflows/ecosystem-{verify,weekly-refresh}.yml
git commit -m "ci(ecosystem): drop pnpm version pin — defer to root packageManager"
git push --force-with-lease
# Watch CI: verify gate should turn green, Test+build inherited from rebase
gh pr merge 108 --squash --delete-branch --admin
```

**Why this is high-priority**: It's working code, written to spec, that another session built. Letting it bit-rot risks merge conflicts compounding with every other PR landing. Ship it.

### 2. Triage new dependabot PRs (#114, #115)

These appeared after dependabot self-closed #109 (overlap detection) and conflicted #113. They're its **revised groupings** of the same packages.

```bash
for pr in 114 115; do
  gh pr view $pr --json title,additions,mergeable,statusCheckRollup
done
```

**Apply the same risk filter I used on #109**:
- Patches → merge if CI green, one at a time, watch main
- Minors → check what's bumped; `@google/generative-ai` and `sharp` are the usual wildcards
- Majors → never auto-merge; flag for review

**Specifically for `@google/generative-ai`**: `apps/web/package.json` is the runtime consumer. `packages/ai-core/package.json` has a separate (much older) version but **is not imported by apps/web at runtime** (verified — empty grep for `@arcanea/ai-core` imports in apps/web). So a bump in ai-core is benign.

### 3. Vercel dashboard — only Frank can do these

Tracked in Issue #104. **~5 minutes total. Highest leverage of any action this week.**

1. **Project Settings → Domains** — pick canonical:
   - Option A: apex (`arcanea.ai`) canonical, redirect www → apex
   - Option B: www canonical, keep apex → www
   - Either works. The current state breaks `fetch` + FormData on POST when users start at the apex (the "failed to fetch" you saw earlier).

2. **Project Settings → Environment Variables** — add:
   - `GROQ_API_KEY` (Whisper STT + Llama LLM + PlayAI TTS — single key for the full voice pipeline)
   - `ELEVENLABS_API_KEY` (premium TTS)
   - `OPENAI_API_KEY` (fallback for STT/TTS — may already be set, verify)

3. **GitHub Actions Secrets** (optional, cosmetic):
   - `VERCEL_TOKEN` — unblocks `Deploy Preview` + `Lighthouse` CI checks on every future PR. Currently both red on every PR purely because of this missing token.

---

## P1 — this week

### 4. Trilogy Project A (Tasks 26–33)

Plan: `docs/superpowers/plans/2026-05-11-connected-ecosystem-trilogy.md` lines for Tasks 26–33.

- Wire `@arcanea/author-council` into the books pipeline as build-time dep
- Collapse 4 slash commands (`/author-council`, `/arcanea-author-council`, `/fiction-author-council`, plus one more) → single `/author-council` with 1-week deprecation window for the others
- `.author-council.yaml` per book (Mila, Forge of Ruin, Las Tierras de Luz)
- New API route: `apps/web/app/api/author/[bookSlug]/publish/route.ts` calls author-council MCP after publish

**Pre-flight**: do NOT start until #108 lands on main. Project A depends on Project C's `derived.ts` + `public-repo-registry.ts`.

**Suggested execution**: open Claude Code in a clean terminal, branch off main, use `superpowers:subagent-driven-development` skill again (same pattern that produced #108).

### 5. Trilogy Project B (Tasks 34–44)

Public `/author` surface where users run the Council live. UI page + stream API + voice-card. Depends on Project A landing first.

### 6. Apex/www redirect end-to-end verify

After Vercel dashboard fix lands:
```bash
curl -I https://arcanea.ai/api/voice/cognition  # should NOT 307 cross-origin
curl -I https://www.arcanea.ai/api/voice/cognition  # should 200
# Then in browser: open /room/jarvis, click Speak, verify mic flow works without BYOK
```

### 7. arcanea-flow repo cleanup (1530 dirty)

Different repo at `~/arcanea-flow/`. Per the 2026-05-07 handover, this is Strategic Charter Phase 2 blocker. **Don't try to fix from this repo's session** — it needs its own dedicated session in that directory.

---

## P2 — next 2 weeks

### 8. Close or merge the 4 lingering open PRs

- **#92** `chore/post-overnight-audit-2026-05-06` — your 11 audit docs. Probably mergeable once main goes green. Check + merge.
- **#100** `ci/a11y-axe-gate-2026-05-07` — elevates Lighthouse gates warn→error. **Decide first**: enforce now or keep warn. Affects every future PR's CI behavior.
- **#101** `fix/vercel-buildcommand-2026-05-07 [HYPOTHESIS]` — experimental. Either confirm hypothesis with a test deploy or close.
- **#108** — see P0.

### 9. Worktree cleanup

Current state: 4 worktrees, over the 2-max policy.

- `multi-pr` (May 7, stale) — safe to remove: `git worktree remove .claude/worktrees/multi-pr`
- `feat-author-council-wiring` (May 11, 09:35 last touch) — INSPECT before removing; may contain Project A WIP. Run `cd .claude/worktrees/feat-author-council-wiring && git status --short` first.
- `agent-*` (locked, today) — these are MY background agents (rescue + reviewer). They'll auto-clean over time or you can force-remove.

### 10. Sister-book trilogy (per memory)

Per `project_tier_10_sister_worlds_proposal.md` and `project_mila_book.md` / `project_las_tierras_book.md`: three sister-book worlds proposed. Awaiting your LOCK. Not Project A/B/C scope — separate creative track. Mention here only so it's not forgotten.

---

## Out-of-scope (do NOT do these)

- **DON'T** touch the 1530 dirty files in `~/arcanea-flow/` from this repo's terminal — different repo, different session
- **DON'T** merge dependabot major version bumps autonomously (per memory `feedback_dependabot_guardrails.md`)
- **DON'T** commit anything that introduces `Cinzel`, `Space Grotesk`, `Inter` font references in code (only allowed in policy markdown — design-fence gate enforces this)
- **DON'T** add `domMax` to Framer Motion code (gate-blocked)
- **DON'T** use `pnpm dev` to validate UI on this 16GB machine (per CLAUDE.md — use `pnpm build` one-shot + Vercel preview)
- **DON'T** start trying to "fix" main when CI's red checks are infra (lighthouse, Deploy Preview) — Vercel native deploy is the source of truth
- **DON'T** spawn more than 4 concurrent Claude Code instances (RAM ceiling per CLAUDE.md)

---

## Memory anchors (canonical references)

| What | Where |
|---|---|
| Trilogy implementation plan | `docs/superpowers/plans/2026-05-11-connected-ecosystem-trilogy.md` |
| Trilogy architecture spec | `docs/superpowers/specs/2026-05-11-connected-ecosystem-trilogy-design.md` |
| Last day's handover (cascade merge action queue) | `planning-with-files/HANDOVER_2026-05-07_DAY_EXECUTION.md` |
| Ops captures (Vercel TODO + PR inventory) | GitHub Issue #104 |
| Design system | `@arcanea/design-system` v0.3.0 + `.claude/CLAUDE.md` |
| Brand discipline | `feedback_design_taste.md`, `feedback_design_tier.md` |
| Quality bar | `feedback_quality_standard.md` (7 gates) |
| Strategy guardrail | `feedback_think_bigger.md`, `project_may_foundations_2026.md` |
| Ship discipline | `feedback_ship_means_ship.md` |
| Dependabot rules | `feedback_dependabot_guardrails.md`, `feedback_lockfile_drift_pattern.md` |

---

## Session deltas summary (what THIS session shipped to main)

```
1d939abb  chore(deps): bump actions/cache from 4 to 5 (#111)               2026-05-11 ~10:24
6ca8d6d0  chore(deps-dev): bump the dev-patches group × 9 (#112)            2026-05-11 ~10:20
704daefc  chore(deps): bump wait-for-vercel-preview 1.3.3 (#110)            2026-05-11 ~10:18
a9961b96  chore: capture multi-agent context + .arcanea + trilogy + ... (#107)  2026-05-11 ~10:00
60d307a7  refactor(web): brand-color-tokens unification + Inter→Geist fix (#106)  2026-05-11 ~09:00
31ead7bb  feat(cockpit): rescue Sir's command bridge (#105)                 2026-05-11 ~06:30
139fde24  feat(room): cognition bridge — /room?via=local (#103)             2026-05-11 ~06:00
```

**Net**: 7 commits to main. 1817 files migrated. 230 corruption sites repaired. 1 stranded PR rescued. 0 regressions. ~3h elapsed.

---

## First action for the next session

```bash
cd ~/Arcanea
git fetch origin
git status                            # confirm clean baseline
gh pr view 108 --json mergeable       # if CONFLICTING, do P0 step 1 above
```

If you forget where to start: re-read this file's `P0` section. Everything before that is context; everything after is sequencing. Start with item #1.

---

_Closed by Claude Code Opus 4.7 [1m]. Nothing in flight from my side. Standing handover complete._
