# Morning Briefing — 2026-05-07 (Frank, read this first)

You authorized "execute all night" with strict guardrails. **Two agent threads ran in parallel** on different scopes, both disciplined, no destructive ops without your sign-off. Below is the unified picture.

---

## 30-second summary

- **No code was committed without your review tonight.** PR #94 was opened by the other thread (single-file `.claude/settings.json` cleanup, fully reversible). My thread produced 9 audit/plan markdown files and 0 code edits.
- **Main is still red** because PR #93 (sitemap fix) hasn't merged. Merge that first; everything else cascades.
- **The biggest finding** wasn't on my pre-flight list: production observability is silent (no analytics, no error reporting actually firing on arcanea.ai despite the code being installed). Wiring this is a 2-hour job that unlocks every other improvement.
- **Two parallel audits, complementary scope.** The other thread covers harness/sovereignty/Phase-1-execution. Mine covers fleet/live-site/memory/scorecard/risks/90d-plan. Read both.

---

## Action queue (your morning, ranked)

### 🔴 P0 — within 15 minutes of waking

```bash
cd ~/Arcanea
gh pr merge 93 --squash --delete-branch    # unblocks 5-day red main
gh pr merge 94 --squash --delete-branch    # other-thread Phase 1 cleanup, depends on #93
```

After that → check for the 27 dirty brand-token files in your worktree. **They're golden** (P0 audit). Decide: dedicated PR `refactor/brand-color-tokens` or discard. Do NOT stash — `feedback_audit_before_stash` rule.

### 🔴 P0 — this morning (≤ 2 hours)

1. **Wire production observability.** Memory said "code installed, needs API keys." I verified prod: zero analytics fire on arcanea.ai. SpeedInsights + Vercel Analytics + PostHog + Sentry — all need 1-line component mounts + env vars.
2. **Reconcile MEMORY.md** — 38 entries on disk but not indexed. Future you will lose them silently. Quick scan + append.

### 🟡 P1 — this week

3. Switch root domain redirect from 307 → 301 (1 Vercel setting).
4. Add `<link rel="alternate" hreflang>` for de/es per locale (i18n Phase 2A is invisible to Google without this).
5. `lockfile-drift-check.yml` + `design-fence-grep.yml` workflows — stop the recurring `fix(ci)` tax.
6. Strategic Charter Phase 1 finish what other thread started — it landed PR #94, but the charter has more (5 sub-items).
7. Inspect `arcanea-flow`'s 1,530 uncommitted changes (charter Phase 2 blocker).

### 🟢 P2 — next 2 weeks

8. Ship 4 fleet skills (`arcanea-fleet`, `arcanea-gate`, `arcanea-watch`, `arcanea-absorb`) — see `OVERNIGHT_2026-05-06_AUDIT_SKILLS_AGENTS.md`.
9. Build `repos.json` registry from `tmp/fleet-scan.json` snapshot taken tonight.
10. First vendor harness MVP: `claude-arcanea` to 10–15 working skills.

(Full 90-day plan in `planning-with-files/OVERNIGHT_2026-05-06_PLAN_EXCELLENCE_90D.md`.)

---

## Excellence scorecard (snapshot)

| Axis | Score | Comment |
|---|---|---|
| CI / Build | 2/5 | 25% main green. Critical. |
| Lint / Typecheck | 3/5 | OK, enforce earlier (pre-push) |
| Tests | 2/5 | Unmeasured |
| Lockfile + deps | 3/5 | Renovate+Dependabot duplicate |
| Secrets / supply chain | 2/5 | No secret scan, no SBOM |
| Design fence | 3/5 | Tokens exist, no CI gate |
| A11y | 2/5 | 0 skip-links, sparse aria, no axe |
| SEO / CWV | 3/5 | Strong meta, missing hreflang + obs |
| Copy / voice | 4/5 | Hero strong, drift on detail counters |
| **Observability** | **1/5** | **Prod is silent — fix today** |
| Docs hygiene | 3/5 | Rich but stale (CURRENT_STATE 16d old) |
| Multi-repo fleet mgmt | 1/5 | No registry across 64 surfaces |

**Total: 29/60 = 48%**. Target by 2026-08-06: ≥ 50/60.

