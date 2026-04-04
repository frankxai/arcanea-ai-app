# Vibe OS MVP Handover - 2026-04-03

## Status

Vibe OS now exists as a real standalone app surface inside the monorepo at `apps/vibe-os`.

This is not a Notion-only prototype and not an internal ops page. It is the start of a separate browser product that uses SIS as its memory substrate.

## What Was Built

- dedicated Next.js app scaffold at `apps/vibe-os`
- design baseline with local Tailwind and app-specific globals
- domain model for:
  - `State`
  - `Mode`
  - `Ritual`
  - `Session`
  - `Project`
  - `Preset`
- first planning UI:
  - time-of-day selection
  - energy selection
  - project lane selection
  - recommended operating modes
- first operating modes:
  - Arcanea Music
  - GenCreator
  - Focus
  - Night
- ritual execution blocks for recommended mode
- preset session launcher cards
- SIS read bridge:
  - vault counts
  - recent highlights
  - bridge summary read from `.arcanea/sis/summary.md`
- markdown import adapter for:
  - `prompts/`
  - `.arcanea/projects/`
  - `.arcanea/prompts/`

## Why This Exists

The product thesis is:

Vibe OS is a state-based planner and ritual engine for creative work.

It is not:

- a generic todo app
- a notes wiki
- just another Arcanea internal tool
- a replacement memory system

It exists because the real workflow problem is:

- choose the right state
- choose the right mode
- launch the right session
- bring in the right prompts, music, and project context
- capture what worked
- write durable learnings back into SIS

That loop is a product boundary.

## Why Dedicated App Instead Of Notion

Notion is useful as an admin surface, source system, or optional ingestion layer.

It is weak as the primary runtime for this product because it does not natively give:

- a true state engine
- mode recommendation
- ritual-first execution
- one-click session launch
- opinionated creative flow UX
- product-grade behavior around active work blocks

So the chosen direction is:

- dedicated browser product for runtime UX
- SIS for canonical memory
- optional Notion integration later if useful

## What Is Connected

### 1. SIS / Starlight

Connected through `apps/vibe-os/lib/sis.ts`.

Reads from:

- `~/.starlight/vaults/*.jsonl`
- `.arcanea/sis/summary.md`

Current usage:

- vault counts
- recent highlights
- bridge summary

Meaning:

Vibe OS already consumes the canonical memory substrate rather than inventing a second one.

### 2. Arcanea repo knowledge

Connected through `apps/vibe-os/lib/importers.ts`.

Imports from:

- `prompts/`
- `.arcanea/projects/`
- `.arcanea/prompts/`

Current usage:

- prompt material
- project material
- music-adjacent material if path/name suggests music context

Meaning:

existing knowledge is becoming structured runtime content for Vibe OS instead of staying trapped in markdown only.

### 3. Arcanea planning layer

Connected through planning updates:

- `planning-with-files/CURRENT_CHANGELOG_2026-04-02.md`
- `planning-with-files/CURRENT_STATE_2026-04-03.md`

Meaning:

the repo execution layer now knows this product slice exists.

## Files Added

- `apps/vibe-os/package.json`
- `apps/vibe-os/next.config.js`
- `apps/vibe-os/tsconfig.json`
- `apps/vibe-os/postcss.config.js`
- `apps/vibe-os/tailwind.config.ts`
- `apps/vibe-os/eslint.config.mjs`
- `apps/vibe-os/next-env.d.ts`
- `apps/vibe-os/app/layout.tsx`
- `apps/vibe-os/app/page.tsx`
- `apps/vibe-os/app/globals.css`
- `apps/vibe-os/components/vibe-os-shell.tsx`
- `apps/vibe-os/lib/domain.ts`
- `apps/vibe-os/lib/sis.ts`
- `apps/vibe-os/lib/importers.ts`

## Verification

Passed:

- `pnpm --dir apps/vibe-os type-check`
- `pnpm --dir apps/vibe-os build`

Blocked:

- `pnpm --dir apps/vibe-os lint`

Lint is currently failing due to shared ESLint/AJV toolchain/runtime failure before app file analysis begins. This appears to be environment/tooling-level, not a Vibe OS code-level issue.

Also note:

- repo contract expects Node 20.x
- current shell runtime observed during work was Node 24.x

That mismatch may be contributing to tooling instability and should be corrected before trusting lint results repo-wide.

## Dependencies

### Direct runtime dependencies

- Next.js
- React
- React DOM

### Build/tooling dependencies

- TypeScript
- Tailwind CSS
- PostCSS
- ESLint

### Product dependencies

- canonical SIS home at `~/.starlight`
- existing Arcanea markdown prompt/project materials

### Organizational dependencies

Vibe OS depends conceptually on:

- SIS / Starlight for memory
- Arcanea for optional themed mode packs and creative overlays
- ACOS for future operator/admin workflows if needed

It should not depend on Arcanea branding to function.

## Product Role In Ecosystem

### For us

Provides:

- a real runtime environment for state-based planning
- a home for AI music workflow orchestration
- a better execution loop than scattered prompts, docs, and tabs
- a product boundary that can ship independently

### For Arcanea

Provides:

- a practical, non-lore-heavy product in the ecosystem
- a place where Arcanea can later contribute premium mode packs and thematic wrappers
- a clearer separation between:
  - memory substrate
  - operator tooling
  - consumer-facing product

### For community

Potential value:

- usable daily operating system for creators
- neuro-state-aware workflow tooling
- better prompt, music, and project continuity
- future public product that is easier to adopt than full Arcanea mythology

## Current UX Shape

Current MVP shape is:

- Today / planner-first
- choose time-of-day
- choose energy
- choose project lane
- get mode recommendation
- inspect rituals
- launch via presets
- browse imported source content
- see SIS highlights

This is the right direction because it is mode-first, not task-first.

## Recommended Next Slice

Build next:

1. session launcher state
- active session
- countdown / duration
- reflection closeout

2. structured import normalization
- proper music asset model
- prompt pack model
- project operating system presets

3. SIS writeback
- reflection writeback
- session learnings
- mode effectiveness notes

4. external workflow capture
- Suno links
- Udio links
- generated track status
- prompt/version tracking

5. route structure
- `/`
- `/session`
- `/projects`
- `/library`
- `/review`

## What Not To Do Next

Do not:

- rebuild memory storage from scratch
- move runtime UX into Notion
- start Android first
- add too much Arcanea lore into first-contact UX
- widen into full task management before session loop is excellent

## Recommended Platform Sequence

- web app first
- PWA second
- Tauri desktop wrapper later if local integrations become necessary
- Android companion later for capture and review

## Notes For Next Agent

- avoid touching active dirty `apps/web/app/api/memory/*` files unless integration explicitly requires it
- preserve SIS as source of truth
- keep Vibe OS product-neutral enough to stand on its own
- treat Arcanea as optional thematic overlay, not core dependency
- fix Node/runtime alignment before trusting lint or broader workspace tooling
