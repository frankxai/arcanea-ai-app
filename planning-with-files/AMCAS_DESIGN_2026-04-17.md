# Arcanea Multi-Coding Agent System (AMCAS) — Design Spec

**Date:** 2026-04-17
**Author:** Frank (via Council + Lumina synthesis)
**Status:** Approved to begin Phase 1
**Depends on:** `@arcanea/router-spec` (shipped 2026-04-17)

---

## 1. Vision

AMCAS is the layer that turns your 11 coding-adjacent repos into one composing system. It does not replace any CLI. It does not fork another TUI. It is the **router + overlay + dispatcher** that makes every existing coding agent smarter, and makes them interoperable under one declared routing policy.

The intent is for Arcanea to own the canonical answer to: _"I have Claude Max + OpenCode Zen + Codex + Gemini. How do I use all of them, correctly, at the lowest cost and highest intelligence, without thinking about it?"_

## 2. Strategic position

Nobody ships this today. Composio AO is claude-code only. Kilo Code forked OpenCode but stayed inside OpenCode. aider is single-model. This is the gap:

- **cross-CLI router** driven by a single YAML spec
- **per-CLI overlays** that teach each CLI Arcanea standards (canon, voice, design tokens)
- **swarm mode** via a real dashboard, not an invention
- **sub-economics** — Claude Max sub funds the heavy work, free Zen pool funds bulk

## 3. Architecture

```
   YOU (terminal-first, desktop-optional)
    │
    ▼
┌───────────────────────────────────────────────────────┐
│  @arcanea/arcanea-code  (thin dispatcher, ~500 LOC)    │
│                                                       │
│  Reads:  @arcanea/router-spec/models.yaml             │
│  Picks:  model per task-class + auth tier             │
│  Execs:  claude -p | opencode -p | codex -p | gemini  │
│  Swarms: delegates to `ao` (Composio orchestrator)    │
└─────────────┬─────────────────────────────────────────┘
              │
   ┌──────────┼──────────┬────────────┬──────────────┐
   ▼          ▼          ▼            ▼              ▼
claude -p  opencode   codex -p    gemini -p       ao CLI
+ claude-  + oh-my-   + codex-    + gemini-       (swarm,
  arcanea    arcanea    arcanea     arcanea        worktrees,
  overlay    overlay    overlay     overlay        dashboard)

   ↑ all overlays read the SAME @arcanea/router-spec ↑
   ↑ installed by claude-codex-gemini-opencode-settings/install.sh ↑
```

## 4. Repo roles (authoritative — no new repos needed)

| Repo / Package | Role | Phase |
|---|---|---|
| `packages/router-spec` | Source of truth | ✅ done |
| `packages/arcanea-code` (new, in monorepo) | Dispatcher CLI | **Phase 1a** |
| `frankxai/arcanea-code` (existing GH repo) | Standalone publish target | Phase 1b |
| `frankxai/oh-my-arcanea` | OpenCode overlay | Phase 2 |
| `frankxai/claude-arcanea` | Claude Code overlay | Phase 2 |
| `frankxai/codex-arcanea` | Codex overlay (stale) | Phase 2 |
| `frankxai/gemini-arcanea` | Gemini overlay (stale) | Phase 2 |
| `frankxai/claude-codex-gemini-opencode-settings` | Install pipeline | Phase 2 |
| `frankxai/arcanea-orchestrator` | Swarm + dashboard | Phase 3 |
| `frankxai/arcanea-flow` | In-session workflow engine | separate axis |
| `frankxai/arcanea-opencode` | (superseded by oh-my-arcanea) | archive in Phase 2 |
| `frankxai/arcanea-openclaw` | older spike | review in Phase 2 |

## 5. User flows

### A. Ambient (default, zero friction)
Any CLI you open — Claude Code, OpenCode, codex, gemini — already has the Arcanea overlay installed. You get canon-aware agents, consistent design tokens, shared skills, common quality gates. No new muscle memory.

### B. Dispatch (when you want the right model, not the one happened-to-open)
```bash
arcanea-code run --task world.canon "write the Forge of Ruin chapter 5"
# → router-spec picks claude-opus-4-7
# → execs: claude -p "..."
# → output streams to stdout
```

### C. Swarm (parallel, dashboard)
```bash
arcanea-code swarm --from planning-with-files/CURRENT_BACKLOG_2026-04-13.md
# → parses backlog items, classifies each by task
# → delegates to `ao spawn` with N workers in worktrees
# → opens http://localhost:4200
```

### D. Desktop (optional, Phase 4, RAM-gated)
`apps/web/app/ops/agents` — aggregates `ao` sessions + open CC tabs + worktrees + PR queue. Refuses to load if MemFree < 3 GB.

