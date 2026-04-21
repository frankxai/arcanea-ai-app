# RECOVERY — Arcanea Incident Playbook

When something breaks, this is the first file to read.

## Known incidents

### 2026-03-11 mass-revert (commit `073bc640`)

- **Author:** `frankxai` (own identity, botched auto-op)
- **Commit message:** `"fix(web): revert about+companions — remove dead luminor-images import"` (misleading)
- **Actual impact:** 4,517 files deleted, 1,166,384 lines removed
- **Hidden damage:** `/lumina`, `/arcanea`, `/superintelligence` + ~20 `/arcanea-*` commands
- **Restored:** 2026-04-20 (commit restoring `/lumina`, `/arcanea`, `/superintelligence`)
- **Still missing (by choice — re-adding would re-sprawl):** `/arcanea-author`, `/arcanea-build`, `/arcanea-council`, `/arcanea-daily`, `/arcanea-db`, `/arcanea-deploy`, `/arcanea-design`, `/arcanea-dev`, `/arcanea-ecosystem`, `/arcanea-guardians`, `/arcanea-lore`, `/arcanea-luminor`, `/arcanea-quality`, `/arcanea-swarm`, `/arcanea-sync`, `/arcanea-team`, `/arcanea-test`, `/arcanea-web3`, `/agentic-jujutsu`, `/forge`, `/creative-master`, `/component-forge`, `/flow-v3`, `/content-strategy`

## Canonical commit references

| What | Last good commit before deletion | Path |
|------|--------|------|
| `/lumina`, `/arcanea`, `/superintelligence` originals | `073bc640^` | `.claude/commands/` |
| `/craft-prompt`, `/instinct-*` originals | `9d91f198^` | `.claude/commands/` |
| `.arcanea/` original substrate | `073bc640^` | `.arcanea/` |
| Pre-Hz-correction lore | `35dcd9a1^` | `book/`, `.arcanea/lore/` |

## Fast restores

### Restore a single deleted file

```bash
# Find the last commit where the file existed
git log --all --oneline -- path/to/file | head -5

# Restore that version
git show <commit>^:path/to/file > path/to/file
git add path/to/file
git commit -m "restore(x): bring back path/to/file from <commit>^"
```

### Restore an entire deleted directory

```bash
# List everything under a path at a specific commit
git ls-tree -r <commit>^ -- .claude/commands/

# Restore all of them
git checkout <commit>^ -- .claude/commands/
```

### Restore via GitHub Action (recommended)

Trigger the `Restore from incident` workflow with:
- **SHA:** the commit just BEFORE the bad commit (e.g. `073bc640^` resolves to the parent)
- **Path glob:** e.g. `.claude/commands/**`
- **Target branch:** `restore/<descriptor>`

It opens a PR you can review before merging.

## Protective layers now live

1. `.githooks/pre-commit` — blocks >100 files or >5000 deletions without `BIG-CHANGE:` tag
2. `.githooks/pre-commit` — blocks deletions in `.claude/`, `.arcanea/`, `CLAUDE.md`, `.github/CODEOWNERS` without `SACRED-DELETE:` tag
3. `.githooks/pre-push` — blocks force-push to `main`/`master`/`production`
4. `.githooks/pre-push` — blocks sacred-path deletions from reaching remote
5. `.github/CODEOWNERS` — auto-suggests reviewer for sacred paths (enforceable with branch protection)
6. `.github/workflows/guardian-pr-check.yml` — tiered automated PR review with cost cap
7. `.github/workflows/claude-snapshot.yml` — daily `.claude/` snapshot to backup branch
8. `.github/workflows/restore.yml` — one-click recovery from any historical commit

Install: `bash scripts/install-hooks.sh`

## Escalation

If a destructive commit lands on `main` despite all this:
1. Do NOT force-push a fix — make a revert commit instead
2. Open the `Restore from incident` workflow with `SHA=<bad-commit>^` and the affected path
3. Add a new incident entry above
4. Save a memory via Claude (`feedback_*` or `project_*`)
