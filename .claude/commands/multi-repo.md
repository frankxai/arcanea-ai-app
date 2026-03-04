---
description: Multi-repo coordination - check status, sync, and coordinate across all Arcanea/FrankX repos
thinking: true
---

# Multi-Repo Coordination Mode

Coordinate work across the full FrankX/Arcanea ecosystem.

## Quick Status Check
Run parallel scouts to check multiple repos simultaneously:

### Core Repos to Monitor
1. `/mnt/c/Users/frank/Arcanea` — Main hub
2. `/mnt/c/Users/frank/arcanea-ai-app` — Production app
3. `/mnt/c/Users/frank/arcanea-flow` — Flow V3
4. `/mnt/c/Users/frank/FrankX` — Creator hub
5. `/mnt/c/Users/frank/Starlight-Intelligence-System` — Memory layer

### Status Commands
```bash
# Git status across all repos
for repo in Arcanea arcanea-ai-app arcanea-flow FrankX Starlight-Intelligence-System; do
  echo "=== $repo ===" && git -C /mnt/c/Users/frank/$repo status -sb 2>/dev/null
done
```

## Coordination Patterns

### Cross-Repo Feature
1. Scout all affected repos (Explore agents in parallel)
2. Plan the cross-repo change (Plan agent)
3. Implement in each repo (Workers in worktrees)
4. Verify integration (Test workers)

### Sync Check
- Compare agent definitions across repos
- Verify .arcanea/ canonical sources haven't drifted
- Check CLAUDE.md consistency
- Validate MCP server configs

### Publish Pipeline
- Build & test in arcanea-flow
- Publish @claude-flow/cli + claude-flow umbrella
- Update arcanea-ai-app dependencies
- Verify production build

What multi-repo work do we need to coordinate?
