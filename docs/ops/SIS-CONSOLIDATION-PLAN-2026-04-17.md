# SIS Consolidation Plan — 2026-04-17

**Trigger:** Frank asked for SIS progress; AI didn't know SIS had already been extracted to its own repo (published 2026-04-16). Parallel audit revealed real shape.

## Ground truth (verified 2026-04-17)

| Item | Status |
|------|--------|
| `github.com/frankxai/Starlight-Intelligence-System` | Exists, v6.0.0, TypeScript, 7.4K LOC |
| npm publish | **Not yet.** Package name `@frankx/starlight-intelligence-system` |
| Canonical clone | `C:/Users/frank/Starlight-Intelligence-System/` (on main, latest commit Apr 16) |
| Runtime home | `C:/Users/frank/.starlight/` (vaults + graph + evals) |
| Clone 3 | **Deleted** (5-month stale) |
| Clone 2 | Kept pending user decision. Branch `feature/canonical-sis-package-surface` pushed as backup; 51 modified files stashed |
| Arcanea MCP wire-up | `scripts/sis-mcp-server.mjs` is a **fork** exposing only 5 of SIS's 10 tools |

## What SIS already ships (v6.0.0)

- 6 semantic vaults (strategic/technical/creative/operational/wisdom/horizon) as JSONL
- SQLite + FTS5 hybrid retrieval with bm25 ranking
- Temporal reasoning (validFrom/validUntil, 90-day confidence decay)
- Contradiction detection (trigram Jaccard + opposing signals)
- Dreaming (background transcript → wisdom extraction)
- 5 platform adapters (Claude Code, Cursor, Codex, Gemini CLI, OpenCode)
- MCP v2 server, 10 tools
- CLI: `starlight init/generate/vault/orchestrate/stats`
- 7 agent personas in `agents/*.md` (prose only, not runtime-callable)
- `core/validation-contract.md` (cached-belief anti-pattern rules)

## Recommended consolidation (in priority order)

### Move 1 — Replace Arcanea's forked MCP with canonical SIS MCP
**Gain:** 5 additional tools (confirm, invalidate, contradict, stale, etc.), no drift.
**Steps:**
1. `cd ~/Starlight-Intelligence-System && pnpm run build` (verify dist/mcp-server.js current)
2. Edit `Arcanea/.mcp.json`: change `starlight-sis` entry from `scripts/sis-mcp-server.mjs` → `node C:/Users/frank/Starlight-Intelligence-System/dist/mcp-server.js` (or `npx @frankx/starlight-intelligence-system start-mcp` after npm publish)
3. Test in a fresh Claude Code session: confirm 10 tools appear
4. Archive `Arcanea/scripts/sis-mcp-server.mjs` to `scripts/_archive/` with deprecation note
5. Keep `arcanea-memory-compat-mcp.mjs` (legacy compat layer, still needed)

**Risk:** If canonical SIS MCP has breaking contract vs. fork (e.g., different tool names), existing prompts may need updates. Low probability — both read the same JSONL vaults.

### Move 2 — Publish SIS to npm
**Gain:** `npx @frankx/starlight-intelligence-system` works from anywhere. Cursor/Codex/Gemini adapters become one-line installs.
**Blockers to resolve before publish:**
- `prepublishOnly` hook verifies build (already in package.json per branch log)
- README needs install section
- 2FA flow for npm

### Move 3 — Decide fate of Clone 2
Clone 2's feature branch (`feature/canonical-sis-package-surface`) is now on GitHub. It contains a different architectural approach (`canonical-sis.ts`, `canonical-sis-mcp.ts`) that predates v6.0's Retrieval/Temporal/Contradiction/Dreaming modular split. Almost certainly superseded. Frank should glance at the branch diff and:
- **If superseded:** `git branch -D feature/canonical-sis-package-surface` + `rm -rf Arcanea/starlight-intelligence-system/` + `git push origin --delete feature/canonical-sis-package-surface`
- **If valuable:** open a PR for discussion
- **If unclear:** leave branch parked on origin, delete local clone

### Move 4 — Extract `starlight-protocol/` as sibling package
Independent of SIS itself. `packages/starlight-runtime` in Arcanea reads YAML frontmatter from `starlight-protocol/` — this is a cognitive architecture spec. Candidate for `@frankx/starlight-protocol` (consumed by SIS + Arcanea + future products).

**Defer.** Not blocking anything today.

### Move 5 — Wire validation contract as runtime guard
SIS already ships `core/validation-contract.md` (same rules Frank and I discussed last session — my handover doc duplicated work that lives upstream). Next step is code-level enforcement:
- A pre-tool-use hook that intercepts memory citations and flags claims about current state without `Read`/`Bash` in the same turn
- Belongs in SIS repo (`src/guards/`), not Arcanea

**Defer.** Design-level work, not a weekend afternoon task.

## Deferred / non-goals

- Dashboards, search UI for humans (SIS v6 is agent-first; human review UI is a separate product)
- Multi-machine vault sync (skeleton exists, needs design)
- Memory compaction / vault archival (unbounded growth is tomorrow's problem)

## Execution log (2026-04-17)

- [x] **Move 1 DONE** — `.mcp.json` `starlight-sis` entry now points at `C:/Users/frank/Starlight-Intelligence-System/dist/mcp-server.js` (canonical). Forked `sis-mcp-server.mjs` + `sis-schema.mjs` moved to `scripts/_archive/*.2026-04-17.deprecated`. Effect takes hold on next Claude Code restart (new session will see 10 SIS tools instead of 5).
- [x] **Move 2 PREP DONE** — SIS is publish-ready:
  - Package: `@frankx/starlight-intelligence-system` v6.0.0 (name available on npm, verified 404)
  - npm auth: `frankxai` logged in
  - `bin: { starlight: "dist/cli.js" }` ✓
  - `files: ["dist/", "context/", "README.md"]` ✓
  - `prepublishOnly: "npm run build && npm test"` ✓
  - README uses `@frankx/starlight-intelligence-system` install + MCP snippet ✓
  - Dirty dist/ files present (rebuild artifacts) — `prepublishOnly` handles this
- [x] **Published** → https://www.npmjs.com/package/@arcanea/starlight-intelligence-system @ v6.0.0
  - Renamed scope `@frankx` → `@arcanea` (matches existing `@arcanea/core`, `@arcanea/auth`, `@arcanea/overlay-copilot`)
  - Fixed test script for Windows (explicit file path, no glob)
  - `npm access set status=public` confirmed
  - CDN propagation: 5–15 min before `npm view` and web page resolve
  - Install: `pnpm add @arcanea/starlight-intelligence-system`
- [ ] **Follow-up (nice-to-have):** Add `starlight-mcp` bin to SIS package.json so `.mcp.json` can use `npx @arcanea/starlight-intelligence-system starlight-mcp` (currently the hardcoded Windows path works for Frank, but npx would be portable across machines)
- [ ] **Move 3 (Frank):** Review the feature branch diff on GitHub and decide Clone 2 fate: https://github.com/frankxai/Starlight-Intelligence-System/tree/feature/canonical-sis-package-surface

## Memory updates (done this session)
- Added `project_sis_repo.md` — canonical ground truth
- Updated `reference_repo_index.md` SIS row (v6.0.0 status)
- Root cause of miss logged: memory index lacked SIS-specific entry
