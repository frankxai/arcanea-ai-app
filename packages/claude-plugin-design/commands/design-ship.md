---
description: Full end-to-end page revamp — orchestrates architect → generator → motion → imagery → verifier. Ships the result to the target file with a conventional commit.
---

# /design-ship

End-to-end page revamp using the full Arcanea design stack. Takes a brief (or generates one), runs all 5 design subagents in sequence, and ships the final result with a PR-ready commit.

## Input

User arguments: `$ARGUMENTS`

Expected format: target file path + optional inline brief. Examples:
- `/design-ship apps/web/app/page.tsx — homepage hero, editorial aesthetic`
- `/design-ship /pricing — revamp using NumberTicker for pricing reveals`

## Required environment

All 5 MCPs need API keys in Windows env (via `setx`):
- `TWENTYFIRST_API_KEY` (Magic)
- `V0_API_KEY` (v0)
- `FAL_KEY` (Fal)
- `GEMINI_API_KEY` (Gemini)
- `REPLICATE_API_TOKEN` (Replicate)

Plus `playwright` MCP for verification. If any missing, stop and report.

## Workflow

1. **Architect** — dispatch `design-architect` to produce the brief. User reviews and locks.
2. **Generate** — dispatch `design-generator` to produce 3 variants. User picks one.
3. **Motion** — dispatch `design-motion` to choreograph one hero moment + supporting motion.
4. **Imagery** — dispatch `design-imagery` if hero/section imagery is required. User picks from 3 options.
5. **Verify** — dispatch `design-verifier` against Vercel preview. BLOCK if any check fails.
6. **Commit** — narrow conventional commit on a feature branch. Never `git add .`. Never Co-Authored-By trailers.
7. **Open PR** — via `gh pr create` with verification report in the body.

Target: 4 hours spec-to-shipped on a single page.

## Rules

- Each subagent's output gates the next — no skipping steps
- User approval gates steps 1, 2, and 4 (brief, variant pick, imagery pick)
- Verification is MANDATORY before commit — no skip
- Commit message: `feat(pages/<name>): <what shipped>`

## Output

PR URL + verification report.
