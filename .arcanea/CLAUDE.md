# Arcanea Shared Intelligence Hub

This directory is the **tool-agnostic brain** of the Arcanea ecosystem. Any AI coding tool (Claude Code, Cursor, Codex, Gemini, arcanea-code) reads from here.

## Directory Map

| Path | Purpose |
|------|---------|
| `lore/CANON_LOCKED.md` | Immutable mythology reference |
| `lore/godbeasts/` | 10 Godbeast profiles |
| `lore/gods-goddesses/` | 10 God/Goddess profiles |
| `lore/guardians/` | Guardian system (staging/production) |
| `config/models.yaml` | Adaptive model routing per tool |
| `config/voice.yaml` | Writing voice and tone rules |
| `config/design-tokens.yaml` | Portable design system tokens |
| `skills/` | Creative and universe knowledge skills |
| `agents/` | Guardian and department agent profiles |
| `installer/manifest.yaml` | Multi-tool installation registry |
| `config.json` | Workspace repository registry |

## Architecture Principle

`.arcanea/` = shared knowledge (brain). Tool-specific directories = execution (hands).

- `.claude/` — Claude Code hooks, commands, orchestration
- `.cursorrules` — Cursor thin pointer
- `.codex/` — Codex thin pointer
- `.gemini/` — Gemini thin pointer

## CRITICAL: WSL2 Storage Reality

**WSL2 does NOT have independent storage.** The VHDX file lives on `C:\`. `df -h /` inside WSL reports virtual disk capacity — this is misleading. Real available space = C: drive free space (check with `df -h /mnt/c/`).

- C: must stay above 5 GB free or WSL writes fail (EIO errors, git corruption, build breaks)
- Never report "WSL has Xn GB free" as independent from Windows disk space
- All agents (Claude Code, opencode, Cursor, Codex) must apply this constraint when estimating storage

## For Project-Level Instructions

See the root `CLAUDE.md` and `.claude/CLAUDE.md` for project instructions, tech stack, and development workflow.
