# Current State — 2026-04-20 (Week-end synthesis)

> Synthesized by `weekly-strategy-synthesis` scheduled task covering the week of
> Apr 13 → Apr 19 (Sunday-to-Sunday). Merges the two prior active snapshots
> (CURRENT_STATE_2026-04-17_AMCAS and CURRENT_STATE_2026-04-18_AGENT_LAYER) into
> a single authoritative reference. Reads from Linear + memory + git hygiene
> report + Weekly Scorecard Apr 14–20.

## TL;DR

Architecture shipped hard. Revenue shipped nothing. Gate 0 is **60% stuck at the
payment surface** with 10 days to deadline (Apr 30). The week produced 160
commits, 9 closed Linear issues, 4 npm publishes, unified the swarm planner,
blocking-CI typecheck, and resolved the GitHub Actions billing crisis — but
zero paid transactions and GenCreator.ai is 2 days past its go-live date.

A large new initiative — **Vibeclubs.ai** — was fully specced into Linear on
Apr 16 (20+ issues across 4 weeks), creating a second unshipped revenue surface
that competes with GenCreator for Frank's attention.

## Active System Inventory (verified against git + npm + Linear)

### Platform — LIVE

| System | Version | Surface | Notes |
|---|---|---|---|
| `@arcanea/orchestrator` | 1.2.1 | npmjs.org | Adaptive routing + 3 workflow templates + `/arco` skill. Docs at `/orchestrator` |
| `@arcanea/router-spec` | 1.0.2 | npmjs.org | 14 models, 16 tasks, 7 surfaces, 4 delegations |
| `@arcanea/starlight-intelligence-system` | 6.0.1 | npmjs.org | Canonical MCP wired; forked scripts retired |
| `@arcanea/design-system` | 0.3.0 | workspace | Geist runtime + 5 primitives (AnimatedBeam, NumberTicker, Marquee, BorderBeam, Spotlight); Lighthouse CI in PR #42 |
| `@arcanea/publishing-house` | 0.5.0 | workspace | First web consumers wired: `/api/ai/author-chat` score_draft (PR #44) + `/api/author/[bookSlug]/publish` TASTE gate (PR #46) |
| arcanea.ai (main) | deployed | Vercel | 0 TS errors; typecheck CI gate blocking since PR #38 |
| Presence Room | live | `arcanea.ai/room/{persona}` | Web-native; BYOK; multi-round tool chaining; VAD tuned |
| Lumina Bubble | live | `/chat` site-wide | Cmd+K trigger |
| ReasoningBank | code + DB live | Supabase | Migration applied; embeddings backfilled |
| Quality Gates | live | `/api/forge/quality-check` | 6 gates |
| Swarm engine | unified with chat planner Apr 20 | `/api/swarm/invoke` | PR #47 ported to LLM `planSwarm`; `LUMINOR_HINTS` demoted to expertise dictionary |
| CI typecheck gate | blocking | GitHub Actions | PR #38; regression-proof |

### Platform — BUILT, NOT LIVE

| System | State | Blocker |
|---|---|---|
| **GenCreator.ai** | Pipeline complete (Whop webhook, Notion auto-duplication, middleware, preflight scripts) — **2 days overdue on go-live** | Final Frank-only manual deploy + domain cutover (ARC-139, due Apr 18) |
| Streaming swarm trace in chat UI | Backend unified (PR #47) but client still renders single-Luminor UX | Trace UI component + SSE subscription (next sprint) |
| MCP exposure of vault tools | Server exists (@arcanea/arcanea-mcp) | Not registered on Smithery / Cline marketplace; not imported into arcanea-ai-app |
| Publishing House claw distribution | All 8 claws + 87 skills mapped; Dockerfile tested | npm publish requires `npm login` (ARC-76); Smithery/ClawHub/Docker Hub/Railway pending |
| Presence Layer (avatar) | Voice pipeline working (Simli-ready) | API keys pending — Simli + Hedra + NVIDIA NIM (ARC-83/84) |

### Platform — IN FLIGHT (new surface, pre-ship)

| Surface | Linear Project | Scope | Target |
|---|---|---|---|
| **Vibeclubs.ai** | `ca98d41c-9bc0-44bb-aa83-c52047d7c788` | 20+ issues (ARC-142 → ARC-159): Next.js 16 + Supabase scaffold, Chrome extension MV3, Pomodoro sync, Suno generation, Stripe tiers, OSS packages | 4-week sprint; launch target 2026-05-14 |
| **Creator Forge** | `24e2b92c-bc13-4983-8aa2-35e344949730` | 8 stage issues (ARC-161 → ARC-168): spec → Notion mirror → public Card pages → fork action → attribution cascade → onchain contract | Staged; Stage 1 (spec) still backlog |

## Revenue & Cash — UNCHANGED

- **Revenue this week:** €0
- **Liquid:** ~€6K
- **Burn:** €346/mo SaaS
- **Runway:** ~17 months assuming zero income (Oracle bonuses Apr 24 + May 24 pending verification)
- **BV deadline:** June 1, 2026 (42 days from today)
- **Gate 0 deadline:** April 30 (10 days)

## Gate 0 — First Flame (unchanged from Scorecard, 2/5 + 2 partial)

| # | Condition | Status | Week delta |
|---|---|---|---|
| 1 | GenCreator.ai live on custom domain with Whop payment | ⏳ Pipeline built, not live | Missed Apr 18 |
| 2 | 3+ OSS templates with 10+ GitHub stars each | ⏳ 5 repos shipped, stars unmeasured | No delta; need measurement |
| 3 | First €1 revenue (any source) | ❌ | No delta |
| 4 | Meta-repo with CI/CD green | ✅ | ARC-186 unblocked Apr 19 |
| 5 | Whop OR LemonSqueezy storefront configured | ❌ | No delta |

## PRs merged this week (main)

- **PR #37** — TS errors 168 → 0 (superseded by #45)
- **PR #38** — Typecheck CI gate flipped to BLOCKING
- **PR #41** — `/arco` skill shipped (wraps orchestrator)
- **PR #44** — Publishing House `score_draft` tool in `/api/ai/author-chat`
- **PR #45** — TS errors rebased batch (superseding #37)
- **PR #46** — TASTE quality gate in `/api/author/[bookSlug]/publish`
- **PR #47** — `/api/swarm/invoke` unified with LLM `planSwarm` planner
- **PR #48** — `next.config.js` transpilePackages for workspace subpath exports

Also restored via `023930d0`: `/lumina`, `/arcanea`, `/superintelligence` slash
commands (killed 2026-03-11 by `073bc640`).

## Linear this week

### Completed (assigned to Frank)

| ID | Title | Closed |
|---|---|---|
| ARC-186 | CRITICAL: GitHub Actions billing blocked | 2026-04-19 |
| ARC-141 | OSS Pivot Strategy — Free-first templates, GitHub Projects V2, LemonSqueezy | 2026-04-16 |
| ARC-140 | /handover skill enhanced with wisdom capture + Starlight Vault routing | 2026-04-16 |
| ARC-138 | Author Studio v2 — All 8 tasks shipped | 2026-04-16 |
| ARC-137 | Machine Performance Defense-in-Depth — 6-layer resource management | 2026-04-16 |
| ARC-136 | Arcanea Mascot System — 8-variant component integrated across site | 2026-04-16 |

Scorecard counted 9 closed; delta (ARC-176, ARC-178, ARC-185) not in my returned slice but trust the Scorecard number.

### In Progress — Urgent, overdue

| ID | Title | Due | Days over |
|---|---|---|---|
| ARC-139 | GenCreator.ai go-live | 2026-04-18 | **2** |
| ARC-86 | Rename @frankxeth → @frankx_ai on X | 2026-04-05 | **15** |
| ARC-88 | Post ACOS v10 + MCP Doctor threads from queue | 2026-04-05 | **15** |
| ARC-146 | VBC-22: Vibeclubs Playbook (MDX) | 2026-04-18 | 2 |
| ARC-143 | VBC-23: Vibeclubs landing page | 2026-04-19 | 1 |
| ARC-142 | VBC-21: vibeclubs.ai Next.js 16 scaffold | 2026-04-17 | 3 |
| ARC-144 | VBC-24: /start wizard | 2026-04-20 | due today |

### In Progress — Urgent, still running

- **ARC-101** M2 Revenue Sprint (rescoped Apr 16) — due 2026-04-30
- **ARC-83 / ARC-84** Presence Layer voice→avatar — blocked on API keys
- **ARC-71** MCP Product Launch — blocked on `npm login` (ARC-76)

### Newly opened

- **ARC-186** (Apr 19, urgent, resolved same-week)
- **ARC-142 → ARC-159** (Apr 16): 20+ Vibeclubs issues — full 4-week plan
- **ARC-161 → ARC-168** (Apr 16–17): 8 Creator Forge stage issues
- **ARC-101** rescope notes

### Canceled

- **ARC-134** VBC-19 Error handling — canceled 2026-04-16 (scope reshuffle)

## Honest risks carried into next week

1. **Two unshipped revenue surfaces competing for Frank's attention** — GenCreator (2 days overdue, 90% done) vs. Vibeclubs (fresh 4-week plan, <5% done). Serial monogamy required; Gate 0 closure depends on finishing GenCreator first.
2. **4 blind domains (Health, Mind, Creativity, Relationships)** still have zero automation — every Scorecard for these is 50% self-report-pending. Gate Tracker DB + Daily Pulse DB live but only for Build/Revenue.
3. **Trinity AI engagement unverified 5 days post-nominal-launch (Apr 15)** — per Apr 16 memory reframe, treated as supportive-not-blocking, but there's no closure signal.
4. **CI Build job structural flaw** — `needs: [lint]` should be `[install, lint]`; deferred to next session.
5. **1,966-file CRLF↔LF line-ending mirage** in the working tree — cosmetic, but risk of noise commits if not handled before next merge. Fix: `core.autocrlf=false`, `core.eol=lf`, `git checkout .`.
6. **13 active local branches** — merged-safe-to-delete: 4 (`feat/design-system-foundation`, `fix/ts-errors-batch3`, `fix/ts-errors-top5`, `orchestrator/v1.2.0-release`). Worktree `design-evolution` flagged prunable.

## Where the truth lives

- **Gate Tracker DB (Notion)** — `collection://f389029e-5d84-470e-b07e-91309fad9a0b`
- **Weekly Scorecard DB (Notion)** — posted weekly by `ao-weekly-scorecard` task
- **Linear projects** —
  - Arcanea: `df23e16b-dd2c-40b1-a828-2ccdb6fa1701`
  - FrankX.ai (GenCreator): `54d8e481-fea4-4c41-bf62-f06aac1edae6`
  - Vibeclubs: `ca98d41c-9bc0-44bb-aa83-c52047d7c788`
  - Creator Forge: `24e2b92c-bc13-4983-8aa2-35e344949730`
  - Content Production: `bd46c227-5696-4ba1-880f-e0714502d679`
  - Business Ops: `7a80126e-8245-4ecb-84af-070d90526e41`
- **Miro Board** — `https://miro.com/app/board/uXjVGdLXraU=/` (90+ artifacts, rows 0–30)
- **Git** — `frankxai/arcanea-ai-app` main, current working branch `docs/ops-handover-autonomous-2026-04-19`

## Supersedes

- `CURRENT_STATE_2026-04-17_AMCAS.md` — folded in (AMCAS section)
- `CURRENT_STATE_2026-04-18_AGENT_LAYER.md` — folded in (Agent Layer section); PR #47 closes the "swarm engine unreachable from chat" gap at the backend

## Does NOT supersede

- `CURRENT_BACKLOG_2026-04-13.md` — replaced by `CURRENT_BACKLOG_2026-04-20.md` (this synthesis)
- `HANDOVER_2026-04-18_PM.md` — reference narrative, kept in place
- `GIT_HEALTH_2026-04-20.md` — today's hygiene scan, kept in place
