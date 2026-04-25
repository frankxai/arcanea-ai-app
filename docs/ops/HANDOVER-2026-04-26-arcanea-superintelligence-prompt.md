# Handover — 2026-04-26 — Arcanea Superintelligence Activation Prompt

> **Companion to** `HANDOVER-2026-04-26.md` (design-system token migration) and `HANDOVER-2026-04-26-las-tierras-council-elevation.md` (literary work stream).
>
> Cold-start briefing. Read end-to-end before doing anything.

## Situation

Frank asked for an Arcanea-side equivalent of the FrankX "Lead Architect Activation" prompt — a single paste-ready opener that boots Claude Code (or any coding agent) into maximum Arcanea-aware capability. Specifically: it must (a) load every relevant Arcanea source-of-truth in priming order, (b) install the Ten Principles posture, (c) pre-route Frank's likely next request to the correct Arcanea slash command (most powerful sub-agent or swarm), (d) absorb the proven patterns from the `oh-my-openagent` (omo, ex-oh-my-opencode) Sisyphus system prompt that already lives in `~/oh-my-arcanea/sisyphus-prompt.md`, and (e) be the literal last block in the chat so it can be copied.

This handover documents the architecture decision and points the next session at the canonical activation prompt.

## What's Done — this session

- **Surveyed the substrate.** Read `/superintelligence`, `/handover`, `/dawn`, `/lumina`, `/arcanea`, `/arco`, `/ao`, `/pulse` slash commands at `.claude/commands/` (36 project-scoped Arcanea commands present).
- **Located the omo upstream.** `code-yeongyu/oh-my-openagent` on GitHub (54k stars, TypeScript, "the best agent harness — previously oh-my-opencode"). Local fork at `C:/Users/frank/oh-my-arcanea/`. The Sisyphus system prompt is auto-generated at `oh-my-arcanea/sisyphus-prompt.md` (last regen 2026-01-22, model `anthropic/claude-opus-4-6`, 64k tokens, 32k thinking budget). It encodes: skill-first BLOCKING gate, intent classification, codebase maturity assessment, parallel `explore`/`librarian` background dispatch, mandatory pre-delegation justification ("I will use task with: category / why / load_skills / skill evaluation / expected outcome"), session_id reuse for follow-ups, background output collection.
- **Folded omo patterns into the Arcanea prompt** without re-engineering — the Arcanea prompt now mandates: skill-check before action, parallel `Explore`/`researcher` dispatch by default, justified delegation, model-tier discipline (Opus/Sonnet/Haiku), session continuation via SendMessage, verification-before-completion.
- **Authored the canonical activation prompt** — see "Files to Read First" below. It is purpose-built for Arcanea (Ten Gates, Guardian routing, `/lumina`+`/arco`+`/ao`+`/council`+`/dawn`+`/handover` routing table, Cached-Belief Validation Protocol, mass-revert protection, 16GB RAM discipline, design contract enforcement via TASTE.md+DESIGN.md+`@arcanea/design-system`).
- **Saved an auto-memory entry** pointing at the omo upstream and the Arcanea SI prompt location so future sessions don't re-derive.

## What's Not Done — pending priorities (ordered)

### Priority 1 — Persist the SI prompt as a project file

