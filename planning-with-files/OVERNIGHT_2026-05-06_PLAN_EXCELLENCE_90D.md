# P9 — 90-Day Excellence Roadmap (2026-05-07 → 2026-08-06)

**Constraints honored:**
- May = pure foundations (memory `project_may_foundations_2026`)
- No consulting / freelance — products + community only (memory `feedback_no_consulting`)
- Think foundations / invention, not quick monetization (memory `feedback_think_bigger`)
- Quality bar = 7-gate excellence filter (memory `feedback_quality_standard`)
- Design tier = AI-lab premium (memory `feedback_design_tier`)
- Defer Gate 0 €1 / monetization to June at earliest (memory `project_may_foundations_2026`)

## Month 1 — May (foundations)

### Week 1 (2026-05-07 → 2026-05-13) — UNBLOCK + OBSERVABILITY
| Task | Risk addressed | Expected outcome | Owner |
|---|---|---|---|
| Merge PR #93 turbo fix | #3 #20 | main green, deploy unblocked | Frank approve, agent merges |
| Wire SpeedInsights + Vercel Analytics on `apps/web/app/layout.tsx` | #1 | RUM data starts flowing | dev-department agent |
| PostHog SDK + 1 environment var | #1 | event tracking live | dev-department |
| Sentry SDK + DSN | #1 | error reporting live | dev-department |
| Reconcile MEMORY.md vs disk (38 missing entries) | #4 | session memory whole | this audit's handover handles it |
| Strategic-charter Phase 1 cleanup (settings.json, 14 cull, 22 dupes, 4 disable) | #9 | clean /doctor, sovereign | other agent already on this |

**Exit gate:** SpeedInsights showing real users on dashboard within 24h of merge.

### Week 2 (2026-05-14 → 2026-05-20) — CI HARDENING + DESIGN FENCE
| Task | Risk |
|---|---|
| `lockfile-drift-check.yml` workflow — fail PR if package.json changed without pnpm-lock.yaml | #6 |
| `design-fence-grep.yml` workflow — fail PR if banned tokens (Cinzel, Inter, `#7fffd4`, `domMax`) re-enter | #10 |
| Move from Dependabot to Renovate-only (pick one) | #18 |
| Switch root domain redirect 307→301 in Vercel | #19 |
| Branch protection on `main`: required checks include the 2 new ones | #3 |
| Land design-token unification PR (the WIP from P0) — coordinate with Frank | #7 |

**Exit gate:** 5 consecutive PRs land green on main without `fix(ci)` patches.

### Week 3 (2026-05-21 → 2026-05-27) — FLEET REGISTRY
| Task | Risk |
|---|---|
| Convert `tmp/fleet-scan.json` (built tonight) into canonical `repos.json` at repo root + GH org | #5 |
| Ship `arcanea-fleet` skill v0 — reads registry, emits diff | #5 |
| Inspect arcanea-flow's 1,530 uncommitted changes — commit/discard/branch | #8 |
| Decide on the 20 nested .git folders — strategic charter Phase 1, supplemented by my fleet doc | #2 |
| Resolve `arcanea-realm` remote mismatch | #13 |

**Exit gate:** `repos.json` references all 64 surfaces; `arcanea-fleet` skill prints fleet status in <5s.

### Week 4 (2026-05-28 → 2026-06-03) — SOVEREIGNTY + DOCS
| Task | Risk |
|---|---|
| Strategic-charter Phase 3 (Skill Sovereignty) — Arcanize 8 user-skills | n/a (charter alignment) |
| Refresh `CURRENT_STATE_*` + `CURRENT_BACKLOG_*` (last refresh was 2026-04-21) | #11 doc hygiene |
| `_archive/` decision — gitignore, push to separate repo, or delete | #2 |
| MEMORY.md decay protocol live — auto-archive `project_*` after 14 days | #4 |
| Update memory contradictions (oh-my-arcanea no longer canonical, etc.) | #4 |

**Exit gate:** Excellence scorecard re-run: target ≥ 38/60 (vs 29/60 today).

## Month 2 — June (substrate)

### Theme: SUBSTRATE INTEGRITY (SIS ↔ arcanea-flow ↔ all vendors)

| Week | Focus | Exit |
|---|---|---|
| 5 (Jun 4-10) | arcanea-flow promotion: clean its 1530-WIP, replace claude-flow integration in `.claude/settings.json` (9 hooks, 3 perms, 2 git fields) | All `claude-flow` mentions gone from settings/skills/PR-template |
| 6 (Jun 11-17) | SIS ↔ arcanea-flow wiring: SIS becomes explicit memory backend for arcanea-flow (no re-implementation) | Substrate divergence risk closed |
| 7 (Jun 18-24) | Design-fence CI live everywhere; a11y baseline (axe-core in Playwright on home + 5 routes) | Top 10 a11y violations closed |
| 8 (Jun 25-Jul 1) | First vendor harness MVP: `claude-arcanea` reaches 10-15 working skills + landing page (strategic-charter Phase 4 start) | First externalize-ready harness |

**Exit gate:** arcanea-flow runs the substrate; SIS authoritative for memory; first vendor harness shipped to plugin marketplace.

## Month 3 — July (excellence rollout)

### Theme: SCALE EXCELLENCE TO THE FLEET

| Week | Focus |
|---|---|
| 9 (Jul 2-8) | `arcanea-gate` skill rolls canonical PR-gate template across top 5 prod repos (Arcanea, FrankX, gencreator.ai, AnimeLegends.ai, vibeclubs.ai) |
| 10 (Jul 9-15) | hreflang + sitemap multilingual upgrade — all 154 URLs emit `<link rel="alternate" hreflang>` for en/de/es; sitemap includes per-locale trees |
| 11 (Jul 16-22) | CWV sweep: target Lighthouse ≥ 90 on home + chat + worlds + library + imagine. Apply `vercel:next-cache-components` patterns. |
| 12 (Jul 23-29) | `arcanea-watch` skill — hourly fleet observability poll. Notion + Slack summary. |
| 13 (Jul 30-Aug 6) | Excellence scorecard re-run: target ≥ 50/60 |

**Exit gate (end of 90 days):** 50/60 on the scorecard, top 5 repos all under shared CI gate, prod observability live with weekly review cadence, MEMORY.md decay running.

## What's deliberately NOT in this 90 days

- **No new product launches.** Foundations month + substrate month + scale month. Adding products fragments attention.
- **No marketplace mass-publish.** Charter Phase 4 starts in week 8 with one vendor — not all four at once.
- **No revenue gate.** Per memory, defer to August or September.
- **No major design-system refactor beyond the WIP token unification.** Stability beats novelty.
- **No new agents/skills beyond the 4 fleet skills.** Existing 75+ already over-supply demand.

## Quality bar (the 7-gate excellence filter as ship criteria)

Every shippable artifact in this 90 days must pass:

| Gate | Question |
|---|---|
| First Principles | Does this address a root cause or just a symptom? |
| Voice | Does the copy match the canonical voice in CANON_LOCKED + TASTE.md? |
| Design | Does it use `@arcanea/design-system` tokens? Does it pass design-verifier? |
| Performance | Does it respect Core Web Vitals budgets? |
| Journey | Does it improve a measurable user journey, not just a vanity surface? |
| Engineering | Lint + typecheck + tests + lockfile-drift + design-fence — all green? |
| Strategy | Does it fit `project_may_foundations_2026` / Sovereignty Doctrine / 90-day plan? |

## Status: P9 COMPLETE
