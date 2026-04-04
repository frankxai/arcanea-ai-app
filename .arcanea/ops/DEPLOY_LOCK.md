# Deploy Lock Protocol

## Rules
1. Before pushing to main, check if another agent session pushed in the last 5 minutes
2. If the last Vercel deploy is in ERROR state, DO NOT push more fixes — wait for the previous fix to build
3. Only ONE agent should own deploy fixes at a time
4. Always verify local build passes before pushing

## Current Lock
- **Status**: UNLOCKED
- **Last Push**: (auto-updated by pre-push hook)
- **Last Deploy**: READY
- **Lock Owner**: none

## How to Check
```bash
git log --oneline -1 --format="%ci %s" origin/main
```
If the last commit was < 5 minutes ago, wait.
