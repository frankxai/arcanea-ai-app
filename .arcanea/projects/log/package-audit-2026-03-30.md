# Package Audit — 2026-03-30

## Summary
- Total items in packages/: 43 (42 directories + 1 standalone file)
- Real packages (has source code): **42**
- Referenced by milestones: 1 (memory-mcp in M003)
- Empty stubs to remove: **0**
- Stubs to keep (milestone-referenced): 0
- Standalone file (not a package): 1 (arcanea-design-preset.js)

## Conclusion

The PICKUP_PLAN estimated "43 directories, many empty stubs." This is incorrect. All 42 package directories contain real TypeScript/JavaScript source code with build artifacts (dist/). There are zero empty stubs. No deletions are warranted.

The "43" count likely included `arcanea-design-preset.js`, which is a standalone file in the packages/ root, not a directory.

---

## KEEP — Real Packages (has source)

| Package | Src Files | Imported in apps/web | Notes |
|---------|-----------|---------------------|-------|
| agent-bus | 3 | No | Inter-agent event bus |
| ai-core | 1 | Yes (1 file) | AI core abstractions |
| aios | 5 | No | Arcanea Intelligence OS CLI |
| ai-provider | 3 | Yes (3 files) | Vercel AI SDK provider |
| arcanea-hooks | 11 | No | Hook system (context, manager, matcher) |
| arcanea-mcp | 23 | Yes (1 file) | MCP server — ALWAYS KEEP |
| arcanea-security | 7 | No | Input/path validation, permissions, safe-executor |
| arcanea-skills | 0 (has bin/install.js + index.js) | No | Skill installer package |
| arc-protocol | 4 | Yes (6 files) | .arc file format parser — ALWAYS KEEP |
| auth | 12 | Yes (1 file) | Supabase auth — ALWAYS KEEP |
| chrome-extension | 9 | Yes (1 file) | Browser extension |
| claude-arcanea | 6 | No | Claude Code overlay (intelligence-os, creative-agents) |
| cli | 13 | Yes (2 files) | Arcanea CLI — ALWAYS KEEP |
| content-api | 1 | No | Content API wrapper |
| core | 28 | No | Framework primitives — ALWAYS KEEP |
| council | 8 | No | Luminor council system |
| creative-pipeline | 6 | No | Asset vault, session, curator, prompt engine |
| database | 10 | No | Database layer — ALWAYS KEEP |
| extension-core | 6 | No | Shared browser/IDE extension lib |
| flow-engine | 3 | No | Workflow flow engine |
| grok-media | 17 | No | Grok media browser extension |
| guardian-evolution | 23 | No | Pattern learner, reasoning bank |
| guardian-memory | 4 | No | HNSW-indexed guardian memory |
| hybrid-memory | 6 | No | Hybrid memory backend (SQL + guardian) |
| intelligence-bridge | 6 | No | Event bus, feedback, routing engine |
| media | 8 | No | Media processor, catalog, canon validator |
| memory-mcp | 1 | No | Memory MCP server (M003 milestone) — ALWAYS KEEP |
| memory-system | 14 | No | ArcaneMD, horizon-ledger, mem0-adapter |
| os | 3 | No | Canon validator, creative memory, library pipeline |
| overlay-chatgpt | 4 | No | ChatGPT overlay (referenced in /overlays page) |
| overlay-claude | 6 | No | Claude overlay (referenced in /overlays page) |
| overlay-copilot | 4 | No | Copilot overlay (referenced in /overlays page) |
| overlay-cursor | 4 | No | Cursor overlay (referenced in /overlays page) |
| overlay-gemini | 4 | No | Gemini overlay (referenced in /overlays page) |
| prompt-books | 6 | No | Context engine, markdown parser (referenced in /blog) |
| rituals | 17 | No | Ritual system |
| skill-registry | 3 | No | Skill discovery and registry |
| sona-learner | 6 | No | Learning engine, pattern store, trajectory recorder |
| starlight-runtime | 2 | No | Starlight runtime engine |
| swarm-coordinator | 7 | No | Multi-agent swarm coordination |
| token-optimizer | 7 | No | Token cost tracking, batch optimizer, reasoning bank |
| vscode | 11 | No | VS Code extension (has .vsix artifact) |

## Standalone File (not a package)

| File | Size | Purpose |
|------|------|---------|
| arcanea-design-preset.js | 3,995 bytes | Tailwind/design preset config |

## DELETE — Empty Unreferenced Stubs

**None.** All 42 directories contain real source code.

## UNCERTAIN — Needs Human Decision

| Package | Reason |
|---------|--------|
| arcanea-skills | Has bin/install.js + index.js + skills/ dir but no src/ directory. Functions as a skill installer — likely intentional. |
| content-api | Only 1 src file (index.ts). Minimal package — may be a thin wrapper worth consolidating into core. |
| starlight-runtime | Only 2 src files. Minimal — could potentially merge into core. |

## Packages Referenced in apps/web (via @arcanea/ imports or UI strings)

Direct code imports:
- ai-core (1 file)
- ai-provider (3 files)
- arcanea-mcp (1 file)
- arc-protocol (6 files)
- auth (1 file)
- chrome-extension (1 file)
- cli (2 files)

Referenced as package names in UI/documentation pages (developers, overlays, docs, blog):
- council, guardian-evolution, guardian-memory, rituals, creative-pipeline, swarm-coordinator
- overlay-chatgpt, overlay-claude, overlay-gemini, overlay-copilot, overlay-cursor
- prompt-books, arcanea-skills, memory-mcp, extension-core, os, cli

## Milestone References

| Package | Milestone | Status |
|---------|-----------|--------|
| memory-mcp | M003 (Memory System, 75%) | Build @arcanea/memory-mcp — pending |
