# Overnight Audit & Excellence Pass — 2026-05-06

**Goal:** Comprehensive, autonomous-overnight audit of the entire Arcanea ecosystem (code, repos, design, SEO, security, performance, memory, skills) — with concrete deliverables Frank can review at sunrise. NO destructive changes without his sign-off.

**Authorization:** Frank is sleeping. Explicit instruction: "execute all night." Discipline:
- Read-only audits = autonomous, full speed
- New audit/plan files = autonomous
- PRs for unambiguous fixes = autonomous (no force-push, no main pushes)
- Destructive cleanup (delete nested .git, mass changes, lockfile reset) = DOCUMENT ONLY, await morning review
- Mass-revert protection memory + audit-before-stash memory both active

## Phases

| # | Phase | Status | Deliverable |
|---|-------|--------|-------------|
| 0 | Audit dirty WIP before anything | in_progress | `OVERNIGHT_2026-05-06_WIP_AUDIT.md` |
| 1 | Read source-of-truth | pending | (in-context) |
| 2 | Fleet registry (64 repos) | pending | `AUDIT_FLEET_REGISTRY_2026-05-06.md` |
| 3 | Nested-repos decision matrix (20) | pending | `AUDIT_NESTED_REPOS_2026-05-06.md` |
| 4 | Excellence scorecard (12 axes) | pending | `AUDIT_EXCELLENCE_SCORECARD_2026-05-06.md` |
| 5 | Live website + SEO audit | pending | `AUDIT_LIVE_SITE_2026-05-06.md` |
| 6 | Memory + SIS audit | pending | `AUDIT_MEMORY_SIS_2026-05-06.md` |
| 7 | Skills + agents gap analysis | pending | `AUDIT_SKILLS_AGENTS_2026-05-06.md` |
| 8 | Risk register top 20 | pending | `AUDIT_RISK_REGISTER_2026-05-06.md` |
| 9 | 90-day excellence roadmap | pending | `PLAN_EXCELLENCE_90D_2026-05-06.md` |
| 10 | Overnight handover | pending | `HANDOVER_2026-05-06_OVERNIGHT_AUDIT.md` |

## Guardrails

1. NEVER `git add .` — always specific files
2. NEVER push to main, only via PR
3. NEVER `git stash` until WIP audit complete
4. NEVER delete a nested .git folder autonomously
5. NEVER `pnpm dev` (16GB constraint, build only when needed)
6. Verify before claiming done — run, read output, then claim
7. Stage only files that I authored or that align with a clear-cut CI fix

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| Bash strips `$` from PowerShell variables | 1 | Switch to `.ps1` script files |
| session-catchup.py not at expected path | 1 | Skip — context already strong from gitStatus + memory |

## Re-read trigger
At start of each new phase, re-read this file and findings.md to keep goals warm.
