# Current Changelog — 2026-04-01

## Verified Promotion Slice

- Integrated project workspace branch onto current `main` in a clean worktree
- Verified promotion branch with:
  - `pnpm run verify:project-workspaces`
  - `pnpm --dir apps/web test:media`

## Product/Engineering Changes In Scope

- Added first-class `/projects` and `/projects/[id]` surfaces
- Added project APIs and linking actions for sessions and creations
- Added project graph summaries, progress guidance, and trace hooks
- Added route/API contract tests for project endpoints
- Added Playwright smoke coverage for project workspace continuity
- Added root verification command: `pnpm run verify:project-workspaces`

## Media/Gallery Cleanup

- Canonicalized official guardian media to local registry paths
- Removed legacy remote guardian gallery URL dependency for first-party media
- Removed explicit Lyssandria gallery asset from the repo
- Added click-to-enlarge behavior on guardian detail imagery
- Added media regression test to prevent remote guardian gallery paths and removed assets from silently returning

## Operational Notes

- Promotion branch is now stronger than the original integration branch because it was reverified against current remote `main`
- Mainline DB activation is still pending and remains the next external step
