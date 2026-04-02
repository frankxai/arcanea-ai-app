# @arcanea/buddy — npm Package Spec

## Quick Reference
- **Package**: `@arcanea/buddy` v0.1.0
- **Location**: `packages/arcanea-buddy/`
- **License**: MIT
- **Dependencies**: Zero (pure Node.js ESM)
- **Entry**: `npx @arcanea/buddy <command>`

## Directory Layout
```
packages/arcanea-buddy/
  package.json
  bin/arcanea-buddy.mjs         # CLI entry point
  src/
    arcanea-buddy.mjs           # Main engine
    ascii-art.mjs               # 16 archetypes + 10 godbeasts
    speech.mjs                  # Wisdom system
    state.mjs                   # Persistence (fix: use os.tmpdir())
    hooks.mjs                   # Hook integration (fix: async onSessionStart)
    init.mjs                    # NEW: env detection + scaffolding
    templates/
      SKILL.md                  # Claude Code skill template
      opencode-hook.mjs         # OpenCode hook template
      opencode-config.json      # opencode.json merge fragment
```

## Commands
```
npx @arcanea/buddy init        # Detect Claude Code / OpenCode, scaffold
npx @arcanea/buddy hatch       # Hatch companion
npx @arcanea/buddy card        # Full stat card
npx @arcanea/buddy godbeast    # Divine gallery
npx @arcanea/buddy pet/speak/evolve/stats/export/list
```

## Bugs to Fix Before Publish
1. `state.mjs`: Replace `/tmp/arcanea-buddy` with `path.join(os.tmpdir(), 'arcanea-buddy')`
2. `hooks.mjs`: Make `onSessionStart` async

## Build Order
1. Scaffold directory + package.json (5m)
2. Copy 5 .mjs files from skill (5m)
3. Fix cross-platform state path (5m)
4. Fix hooks async bug (5m)
5. Write init.mjs with env detection (20m)
6. Create templates (15m)
7. Smoke test on Windows (15m)
8. npm publish --access public (5m)

**Total: ~75 minutes focused work**