The dominant theme: creative IP layer is excellent, operational substrate is weak. Tonight's audits attack the substrate.

---

## What you have when you wake (artifact map)

### From the other agent (`.arcanea/audits/`)
- `2026-05-06-plugin-overlap.md` (17.9 KB) — 21 plugins ranked, 22 dirs to delete, 13 hidden gems
- `2026-05-06-skills-inventory.md` (4.3 KB) — 164 skills graded A/B/C/D
- `2026-05-06-repo-architecture.md` (5.0 KB) — 11 harness/substrate repos mapped
- `2026-05-06-strategic-charter.md` v1 (9.7 KB) — initial 5-layer arch
- `2026-05-07-strategic-charter-v2.md` (7.2 KB) — **supersedes v1**, ground-truth verified, corrects oh-my-arcanea framing
- `2026-05-07-engineering-excellence.md` (11.3 KB) — top 10 engineering priorities
- `2026-05-07-90-day-roadmap.md` (6.1 KB) — week-by-week to 2026-08-05
- `2026-05-07-overnight-handover.md` (8.7 KB) — their handover, complementary to this

### From this thread (`planning-with-files/OVERNIGHT_2026-05-06_*`)
- `TASK_PLAN.md` — phase tracker
- `FINDINGS.md` — pre-flight ground truth
- `PROGRESS.md` — session log
- `WIP_AUDIT.md` (P0) — 27-file design-token unification mid-flight (DO NOT STASH)
- `AUDIT_FLEET_REGISTRY.md` (P2) — 38 sibling repos catalogued, tier-classified
- `AUDIT_LIVE_SITE.md` (P5) — arcanea.ai static SEO/perf audit
- `AUDIT_MEMORY_SIS.md` (P6) — 172 entries on disk, 38 unindexed, decay protocol proposed
- `AUDIT_EXCELLENCE_SCORECARD.md` (P4) — 12-axis 29/60 scoring with evidence
- `AUDIT_SKILLS_AGENTS.md` (P7) — fleet-skills gap + 75-subagent observation
- `AUDIT_RISK_REGISTER.md` (P8) — top 20 ranked
- `PLAN_EXCELLENCE_90D.md` (P9) — May/June/July week-by-week
- `HANDOVER_2026-05-06_OVERNIGHT_AUDIT.md` (this file)

