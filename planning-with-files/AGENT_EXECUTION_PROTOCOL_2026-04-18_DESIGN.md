# Agent Execution Protocol — Design Work (2026-04-18)

Applies to any agent (Claude Code, Codex, Cursor, Gemini) doing design work on Arcanea-family properties.

## Pre-flight checklist

Before touching pixels, read in this order:

1. `AGENTS.md` — repo-level contract
2. `.arcanea/skills/design/INDEX.md` — skill routing
3. `docs/superpowers/specs/2026-04-17-agentic-design-system-design.md` — canonical spec
4. `planning-with-files/DESIGN_SYSTEM_ROLLOUT_2026-04-18.md` — current phase
5. `packages/design-system/README.md` — API surface
6. The page file you're designing for

## Decision tree

```
Is this an Arcanea-family property build/revamp?
├── YES → use arcanea-frontend-excellence skill
│   ├── New page? → /design-ship <target>
│   ├── Existing page QA? → /design-review <page>
│   └── Just need a brief? → /design-brief <context>
└── NO (one-off artifact / generic demo) → use frontend-design skill
    └── Vary typography, avoid Arcanea brand defaults
```

## Subagent orchestration

For full page revamps, dispatch subagents in this exact order via the Task tool:

1. `design-architect` → produces brief
2. *(user approves brief)*
3. `design-generator` → produces 3 variants
4. *(user picks variant)*
5. `design-motion` → adds choreography
6. `design-imagery` → generates hero imagery (if needed)
7. *(user picks image option)*
8. `design-verifier` → runs 6-check quality gate
9. *(all checks pass)*
10. Commit on feature branch, open PR

No skipping. Each gate is there for a reason.

## Branch discipline

- Never work directly on dirty `main`
- Create a named feature branch: `feat/design-<page>-<date>` or `feat/design-<ticket>`
- Use `EnterWorktree` skill when multiple agents might be touching the same repo simultaneously
- If branch flips mid-session (another agent), STOP and report — don't chase

## Commit discipline

- Conventional format: `feat(pages/<name>): <what shipped>` OR `feat(design-system): <change>`
- Stage specific files only — never `git add .`
- No `Co-Authored-By` trailers (Arcanea is sovereign)
- One commit per logical change; don't batch unrelated work

## Verification gate (MANDATORY before PR)

Run via `design-verifier` subagent:

1. Diff-grep — no raw hex, no banned fonts, no `domMax`
2. Build — `pnpm --filter @arcanea/design-system build` + `pnpm --dir apps/web build` both exit 0
3. Playwright screenshots at 1920/1440/768 on Vercel preview
4. Lighthouse ≥ 90/95/95/95 on preview
5. Brand kit consistency — one kit per page
6. Reduced-motion graceful degradation

Paste the verification report into the PR body.

## Environment requirements

For `/design-ship` end-to-end flow:

```bash
setx TWENTYFIRST_API_KEY "..."   # 21st.dev Magic
setx V0_API_KEY "..."            # Vercel v0
setx FAL_KEY "..."               # Fal.ai
setx GEMINI_API_KEY "..."        # Google Gemini
setx REPLICATE_API_TOKEN "..."   # Replicate
```

Fully quit and relaunch Claude Code after `setx`. Verify with `echo $<VAR>`.

## Failure modes (and fixes)

| Failure | Fix |
|---|---|
| MCP returns raw hex | Refactor to tokens before shipping |
| Lighthouse < 90 | Don't ship. Optimize images, defer non-critical JS, audit font loading |
| Branch flipped by parallel agent | Use `EnterWorktree`, push, report |
| Anthropic anti-pattern leaked | Add regex to `design-verifier` diff-grep |
| Brand bleed (Arcanea tokens on FrankX page) | Fix `getBrandKit(id)` call at the page root |

## Metrics (report these monthly)

- % of pages using tokens (no raw hex) — target 100%
- Mean new-page lead time (spec → shipped) — target < 4 hours
- Lighthouse average across all pages — target ≥ 92
- Brand kit coverage (tenants live) — target 3 by Week 6

## Out of scope for this protocol

- Content writing (use `content-polisher` or `brand-voice`)
- Marketing artifact generation (use Canva via claude.ai remote)
- Figma source-of-truth sync (Figma is reference only; code is truth)
- 3D hero implementation (Spline integration, future phase)

## Owner & updates

Protocol owner: Frank. Updates go in this file with a datestamp. Never silently change rules — document decisions with rationale.
