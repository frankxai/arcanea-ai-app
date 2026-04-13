---
title: Second Brain — Buildout Plan
domain: meta
created: 2026-04-10
updated: 2026-04-13
author: claude
status: active-build
links: [confidential-tier, inbox-architecture, semantic-map-at-scale, agent-protocol, knowledge-inventory, notion-map]
---

# Second Brain — Buildout Plan

Master architecture for a semantic, agent-maintained, multi-brand second brain. This is the file plans collapse into when conversations end. Read this before starting any second-brain session.

## North Star

One inbox. One canonical wiki. Many surfaces. Agents maintain. Knowledge compounds. Revenue follows — not the other way around.

**Operating posture (2026-04-10):** Capture & interconnection precede shipping velocity. Revenue focus shifts to end-of-April. Until then, every session should either (a) shorten the distance between a new idea and its indexed, interlinked home, or (b) automate a loop that was previously manual.

## The Seven Systems

The second brain is not one system — it is seven interlocking loops. Each has a file, a surface, and a ritual.

| # | System | Primary file | Surface | Ritual |
|---|--------|-------------|---------|--------|
| 1 | Trust tiers | [confidential-tier](confidential-tier.md) | Local encrypted + 1Password + revoked-Notion | Quarterly review |
| 2 | Inbox | [inbox-architecture](inbox-architecture.md) | Linear `ARC-INBOX` project | Daily 9am triage |
| 3 | Semantic wiki | [notion-map](notion-map.md) + this directory | `wiki/` markdown | Weekly Sunday harvest |
| 4 | Repo sprawl | `/repo-triage` skill | GitHub → Linear | Weekly Sunday 10am |
| 5 | Milestone capture | `/ship-it` skill | Chrome MCP + wiki/milestones + Slack | On every Linear Done |
| 6 | Agent workflows | `.claude/skills/` + `commands/` | Cowork + Claude Code | Per-session |
| 7 | Scheduled tasks | `schedule` skill | Background | Cron-like |

Each system has a dedicated buildout doc. This file is the index and the sequencing decision.

## Build Sequence (locked)

Build in this order. Do not skip. Do not parallelize beyond what's noted.

### Phase 1 — Foundation (this week, 2026-04-10 → 2026-04-17)

1. **Trust tiers documented** → `confidential-tier.md` (this session)
2. **Inbox architecture documented** → `inbox-architecture.md` (this session)
3. **Semantic-map-at-scale doc** → `semantic-map-at-scale.md` (this session)
4. **Skill specs drafted** → `wiki/skills/*.md` (this session)
5. **Repo-triage script drafted** → `wiki/scripts/repo-triage.py` (this session)

Phase 1 deliverable: a complete, file-backed architecture. No running automation yet — but every decision is reversible and written down.

### Phase 2 — Activation (next session, requires Frank's hands)

6. Create Linear `ARC-INBOX` project (1 Linear call)
7. Create Notion "Private / T1" top-level page + revoke integration access
8. `gh auth login` so full 106-repo list becomes accessible
9. Run repo-triage script once manually → verify grading → file into Linear
10. Wire `schedule` skill: weekly repo triage + twice-daily milestone scanner
11. Build `/inbox-triage` skill (highest leverage — unlocks daily ritual)

Phase 2 deliverable: captured ideas hit Linear ARC-INBOX within 30 seconds of utterance; repos auto-graded weekly; milestones auto-captured.

### Phase 3 — Shipping velocity (2026-04-18 → 2026-04-30)

12. Build `/ship-it` skill (Chrome MCP screenshot + social drafts + wiki milestone entry)
13. Build `/confidential-capture` skill (refuses to write secrets to T2)
14. Refactor 8 structural gaps from `notion-map.md` (Business hub, FrankX refresh, SIS promotion, Dream100 merge, Wealth automation, Morning Brief archive, Workshop execution, Podcast recording)
15. Wire Gate 0 — first revenue — by 2026-04-30

Phase 3 deliverable: second brain actively producing revenue loops, not just capturing them.

## Non-negotiables

