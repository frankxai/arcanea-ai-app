# Arcanea Harness Consolidation Plan

**Date**: 2026-03-27
**Status**: PROPOSED
**Decision**: Consolidate into `oh-my-arcanea` as the canonical harness

---

## 1. Comparison Summary

| Dimension | oh-my-arcanea | arcanea-opencode |
|-----------|--------------|------------------|
| **Package name** | `oh-my-arcanea` | `arcanea-opencode` |
| **Version** | 4.0.0 | 3.14.0 |
| **CLI binaries** | `oh-my-arcanea`, `opencode-arcanea` | `arcanea-opencode` |
| **Upstream fork** | oh-my-opencode | oh-my-opencode (same) |
| **Upstream version** | ~v3.14+ (partial sync) | v3.14.0 (just synced 2026-03-27) |
| **Default branch** | `dev` | `main` (currently on `merge-upstream-20260327`) |
| **Total TS files** | 1,227 | 1,487 |
| **Arcanea overlay path** | `src/arcanea/` (5 files, 761 LOC) | `src/agents/arcanea/` (2 files + CLAUDE.md, 1,592 LOC) |
| **Overlay architecture** | Modular: guardians, hooks, statusline, luminor-swarm, index | Monolithic: index.ts (1,278 LOC) + orchestrator (314 LOC) |
| **Guardian routing** | Full Ten Gates with file-pattern + keyword detection | None (no Guardian routing) |
| **Luminor swarm types** | Complete: 3 patterns, coordination plans, phase deps | None |
| **Statusline** | Full ANSI-colored with element glyphs, roster display | None |
| **Session hooks** | Guardian activation, context injection, session banners | None |
| **Agent definitions** | None (types only, delegates to orchestrator) | 17 full agent factories (Architect, Coder, Reviewer, Debugger, Story Master, Character Crafter, World Expander, Lore Master, etc.) |
| **Orchestrator** | None (references external arcanea-orchestrator) | Full orchestrator with Seven Wisdoms, magic words, agent teams |
| **npm published** | No | No |
| **Naming convention** | `oh-my-arcanea` (oh-my-* pattern) | `arcanea-opencode` (arcanea-* = product name) |

---

## 2. Analysis

### Guardian Routing: oh-my-arcanea wins
oh-my-arcanea has the complete Ten Gates Guardian system with:
- File-pattern glob matching per Guardian
- Keyword detection for task descriptions
- Proper `Guardian` type with all canonical fields (gate, element, frequency, godbeast, domain, motto)
- Utility functions: `detectGuardianForFile()`, `detectGuardianForTask()`, `getGuardianByGate()`, `getGuardianByName()`

arcanea-opencode has zero Guardian routing.

### Luminor Swarm Support: oh-my-arcanea wins
oh-my-arcanea has complete swarm type definitions:
- `Luminor` type with guardian binding, role, priority
- 3 swarm patterns: `element-focus`, `gate-progression`, `council`
- `buildCoordinationPlan()` with phase dependencies
- 40-Luminor roster generation (4 roles x 10 Guardians)

arcanea-opencode has zero swarm support.

### Statusline: oh-my-arcanea wins
oh-my-arcanea has:
- ANSI color mapping for all 10 elements
- Unicode glyphs per element
- `formatGuardianStatus()`, `formatGuardianRoster()`
- Motto and frequency segments

arcanea-opencode has zero statusline.

### Agent Definitions: arcanea-opencode wins
arcanea-opencode has 17 fully-specified agent factories with rich prompts:
- Development Team: Architect, Coder, Reviewer, Debugger
- Creative Team: Story Master, Character Crafter, World Expander, Lore Master
- Writing Team: Prose Weaver, Voice Alchemist, Line Editor, Continuity Guardian
- Research Team: Sage, Archivist, Scout, Muse
- Plus the master Orchestrator with Seven Wisdoms framework and magic words

oh-my-arcanea has types only, no agent implementations.

### Upstream Sync: arcanea-opencode wins
arcanea-opencode was just synced with upstream on 2026-03-27 and has 1,487 TS files (more recent upstream features). oh-my-arcanea appears to be on an older fork point with 1,227 TS files.

### Naming Convention: oh-my-arcanea wins
Per project memory: `*-arcanea = harness overlay`. The `oh-my-arcanea` name follows the oh-my-* naming pattern of the upstream (oh-my-opencode), and the `opencode-arcanea` binary alias follows the `*-arcanea` convention. `arcanea-opencode` uses the `arcanea-*` prefix which is reserved for Arcanea products, not harness overlays.

### Code Quality: oh-my-arcanea wins
oh-my-arcanea's overlay is cleanly modular (5 focused files, each under 300 LOC). arcanea-opencode packs 1,278 LOC into a single index.ts with 17 agent factories all in one file.

---

## 3. Recommendation

**Canonical harness: `oh-my-arcanea`** (frankxai/oh-my-arcanea)