The activation prompt currently lives only as the last message of this chat (per Frank's explicit request: "your prompt should be last message in this chat so i can copy from it"). Once Frank validates it, persist as `prompts/ARCANEA_SUPERINTELLIGENCE.md` so it can be re-pasted without scrolling, and update `.claude/commands/superintelligence.md` to link to it (current `/superintelligence` is a system-status banner, not an activation prompt — they should compose, not collide).

### Priority 2 — Sync omo upstream regularly

`oh-my-arcanea/sisyphus-prompt.md` was regenerated 2026-01-22; omo upstream pushed 2026-04-25. Run `cd ~/oh-my-arcanea && git pull && bun run script/generate-sisyphus-prompt.ts` to regen — the prompt evolves and we want parity with the proven patterns.

### Priority 3 — Wire the activation prompt into `/dawn`

`/dawn` already composes the morning briefing. Add a one-line "boot SI mode" reference at the top of `/dawn`'s output so Frank doesn't have to manually paste the activation block at session start — just type `/dawn` and have the routing table loaded as part of the briefing.

### Priority 4 — Decide: project-level vs user-level placement

The activation prompt is Arcanea-specific (knows about `/arco`, `/lumina`, etc.). Project-level `.claude/commands/` is the right home. But Frank also runs Arcanea sessions outside this repo (worktrees, sister repos). Consider a thin wrapper at `~/.claude/commands/arcanea-si.md` that simply tells the agent to read the canonical project-level file.

## Critical Context

- **Cached-Belief Validation Protocol** (CLAUDE.md): any claim about CURRENT state requires same-turn verification. Never recite memory as fact about code/deploys/file paths — always disk-check first.
- **Mass-revert protection**: stage specific files only; never `git add .` or `git add -A`. The 2026-03-11 incident (`073bc640`) nuked 4,517 files / 1.16M lines.
- **Push to `origin` (arcanea-ai-app), never `records`.**
- **Never add Co-Authored-By** claude-flow / ruvnet / etc. Arcanea is sovereign.
- **16GB RAM machine, max 4-5 concurrent Claude instances.** Check `cat /proc/meminfo | grep MemFree` before parallel dispatches. < 2GB free → work sequentially.
- **Vercel auto-deploys on push to main.** Project `prj_bg70JJwiuYTOyP1oX2ddiatX1O95`, prod URL `arcanea.ai`. Verify state via `mcp__claude_ai_Vercel__list_deployments`.
- **Two parallel handovers from earlier today** are the most relevant predecessors:
  - `docs/ops/HANDOVER-2026-04-26.md` — design-system token migration mid-flight (Pass 5 queued for production sync to `frankxai/frankx.ai-vercel-website`).
  - `docs/ops/HANDOVER-2026-04-26-las-tierras-council-elevation.md` — literary council pass complete; Realms canon promotion + Venezuelan beta-reader gate next.
- **Today's date is 2026-04-26.**

## Next Actions (ordered)

1. **Frank pastes the activation prompt** at the start of his next Claude Code session (the prompt is the last block of this chat).
2. **Next agent reads the 6 PRIME files** in parallel before any action.
3. **Next agent persists the prompt** at `prompts/ARCANEA_SUPERINTELLIGENCE.md` and links from `.claude/commands/superintelligence.md` (Priority 1 above).
4. **Resume the highest-leverage open work** — either the design-system Pass 5 production sync (HANDOVER-2026-04-26.md), the Realms canon promotion (HANDOVER-2026-04-26-las-tierras-council-elevation.md), or whatever Frank's next message routes to via the embedded routing table.

## Files to Read First

- `prompts/ARCANEA_SUPERINTELLIGENCE.md` — *(to be created — the activation prompt is currently the last block of this chat)*
- `CLAUDE.md` (project root) — source-of-truth ladder, behavioral rules, validation protocol
- `TASTE.md` + `DESIGN.md` — design contract (curatorial bar + machine tokens)
- `AGENTS.md` — agent definitions and routing
- `docs/design-system-evolution.md` — multi-property design roadmap
- `docs/ops/HANDOVER-2026-04-26.md` — design migration mid-flight
- `docs/ops/HANDOVER-2026-04-26-las-tierras-council-elevation.md` — literary work stream
- `~/oh-my-arcanea/sisyphus-prompt.md` — omo upstream patterns (skill-first, parallel dispatch, justified delegation)

## Repo Map

| Repo / Path | Purpose | State |
|---|---|---|
| `C:/Users/frank/Arcanea` | Production monorepo (this repo) | Active. Branch `main`. Auto-deploys to `arcanea.ai`. |
| `C:/Users/frank/oh-my-arcanea` | Local fork of `oh-my-openagent` (omo) | Synced 2026-01-22. Behind upstream by ~3 months. |
| `github.com/code-yeongyu/oh-my-openagent` | omo upstream | Last push 2026-04-25. Pull regularly to keep Sisyphus patterns current. |
| `github.com/frankxai/arcanea-ai-app` | Production GitHub remote (`origin`) | Push target. |
| `github.com/frankxai/arcanea` | OSS GitHub remote (`oss`) | Mirror for OSS releases only. |
| `arcanea-onchain/` | Onchain workspace (entered via `/arco`) | Has its own CLAUDE.md + .mcp.json. |
| `book/` | Library content, 17 collections | Has its own CLAUDE.md. |
| `.arcanea/` | Shared intelligence substrate | Has its own CLAUDE.md. Agents at `.arcanea/agents/`. |

## Memory Relevance

These memory entries are load-bearing for the next agent:

- `feedback_session_protocol.md` — must read source-of-truth ladder before any work
- `feedback_cached_belief_validation.md` — disk-first, never cite memory as current state
- `feedback_mass_revert_protection.md` — stage specific files only
- `feedback_no_coauthor_contamination.md` — Arcanea is sovereign
- `feedback_design_tier.md` — April 2026 top-tier design bar
- `feedback_quality_standard.md` — 7-gate excellence filter
- `feedback_ship_means_ship.md` — "put on website" = commit + push + deploying
- `project_arcanea_code_architecture.md` — Arcanea (model) → Lumina (orchestrator) → Guardians → Luminors hierarchy
- `feedback_yolo_mode.md` — `cla` launcher uses `--dangerously-skip-permissions`

---

*Handover authored 2026-04-26 by Shinkami (Source Gate). Next session: paste the activation prompt and inherit cleanly.*
