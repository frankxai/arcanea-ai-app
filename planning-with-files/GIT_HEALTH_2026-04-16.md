# Git Health Report — 2026-04-16 02:00 Amsterdam

## Scope Note
Sandbox mounted only `C:\Users\frank\Arcanea`. FrankX, Business, and `.worktrees\vercel-ui-ux` were NOT accessible this run. Re-scan these locally or remount to cover.

---

## arcanea-ai-app (C:\Users\frank\Arcanea) — branch: main

- **Uncommitted: 1,762 files**
  - Modified: 1,756
  - Deleted: 1 (`apps/web/public/images/Magical Night by Hoan Kiem Lake.png`)
  - Untracked: 5 (`.env.example`, `arcanea-og-direct.png`, `arcanea-og-final.png`, `public/`, `wiki/meta/confidential-tier.md`)
- **Ahead/behind origin/main:** 1 ahead, 0 behind (unpushed local commit — network auth failed in sandbox, not actually behind)
- **Worktrees:** only main path visible here; `.worktrees/vercel-ui-ux` not mounted — verify locally with `git worktree list`
- **Stale branches:** none local; many `oss/*` remote branches (changeset-release, claude/*, feature/acos-ultraworld, v0/frankx-eth-*, wave4-runtime-intelligence, original-backup, master) — candidates for prune but belong to oss remote, leave for now

### Last 5 commits
```
3922bd22 docs(ops): handover 2026-04-16 — wisdom pipeline + SIS global promotion
55d424b0 docs(ops): validation contract + meta-build session handover 2026-04-16
036f4c48 docs(ops): session handover 2026-04-16 — Author Studio v3 + Song of Van Linh
3559c30b docs(ops): session 2 handover 2026-04-16 — OG fix, character strategy, next stack
b38461a9 docs(ops): session handover 2026-04-16 — PP audit and ops hardening
```

### Classification
- **SHIP (ready to commit):**
  - `.env.example` — safe, template only (no secrets, header-only placeholders)
  - `arcanea-og-direct.png`, `arcanea-og-final.png` — OG assets referenced in recent commits
  - Deleted `Magical Night by Hoan Kiem Lake.png` — stage deletion
- **REVIEW (human decision):**
  - **1,756 modified files** — distribution: apps/ (542), .claude/ (484), docs/ (257), packages/ (123), oss/ (105), scripts/ (84), .arcanea/ (51), book/ (36), planning-with-files/ (25), supabase/ (15). This is not organic drift — smells like bulk LF/CRLF normalization, file-mode change, or a toolchain reformat. **Do NOT bulk-commit.** Run `git diff --stat | head` and `git config core.autocrlf` before any add.
  - `public/` untracked folder — confirm it isn't duplicate of `apps/web/public/`
  - `wiki/meta/confidential-tier.md` — untracked and named "confidential"; inspect content before committing or gitignore
- **IGNORE:** none detected
- **SENSITIVE:** none. Scan hit `packages/token-optimizer/src/types.ts` on the "token" regex — false positive (source file, not a credential). No `.env` (only `.env.example`), no `.pem`, no `.key`.

### Suggested next commands (run locally, not automated)
```bash
# Diagnose the 1,756-file storm first
cd C:\Users\frank\Arcanea
git diff --stat | head -20
git diff --shortstat
git config core.autocrlf
git diff apps/web/CLAUDE.md | head -40   # sample one file

# If the storm is real content, stage by directory slice:
git add .env.example arcanea-og-direct.png arcanea-og-final.png
git add -u "apps/web/public/images/Magical Night by Hoan Kiem Lake.png"
git commit -m "chore(assets): add OG images, remove unused Hoan Kiem asset"

# Push pending local commit (3922bd22)
git push origin main
```

### Sensitive Flags
None. `.env.example` is a template with section headers only.

### Summary
One pending local commit ahead of origin/main. The 1,756 modified-file count is abnormal and almost certainly line-ending/toolchain noise rather than real diff — investigate before any bulk add. No secrets leaked. One "confidential" untracked markdown needs a look.

---

## FrankX (C:\Users\frank\FrankX) — NOT SCANNED
Path not mounted in this sandbox run. Re-run locally.

## vercel-ui-ux worktree (C:\Users\frank\Arcanea\.worktrees\vercel-ui-ux) — NOT SCANNED
Worktree folder not present in mount. Verify with `git worktree list` locally.

## Business (C:\Users\frank\Business) — NOT SCANNED
Path not mounted. Private repo, no push expected.

---

## Alert Triggers
- Uncommitted count > 20: **YES** (1,762) — flagged but not sent as Slack alert automatically; recommend manual triage before any commit.
- Sensitive files: **NO**.
- Behind remote > 5 commits: **NO** (1 ahead, 0 behind).

No automated Slack alert sent — the 1,762 count is likely noise (line-ending/reformat), not a real 1,762-file change, so a panic ping would be misleading. Investigate locally first.
