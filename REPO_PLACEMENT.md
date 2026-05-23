# REPO_PLACEMENT.md — Where new repos go

> Authored 2026-05-22 by Shinkami under Frank's overnight-consolidation mandate.
> Closes the gap named in `GROUND_TRUTHS.md` §2.3 (Repository drift, ACOS pattern generalized).
>
> **Authority order:** Direct user instruction > this file > any other repo-placement habit.

---

## The problem this rule solves

The Arcanea fleet has ~6 known cases where the same conceptual repo exists in *both* a top-level standalone location (`~/arcanea-onchain/`) and a nested-in-Arcanea location (`~/Arcanea/arcanea-onchain/`). Each drift case followed the same pattern:

1. A specialized concern carved off the main repo.
2. Someone cloned it into the user's home directory as a sibling.
3. Someone else kept editing the nested copy.
4. Three months later the two trees diverge; nobody knows which is canonical.

Past incidents (verified 2026-05-21):
- `~/arcanea-onchain/` (Feb 22, public OSS) vs `~/Arcanea/arcanea-onchain/` (May 6, gitignored working copy) — actually identical in content modulo CRLF, but visible drift surfaced confusion
- `~/arcanea-flow/` vs `~/Arcanea/arcanea-flow/`
- `~/arcanea-code/` vs `~/Arcanea/arcanea-code/`
- `~/arcanea-orchestrator/` vs `~/Arcanea/arcanea-orchestrator/`
- `~/arcanea-opencode/` vs `~/Arcanea/arcanea-opencode/` (superseded → `oh-my-arcanea`)
- `~/arcanea-claw/` vs `~/Arcanea/arcanea-claw/`

This document names a deterministic rule so the next 5 candidates don't repeat the pattern.

---

## The rule

For any new component, package, sub-product, or specialization, **decide placement using this single decision tree**:

```
Q1. Will this ship to a separate GitHub repo with its own release cadence,
    its own README on the public profile, and its own contributors?
│
├── YES → Top-level standalone at ~/<name>/
│         Add .gitignore entry for `<name>/` at repo root of every monorepo
│         that consumes it. Document the sync direction in this repo's
│         README ("public surface; monorepo consumes via package.json").
│
└── NO  → Q2. Does this need to ship to npm under @arcanea/ or be imported
              as a workspace dependency by apps/web or another package?
        │
        ├── YES → Nested in monorepo at Arcanea/packages/<name>/
        │         Use pnpm workspace; reference via "workspace:*"
        │
        └── NO  → Q3. Is this a CLI tool, MCP server, or skill harness?
                │
                ├── YES → Top-level standalone at ~/<name>/ as a separate
                │         tool, OR install path under ~/.claude/skills/
                │         if it's a Claude-Code-specific skill.
                │
                └── NO  → Nest as a subfolder in Arcanea/<area>/<name>/.
                          (e.g. Arcanea/book/<book-slug>/,
                          Arcanea/.arcanea/lore/<category>/)
```

**The defining test:** *"If I never opened this folder again for 6 months, would somebody else still know where to find it?"*

- Public OSS repo: discoverable via github.com/frankxai → top-level ✓
- npm package consumed by web app: discoverable via the consumer's package.json → nested ✓
- Personal scratch / experiment: not discoverable → DO NOT create yet

---

## What to do when both already exist (drift remediation)

For an existing drift case (e.g. the `arcanea-onchain` pair):

1. **Diff with whitespace-ignore.** Run `diff -w -q` (or `git diff -w --stat`) to confirm whether the drift is *content* or just CRLF/LF. Many false-positive "drifts" are line-ending noise.
2. **Establish canonical.** Per Q1 above. If it ships to GitHub, top-level wins. If it's a workspace dep, nested wins.
3. **Mark the loser.** Add `DEPRECATED_DELETE_AFTER_VERIFY.md` to the non-canonical copy explaining where to edit going forward. Wait at least 30 days before delete.
4. **Update the canonical-locations index.** Append the resolution to `~/.claude/skills/arcanea-meta/references/canonical-locations.md`.
5. **Add a `.gitignore` entry in the monorepo** for the standalone repo's path, so accidentally re-cloning it nested no longer shadows the canonical version.
6. **After 30 days of silence**, delete the non-canonical copy.

---

## Worktrees ≠ duplicate repos

A `git worktree add` creates an *additional checkout* of the same repo at a different path, not a separate repo. Worktrees are explicitly allowed and useful:

- Run `pnpm build` in one worktree without disturbing in-flight work in another
- Resolve a merge conflict in isolation
- Park a feature branch while doing emergency work on main

**Limits (per `feedback_ops_workflow`):**
- Max 2 active worktrees per developer at any time
- Use `~/<repo>-<purpose>/` (`~/Arcanea-claude/`, `~/Arcanea-site-excellence/`) not `~/<repo>/.claude/worktrees/<hash>/`
- Always `git worktree remove` when the branch is merged or abandoned
- Never leave a worktree with uncommitted changes longer than 24h — commit-or-stash discipline

---

## Where existing repos belong (snapshot 2026-05-22)

These cases are *resolved* and serve as worked examples:

| Repo | Canonical | Status |
|---|---|---|
| `Starlight-Intelligence-System` | top-level `~/Starlight-Intelligence-System/` | ✓ npm `@arcanea/starlight-intelligence-system`; public OSS substrate |
| `agentic-creator-os` | top-level `~/agentic-creator-os/` | ✓ public ACOS substrate |
| `arcanea-vault` (Kura) | top-level `~/arcanea-vault/` (rename pending) | ✓ public Chrome extension repo |
| `arcanea-onchain` | top-level `~/arcanea-onchain/` (the GitHub-tracked one) | ✓ public, nested-in-Arcanea was a working copy |
| `arcanea-ai-app` (this monorepo) | `~/Arcanea/` | ✓ canonical Next.js production app |
| `@arcanea/design-system` | nested `Arcanea/packages/design-system/` | ✓ workspace dep of apps/web |
| `@arcanea/router-spec` | nested `Arcanea/packages/router-spec/` | ✓ workspace dep |
| `@arcanea/peak-performance` | nested `Arcanea/packages/peak-performance/` | ✓ workspace dep |
| `book/` collections | nested `Arcanea/book/<slug>/` | ✓ part of monorepo, no separate repo per book |
| `.arcanea/lore/` | nested `Arcanea/.arcanea/lore/` | ✓ shared intelligence substrate |

---

## When this rule needs an exception

The single legitimate exception: when you are *temporarily* developing a new component that may become a separate repo but isn't ready to ship publicly. In that case:

1. Start nested at `Arcanea/packages/_experimental/<name>/`
2. Add the `_experimental/` directory to `.gitignore` if you don't want it in main yet
3. When ready to ship, extract to top-level following Q1 above
4. Never leave anything under `_experimental/` for longer than 60 days — either promote or delete

---

## Cross-references

- `GROUND_TRUTHS.md` §2.3 — the gap this rule closes
- `~/.claude/skills/arcanea-meta/references/canonical-locations.md` — drift-resolution log
- `~/.claude/skills/arcanea-meta/references/ecosystem-map.md` — the 198-repo inventory
- Memory: `project_kura.md`, `project_arcanea_si_prompt.md`, `feedback_ops_workflow.md`

---

## Update protocol

When a new repo or drift case is created/resolved, append a row to the "Where existing repos belong" table above and add a one-line entry to `canonical-locations.md`. This file's authority is **load-bearing on the next 5 placements**; do not let it go stale.
