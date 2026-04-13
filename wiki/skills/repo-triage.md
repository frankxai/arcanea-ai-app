---
title: /repo-triage — Weekly GitHub Repo Grading
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: spec
priority: P0
effort: 1 day
links: [README, ../meta/semantic-map-at-scale, ../meta/knowledge-inventory]
---

# /repo-triage

**Purpose:** Weekly scheduled pass over all 106 frankxai/ GitHub repos. Grade each as active/dormant/graveyard/shipped. File results into Linear as an actionable summary. Prevent repo sprawl from becoming un-auditable.

**Triggering description (for SKILL.md):**
> Use this skill when the user says "triage repos", "audit repos", "which repos are dead", "github repo review", or explicitly invokes `/repo-triage`. Also trigger via scheduled weekly task (Sundays 10am).

## Usage

```
/repo-triage
/repo-triage --owner frankxai --output wiki/reports/repos-2026-04-10.md
/repo-triage --dry-run   # grade without writing to Linear
```

## Grading Taxonomy

| Grade | Criteria | Action |
|-------|----------|--------|
| 🟢 **Active** | commits in last 14 days OR open PR OR open issue with recent activity | No action — track |
| 🟡 **Dormant** | last commit 14-90 days ago, no open issues | Weekly ping — keep or archive? |
| 🔴 **Graveyard** | 90+ days no commits, no open work, not deployed | Archive candidate — decide within 1 month |
| 🚀 **Shipped** | has release tag (v1.0.0+) AND deployed URL AND recent deploy (90d) | Celebrate — promote, add to FrankX/Arcanea product list |
| ⚫ **Uncategorized** | ambiguous state (e.g., archived repos, forks, WIP that's stale but recently committed) | Manual review |

## Behavior

### Phase 1: Fetch (5-10s)

Requires `gh auth login` configured.

```bash
gh repo list frankxai --limit 200 --json name,description,isArchived,isFork,pushedAt,defaultBranchRef,stargazerCount,forkCount,isPrivate,updatedAt
```

For each non-archived repo:
```bash
gh api repos/frankxai/{name}/commits?per_page=1
gh api repos/frankxai/{name}/releases/latest 2>/dev/null || echo "no-release"
gh api repos/frankxai/{name}/issues?state=open&per_page=1
gh api repos/frankxai/{name}/pulls?state=open&per_page=1
```

Also check Vercel/Netlify deployment status if repo has a `vercel.json` or `netlify.toml` (from repo content API).

### Phase 2: Grade (instant)

Python classifier (`scripts/repo-triage.py`, see `wiki/scripts/`):

```python
def grade(repo):
    days_since_push = (now - repo.pushed_at).days
    has_open_work = repo.open_issues > 0 or repo.open_prs > 0
    has_release = repo.latest_release is not None
    is_deployed = repo.has_deploy_config

    if days_since_push < 14 or has_open_work:
        return "active"
    if has_release and is_deployed and days_since_push < 90:
        return "shipped"
    if days_since_push < 90:
        return "dormant"
    if days_since_push >= 90:
        return "graveyard"
    return "uncategorized"
```

### Phase 3: Report (instant)

Write summary to `wiki/reports/repos-{YYYY-MM-DD}.md`:

```markdown
# Repo Triage — 2026-04-10

**Total:** 106 repos under frankxai/

| Grade | Count | Change vs last week |
|-------|-------|---------------------|
| 🟢 Active | 12 | +2 |
| 🚀 Shipped | 6 | 0 |
| 🟡 Dormant | 43 | -1 |
| 🔴 Graveyard | 41 | +3 |
| ⚫ Uncategorized | 4 | -4 |

## 🟢 Active (12)

| Repo | Last commit | Open issues | Notes |
|------|-------------|-------------|-------|
| arcanea-ai-app | 2d ago | 3 | Main platform |
| second-brain | 0d ago | 0 | This wiki |
| ... | | | |

## 🚀 Shipped (6)

...

## 🟡 Dormant (43) — ACTION NEEDED

Review each below — archive or resume within 30 days.

...

## 🔴 Graveyard (41) — ARCHIVE CANDIDATES

...

## ⚫ Uncategorized (4) — MANUAL REVIEW

...
```

### Phase 4: Linear write (2-5s)

Create a single Linear issue per run in `ARC-INBOX`:

```
Title: Repo triage 2026-04-10 — 41 graveyard candidates
Body: [markdown report inline]
Labels: type:reference, source:scheduled, brand:ARC
Link: wiki/reports/repos-2026-04-10.md
```

For each graveyard repo, also create an individual Linear issue with `archive-candidate` label and 30-day deadline.

### Phase 5: Commit wiki

```bash
git -C /sessions/youthful-festive-allen/mnt/Arcanea/wiki add reports/repos-*.md
git -C /sessions/youthful-festive-allen/mnt/Arcanea/wiki commit -m "chore(wiki): repo triage 2026-04-10"
```

## Acceptance Criteria

- [ ] Runs in < 60 seconds for 106 repos
- [ ] Produces a dated report in `wiki/reports/`
- [ ] Writes a single summary Linear issue per run
- [ ] Creates individual archive-candidate issues for graveyard repos
- [ ] Handles missing `gh auth` gracefully (instructs Frank to auth)
- [ ] Idempotent — running twice same day doesn't duplicate Linear issues (check by title)

## Dependencies

- `gh` CLI installed and authenticated (`gh auth login`)
- Linear MCP connected
- Git available in wiki directory
- Scheduled task infrastructure (see `schedule` skill)

## Scheduled Task Config

```yaml
name: weekly-repo-triage
schedule: "0 10 * * 0"  # Sundays 10am
command: /repo-triage
notify_on: failure
```

---

*106 repos is not manageable by human attention. Automate or prune — those are the only options.*
