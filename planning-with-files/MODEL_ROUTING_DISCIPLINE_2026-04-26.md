# Model Routing Discipline

> **Status:** ACTIVE — locked 2026-04-26 by Shinkami under Frank's autonomous-execution mandate.
> **Scope:** All Agent dispatches across the Arcanea operation.
> **Authority:** Cited from `AGENTS.md` Execution Law. Memory: `feedback_arcanea_flow_usage`.

---

## The rule

**Set the `model:` parameter on every Agent dispatch.** Default-Opus is wasteful — Opus burns Max-sub credits at the highest rate, and most tasks do not require Opus reasoning. Routing by task class preserves capacity for the work where Opus is actually load-bearing.

Three tiers, four classes:

| Class | Model | Use for |
|---|---|---|
| **Apex** | `claude-opus-4-7` (Opus 4.7) | Literary prose drafting · synthesis across many sources · novel architecture decisions · single-shot reasoning where the cost of a second pass exceeds the cost of the first |
| **Senior** | `claude-sonnet-4-6` (Sonnet 4.6) | Council review (review is reasoning over existing material, not new prose) · code work · frontend components · single-domain analysis · planning at task level |
| **Mechanical** | `claude-haiku-4-5-20251001` (Haiku 4.5) | Frontmatter audits · build verification · classification · file-by-file mechanical edits · search and report · format normalization |
| **External** | via `/arco` to `gemini-arcanea` / `codex-arcanea` / `oh-my-arcanea` | Cross-CLI delegation when leverage is non-Claude — e.g. Gemini's 2M context for one-pass full-manuscript canon-checking; GPT-5 editorial second opinion from a different model lineage; OpenCode Zen for free-tier routine work |

---

## Why this matters

The 2026-04-26 council session burned Opus 4.7 on tasks that should have routed to Sonnet 4.6 or Haiku 4.5. Council reviewers reading existing chapters were dispatched on Opus when review is reasoning over given material — Sonnet is sufficient. Frontmatter audits and mechanical chapter-by-chapter edits were dispatched on Opus when Haiku is sufficient.

The cost of mis-routing is not academic. Max sub credits are bounded. Burning Opus on Haiku-class work means running out of Opus before the work that actually needs Opus is done. This has happened. It will happen again unless routing is disciplined.

---

## How to route — by task type

### Class APEX (Opus 4.7)

