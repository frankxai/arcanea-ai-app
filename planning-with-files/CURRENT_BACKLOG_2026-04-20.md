# Current Backlog — 2026-04-20 (Week-end reprioritization)

> Supersedes `CURRENT_BACKLOG_2026-04-13.md`. Reordered around Gate 0's 10-day runway
> (deadline Apr 30). Two hard constraints govern priority: (a) every tier above P2
> must route to paid transactions or Gate 0 closure, (b) Frank-manual work is scarcer
> than agent-capable work — cut Frank-manual tasks unless they unlock revenue.

## Prioritization rule (new this week)

```
P0 = Gate 0 critical path. Blocks first €1 or Apr 30 deadline.
P1 = Revenue surface #2 or Gate 0 ancillary (stars, OSS templates).
P2 = Unblock compounding surfaces (npm login, MCP distribution).
P3 = New initiative catch-up (Vibeclubs, Creator Forge).
P4 = Platform hygiene / tech-debt.
P5 = Future-optionality (deferred until post-Gate-0).
```

Vibeclubs is explicitly P3, not P1, despite 5 overdue issues. Rationale: shipping
GenCreator.ai first proves the pattern; Vibeclubs copies the stack. Parallel focus
on two unshipped revenue surfaces is how Gate 0 slips.

---

## P0 — Gate 0 critical path (close by Apr 30)

| # | ID | Surface | Action | Owner | Due | Blocker |
|---|---|---|---|---|---|---|
| P0.1 | **ARC-139** | GenCreator.ai | Manual cutover: domain DNS + Vercel prod deploy + Whop webhook prod key + smoke test paid flow | **Frank** | 2026-04-24 EOD | None — entirely Frank-manual |
| P0.2 | **new** | Storefront | Pick one: Whop (already half-wired) OR LemonSqueezy; configure tiers, webhook, test purchase; satisfies Gate 0 cond #5 | **Frank** | 2026-04-25 | None |
| P0.3 | **new** | First €1 | Execute test purchase from personal card on the live surface; measurably closes Gate 0 cond #3 | **Frank** | 2026-04-26 | P0.1 + P0.2 |
| P0.4 | **new** | OSS stars | Measure current stars across 5 shipped OSS repos; if <10, launch "Show HN / X thread" campaign for the 3 closest; closes Gate 0 cond #2 | Agent-capable (star count + draft threads) | 2026-04-27 | — |

**Escape valve:** If P0.1 slips past Apr 26, formally rescope Gate 0 cond #1 to a
narrower surface (e.g. a single Whop product card on arcanea.ai/store). A Gate
missed is a Gate deferred; a Gate faked is a credibility loss.

---

## P1 — Revenue ancillary + surface leverage

| # | ID | Action | Why | Est |
|---|---|---|---|---|
| P1.1 | **ARC-76** | `npm login` + publish 13 pending @arcanea packages | Unblocks ARC-71 (MCP chain), ClawHub, public-consumable orchestrator extensions | 30 min, Frank-manual |
| P1.2 | **ARC-71** | MCP Product chain launch (depends on P1.1) | Turns already-built `@arcanea/arcanea-mcp` into installable product on Smithery/Cline | 2 hrs after P1.1 |
| P1.3 | **ARC-86** | Rename `@frankxeth` → `@frankx_ai` on X | 15 days overdue. Protects the X handle identity aligned with `frankx.ai` domain before distribution ramps | 5 min, Frank-manual |
| P1.4 | **ARC-88** | Post queued threads from `data/social-queue.json` (ACOS v10 + MCP Doctor) | 15 days overdue. Built audience content sitting idle; costs nothing to ship | 20 min, Frank-manual |
| P1.5 | **new** | Commit the 12 SHIP files flagged in `GIT_HEALTH_2026-04-20.md` | Design agent suite + `/ao` + `/arco` + `.env.example`. Finishes the settings-repo posture | 10 min after CRLF fix |

---

## P2 — Unblock compounding infrastructure