## 6. Success criteria

1. Editing `packages/router-spec/models.yaml` changes behavior in claude-code, opencode, codex, gemini with **zero manual reconfig**.
2. `arcanea-code run "<task>"` returns valid output in <30 s for a typical task.
3. Full system functional in an SSH-only session.
4. Dispatcher resident memory <50 MB (doesn't compete with CC tabs).
5. `arcanea-code swarm` spawns N workers with zero branch conflicts (worktree-isolated).
6. Heavy reasoning routes to `claude -p` by default (Max sub amortizes).
7. New-machine onboarding in <30 min: `install.sh` → all 4 CLIs + overlays wired.

## 7. Key technical decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Language | TypeScript | Matches pnpm monorepo, ships via npm |
| Sub-CLI mode | `-p` headless | Uses provider CLI auth → sub-aware |
| Spec format | YAML | Human-editable, comment-preserving |
| New TUI | No | OpenCode + Claude Code suffice today |
| Session continuity | `--continue <id>` + `~/.arcanea/sessions.json` cache | Sub-CLIs support it |
| RAM guard | Refuses swarm if MemFree <2 GB | Per CLAUDE.md discipline |
| Approach | Option B+C merged | Thin dispatcher (B) + OpenCode kept as a backend (C). Later: fork OpenCode if own TUI becomes worth it (Kilo-style). |

## 8. Phased build (14–20 hrs total)

| Phase | Scope | Est. | Ship target |
|---|---|---|---|
| 0 | Router Spec | ✅ | shipped today |
| 1a | Dispatcher in monorepo (`packages/arcanea-code`) | 3 h | PR this session |
| 1b | Port to standalone GH repo, npm publish | 1 h | follow-up |
| 2 | Overlay convergence (4 overlays read router-spec) + `install.sh` pulls it | 6 h | next session |
| 3 | `arcanea-code swarm` wraps `ao spawn` | 3 h | follow-up |
| 4 | `/ops/agents` web dashboard (optional) | 4 h | optional |

## 9. Phase 1a scope (this session)

**Package:** `packages/arcanea-code`
**Dependencies:** `@arcanea/router-spec` (workspace), `commander`, `yaml`, `execa`
**LOC target:** ~500

**Commands shipped:**

- `arcanea-code list-models` — print catalog from router-spec
- `arcanea-code list-tasks` — print task classes
- `arcanea-code explain <task>` — show candidate chain for a task-class across surfaces
- `arcanea-code run --task <id> "<prompt>"` — execute via chosen CLI (`claude -p`, `opencode run -p`, `codex -p`, `gemini -p`)
- `arcanea-code swarm` — stub that prints planned dispatch + instructs to finish Phase 3

**Out of scope for 1a:** session continuity wiring, swarm execution, overlay sync, web dashboard.

## 10. Risks + mitigations

| Risk | Mitigation |
|---|---|
| `claude -p` doesn't actually use Max sub | Verify in Phase 1a smoke test. If false, `--model` flag exposes BYOK fallback. |
| Sub-CLI invocation too slow for interactive use | Dispatcher is batch-first, not interactive. `run` is designed for scripting. |
| Router-spec drift between `packages/` source and published `frankxai/*` overlays | Phase 2 wires each overlay to pull `@arcanea/router-spec` as a dep. |
| Claude Code `-p` and opencode `-p` have incompatible stdin/stdout patterns | Dispatcher normalizes — small per-runtime adapter in `src/runtimes.ts`. |
| Scope creep into Phase 2 during Phase 1a | Locked in Section 9 — anything beyond is explicitly deferred. |

## 11. Non-goals

- No new TUI (OpenCode + Claude Code are enough for now).
- No replacement for Composio AO — we integrate, not replace.
- No rewrite of `arcanea-flow` — different layer (in-session workflow, not cross-CLI dispatch).
- No rewrite of existing overlays — Phase 2 teaches them to read router-spec; it doesn't replace them.
- Not a chat product. This is engineering-agent infrastructure.

## 12. Self-review

- No TBDs or placeholders.
- Phases independently shippable (Phase 1a has standalone value).
- Doesn't contradict prior CLAUDE.md rules (RAM discipline, no co-author contamination, verify-before-cite).
- Scope bounded: does not touch author-os, peak-performance, NFT forge.
- `claude -p` Max sub assumption is flagged as risk + verified in Phase 1a smoke test.
- Option B+C merge is explicit — no ambiguity on approach.

---

**Approval gate:** Frank approved in-session 2026-04-17. Starting Phase 1a immediately.