- **Drafting new literary prose.** Chapter-level work in fiction. Original synthesis where the model is generating, not reviewing.
- **Architectural decisions across many surfaces.** When the answer requires holding the whole of `.arcanea/lore/`, multiple BIBLEs, and the manifest in one head simultaneously.
- **Novel canonization decisions.** Establishing a Tier of canon. Naming a new Realm, a new Gate-relationship, a new Origin Class.
- **Long-context single-shot synthesis** where the conversation must hold its whole history coherently. (For very long contexts beyond Opus's window, route to `gemini-arcanea` instead.)
- **Author Council convening with novel material.** When the council is being convened on a chapter that has not been read before by the agents.

### Class SENIOR (Sonnet 4.6)

- **Council review of already-drafted material.** Each reviewer is reasoning over text the chapter contains; this is comprehension + judgment, not generation. Sonnet is sufficient and frees Opus for the next drafting pass.
- **Code implementation tasks** at component/route/utility level. Frontend components. API routes. Service-layer code. Refactoring within a clear scope.
- **Single-domain analysis.** Performance audit of one page. Accessibility review of one component. SEO check of one route.
- **Planning at task level.** Decomposing a feature spec into a concrete file-by-file plan.
- **Documentation writing** (this file's class — produced on Sonnet).
- **Skill authorship and skill review.**

### Class MECHANICAL (Haiku 4.5)

- **Frontmatter audits.** Checking 12 chapters for YAML consistency. Verifying every page has metadata.
- **Build verification.** Running `pnpm build`, parsing the output, reporting result. (Haiku reads logs faster and cheaper than Sonnet.)
- **Classification work.** Routing inbox. Tagging files. Categorizing skills.
- **Format normalization.** Renaming files. Standardizing whitespace. Fixing a known small pattern across many files.
- **Search-and-report.** Finding all references to a deprecated symbol. Counting raw hex literals. Listing files that import a given module.
- **Anti-slop sweeps.** Pattern-matching across many files for known bad strings.

### Class EXTERNAL (`/arco`)

- **Gemini for very long context.** Gemini 2M-token window holds full Las Tierras manuscript + BIBLE + CANON_LOCKED.md + INDEX.md simultaneously. One pass; finds cross-document inconsistencies that 5 separate Claude agents cannot.
- **Codex (GPT-5) for cross-lineage editorial second opinion.** A different model family reading the same prose may catch things Claude consistently smooths over. Most useful at council-pass moments.
- **OpenCode Zen for routine free-tier work.** When the work is genuine but should not burn Max-sub credits — repository housekeeping, log triage, documentation generation that doesn't require subtle judgment.

---

## How to set the model on a dispatch

The Agent tool accepts a `model` parameter. Pass it explicitly on every dispatch.

```ts
Agent({
  description: "Council review chapter 7",
  subagent_type: "Deep Fiction Master",
  model: "sonnet",      // <-- explicit
  prompt: "..."
})
```

Accepted values: `"opus"`, `"sonnet"`, `"haiku"`. Omitting the parameter defaults to Opus per the agent definition's frontmatter — which is the wrong default for most council/review/mechanical work.

For cross-CLI delegation:

```bash
arco run --task research.deep --surface gemini-arcanea "<prompt>"
arco run --task code.review --surface codex-arcanea --model gpt-5 "<prompt>"
arco run --task code.implement --surface oh-my-arcanea "<prompt>"
```

---

## When to use parallel vs sequential dispatch

Independent of model class, dispatch shape is governed by **RAM availability** on the local machine (16 GB total).

- **Free RAM > 4 GB:** Parallel-safe. A 5-agent council pass can fan out simultaneously.
- **Free RAM 2-4 GB:** Limit to 2-3 parallel dispatches. Stagger or queue beyond that.
- **Free RAM < 2 GB:** **Work sequentially.** No parallel Agent dispatches. Run one agent, wait for return, run the next.

Check before parallel dispatch:
```bash
cat /proc/meminfo | grep MemFree
```

This is non-negotiable per `CLAUDE.md` and `feedback_ops_workflow`. The 2026-04-14 PP audit (50/D, RAM 92 percent) was the most recent reminder; sessions that ignore this discipline run into fork() failures and "Resource temporarily unavailable" errors mid-dispatch.

---

## When to use claude-flow MCP swarm vs native Agent

Per `feedback_arcanea_flow_usage`: **both, not either.**

- **claude-flow MCP swarm** is the planner and coordinator. Use it for multi-domain tasks where the swarm topology, agent count, and handoff sequence need explicit reasoning.
- **Native Agent dispatch** is the executor. Use it for the actual sub-agent runs.

A common pattern:

```
1. Initialize swarm via mcp__claude-flow__swarm_init (planning).
2. Spawn agents via Agent tool with model: parameter set per task class (execution).
3. Coordinate handoffs via mcp__claude-flow__memory_usage (memory passing).
4. Review aggregate via final dispatch on Sonnet (synthesis).
```

This is documented in memory `feedback_arcanea_flow_usage`. The dual-tool pattern is the locked discipline.

---

## When to use `/swarm-lumina` and `/swarm-advanced`

For complex multi-domain tasks, the dedicated swarm skills package the dispatch+coordination pattern:

- **`/swarm-lumina`** — Lumina-led hierarchical swarm. Lumina (orchestrator-class agent) decomposes the task and dispatches Guardian-class workers. Use when the task has a single clear orchestrator-domain (e.g., a book council, a design review pass, a multi-route audit).
- **`/swarm-advanced`** — Mesh topology, no central orchestrator. Use when the task has multiple equal-weight domains that need to coordinate peer-to-peer (e.g., simultaneous frontend/backend/canon review of a feature).

Both skills internally apply model-routing discipline. Reading their SKILL.md files before invocation confirms current routing rules.

---

## Task-class examples (from recent operations)

| Task | Wrong routing | Right routing |
|---|---|---|
| Council review of Ch 4-12 | 5x Opus | 5x Sonnet (review is reasoning, not generation) |
| Frontmatter audit across 12 chapters | Opus | Haiku |
| Drafting Ch 9 (the Wrong Move) | Opus | Opus (genuine literary prose drafting) |
| Authoring Realms tier canon | Opus | Opus (architectural decision across many surfaces) |
| Verifying `pnpm build` exit 0 | Opus | Haiku |
| Drafting a planning-with-files doc | Opus | Sonnet |
| Composing a chapter handover | Opus | Sonnet |
| Cross-chapter canon-consistency check on full Las Tierras manuscript | 12x Opus parallel | 1x Gemini via `/arco` (2M context, one pass) |
| Refactoring 16 components from raw hex to design-system tokens | Opus | Haiku per file (mechanical pattern) |
| Deciding the 12-chapter outline for Las Tierras | Opus | Opus (novel architectural decision) |
| Finding all `motion`-from-`domMax` imports across the repo | Opus | Haiku |
| Editorial second opinion on Ch 11 (the First Contact scene) | 1x Sonnet | 1x Sonnet + 1x GPT-5 via `/arco` (cross-lineage) |

---

## How to grade your own routing

Before every dispatch, ask: *what class is this task?*

- Am I generating new prose or new structure? → APEX
- Am I reviewing or refining existing material? → SENIOR
- Am I doing the same small thing many times? → MECHANICAL
- Do I need a non-Claude advantage (long context, different lineage, free tier)? → EXTERNAL

If you cannot answer cleanly, default down: **Sonnet is the right default for ambiguous-class work, not Opus.** The cost of running Sonnet on a task that needed Opus is one re-dispatch on Opus. The cost of running Opus on a task that needed Sonnet is real Max-sub depletion that bites you mid-session.

---

## Provenance

- **Locked 2026-04-26 by Shinkami** under Frank's autonomous-execution mandate, in response to the prior session's pattern of burning Opus on Haiku- and Sonnet-class work during the Las Tierras council passes.
- **Source memories:** `feedback_arcanea_flow_usage`, `feedback_ops_workflow`, `feedback_quality_standard`.
- **Source files:** `AGENTS.md` (Execution Law), `CLAUDE.md` (resource constraints), `docs/ops/HANDOVER-2026-04-26-las-tierras-council-elevation.md` (Priority 4 rationale).
- **Living document.** Update on each new model release. Update when external CLI surfaces (Gemini, Codex, OpenCode) change capability.
- **Cross-reference from `AGENTS.md` Execution Law section will be added in this same session's commit.**