- **Plans save to file when >150 lines.** Every non-trivial architecture doc lives in `wiki/meta/` or `wiki/skills/`. Conversations are ephemeral; the wiki is canon.
- **Single INBOX, multiple surfaces.** Every capture destination that is not `ARC-INBOX` is a downstream projection, not a source of truth.
- **Skills over RAG.** Knowledge activation via `.claude/skills/*.md` beats semantic search for agent workflows. See `knowledge-systems.md` decision 3.
- **Idea capture before categorization.** Brain Gems → triage → PARA. Never force category at capture time.
- **Wiki before Notion before Linear before code.** When adding a new concept: write the wiki article first, then mirror to Notion if team-facing, then create Linear issues for execution, then write code.
- **Kill-switch per tier.** Any T2 surface must be revocable in one action (delete integration, rotate token, archive page).

## Scaling Constraints

At current scale (150+ assets, 106 repos, 80+ Notion pages, 5 brands), manual maintenance is dead. The following loops must be automated before any more content is produced:

1. **Repo grading** — 106 repos, cannot manually audit. `/repo-triage` weekly.
2. **Idea triage** — multi-platform capture causes fragmentation. Single inbox + `/inbox-triage` daily.
3. **Morning brief** — already auto-generating, but briefs accumulate unread. Archive rotation via scheduled task.
4. **Milestone capture** — manual screenshot + social drafting eats 30 min per shipped thing. `/ship-it` automates to 30 seconds.
5. **Wiki harvest** — insights stuck in Obsidian + Legendary Brain. Weekly `/harvest` skill (Phase 3 candidate).

The rule: if a loop runs more than weekly, it needs a skill. If it needs to run without Frank present, it needs a scheduled task.

## The Sprint Board Decision

**Recommendation: Linear for active work. Notion for reference/archive. Wiki for decisions.**

**Why Linear wins for active:**
- Project-scoped issues with cycle-aware scheduling (already have 7 projects)
- API-first — trivial to wire `/repo-triage`, `/ship-it`, `/inbox-triage` writes
- Labels + statuses map cleanly to grading axes (active/dormant/graveyard/shipped)
- Agent ownership via assignee field, not a separate registry

**Why Notion keeps its role:**
- Team knowledge, templates, human-editable dashboards
- Canvases and toggles for narrative docs
- Already holds 80+ pages of institutional memory

**Why the Wiki is separate from both:**
- Markdown is the lingua franca for agents (readable by every LLM, every editor, every terminal)
- Git-backed = version-controlled decisions
- No vendor lock-in
- Karpathy LLM Wiki pattern operationalized

**The three-layer rule:**
```
Wiki (decisions, canon, architecture)  →  Notion (team knowledge, templates)  →  Linear (active work, issues, cycles)
```

Information flows left-to-right when executing. Right-to-left when reflecting.

## Open Decisions (not yet collapsed)

