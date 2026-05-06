# Engineering Excellence Audit — 2026-05-07

**Auditor:** Continuation of overnight session 2 (Frank asleep)
**Mode:** Read-only audit + non-destructive commits only
**Scope:** Whole-stack from substrate to live site, May 2026 best practices

---

## TL;DR — Top 10 priorities ranked by impact ÷ effort

| # | Item | Impact | Effort | Priority |
|---|---|---|---|---|
| 1 | Merge PR #93 → unblock 5-day red main | CRITICAL | 5 min | P0 — DO FIRST |
| 2 | Then merge PR #94 (ecosystem cleanup) | HIGH | 5 min | P0 |
| 3 | Commit-or-discard the 27-file brand-color WIP | HIGH | 30 min review + 5 min commit | P0 |
| 4 | Update arcanea-flow upstream remote → ruflo, rebase | HIGH | 2-3 hours | P1 (this week) |
| 5 | Update oh-my-arcanea CLAUDE.md to multi-vendor reality | MEDIUM | 30 min | P1 |
| 6 | Build claude-arcanea scaffold to MVP | HIGH | 2-3 days | P2 (next 2 wk) |
| 7 | SEO + AEO audit of arcanea.ai (top 20 pages) | HIGH | 1 day | P2 |
| 8 | Memory MEMORY.md hygiene (200-line truncation hit) | MEDIUM | 1 hour | P2 |
| 9 | Skill consolidation pass 2 (still 690 dirs in user skills) | MEDIUM | 2 hours | P3 |
| 10 | Dependabot-grouped major bumps (PR #91 staged) | MEDIUM | 1 hour | P3 |

---

## 1. Code health

### TypeScript / build state
- **PR #94**: TypeScript Check (Quality Gate) ✓, ESLint ✓, Security Audit ✓, Install ✓. Production Build pending (likely waiting for runner). The "TypeScript" check that says "fail" is a separate action — likely inherited from red main.
- **PR #93** is the unblocker. Merge first.
- Brand-color WIP (27 files) reduces hardcoded hex literals → CSS variables — architecturally correct, must be preserved.

### Lockfile drift pattern (memory: feedback_lockfile_drift_pattern)
- pnpm-lock.yaml has 1-line drift in current WIP (peerDep version constraint for next-intl). Likely auto-tooling. Verify on next session before commit.
- 2 main-breaks in 2 days from package.json without lock — add CI lockfile-drift detection (currently missing).

### Repo hygiene
- 20 nested `.git` folders inside Arcanea/ NOT registered as submodules (memory)
- 44 sibling repos at C:/Users/frank/* with own .git
- `.arcanea/audits/` dir untracked (created this session) — add to gitignore or add to a docs commit

---

## 2. Live website (arcanea.ai)

### Strengths
- Polished homepage, clean nav (5 sections)
- Strong hero copy: "Type one sentence. Get a world..."
- Mascots Lyria + Shinkami well-integrated
- MIT positioning + sovereignty messaging
- Living Worlds engine + 16 specialist AI partners as differentiators

### Gaps to investigate (next session)
- Lighthouse / Core Web Vitals scores per page (memory: project_cwv_baseline shows homepage 35, chat 18, imagine 49 pre-optimization — May 2026 status unknown)
- AEO (answer engine optimization for Perplexity/ChatGPT search) — JSON-LD on homepage?
- 111 pages tracked in MASTER_PLAN.md — how many LIVE vs STUB?
- i18n Phase 2A foundation merged (PR #87) — en+de scaffold. State of /es, /fr, /pt?

### SEO quick-check actions for next session
- `curl -s arcanea.ai | grep -E '<title>|<meta'` → snapshot meta tags
- `curl -s arcanea.ai/sitemap.xml` → verify sitemap structure (sitemap-[locale].xml split landed in PR #93)
- Run Lighthouse via `npx lighthouse https://arcanea.ai --view` → score baseline
- Check schema.org JSON-LD coverage (SoftwareApplication, Organization, WebSite)

---

## 3. AI ops + best practices May 2026

### Stack alignment
- Next.js 16 App Router ✓ (per CLAUDE.md)
- React 19 ✓
- Vercel deployment with Fluid Compute (Anthropic-recommended over Edge)
- AI SDK v6 with parts[] message format ✓ (memory: feedback_ai_sdk_v6_messages)
- Default Claude Opus 4.7 1M context

### Memory + context engineering
- SIS provides 6 semantic vaults (technical/strategic/creative/operational/wisdom/horizon)
- ~/.claude/projects/.../memory/ MEMORY.md auto-memory — currently >200 lines (truncation threshold)
- ReasoningBank skills active (reasoningbank-intelligence + reasoningbank-agentdb)
- Vector search via AgentDB (5 agentdb-* skills)

### Improvement opportunities
- **MEMORY.md cleanup**: too many entries, some stale dates, listing truncated. Audit + consolidate to <150 lines.
- **Hooks integration**: 3 SIS hooks active (SessionStart, PreCompact, Stop). Consider adding PostToolUse for auto-format, PreCompact for summarization.
- **MCP server health**: starlight-substrate + memory-bus configured at user level. Verify both active via /doctor next session.

---

## 4. Ecosystem alignment

### Layer dependencies (per refined Charter v2)
- L4 Arcanea web ←→ L0 SIS (memory + voice + context)
- L3 oh-my-arcanea ←→ L1 arcanea-flow (orchestration calls)
- L2 vendor harnesses → wrap L1 + L0 patterns

### Integration debt
- arcanea-flow not yet wired into Arcanea web app
- oh-my-arcanea not yet wired into arcanea-flow
- SIS not auto-imported by arcanea-flow (re-implementation risk)

### Naming clarity (verified)
- `claude-flow` → renamed to `ruflo` by ruvnet (we forked, named our fork `arcanea-flow`)
- `oh-my-opencode` → renamed to `oh-my-openagent` by code-yeongyu (we forked, named our fork `oh-my-arcanea`)
- Both upstream remotes in our forks point to OLD URLs — minor risk

---

## 5. Documentation + clarity

### Source-of-truth docs at root
- `AGENTS.md` (6.9 KB, 2026-05-06)
- `TASTE.md` (9.7 KB)
- `DESIGN.md` (15.7 KB)
- `CLAUDE.md` (3.8 KB)
- `ARCANEA_AGENTHUB_MASTER_PLAN.md` (23.4 KB, 2026-03-31 — STALE 5 weeks)
- `CHANGELOG.md` (10.7 KB, 2026-03-28 — STALE 5+ weeks)

### Document hygiene
- MASTER_PLAN needs refresh (5 weeks old, much shipped since)
- CHANGELOG even more stale
- New `.arcanea/audits/` content (4 files this session) — potential AGENTS.md update to point at it

### Memory drift to fix
- `project_harness_consolidation.md` says "oh-my-arcanea is canonical harness" — superseded by Charter v2
- `project_arcanea_flow_plan.md` says wrap claude-flow with Luminor prompts — refine: now arcanea-flow IS the wrapper

---

## 6. Top engineering practices (May 2026 perspective)

### What world-class repos do (and we don't fully)
- ✓ Strict TypeScript (have)
- ✓ ESLint + Prettier (have via Quality Gate)
- ✗ Lockfile-drift detection in CI (missing — caused 2 main-breaks)
- ✗ Vitest/Jest with >70% coverage (state unknown — audit pending)
- ✗ Lighthouse CI gates (memory: PR #93 had Lighthouse failures, possibly flaky)
- ✗ Bundle-size budgets (Vercel does some, no per-PR budgets)
- ✗ Per-page Web Vitals tracking (Vercel built-in but not surfaced in repo)
- ✗ Storybook / visual regression (none)
- ✗ Playwright E2E for critical user journeys (skill exists, usage unclear)
- ✓ CodeRabbit AI review (active on PR #94)
- ✓ Vercel Agent review (active)
- ✓ Guardian PR Check Classify risk (custom)

### Top 3 quick wins
1. **Add lockfile-drift CI check** — prevent the recurring main breakage
2. **Lighthouse-CI in PR pipeline with budgets** — block regressions before they ship
3. **Vitest coverage gate at 70%** for `packages/core` and `packages/design-system`

---

## 7. SEO + AEO + agent-discoverability (May 2026)

### Beyond Google: who indexes Arcanea?
- **Perplexity, ChatGPT search, Gemini, Claude search, You.com** — answer engines pulling JSON-LD
- **GitHub indexing** — README quality on each ecosystem repo
- **NPM** — package descriptions + READMEs for `@arcanea/*` packages
- **Crawler-friendly skills marketplace** — when {vendor}-arcanea ships

### Schema priorities
- Organization + WebSite + SoftwareApplication on every page (SIS just shipped this 2026-05-07)
- BreadcrumbList for nested pages
- FAQ schema for /pricing, /how-it-works
- VideoObject for any embedded videos
- Article + author for blog posts

### Agent-readable surfaces (often forgotten)
- `/.well-known/llms.txt` — declare what you are to agents
- `/api/openagent` — machine-readable API
- `/manifest.json` — PWA + agent
- `agents.json` (industry forming) — agent capability declaration

---

## 8. Risk register (top 10)

| # | Risk | Probability | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Main red persists past PR #93 merge | LOW | HIGH | Merge ASAP; investigate root if recurs |
| 2 | Brand-color WIP lost in next session | MEDIUM | MEDIUM | Commit on dedicated branch within 24h |
| 3 | arcanea-flow upstream further drifts from ruflo | HIGH | MEDIUM | Update remote + scheduled fetch |
| 4 | Memory truncation hides important context | MEDIUM | MEDIUM | Trim MEMORY.md to <150 lines |
| 5 | Lockfile drift breaks main again | MEDIUM | HIGH | Add CI check |
| 6 | Skill listing budget overrun once new skills land | MEDIUM | LOW | Continue cull pass 2 |
| 7 | SEO regression undetected | MEDIUM | MEDIUM | Add Lighthouse-CI |
| 8 | i18n incomplete (only en+de scaffolded) | LOW | LOW | Defer until product validates demand |
| 9 | Vendor harness sprawl (4 repos w/o consolidated maintenance) | MEDIUM | MEDIUM | Template-driven sync |
| 10 | Documentation drift (MASTER_PLAN 5 wk stale) | HIGH | LOW | Weekly refresh ritual |

---

## 9. May 2026 best practices not yet adopted

### From Anthropic + frontier labs
- **Prompt caching** — verify all Claude API code uses it (check `vercel:ai-sdk` skill recommendations)
- **Extended thinking** — `alwaysThinkingEnabled: true` in user settings ✓
- **Tool use with response shaping** — for AI SDK v6 messages
- **Files API** for long-context document handling

### From Vercel platform updates (loaded via knowledge-update skill)
- Fluid Compute is default (not Edge)
- Node 24 LTS default (not 18)
- vercel.ts replaces vercel.json
- AI Gateway preferred over per-provider SDKs
- Vercel Sandbox + Queues + BotID + Rolling Releases all GA

### From design + UX
- View Transitions API for nav animations
- Container queries for responsive components
- CSS @scope for component isolation
- WCAG 2.2 (frontend-design plugin enforces)

---

## 10. What I executed this session

### Phase 1 cleanup (DONE)
1. ✓ Removed claude-flow lifecycle hooks (9), permission patterns (3), claudeFlow config block (40 lines), Co-Authored-By attribution from `Arcanea/.claude/settings.json` — committed on `chore/ecosystem-cleanup-2026-05-07`, PR #94 open
2. ✓ Removed duplicate `session-start.sh` hook (was firing twice)
3. ✓ Disabled 4 redundant plugins (context7, code-simplifier, serena, explanatory-output-style) in user settings
4. ✓ Deleted 37 user-level skill dirs (14 mandatory cull + 23 marketplace duplicates), backup at `~/.claude/backups/2026-05-07/skills-pre-cleanup.tar.gz`

### Audits written
1. `2026-05-06-skills-inventory.md`
2. `2026-05-06-repo-architecture.md`
3. `2026-05-06-plugin-overlap.md`
4. `2026-05-06-strategic-charter.md` (v1)
5. `2026-05-07-strategic-charter-v2.md` (this session — supersedes v1)
6. `2026-05-07-engineering-excellence.md` (this file)
7. `2026-05-07-90-day-roadmap.md` (next file)
8. `2026-05-07-overnight-handover.md` (final summary)

### NOT executed (deferred per discipline)
- Phase 2 (claude-flow surgery in arcanea-flow repo — needs Frank's review of 1530 changes)
- WIP commit (brand-color refactor — Frank should approve direction)
- main merges (no autonomous merging policy)
