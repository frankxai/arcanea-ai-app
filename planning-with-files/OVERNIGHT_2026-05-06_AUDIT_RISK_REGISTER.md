# P8 — Risk Register (Top 20)

**Method:** Severity (1-5) × Likelihood (1-5) × Inverse-Time-To-Fix (1-5) = composite priority. Synthesizes P0-P7 + the 4 prior `.arcanea/audits/` docs.

## Top 20 ranked

| # | Risk | Sev | Lik | TTF | Score | Source |
|:-:|---|:-:|:-:|:-:|:-:|---|
| 1 | **Production observability silent** — no analytics in prod HTML | 5 | 5 | 5 | **125** | P5, P4#10 |
| 2 | **20 nested `.git` folders inside Arcanea/** — not registered submodules, invisible to CI/scanners/Dependabot | 5 | 4 | 4 | **80** | P0, prior repo-architecture audit |
| 3 | **Main branch CI 25% green** — chronic red blocking deploys | 5 | 5 | 3 | **75** | P4#1 |
| 4 | **MEMORY.md index drift (38 unindexed entries)** — future sessions can't see them | 4 | 5 | 5 | **100** | P6 |
| 5 | **64-repo fleet has no registry** — unbounded sprawl, no audit surface | 4 | 5 | 4 | **80** | P2, P7 |
| 6 | **Lockfile drift breaks main repeatedly** — 2 incidents in 2 days, no CI gate | 4 | 4 | 5 | **80** | feedback memory + P4#4 |
| 7 | **Design-token unification mid-flight (27 dirty files)** — could be lost on a stash mistake | 4 | 3 | 5 | **60** | P0 |
| 8 | **arcanea-flow has 1,530 uncommitted changes** — promotion to system bus blocked | 4 | 5 | 2 | **40** | strategic-charter |
| 9 | **`Co-Authored-By: claude-flow` attribution still in workflow** — violates user feedback | 3 | 5 | 5 | **75** | repo-architecture audit + memory |
| 10 | **No design-fence in CI** — banned tokens (Cinzel, Inter, raw `#7fffd4`, domMax) can re-enter | 3 | 5 | 5 | **75** | P4#6 |
| 11 | **A11y baseline gaps** — 0 skip-links, sparse aria, no axe-core in CI | 3 | 4 | 4 | **48** | P5, P4#7 |
| 12 | **No hreflang on prod despite i18n Phase 2A merged** — German/Spanish work invisible to Google | 3 | 5 | 5 | **75** | P5 |
| 13 | **`arcanea-realm` directory has wrong remote** (points to arcanea-code.git) | 3 | 4 | 4 | **48** | P2 |
| 14 | **Worktree confusion** — frankx-* and jarvis-* directories duplicate disk; ~150K duplicated files | 2 | 4 | 3 | **24** | P2 |
| 15 | **`~/.starlight/vaults/` doesn't exist** but `starlight-vault` skill expects it | 3 | 5 | 4 | **60** | P6#5 |
| 16 | **No JSON-LD on Arcanea homepage** while SIS just shipped JSON-LD on its own site | 2 | 5 | 5 | **50** | P5, P6 SIS commit cross-ref |
| 17 | **75+ subagents but no canonical routing map** — implicit dispatch, drifts | 2 | 4 | 4 | **32** | P7 |
| 18 | **Renovate AND Dependabot both active** — double-bot PR risk | 2 | 4 | 4 | **32** | P4#4 |
| 19 | **Bare-domain `arcanea.ai` 307→`www.arcanea.ai`** — SEO + perf hit | 2 | 5 | 5 | **50** | P5 |
| 20 | **PR #92 (post-overnight-audit) failing TS + Build** while waiting for PR #93 turbo fix | 3 | 5 | 5 | **75** | P0, gh CLI status |

(Re-sorting by Score for the action queue: #1, #4, #5, #2, #6, #3, #9, #10, #12, #20, #7, #11, #19, #16, #15, #13, #18, #17, #14, #8.)

## What's NOT on the list (deliberately)

- "Convert nested .git to submodules" — strategic charter has Phase 1 ready; not adding new risk
- "Rename Luminors" — memory `feedback_luminor_naming_depth` says NEVER do this
- "Single storefront monetization push" — memory `project_may_foundations_2026` says May = foundations only
- "Mass marketplace publish of native skills" — strategic charter Phase 4 sequences this; premature

## Status: P8 COMPLETE