| # | Decision | Options | Deadline |
|---|----------|---------|----------|
| D1 | Second-brain repo: standalone or wiki-in-Arcanea? | Standalone `frankxai/second-brain` private repo vs. current `Arcanea/wiki/` inline | 2026-04-17 |
| D2 | Business folder: consolidate to Notion hub or keep local? | New Notion Business hub vs. stay on local `C:\Users\frank\Business\` | 2026-04-17 |
| D3 | Obsidian → Wiki bridge: manual or scripted? | Weekly manual harvest vs. `obsidian-export` + rsync | 2026-04-24 |
| D4 | Confidential tier primary store | Encrypted local vault vs. 1Password + Proton Drive vs. both | 2026-04-17 |
| D5 | Milestone capture trigger | Linear status change webhook vs. Frank-invoked `/ship-it` | 2026-04-18 |

## Failure Modes to Avoid

- **Wiki sprawl.** If a wiki article isn't linked from README or another article within 7 days, it's orphaned. Prune aggressively.
- **Inbox bankruptcy.** If `ARC-INBOX` has >100 items unprocessed, declare bankruptcy and archive all. The ritual must fit in 15 minutes.
- **Skill debt.** Every skill added must have a kill criterion: if unused for 30 days, delete.
- **Two brains.** If Legendary Brain and this wiki ever drift such that a fact lives in only one — flag in weekly review.
- **Notion as source of truth for code-adjacent decisions.** Architecture decisions live in `wiki/decisions/`, not in Notion pages. Notion mirrors; wiki owns.

## Current State (2026-04-13)

### Phase 1 — Foundation ✅ COMPLETE (2026-04-10)

- ✅ Wiki directory with 17 articles (README, 5 domain overviews, agent-protocol, decision architecture, knowledge-inventory, knowledge-systems, notion-map, buildout-plan, confidential-tier, inbox-architecture, semantic-map-at-scale, skills/README, scripts/README, 6 skill specs)
- ✅ Full Notion semantic map with collection:// IDs
- ✅ Auto-memory system tracking 16+ project/user/feedback memories
- ✅ 7 Linear projects across 5 brands
- ✅ Trust tier doc (`confidential-tier.md`) — T0/T1/T2 taxonomy, routing rules, refusal hooks
- ✅ Inbox architecture doc (`inbox-architecture.md`) — 7 buffers, triage ritual, bankruptcy protocol
- ✅ Semantic-map-at-scale doc — 5 scale problems + fixes, graph view Phase 3
- ✅ Skill specs (6 total: capture, inbox-triage, repo-triage, ship-it, confidential-capture, harvest)
- ✅ Repo-triage script (`wiki/scripts/repo-triage.py`) — 280 lines, idempotent, --dry-run, tested interface
- ✅ D1–D5 decisions collapsed with recommendations (2026-04-13)

### Phase 2 — Activation ✅ COMPLETE (2026-04-13)

- ✅ Linear ARC-INBOX project created (id: f275978c-8ef8-450a-a6b3-fda11df5c568, url: linear.app/arcanea/project/arc-inbox-92d92241315c)
- ✅ Notion Business Ops Hub created under Ops Hub (page: 34126ac2-b7f6-81fc-8aae-d2076541e753)
- ✅ 4 Notion databases created: Financial Ops, Contracts, Compliance, Legal — all with proper schemas
- ✅ Trinity AI Alliance contract seeded in Contracts DB (€180K, Active, SIS brand)
- ✅ BV Netherlands Formation seeded in Compliance DB (due: 2026-06-01)
- ✅ Skill implementations built (.claude/skills/): capture, inbox-triage, confidential-capture, repo-triage, ship-it, harvest
- ✅ obsidian-harvest.py script written (280 lines, stdlib, --dry-run, smoke test, dedup)
- ✅ Scheduled tasks wired (3 tasks):
  - daily-inbox-reminder: every day 9am — ARC-INBOX pulse check
  - weekly-repo-triage: Sundays 10am — repo audit → wiki report → Linear issue
  - weekly-harvest: Sundays 10:30am — drain all 7 buffer surfaces → ARC-INBOX

**Phase 2 pending (requires Frank's hands):**
- ⬜ `gh auth login` — unlock full 106-repo list for repo-triage
- ⬜ Create Notion "Private / T1" page + revoke Notion integration on it
- ⬜ Run `python wiki/scripts/repo-triage.py --dry-run` once to verify output
- ⬜ Run weekly-repo-triage task manually to pre-approve Linear + GitHub MCP tool permissions
- ⬜ Run weekly-harvest task manually to pre-approve Slack + Drive + Notion MCP permissions
- ⬜ Set up 1Password `arcanea-infra` vault for credentials
- ⬜ Init `~/Business/confidential/` directory with age encryption

### Phase 3 — Shipping Velocity (2026-04-18 → 2026-04-30)

- ⬜ Fix 8 structural Notion gaps (Business hub complete ✅, FrankX refresh, SIS promotion, Dream100 merge, Wealth automation, Morning Brief archive, Workshop execution, Podcast recording)
- ⬜ Wire Gate 0 revenue loop (first €1 by 2026-04-30)
- ⬜ Phase 3 graph view (orphan-scan.py, link-check.py, auto-graph from frontmatter)
- ⬜ frankxai/second-brain standalone repo (post-Phase 2)

### Gate 0 Revenue
- ⬜ First €1 by 2026-04-30

---

*This plan is the durable form of what would otherwise be lost in a conversation. Update status markers during every second-brain session. Never delete — supersede.*
