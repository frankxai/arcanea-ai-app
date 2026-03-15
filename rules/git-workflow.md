# Arcanea Git Workflow

## Branch Strategy

- `main` — stable, protected
- `lean-prod` — active development branch
- Feature branches: `feat/<name>`, `fix/<name>`, `chore/<name>`
- Push to production: `git push production lean-prod:main`

## Remotes

- `origin` — arcanea-records (source repo)
- `production` — arcanea-ai-app (Vercel deployment source)

## Commit Style

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `perf:`
- Scope in parens: `feat(nav):`, `fix(chat):`, `chore(deps):`
- Imperative mood: "add feature" not "added feature"
- Keep subject under 72 characters
- Body for context when the "why" isn't obvious

## Pre-Commit Checks

- Secrets scan (blocks sk-*, sbp_*, sb_secret_*, ghp_*, eyJ*)
- No `.env` files
- No `console.log` in production code (warnings allowed in dev)

## Before Pushing

1. Verify build succeeds locally or trust Vercel as ground truth
2. Check for barrel export (`index.ts`) dangling references if files were deleted
3. Fix ALL TypeScript errors before pushing — don't push one fix at a time
4. After push, verify Vercel deployment status

## Dangerous Operations — ALWAYS CONFIRM

- `git push --force` — never to main/production without explicit approval
- `git reset --hard` — check for uncommitted work first
- `git branch -D` — verify branch is fully merged
- `git checkout -- .` — verify no in-progress work will be lost

## WSL2 Considerations

- Git alternates: `GIT_OBJECT_DIRECTORY=/home/frankx/.arcanea-objects` (active while C: < 20GB)
- If 35+ zombie git processes: `pkill -f git` before operations
- `index.lock` — investigate before deleting (`rm .git/index.lock`)
- Check `df -h /mnt/c/` — keep above 5GB free
