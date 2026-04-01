# Current State — 2026-04-01

## Primary Repo

- Repo: `frankxai/arcanea-ai-app`
- Promotion worktree: `C:\Users\frank\Arcanea-main-promote`
- Promotion branch: `promote/project-workspaces`
- Source branch already integrated here: `origin/integration/project-workspaces-mainline`
- Promotion posture: already promoted to remote `main`

## What Is In This Promotion Slice

- First-class project workspaces and project graph APIs
- `/projects` and `/projects/[id]` product surfaces
- Project-linked chat sessions, creations, memories, and provenance
- Project graph summaries, progress guidance, and trace hooks
- Project-aware retrieval helper for active chat sessions using graph summary, ranked sessions, creations, and memories
- Route/API contract tests and Playwright browser smoke coverage
- Guardian/gallery media cleanup
- Local-canonical first-party guardian media paths
- Removed explicit Lyssandria gallery asset
- Click-to-enlarge behavior on guardian detail imagery

## Verified In Clean Worktree

- `pnpm run verify:project-workspaces`
- `pnpm --dir apps/web test:media`
- verification gate now self-seeds placeholder public Supabase envs for clean-machine builds

## Verification Notes

- Build and browser tests pass with placeholder public Supabase env vars:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Remaining non-blocking warnings:
  - Node engine mismatch: repo wants `20.x`, machine currently `24.14.0`
  - deprecated `middleware` convention
  - stale Browserslist data
  - edge-runtime static-generation warning

## Main External Blocker

- Live Supabase activation is still pending:
  - apply project graph migrations
  - regenerate real Supabase types from the live DB

## Repos Touched Or Audited In This Cycle

- `frankxai/arcanea-ai-app`
  - heavy engineering and promotion work
- `frankxai/arcanea`
  - used as OSS/ecosystem context, not updated in this slice
- `frankxai/arcanea-records`
  - considered as ecosystem surface, not updated in this slice
- satellite repos previously audited for merge risk:
  - `frankxai/arcanea-code`
  - `frankxai/oh-my-arcanea`

## Recommendation

- Treat remote `main` as the authoritative branch for the workspace slice
- Do DB activation in the evening
- Build project-aware retrieval and async graph enrichment immediately after DB activation
- Use the new 2026-04-02 planning files for notes/board/capture and canvas strategy:
  - `planning-with-files/CANVAS_EDITOR_DECISION_2026-04-02.md`
  - `planning-with-files/ARCANEA_PRODUCT_SYSTEM_ROADMAP_2026-04-02.md`
  - `planning-with-files/NOTES_BOARD_AND_CAPTURE_BACKLOG_2026-04-02.md`
  - `planning-with-files/NOTES_DOCS_SYSTEM_ARCHITECTURE_2026-04-02.md`
  - `planning-with-files/EDITOR_AND_TEMPLATE_DECISION_2026-04-02.md`
