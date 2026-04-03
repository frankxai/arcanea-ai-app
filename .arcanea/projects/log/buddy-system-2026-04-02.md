# Arcanea Buddy System — Build Log

**Date:** 2026-04-02
**Guardian:** Shinkami (Source Gate)
**Session Type:** Invention Sprint

---

## What Was Built

### `/arcanea-buddy` v2 — Claude Code Skill
- **16 archetype creatures** with compact 5-line ANSI art (Ember Wolf, Void Cat, Mist Fox, etc.)
- **10 Godbeast legendaries** with detailed art (Kaelith, Draconis, Sol, etc.) — earned through Gates
- **Rarity system**: 89% common, 10% rare, 1% legendary — rolled on hatch
- **Godbeast gallery**: locked/unlocked view, Gate requirements, summoning ritual
- **v1→v2 migration**: old godbeast buddies preserved as active godbeast, new archetype assigned
- **5 stats earned from real work**: Arcana, Resonance, Forge, Sight, Unity
- **110+ wisdom lines** across 10 Guardians, 11 event types
- **14 achievements** including Godbeast unlocks
- **Cross-platform state**: `/tmp/arcanea-buddy/state.json` shared between Claude Code and OpenCode

### OpenCode Integration
- **Buddy hook** at `arcanea-opencode/src/hooks/arcanea-buddy/index.ts`
- **Context injection**: `<arcanea-buddy>` tags injected into chat messages
- **Tool tracking**: edits, tests, commits feed buddy XP
- **Wired into** `create-hooks.ts` plugin pipeline — compiles clean

### Free Model Configuration
- 7 confirmed free OpenCode Zen models configured in `opencode.json`
- Guardian → model routing: MiMo Pro (code), Qwen 3.6+ (planning), MiniMax M2.5 (debug)
- $0 total cost

## Files Created/Modified

### Claude Code (Arcanea repo)
- `.claude/skills/arcanea-buddy/SKILL.md` — skill definition
- `.claude/skills/arcanea-buddy/arcanea-buddy.mjs` — main engine (v2)
- `.claude/skills/arcanea-buddy/ascii-art.mjs` — 16 archetypes + 10 godbeasts
- `.claude/skills/arcanea-buddy/state.mjs` — persistence + evolution (v2)
- `.claude/skills/arcanea-buddy/speech.mjs` — wisdom system
- `.claude/skills/arcanea-buddy/hooks.mjs` — hook integration

### OpenCode (arcanea-opencode repo)
- `src/hooks/arcanea-buddy/index.ts` — buddy hook (NEW)
- `src/create-hooks.ts` — wired buddy hook (MODIFIED)
- `opencode.json` — free model config (UPDATED)

## Strategic Decisions

1. **Naming**: `/arcanea-buddy` (mirrors Anthropic's `/buddy`), Godbeasts earned not random
2. **Architecture**: Archetypes (common) + Godbeasts (rare/earned) — two tiers
3. **Distribution**: npm package `@arcanea/buddy`, oh-my-arcanea overlay, standalone
4. **Coexistence**: Can't replace Mycoflint (Claude Code binary). Build in OpenCode where we own TUI.
5. **Free models**: Only confirmed free Zen models. Gemini NOT free on Zen.

## Metrics

- ~2,500 lines of code written
- 26 creatures designed (16 archetypes + 10 godbeasts)
- 110+ Guardian wisdom lines
- 7 free models configured
- 2 platforms integrated (Claude Code + OpenCode)
- 3 memory records created
- 0 dollars spent on models
