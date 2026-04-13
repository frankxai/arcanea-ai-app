#!/usr/bin/env python3
"""
repo-triage.py — Weekly GitHub repo grading for frankxai/*

Grades all repos under a GitHub owner into active/dormant/graveyard/shipped/uncategorized.
Writes a dated markdown report to wiki/reports/ and (optionally) files a Linear issue.

Usage:
    python repo-triage.py --owner frankxai
    python repo-triage.py --owner frankxai --dry-run
    python repo-triage.py --owner frankxai --output wiki/reports/repos-2026-04-10.md

Dependencies:
    - gh CLI (authenticated: `gh auth login`)
    - Python 3.10+
    - stdlib only (json, subprocess, datetime, pathlib, argparse)

Called by: /repo-triage skill, weekly scheduled task (Sundays 10am)
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass, asdict
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Optional


# ─────────────────────────────────────────────────────────────────────────────
# Data model
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Repo:
    name: str
    description: str
    is_archived: bool
    is_fork: bool
    is_private: bool
    pushed_at: datetime
    updated_at: datetime
    default_branch: str
    stars: int
    forks: int
    open_issues: int = 0
    open_prs: int = 0
    has_release: bool = False
    latest_release: Optional[str] = None
    has_deploy_config: bool = False
    grade: str = "uncategorized"
    grade_reason: str = ""

    @property
    def days_since_push(self) -> int:
        return (datetime.now(timezone.utc) - self.pushed_at).days


# ─────────────────────────────────────────────────────────────────────────────
# GitHub via `gh` CLI
# ─────────────────────────────────────────────────────────────────────────────

def gh(args: list[str]) -> dict | list:
    """Run `gh api` or `gh repo list`. Returns parsed JSON."""
    result = subprocess.run(
        ["gh"] + args,
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"gh failed: {' '.join(args)}\n{result.stderr}")
    return json.loads(result.stdout) if result.stdout.strip() else {}


def list_repos(owner: str, limit: int = 200) -> list[Repo]:
    """List all repos for an owner using `gh repo list`."""
    raw = gh([
        "repo", "list", owner,
        "--limit", str(limit),
        "--json", "name,description,isArchived,isFork,isPrivate,pushedAt,updatedAt,defaultBranchRef,stargazerCount,forkCount",
    ])
    if not isinstance(raw, list):
        raise RuntimeError(f"Expected list from gh repo list, got {type(raw)}")

    repos: list[Repo] = []
    for r in raw:
        repos.append(Repo(
            name=r["name"],
            description=r.get("description") or "",
            is_archived=r["isArchived"],
            is_fork=r["isFork"],
            is_private=r["isPrivate"],
            pushed_at=parse_iso(r["pushedAt"]),
            updated_at=parse_iso(r["updatedAt"]),
            default_branch=(r.get("defaultBranchRef") or {}).get("name") or "main",
            stars=r["stargazerCount"],
            forks=r["forkCount"],
        ))
    return repos


def enrich_repo(owner: str, repo: Repo) -> Repo:
    """Fetch open issues, PRs, latest release, deploy config for a repo."""
    try:
        issues = gh(["api", f"repos/{owner}/{repo.name}/issues?state=open&per_page=1"])
        repo.open_issues = len(issues) if isinstance(issues, list) else 0
    except Exception:
        pass

    try:
        pulls = gh(["api", f"repos/{owner}/{repo.name}/pulls?state=open&per_page=1"])
        repo.open_prs = len(pulls) if isinstance(pulls, list) else 0
    except Exception:
        pass

    try:
        release = gh(["api", f"repos/{owner}/{repo.name}/releases/latest"])
        if isinstance(release, dict) and release.get("tag_name"):
            repo.has_release = True
            repo.latest_release = release["tag_name"]
    except Exception:
        pass

    for config in ("vercel.json", "netlify.toml", "wrangler.toml", "Dockerfile"):
        try:
            gh(["api", f"repos/{owner}/{repo.name}/contents/{config}"])
            repo.has_deploy_config = True
            break
        except Exception:
            continue

    return repo


def parse_iso(s: str) -> datetime:
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


# ─────────────────────────────────────────────────────────────────────────────
# Grading logic
# ─────────────────────────────────────────────────────────────────────────────

def grade(repo: Repo) -> tuple[str, str]:
    """Grade a repo. Returns (grade, reason)."""
    if repo.is_archived:
        return "graveyard", "explicitly archived"
    if repo.is_fork:
        return "uncategorized", "fork"

    days = repo.days_since_push
    has_open_work = repo.open_issues > 0 or repo.open_prs > 0

    if days < 14 or has_open_work:
        reason = f"recent activity ({days}d)" if days < 14 else f"{repo.open_issues + repo.open_prs} open items"
        return "active", reason

    if repo.has_release and repo.has_deploy_config and days < 90:
        return "shipped", f"released {repo.latest_release}, deployed"

    if days < 90:
        return "dormant", f"last push {days}d ago"

    return "graveyard", f"inactive {days}d"


# ─────────────────────────────────────────────────────────────────────────────
# Report
# ─────────────────────────────────────────────────────────────────────────────

GRADE_EMOJI = {
    "active": "🟢",
    "shipped": "🚀",
    "dormant": "🟡",
    "graveyard": "🔴",
    "uncategorized": "⚫",
}


def render_report(owner: str, repos: list[Repo], when: datetime) -> str:
    by_grade: dict[str, list[Repo]] = {g: [] for g in GRADE_EMOJI}
    for r in repos:
        by_grade[r.grade].append(r)

    total = len(repos)
    lines = [
        f"---",
        f"title: Repo Triage — {when.date().isoformat()}",
        f"domain: meta",
        f"created: {when.date().isoformat()}",
        f"updated: {when.date().isoformat()}",
        f"author: claude",
        f"status: generated",
        f"links: [../skills/repo-triage, ../meta/semantic-map-at-scale]",
        f"---",
        "",
        f"# Repo Triage — {when.date().isoformat()}",
        "",
        f"**Owner:** {owner}",
        f"**Total repos scanned:** {total}",
        "",
        "## Summary",
        "",
        "| Grade | Count |",
        "|-------|-------|",
    ]
    for g in ("active", "shipped", "dormant", "graveyard", "uncategorized"):
        lines.append(f"| {GRADE_EMOJI[g]} {g.title()} | {len(by_grade[g])} |")

    for g in ("active", "shipped", "dormant", "graveyard", "uncategorized"):
        bucket = by_grade[g]
        if not bucket:
            continue
        lines += ["", f"## {GRADE_EMOJI[g]} {g.title()} ({len(bucket)})", ""]
        if g == "graveyard":
            lines.append("> **Action:** archive or revive within 30 days.")
            lines.append("")
        elif g == "dormant":
            lines.append("> **Action:** review weekly; convert to active or graveyard.")
            lines.append("")
        lines += [
            "| Repo | Last push | Stars | Reason |",
            "|------|-----------|-------|--------|",
        ]
        for r in sorted(bucket, key=lambda x: x.days_since_push):
            lines.append(
                f"| [{r.name}](https://github.com/{owner}/{r.name}) "
                f"| {r.days_since_push}d ago "
                f"| {r.stars} "
                f"| {r.grade_reason} |"
            )

    lines += [
        "",
        "---",
        "",
        f"*Generated by [repo-triage.py](../scripts/repo-triage.py) at {when.isoformat()}*",
        "",
    ]
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description="Grade all GitHub repos for an owner")
    parser.add_argument("--owner", default="frankxai", help="GitHub owner/org")
    parser.add_argument("--limit", type=int, default=200, help="Max repos to scan")
    parser.add_argument("--output", help="Output markdown path (defaults to wiki/reports/repos-{date}.md)")
    parser.add_argument("--dry-run", action="store_true", help="Don't write files")
    parser.add_argument("--no-enrich", action="store_true", help="Skip per-repo API calls (faster but less accurate)")
    args = parser.parse_args()

    # Verify gh auth
    try:
        subprocess.run(["gh", "auth", "status"], capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("ERROR: gh CLI not authenticated. Run: gh auth login", file=sys.stderr)
        return 1

    print(f"Fetching repos for {args.owner}...", file=sys.stderr)
    repos = list_repos(args.owner, limit=args.limit)
    print(f"Found {len(repos)} repos", file=sys.stderr)

    if not args.no_enrich:
        print("Enriching with issues/PRs/releases...", file=sys.stderr)
        for i, repo in enumerate(repos):
            if repo.is_archived or repo.is_fork:
                continue
            print(f"  [{i+1}/{len(repos)}] {repo.name}", file=sys.stderr)
            enrich_repo(args.owner, repo)

    print("Grading...", file=sys.stderr)
    for repo in repos:
        repo.grade, repo.grade_reason = grade(repo)

    when = datetime.now(timezone.utc)
    report = render_report(args.owner, repos, when)

    output_path = Path(args.output) if args.output else Path(
        f"wiki/reports/repos-{when.date().isoformat()}.md"
    )

    if args.dry_run:
        print("DRY RUN — would write to:", output_path, file=sys.stderr)
        print(report)
    else:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(report)
        print(f"✓ Wrote {output_path}", file=sys.stderr)

    # Print grade summary to stderr for scheduled-task logs
    counts: dict[str, int] = {}
    for r in repos:
        counts[r.grade] = counts.get(r.grade, 0) + 1
    print(f"Summary: {counts}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
