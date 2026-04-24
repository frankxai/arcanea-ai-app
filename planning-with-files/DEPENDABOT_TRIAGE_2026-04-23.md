---
date: 2026-04-23
context: Autonomous session triage of 8 stale Dependabot PRs
guardrail: feedback_dependabot_guardrails — never batch major version bumps
recommendation: do NOT merge any until CI green + manual review
---

# Dependabot Triage — 2026-04-23

## State

8 open Dependabot PRs. **All have CI FAILURE.** None are safely auto-mergeable.

## PR-by-PR Action

| PR | Bump | Risk | Action |
|---|---|---|---|
| **#62** | production-deps group, **34 updates** | 🔴 HIGH — batched majors per guardrail | Split into per-package PRs OR rebase on green main and inspect locks. Defer until post-Gate-0. |
| **#61** | dev-deps group, **5 updates** | 🟡 MED — smaller batch, dev-only | Same as #62 but lower priority. |
| **#54** | actions/checkout 4 → 6 | 🟡 MED — major bump | Check changelog v4→v6 for breaking. Likely safe (checkout is stable). |
| **#53** | actions/setup-node 4 → 6 | 🟡 MED — major bump | Check Node 22+ default change. Pin Node version explicitly first. |
| **#52** | actions/github-script 7 → 9 | 🟡 MED — major bump | Check octokit version bundled. Likely safe. |
| **#51** | pnpm/action-setup 4 → 6 | 🔴 BLOCKED | Known issue per memory `project_ci_ops_session_2026_04_17`. **Close as duplicate of #33.** |
| **#50** | marocchino/sticky-pull-request-comment 2 → 3 | 🟢 LOW — minor surface area | Safe to test merge after CI green. |
| **#33** | feat(ops): pnpm v4→v6 + pnpm 9.15.0 (DRAFT) | 🔴 BLOCKED | Same upstream bug. Hold until pnpm/action-setup#bug fixed. |

## Recommendation

**DO NOT merge any during Gate 0 sprint.** Reasons:

1. CI is failing across the board — investigation needed BEFORE merge attempts (root cause may be shared, not per-PR)
2. Major version bumps for github_actions need pinning strategy decision first
3. The 34-update production-deps batch is a guardrail violation as-is
4. Frank's attention through Apr 30 belongs to GenCreator + first €1, not dependency hygiene

## Post-Gate-0 plan (after May 1)

1. **Day 1**: Diagnose CI failure root cause (if shared, fix once)
2. **Day 2**: Close #51 + #33 as known-blocked, link upstream bug
3. **Day 3**: Test #50 + #54 individually (safest)
4. **Day 4-5**: Decompose #62 into per-package PRs by semver level (patch → minor → major)
5. **Day 6**: Merge patch-level updates as one PR; majors stay individual

## Labels suggested for cleanup

Add to each:
- `gate-0-defer` — explicit signal to skip until May
- `ci-failing` — visible in PR list
- `needs-rebase` — if main has moved

## Bot suggestion

Add `.github/dependabot.yml` config to:
- Group by semver level (patch/minor/major) not by ecosystem
- Cap PR concurrency to 3 (currently floods 8+)
- Require approval before merge for any major bump

I'll draft this file in a follow-up session if approved.
