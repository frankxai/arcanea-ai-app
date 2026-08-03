# Meridian Release Contract — 2026-08-04

## Scope

Create a new, non-root Arcanea.ai saga experience for *Arcanea: Meridian*: the selected relic-sidebar world entry, a reserved five-panel story entry, an interactive five-relic archive, Chapter Zero reader, narrative bible, staged lore, and measurable split-test ingress.

## Owner

Codex implementation agent; Frank/Arcanea remains editorial, canon, product, and merge approver.

## Files

- `apps/web/app/sagas/meridian/**`
- `apps/web/public/images/sagas/meridian/**`
- `.arcanea/lore/staging/MERIDIAN_CYCLE.md`
- `book/chronicles-of-arcanea/sagas/meridian/**`
- `docs/ops/MERIDIAN_RELEASE_CONTRACT_2026-08-04.md`
- `design-qa.md`

## Non-goals

- No change to `/` in this branch.
- No promotion into `CANON_LOCKED.md`.
- No full CMS, account flow, payment, or generative character-chat backend.
- No automatic merge, production promotion, paid traffic, or external publication.

## Acceptance

- `/sagas/meridian` defaults to the relic-sidebar world entry.
- `?entry=story` renders the five-panel story entry without a separate redesign.
- `/sagas/meridian/enter` performs sticky 50/50 assignment and supports explicit QA overrides.
- Five relic controls update a full record with accessible tab semantics.
- Chapter Zero is readable on mobile and desktop and tracks start/completion with variant attribution.
- All primary CTAs resolve to live routes/anchors.
- New narrative material stays clearly marked as staging.
- No raw application colors bypass the design tokens.

## Verification

- `pnpm --filter @arcanea/web type-check`
- scoped ESLint for new TypeScript/TSX
- `pnpm --filter @arcanea/web build`
- browser-rendered desktop, tablet, and mobile checks
- keyboard/focus, relic tab switching, anchor navigation, experiment redirect/cookie, Chapter Zero progress
- browser console error review
- source-vs-rendered side-by-side comparison recorded in `design-qa.md`

## Rollback

Remove the isolated `/sagas/meridian` route tree, its public image directory, and the three staging/strategy documents. No root route, database, locked-canon file, or shared schema is modified, so rollback has no migration dependency.

