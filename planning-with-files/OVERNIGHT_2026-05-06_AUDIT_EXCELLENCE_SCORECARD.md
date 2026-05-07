# P4 — Excellence Scorecard (12 axes)

**Method:** Score each axis 1-5 (1=critical, 5=excellent) based on signal collected this session. Synthesizes P0-P7 findings.
**Lens:** What a top-tier May-2026 SDLC org would expect.

## Summary card

| # | Axis | Score | Trend | Confidence |
|---|------|:-:|:-:|:-:|
| 1 | CI / Build reliability | **2/5** | declining (4 of 14 recent commits are fix(ci)) | high |
| 2 | Lint / Typecheck enforcement | **3/5** | stable | medium |
| 3 | Tests / coverage | **2/5** | unmeasured | low |
| 4 | Lockfile + dependency hygiene | **3/5** | improving (Renovate landed PR#81) | medium |
| 5 | Secrets + supply-chain security | **2/5** | unmeasured | low |
| 6 | Design fence | **3/5** | active migration WIP | high |
| 7 | Accessibility (WCAG 2.2) | **2/5** | unmeasured + heuristic gaps | medium |
| 8 | SEO / CWV / structured data | **3/5** | strong meta, missing analytics + hreflang | high |
| 9 | Copy / voice / clarity | **4/5** | strong on home, drift on details | medium |
| 10 | Observability | **1/5** | code-installed, prod-silent | high |
| 11 | Docs hygiene | **3/5** | rich but scattered, MEMORY.md drift | high |
| 12 | Multi-repo fleet management | **1/5** | no registry, no shared gates, 64 surfaces | high |

**Aggregate:** **29/60 = 48%** — solid creative IP layer, weak operational substrate. The gap between what's built (creative excellence) and what runs (operational excellence) is the dominant theme.

## Detailed scoring

### 1. CI / Build reliability — 2/5
- 50 last runs: 32 failure / 17 success / 1 in-progress = **34% green**
- Main branch: 4 runs / 1 success = **25% main green**
- 4 of last 14 commits are explicit `fix(ci)` patches — chronic
- Top failing workflows: Quality Gate (10), Deploy Arcanea Web (7), CI (7), Lighthouse (5)
- 12 workflows total — high surface area amplifies fragility
- **Today (2026-05-06):** PR #92 still failing TypeScript+Build; PR #93 has the fix but isn't merged yet
- **Move to 4/5 in 30 days:** merge PR #93, drive Quality Gate to <2 failure/30d, set required-checks to refuse merge below 90% green

### 2. Lint / Typecheck enforcement — 3/5
- TypeScript strict mode enforced (per AGENTS.md execution law)
- ESLint runs in Quality Gate workflow (saw it green on PR #92)
- 27 dirty WIP files would compile cleanly per the design-token unification — but not verified end-to-end
- **Improve:** add `pnpm run typecheck` as a required pre-push hook; today it runs only in CI which is too late

### 3. Tests / coverage — 2/5
- E2E smoke skipped on PR #92 (not run on every PR)
- `packages/core/tests/engine.test.mjs` modified in WIP
- No unified coverage reporting visible
- No Storybook visual-regression suite
- Memory references `pnpm test:media` but no signal on pass rate
- **Improve:** baseline coverage report, set 60% floor, gate PRs on no-coverage-regression. Add Playwright visual snapshots for the homepage + 5 high-traffic pages.

### 4. Lockfile + dependency hygiene — 3/5
- ✅ `pnpm-lock.yaml` is committed and `--frozen-lockfile` enforced (AGENTS.md)
- ✅ Renovate config present (3.2 KB)
- ✅ Dependabot config present (2.5 KB)
- ⚠️ Memory `feedback_lockfile_drift_pattern` flags 2 main breaks in 2 days from package.json without lock — pattern keeps recurring
- ⚠️ Both Renovate AND Dependabot active = double-bot risk (PRs from both for the same dep)
- **Improve:** pick one (Renovate is more powerful), disable the other; add a CI gate that fails if `package.json` changed without `pnpm-lock.yaml` in same PR

### 5. Secrets + supply-chain security — 2/5
- No automated secret-scan visible in workflow list (no GitHub Secret Scanning workflow)
- Quality Gate has a "Security Audit" job but its scope is unclear
- `.env` files protected by gitignore (presumed) but no in-CI grep guard
- No SBOM generation visible
- No GitHub OIDC for deploy auth (presumably long-lived secrets)
- **Improve:** add `gitleaks` or `trufflehog` to CI; add GitHub Actions `permissions:` block to all workflows; OIDC migration for Vercel/Supabase

### 6. Design fence — 3/5
- ✅ `@arcanea/design-system` exists, tokens canonical
- ✅ `TASTE.md` + `DESIGN.md` (Google Labs spec) — taste authority + machine tokens
- ✅ `design-verifier` agent exists (per agent catalog) — but no signal it runs in CI
- ⚠️ WIP shows hardcoded hex still being refactored (workstream B in P0 audit) — fence not yet airtight
- ⚠️ Fonts: design-tokens.ts WIP migrates Space Grotesk/Inter → Geist; not yet shipped
- ⚠️ No `design-verifier` automated CI step grepping for banned tokens (Cinzel, Inter, raw `#7fffd4`, `domMax`)
- **Improve:** add a `design-fence.yml` workflow that grep-fails the build on banned tokens. Should be a 30-min PR.

### 7. Accessibility — 2/5
- 0 skip-links on homepage HTML
- Only 7 `aria-label` and 0 `aria-labelledby` for ~150-page app — sparse
- 3 `role=` attributes — minimal
- `<html lang="en">` set ✅
- No `axe-core` visible in test infrastructure
- WCAG 2.2 compliance unmeasured
- **Improve:** axe-core in Playwright tests, run against homepage + 5 representative pages on every PR. The `accessibility-auditor` agent in your fleet exists — wire it into CI.

### 8. SEO / CWV / structured data — 3/5
- ✅ Title, meta description, canonical, 11 OG, 8 Twitter, 2 JSON-LD — strong baseline
- ✅ Sitemap with 154 URLs, robots.txt sane
- ✅ `<html lang="en">` set
- ❌ TTFB 1.14s on homepage (target <0.8s on Vercel)
- ❌ 0 `hreflang` alternates despite shipping i18n Phase 2A
- ❌ Sitemap doesn't include /de/* /es/* trees
- ❌ Bare-domain redirect is 307 (should be 301)
- ❌ No CWV in-prod measurement (no Vercel Speed Insights detected)
- **Improve:** add hreflang in `metadata.alternates.languages`; switch root redirect to 301; verify SpeedInsights mounted; run Lighthouse on top 6 pages

### 9. Copy / voice / clarity — 4/5
- Hero "What will you create?" — direct, generative, on-voice
- Strapline "Type one sentence. Get a world..." — strong
- Footer sovereignty pillars (Keep your keys / Keep your IP / MIT / No vendor lock-in) — clear
- Navigation IA simple (Create, Explore, Learn, Blog, Pricing) — good
- ⚠️ "16 AI specialist partners" — date-of-truth unclear, verify
- ⚠️ "190K+ words of creative philosophy" — outdated (memory says 260K+)
- ⚠️ Tagline drift across pages not audited
- **Improve:** weekly `vis-audit` skill against home + top 10 pages; a one-source-of-truth `copy.yaml` for repeated counters (book count, word count, agent count)

### 10. Observability — 1/5
- **Zero analytics fired on prod** — no PostHog, Plausible, GA, Vercel Analytics, Vercel Speed Insights, Sentry, Segment detected in homepage HTML
- Memory says "code installed, needs API keys (30 min)" — confirmed: prod is silent
- No error budget defined
- No uptime monitor visible
- **You are flying blind in production.** This is the lowest score on the card.
- **Fix this first:** even just `<Analytics />` + `<SpeedInsights />` from `@vercel/analytics` and `@vercel/speed-insights` (already installed somewhere, judging by memory) takes 5 minutes. Then PostHog 30 min. Then Sentry 30 min.

### 11. Docs hygiene — 3/5
- ✅ AGENTS.md, CLAUDE.md (3 layers), TASTE.md, DESIGN.md, MASTER_PLAN.md — rich substrate
- ✅ `.arcanea/` shared intelligence hub exists
- ✅ planning-with-files/ active execution layer
- ⚠️ Latest formal `CURRENT_STATE_*` is **2026-04-21**, 16 days stale
- ⚠️ Latest `CURRENT_BACKLOG_*` is 2026-04-20, 17 days stale
- ⚠️ MEMORY.md index drift: 38 entries on disk not indexed (P6 finding)
- ⚠️ 4 audit docs from earlier today not yet committed (per P0 finding)
- **Improve:** weekly cron that refreshes CURRENT_STATE/BACKLOG/CHANGELOG from the latest planning entries; auto-reconcile MEMORY.md vs disk

### 12. Multi-repo fleet management — 1/5
- 64 repo surfaces (38 sibling + 20 nested + 6 already-audited)
- **No fleet registry.** repos.json mentions exist but mismatch reality (per strategic charter Risk #3)
- **No shared CI template.** Each repo bespoke.
- **No shared CODEOWNERS.** PR #32 added it on Arcanea only.
- **No unified observability dashboard.** Status checked by hand.
- **No bulk-PR tooling.** Renovate handles deps; nothing handles workflow templates.
- **Lowest-confidence axis** because so much is speculative until the registry is built.
- **Improve:** P2 of this audit produced the disk-walked fleet snapshot; turn into `repos.json`, then ship the 4 fleet skills (P7 proposal).

## Top 3 axis-improvements by ROI

1. **Observability (1→4 in one day):** wire SpeedInsights + Analytics + PostHog + Sentry. Code is mostly there. Time: ~2 hours. Leverage: enables ALL future scorecard improvements because you can finally measure them.

2. **CI reliability (2→4 in one week):** merge PR #93, then make `lockfile-drift-check` + `design-fence-grep` required gates. Time: ~1 day. Leverage: stops the 2-PR-per-week firefighting tax.

3. **Fleet management (1→3 in two weeks):** ship `arcanea-fleet` + `arcanea-gate` skills + `repos.json` registry. Time: ~3-4 days. Leverage: every future cross-cutting concern (security, design, deps) becomes a one-line skill invocation instead of 64 manual repo touches.

## Status: P4 COMPLETE
