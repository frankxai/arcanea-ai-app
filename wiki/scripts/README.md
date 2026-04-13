---
title: Scripts — Second Brain Automation
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: growing
links: [../skills/README, ../meta/second-brain-buildout-plan]
---

# Scripts

Executable automation that supports the skill workflows. Keep each script small, stdlib-first, idempotent.

## Active Scripts

| Script | Purpose | Invoked by | Runtime |
|--------|---------|-----------|---------|
| [repo-triage.py](repo-triage.py) | Grade all frankxai/* repos | `/repo-triage` skill + weekly scheduled task | ~60s for 106 repos |

## Planned

| Script | Purpose | Priority |
|--------|---------|----------|
| `check-wiki-links.py` | Verify all `links:` frontmatter resolve | P2 |
| `orphan-scan.py` | Find wiki articles with no incoming links | P2 |
| `brain-gem-harvest.py` | Pull Notion Brain Gems DB → ARC-INBOX | P1 (for /harvest skill) |
| `obsidian-harvest.py` | Drain Obsidian `## To Triage` sections → ARC-INBOX | P1 (for /harvest skill) |
| `capture-bridge.py` | Standalone CLI version of /capture for shell use | P2 |

## Conventions

- **Stdlib first.** No `requests`, no `httpx`, no `pydantic`. Use `urllib`, `subprocess`, `dataclasses`.
- **Python 3.10+.** Use `from __future__ import annotations` for forward refs.
- **Idempotent.** Running twice should not duplicate output.
- **Dry-run mode.** Every script that writes must support `--dry-run`.
- **Stderr for logs, stdout for data.** Pipeable by default.
- **Exit codes matter.** 0 = success, 1 = error, 2 = partial success.

## Testing

Manual smoke test for each new script:

```bash
python script.py --dry-run
python script.py --help
python script.py  # real run, verify output
```

No unit test framework yet. Add pytest later if scripts grow beyond 500 lines.

---

*Scripts are the load-bearing walls of the second brain. Keep them boring, keep them working.*