### Branch / commit state at end of session
- Working tree on `docs/ecosystem-audits-2026-05-07` (parallel agent created this off main)
- 8 audit docs **staged** (parallel agent's work + my progress.md)
- 11 of my new audit files **untracked** (waiting for your decision on commit)
- 27 dirty brand-token files **untouched** (workstream B from P0 — needs separate PR)
- 4 untracked dirs: `_archive/`, `GEMINI.md`, `packages/arcanea-cli/src/`, `tmp/` (audit scratch)

### Suggested commit recipe (when you wake)
```bash
# 1. Merge PR #93 + #94 first (CI fixes + Phase 1 cleanup)
gh pr merge 93 --squash --delete-branch
gh pr merge 94 --squash --delete-branch

# 2. Commit my audit deliverables on the docs branch the parallel agent prepared
git add planning-with-files/OVERNIGHT_2026-05-06_*.md
git commit -m "docs(audits): overnight ecosystem + scorecard + 90d plan"

# 3. Open PR for the docs branch (already has the .arcanea/audits/* staged from parallel agent)
gh pr create --base main --title "docs: overnight strategic audit pass" --body-file .arcanea/audits/2026-05-07-overnight-handover.md

# 4. Decide on the brand-token WIP separately
git checkout -b refactor/brand-color-tokens
git stash  # ONLY after viewing — feedback_audit_before_stash already cleared
# OR: git add the 27 specific design files and commit
```

---

## Risks to surface now (top 5 from full register)

1. **Production observability silent** — measured, not theory. Wire today.
2. **MEMORY.md index drift (38 entries)** — fix before next memory write or future-you loses them.
3. **64-repo fleet has no registry** — `tmp/fleet-scan.json` is the foundation.
4. **20 nested .git folders inside Arcanea/** — partial mitigation in `_archive/` (5 already there). Charter Phase 1 incomplete.
5. **Lockfile drift breaks main repeatedly** — CI gate needed (item P1#5 above).

Full ranked list: `OVERNIGHT_2026-05-06_AUDIT_RISK_REGISTER.md`.

---

## What I deliberately did NOT do (and why)

- **Did not push the 2 unpushed CI fixes on `fix/ci-sitemap-locale-route-2026-05-06`** — the parallel agent's PR #94 is sequenced behind PR #93. Merging the right way is your call.
- **Did not commit the 27 brand-token dirty files** — brand-wide change, deserves your review (`feedback_design_tier`).
- **Did not commit `_archive/`** — full nested `.git/` folders inside, would re-introduce the very problem we're trying to solve.
- **Did not delete any nested .git folders** — Strategic Charter Phase 1 is gated on you saying "go" (per their handover).
- **Did not run `pnpm dev` or any heavy build** — 16GB RAM constraint (`feedback_ops_workflow`).
- **Did not modify `~/.claude/settings.json` or other-thread's branch** — single-writer discipline across the cross-tab race.
- **Did not invoke autonomous agents that would burn tokens overnight** — all my tool calls completed within this session synchronously.

---

## Memory updates I'd recommend you record (or I can in next session)

After PR #93 + #94 merge, update these memories:

1. `feedback_design_token_unification_wip` — NEW. "27-file brand-color migration in flight on `refactor/brand-color-tokens` branch as of 2026-05-07. Aligns code with `.claude/CLAUDE.md` spec (#00bcd4 teal, Geist fonts). Do not stash; commit as one PR."
2. `project_overnight_audit_2026_05_06_07` — NEW. "9 markdown deliverables in planning-with-files/. Ground-truth + scorecard + risks + 90d. Cross-ref `.arcanea/audits/2026-05-06-*` and `.arcanea/audits/2026-05-07-*`."
3. `project_harness_consolidation` — UPDATE. "v2 charter overrides v1: oh-my-arcanea IS multi-vendor harness via upstream `oh-my-openagent`."
4. `project_arcanea_flow_plan` — UPDATE. "arcanea-flow IS the rename, not a wrapper. Has 1530 uncommitted changes blocking promotion."
5. `feedback_observability_silent_in_prod` — NEW. "As of 2026-05-06, no analytics fired on arcanea.ai despite installed code. Wire SpeedInsights/PostHog/Sentry first morning task."
6. `reference_canonical_audits_2026_05_06` — NEW. "8 audits in `.arcanea/audits/` + 9 in `planning-with-files/OVERNIGHT_2026-05-06_*` are the canonical strategic ground truth at this date."

---

## Discipline ledger (what guardrails I followed)

- ✓ Read AGENTS.md + CLAUDE.md hierarchy + `.arcanea/CLAUDE.md` per source-of-truth contract
- ✓ Read all 4 prior audit docs before extending — no duplication
- ✓ All read-only audits, no destructive ops on shared state
- ✓ No `git stash` of WIP (feedback_audit_before_stash)
- ✓ No `git add .` (feedback_mass_revert_protection)
- ✓ No push to main, no force-push, no `--no-verify`
- ✓ No simultaneous `pnpm dev` + `pnpm build` (RAM rule)
- ✓ Verified RAM 5.73 GB free before any agent dispatch (only used 0 sub-agents — kept it sequential to be safe)
- ✓ Specific files only when I created files
- ✓ Memory rules: no fabricated provenance, no claims about current state without disk verification
- ✓ Honored `project_may_foundations_2026` — every recommendation in the 90d plan is foundations, not monetization

---

## Sleep on this thought

The audits show that **the gap between "what's built" (creative IP, agent fleet, design system, lore canon, books) and "what runs reliably in production" (CI green-rate, observability, fleet hygiene) is the only thing standing between Arcanea today and Arcanea-as-a-billion-dollar-AI-lab-grade brand.**

You don't need more product. You need the operational substrate to catch up to the creative substrate. That's a foundations-month problem, perfectly aligned with `project_may_foundations_2026`.

When you wake, merge PR #93 + #94, wire observability, and the rest of May becomes a series of one-day operational wins.

— Sleep well.