| # | ID | Action | Why | Est |
|---|---|---|---|---|
| P2.1 | **new** | Streaming swarm trace UI + SSE subscription | Closes the PR #47 delta: backend is unified but chat UI still renders single-Luminor. First real agent-visible demo for Show HN / launch content | 1–2 days |
| P2.2 | **ARC-83 / ARC-84** | Presence Layer API keys — Simli + Hedra + NVIDIA NIM | Voice→avatar pipeline is built; single auth step away from demo-able artifact. Frank-manual signup flow | 1 hr, Frank-manual |
| P2.3 | **new** | Publishing House distribution — 8 claws → Smithery + ClawHub + Docker Hub + Railway | Dockerfile tested, mappings done. Same blocker chain as P1.1 (`npm login`) | 3 hrs after P1.1 |
| P2.4 | **new** | CI Build job `needs: [install, lint]` fix | Structural flaw carried since Apr 18. 10-line PR. Removes a silent failure mode before it bites | 15 min |
| P2.5 | **new** | CRLF / line-ending nuke — `core.autocrlf=false`, `core.eol=lf`, `git checkout .` | Clears 1,966-file diff mirage before any merge. Prevents noise commits | 10 min |
| P2.6 | **new** | Branch cleanup — delete 4 merged (`feat/design-system-foundation`, `fix/ts-errors-batch3`, `fix/ts-errors-top5`, `orchestrator/v1.2.0-release`) + prune `design-evolution` worktree | Git hygiene hygiene | 5 min |

---

## P3 — New initiative catch-up (Vibeclubs + Creator Forge)

Deprioritized relative to gut feel. Vibeclubs has 20+ Linear issues and 4 week-1 items are already 1–3 days overdue. Shipping GenCreator first validates the stack; Vibeclubs inherits. Do not spread Frank across both shipping surfaces.

| # | ID | Action | Target | Notes |
|---|---|---|---|---|
| P3.1 | **ARC-142** | vibeclubs.ai Next.js 16 scaffold | Apr 24 (post-GenCreator) | 3 days overdue. Agent-capable mostly |
| P3.2 | **ARC-144** | `/start` wizard | Apr 25 | Due today per backlog; defer ok |
| P3.3 | **ARC-143** | Landing page | Apr 26 | 1 day overdue |
| P3.4 | **ARC-146** | Vibeclubs Playbook MDX | Apr 27 | 2 days overdue. Writing task, easily agent-spawnable |
| P3.5 | **ARC-161** | Creator Forge Stage 1 spec | Apr 30 | Still in backlog, untouched. Blocking all 8 downstream stages |
| P3.6 | — | Remaining ARC-142 → ARC-159 | Week of Apr 27 | Reassess after P0 closes |

**Hard rule:** No Vibeclubs PR against main until GenCreator is live. Branch-and-wait.

---

## P4 — Platform hygiene / tech-debt

| # | ID | Action | Note |
|---|---|---|---|
| P4.1 | **ARC-67** | 6 Canva Brand Kits | Brand distribution surface. Agent-doable via Canva MCP |
| P4.2 | **ARC-70** | Postiz / Blotato distribution setup | Unblocks automated publishing loop |
| P4.3 | **new** | Classifier/planner upgrade for swarm (replace `LUMINOR_HINTS` heuristic) | Works until ~20 Luminors; we're at 13. Not urgent yet |
| P4.4 | **new** | Kill 13 → 5 active local branches. Rebase/close remaining feature branches post-merge | Reduce cognitive overhead |
| P4.5 | **new** | Trinity AI engagement closure signal | 5 days post-nominal-launch, still unverified. Either formalize as paying or deprioritize officially |

---

## P5 — Future-optionality (deferred until post-Gate-0)

- Arcanea-code TUI fork — empty repo, decision between submodule vs fork still pending
- `@arcanea/router-spec` v1.1 publish — in-tree surface additions, no consumer demand
- Real stats population via 10+ `arco run` events to unlock adaptive routing on this machine
- Windows PowerShell `install.sh` transpile
- `@arcanea/orchestrator-pro` monetization fork decision
- `arco exec` for workflow sequential/parallel dispatch — design call on concurrency semantics
- 4 blind domain automations (Health, Mind, Creativity, Relationships) — Gate Tracker + Daily Pulse only live for Build/Revenue

---

## Removed / Superseded

- CURRENT_BACKLOG_2026-04-13 P0-P5 tiers — structure kept, content reshuffled around Gate 0
- AMCAS orchestrator v1.2.0 ship items — now historical (shipped; see CURRENT_STATE_2026-04-20)
- TS errors batch — closed (0 errors, blocking gate active)
- "Swarm engine unreachable from UI" — backend closed via PR #47; UI piece moved to P2.1

## This week's singular framing

Two shipped revenue surfaces are worth more than twenty specced ones. The backlog
above is ordered so that if Frank does P0.1 → P0.4 this week and nothing else,
Gate 0 closes and June 1 BV deadline is met.
