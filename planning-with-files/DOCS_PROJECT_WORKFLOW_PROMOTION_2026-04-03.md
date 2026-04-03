# Docs Project Workflow Promotion - 2026-04-03

## Scope

Promote the docs workflow slice onto a `main`-based branch without carrying unrelated integration work.

Branch:
- `promote/docs-project-workflow-clean`

Source commits:
- `124180eb9` `fix(docs): harden project doc contracts and editor integration`
- `f8e8829bf` `feat(projects): make docs a first-class project workflow`

## What Landed

- project docs are now visible and actionable from `/projects`
- `/projects/[id]` treats docs as a first-class continuity layer
- `/projects/[id]/docs/new` is a real entry flow instead of a redirect spinner
- project-aware retrieval and graph enrichment include docs
- docs API save/load/version behavior is hardened around the canonical envelope
- `/docs` remains developer documentation and now points product users toward Projects for in-product docs

## Verification

Executed in a clean `main`-based worktree with placeholder Supabase env for build and workspace verification:

- `pnpm install --frozen-lockfile`
- `pnpm --dir apps/web test:projects`
- `pnpm --dir apps/web test:media`
- `pnpm --dir apps/web type-check`
- `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key pnpm --dir apps/web build`
- `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-anon-key pnpm run verify:project-workspaces`

Result:
- pass

## Release Posture

This slice is promotion-ready as a narrow product-compounding branch.

Recommended merge order after review:
1. docs project workflow
2. provider/control-plane tracing tranche
3. SIS/runtime hardening tranche

## Product Decision

Do not turn `/docs` into the primary user note-taking surface.

Recommended information architecture:
- `/docs` = developer/platform documentation
- `/projects/[id]/docs/*` = user-facing durable notes, briefs, canon, outlines, and specs
- `/chat` = active execution loop that should consume project docs via retrieval

This keeps Arcanea aligned to the product spine:
- projects
- continuity
- docs
- retrieval
- provenance
- graph intelligence