Reasoning:
1. **Better architecture** -- Modular overlay with clean separation of concerns (guardians, hooks, statusline, swarm)
2. **Guardian routing** -- The core differentiator of Arcanea's Ten Gates system, fully implemented
3. **Luminor swarm types** -- Critical for multi-agent coordination, only exists here
4. **Statusline** -- Terminal UX that makes the Arcanea overlay visible and delightful
5. **Correct naming** -- Follows `*-arcanea` convention for harness overlays
6. **Higher version** -- v4.0.0 indicates intentional major release

---

## 4. Migration Plan

### Phase 1: Port Agent Factories (Day 1)

Port the 17 agent factory definitions from arcanea-opencode to oh-my-arcanea:

1. Create `src/arcanea/agents/` directory in oh-my-arcanea
2. Split arcanea-opencode's monolithic index.ts into focused files:
   - `src/arcanea/agents/development-team.ts` (Architect, Coder, Reviewer, Debugger)
   - `src/arcanea/agents/creative-team.ts` (Story Master, Character Crafter, World Expander, Lore Master)
   - `src/arcanea/agents/writing-team.ts` (Prose Weaver, Voice Alchemist, Line Editor, Continuity Guardian)
   - `src/arcanea/agents/research-team.ts` (Sage, Archivist, Scout, Muse)
   - `src/arcanea/agents/index.ts` (re-exports)
3. Port `arcanea-orchestrator.ts` as `src/arcanea/orchestrator.ts`
4. Wire agents into Guardian system (each agent maps to a Guardian domain)
5. Update `src/arcanea/index.ts` to export new modules

### Phase 2: Sync Upstream (Day 1-2)

1. Fetch upstream (oh-my-opencode) latest
2. Rebase or merge upstream changes into oh-my-arcanea
3. Resolve any conflicts in the overlay files
4. Verify build passes: `bun run build && bun run typecheck`

### Phase 3: Wire Guardian-Agent Binding (Day 2)

Connect the two systems that currently exist independently:

1. Add `agents` field to `Guardian` interface mapping each Guardian to its primary agents
2. Create `getAgentsForGuardian(guardian: Guardian)` utility
3. Update `activateGuardianForSession()` to pre-configure relevant agents
4. Add agent routing to `buildGuardianContextBlock()` so the session knows which agents are available

### Phase 4: Validate and Publish (Day 2-3)

1. Run full test suite: `bun test`
2. Verify CLI binary works: `npx oh-my-arcanea --help`
3. Update README with consolidated feature set
4. Publish to npm as `oh-my-arcanea` with `opencode-arcanea` binary alias
5. Tag release v4.1.0

### Phase 5: Deprecate arcanea-opencode (Day 3)

1. Update arcanea-opencode README to redirect:
   ```
   # arcanea-opencode [DEPRECATED]
   This repo has been consolidated into [oh-my-arcanea](https://github.com/frankxai/oh-my-arcanea).
   ```
2. Archive the repo on GitHub (Settings > Archive)
3. If npm-published in future, publish a final version that logs deprecation notice

---

## 5. What Each Repo Contributes

```
oh-my-arcanea (KEEP - canonical)
  src/arcanea/
    guardians.ts          -- Ten Gates Guardian system (EXISTING)
    hooks.ts              -- Session lifecycle hooks (EXISTING)
    statusline-config.ts  -- Terminal statusline (EXISTING)
    luminor-swarm.ts      -- Swarm coordination types (EXISTING)
    orchestrator.ts       -- Master orchestrator (PORT from arcanea-opencode)
    agents/               -- Agent factories (PORT from arcanea-opencode)
      development-team.ts
      creative-team.ts
      writing-team.ts
      research-team.ts
      index.ts
    index.ts              -- Public API (UPDATE)

arcanea-opencode (ARCHIVE)
  src/agents/arcanea/
    arcanea-orchestrator.ts  -- PORT to oh-my-arcanea/src/arcanea/orchestrator.ts
    index.ts                 -- SPLIT into oh-my-arcanea/src/arcanea/agents/*
```

---

## 6. Timeline

| Day | Task | Estimated Hours |
|-----|------|----------------|
| 1 | Port agent factories + orchestrator | 2-3h |
| 1-2 | Sync upstream into oh-my-arcanea | 1-2h |
| 2 | Wire Guardian-Agent binding | 1-2h |
| 2-3 | Test, validate, publish | 1h |
| 3 | Archive arcanea-opencode | 15min |

**Total: ~6-8 hours of focused work**

---

## 7. Post-Consolidation

After consolidation, the Arcanea harness ecosystem becomes:

- **oh-my-arcanea** -- The canonical OpenCode harness overlay (npm: `oh-my-arcanea`, bins: `oh-my-arcanea` + `opencode-arcanea`)
- **arcanea-orchestrator** -- Standalone orchestration engine (separate package, referenced by the harness)
- **arcanea-mcp** -- MCP server for Arcanea intelligence (separate, already exists)

This gives a clean separation: the harness handles terminal overlay + Guardian routing, the orchestrator handles agent coordination, and the MCP server handles tool integration.
