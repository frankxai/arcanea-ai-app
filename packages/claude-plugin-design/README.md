# @arcanea/claude-plugin-design

Arcanea design intelligence bundle for Claude Code. Ship production-grade UI using Arcanea tokens, brand kits, and the MCP-driven generation stack (Magic, v0, Fal, Gemini, Replicate).

## What's inside

| Path | Purpose |
|---|---|
| `skill/SKILL.md` | `arcanea-frontend-excellence` skill — the execution workflow |
| `mcp/mcp.example.json` | MCP server recipe for design work |
| `agents/` | 5 design agent personas (Architect, Generator, Motion, Imagery, Verifier) |
| `tokens/tokens.css` | Framework-agnostic CSS vars (mirror of `@arcanea/design-system`) |
| `install.md` | How to symlink into `.claude/plugins/arcanea-design/` |

## Install (manual, today)

```bash
# From repo root
ln -s "$(pwd)/packages/claude-plugin-design" ~/.claude/plugins/arcanea-design

# Or on Windows (PowerShell, admin)
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\plugins\arcanea-design" -Target "$PWD\packages\claude-plugin-design"
```

Then restart Claude Code. The skill and agents become available.

## Required MCPs

Set these env vars (via `setx` on Windows) before Claude Code launch:

- `TWENTYFIRST_API_KEY` — 21st.dev Magic
- `V0_API_KEY` — Vercel v0
- `FAL_KEY` — Fal.ai
- `GEMINI_API_KEY` — Google Gemini / NB2
- `REPLICATE_API_TOKEN` — Replicate (Frank's fine-tuned models + Wan)

See `mcp/mcp.example.json` for the full `.mcp.json` entry.

## Scope

This plugin assumes you consume `@arcanea/design-system` (via npm workspace or published package). If you don't, install tokens directly from `tokens/tokens.css`.

## Future

When the Claude marketplace exists, this package publishes there. Until then, symlink install is the pattern.

## Status

Phase 5 deliverable per `planning-with-files/DESIGN_SYSTEM_ROLLOUT_2026-04-18.md`. Scaffold v0.1.0 — skill + agents + MCP recipe + tokens. Battle-tested patterns flow in from Phase 2–3 work first.
