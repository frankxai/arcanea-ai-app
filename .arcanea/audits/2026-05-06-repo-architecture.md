# Repo Architecture Audit — 2026-05-06

**Auditor:** Explore agent
**Scope:** Arcanea harness/CLI/substrate landscape on disk

## Repo State Matrix

| Name | Exists? | Last commit | LOC est | Language | Purpose | Status |
|---|---|---|---|---|---|---|
| `Arcanea` (main monorepo) | ✓ | 2026-05-06 | — | TS/Next.js | Production app + universe content | ACTIVE |
| `oh-my-arcanea` | ✓ | 2026-04-16 | ~7,023 | TS | OpenCode overlay with Ten Gates Guardian system | ACTIVE (dev branch) |
| `arcanea-flow` | ✓ | 2026-02-26 | ~9,113 | JSON/MD heavy | Cross-vendor orchestration runtime | ACTIVE main, **1,530 uncommitted changes** |
| `Starlight-Intelligence-System` | ✓ | 2026-05-06 | ~92,147 | JS/TS | Persistent context + memory substrate (SIP) | ACTIVE — most active |
| `arcanea-onchain` | ✓ | 2026-02-26 | ~133 | TS | Blockchain IP & creator economy | ARCHITECTURE PHASE |
| `arcanea-opencode` | ✓ | 2026-04-02 | ~2,095 | TS | Legacy OpenCode compat layer | ACTIVE (merge-upstream branch) |
| `claude-arcanea` | ⚠ subdir-only | — | ~15 | TS | Claude Code vendor harness | ASPIRATIONAL (scaffold) |
| `codex-arcanea` | ⚠ subdir-only | — | ~21 | TS | Codex vendor harness | ASPIRATIONAL (scaffold) |
| `gemini-arcanea` | ⚠ subdir-only | — | ~18 | TS | Gemini vendor harness | ASPIRATIONAL (scaffold) |
| `claude-flow` | ✗ npm-only | — | — | — | ruvnet's legacy orchestration | DEPRECATED |
| `ruflow` | ✗ | — | — | — | Proposed rename of claude-flow | NOT IMPLEMENTED |

The three vendor-arcanea harnesses exist as **subdirectories of `Arcanea/arcanea-ecosystem/`**, NOT as standalone clones at `C:/Users/frank/<name>`. They are scaffolds (15–21 files each), externally registered in `repos.json` but no production code.

## claude-flow Integration Footprint

`Arcanea/.claude/settings.json` — **15 mentions across:**
- 9 lifecycle hooks: `pre-edit`, `post-edit`, `pre-command`, `post-command`, `pre-task`, `post-task`, `route`, `daemon-start`, `session-restore`, `notify`
- 3 permission patterns: `Bash(npx claude-flow:*)`, `Bash(npx @claude-flow/cli:*)`, `mcp__claude-flow__:*`
- 2 git metadata: author footer `Co-Authored-By: claude-flow <ruv@ruv.net>`, PR template

> **VIOLATES** user feedback memory `feedback_no_coauthor_contamination.md` — "NEVER add Co-Authored-By claude-flow/ruvnet; Arcanea is sovereign"

**In skills:** `github-code-review/SKILL.md` and `github-multi-repo/SKILL.md` reference claude-flow swarm orchestration patterns.

## Aspirational vs Real

**Real, production-active:**
- arcanea-flow (replacement substrate — but stale main branch + 1,530 uncommitted changes, needs cleanup)
- oh-my-arcanea (Ten Gates Guardian overlay — distinct product, not a "canonical harness")
- SIS (substrate, most active)
- arcanea-onchain (architecture phase, separate vertical)
- arcanea-opencode (legacy compat tracker)

**Aspirational:**
- claude-arcanea, codex-arcanea, gemini-arcanea (scaffolds in `arcanea-ecosystem/` subdir)
- ruflow rename (not started)

## Recommended Consolidation Map

```
EXTERNAL REPOS (keep separate)
├── Arcanea                           (main monorepo + product)
├── arcanea-flow                      (CRITICAL — replace claude-flow integration)
├── oh-my-arcanea                     (Ten Gates / OpenCode overlay)
├── Starlight-Intelligence-System     (substrate, SIP protocol)
├── arcanea-onchain                   (separate vertical)
└── arcanea-opencode                  (legacy compat)

ECOSYSTEM SUBDIRECTORIES (consolidated, externalize on demand)
├── arcanea-ecosystem/claude-arcanea/    (scaffold)
├── arcanea-ecosystem/codex-arcanea/     (scaffold)
└── arcanea-ecosystem/gemini-arcanea/    (scaffold)

DEPRECATED (remove)
└── claude-flow npm references → replace with arcanea-flow
```

## claude-flow → arcanea-flow Migration

1. Rewrite `.claude/settings.json` — replace 13 `claude-flow hooks *` commands with `arcanea-flow` equivalents (or remove entirely if arcanea-flow doesn't ship them yet)
2. Replace `Bash(npx claude-flow:*)` permission with `arcanea-flow` equivalents
3. Remove `Co-Authored-By: claude-flow` attribution (memory mandate)
4. Update `github-code-review`, `github-multi-repo` skills to drop `mcp__claude-flow__` references
5. Move `.claude-flow/` state dir → `.arcanea/legacy/` or delete
6. Document deprecation date in `.arcanea/CLAUDE.md`

## Risk Callouts

1. **arcanea-flow's 1,530 uncommitted changes** — review/commit/discard before promoting to system bus
2. **Vendor harness scaffolds barebones** — ~20 files each is below MVP; need template/codegen plan
3. **`repos.json` dependency graph** assumes external clones for vendor harnesses; subdirectory reality breaks the assumption — update registry or externalize
4. **SIP/SIS not wired to arcanea-flow** — risk of substrate divergence
5. **ruflow rename** never happened — don't bother; arcanea-flow IS the rename
