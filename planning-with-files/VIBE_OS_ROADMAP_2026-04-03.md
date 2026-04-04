# Vibe OS V1 Product Roadmap — 2026‑04‑03

## Goal

Deliver a fully opinionated, state‑based creator OS that links time‑of‑day, energy, rituals, projects, prompts/music, and SIS memory into a single V1 experience. This doc sets the routes, entity model, third‑party integrations, and build order for the production app that now lives at `apps/vibe-os`.

## Routes

1. `/` — Today dashboard
   - current state (time + energy)
   - recommended mode + project
   - quick path to start session
   - SIS snapshot sidebar
2. `/session` (progressive) — Active session workspace
   - selected mode + ritual steps
   - active objective, timer, verification intent
   - prompt + music references + import/upload buttons
   - reflection capture + SIS writeback
3. `/projects` — Project OS directory
   - Arcanea Music, GenCreator, Focus Engineering, Night Recovery lanes
   - each lane lists rituals, presets, assets, prompt packs
4. `/library` — Imported content library
   - prompt markdown snippets, music direction files, project specs
   - filter by kind/tag/project, surface excerpt previews
5. `/review` — Pattern reflection
   - session archive
   - SIS highlight view
   - mode effectiveness dashboard (time/energy/mode)

## Entities

1. **State** – `timeOfDay`, `energy`, mood/focus/social/recovery flags, delta versus previous session.
2. **Mode** – `id`, `name`, `intent`, `windows`, `energyProfile`, `ritualIds`, `soundtrackCue`, `promptFrame`.
3. **Ritual** – `steps`, `minutes`, `cue`, preferred times.
4. **Session** – `modeId`, `projectId`, `objective`, `duration`, `verification`, `reflection`, `attachments`.
5. **Project OS** – `name`, `lane`, `outcome`, `promptPaths`, `musicPaths`, `operatingRules`.
6. **Preset** – `timeOfDay`, `energy`, `modeId`, `projectId`, `sessionObjective`.
7. **ImportedAsset** – `kind` (`music`|`prompt`|`project`), `title`, `excerpt`, `sourcePath`, `tags`.
8. **SisSnapshot** – `sisRoot`, vault `counts`, `highlights`, `summary lines`.

## Integrations

- **SIS / Starlight** (`~/.starlight`)
  - read vault jsonl files for counts/highlights
  - read `.arcanea/sis/summary.md` for current context
  - V2: write reflections/patterns via vault append calls
- **Prompt/Music Markdown** (`prompts/`, `.arcanea/prompts/`, `.arcanea/projects/`)
  - import first 18 files, parse excerpt/title/tags
  - future: index by metadata + add watchers/auto-import
- **Suno / Udio (planned)**
  - surface links inside `/session` when user runs generation
  - store generated files in asset catalog
- **Notion / other CMS (optional)**
  - optional sync for project specs or public-facing documentation

## Build Order

### Sprint 0 — Foundation (already delivered)
1. scaffold `apps/vibe-os`
2. define domain entities + constants
3. implement `/` today page with modes, rituals, presets
4. connect SIS read logic + markdown imports
5. verify TS, build (lint still blocked by shared toolchain)

### Sprint 1 — Sessions + Projects
1. add `/session` route with:
   - ritual step tracking
   - objective + timer UI
   - reflection capture (draft stored client side)
2. add `/projects` route to expose each lane’s operating rules
3. persist `Session` state in memory/URL so user can resume

### Sprint 2 — Library + Review
1. extend `ImportedAsset` view into `/library`
2. add filters (kind/mode/project/tags)
3. build `/review` with:
   - SIS highlights
   - session log
   - mode effectiveness metrics (counts / average energy)
4. add ability to mark a session as “learned” and queue SIS writeback

### Sprint 3 — SIS writeback + integrations
1. integrate SIS append APIs (`scripts/sis-write.mjs`)
   - reflection entries
   - pattern notes
2. add Suno/Udio link capture inside `/session`
3. add optional Notion import/export connector for prompt/project specs
4. capture generation metadata (mood tags, prompt versions, status)

### Sprint 4 — Distribution + polish
1. add PWA manifest + install flow
2. design system polish: gradients, animations, glass tiers
3. instrumentation: track mode adoption, ritual compliance, session completion
4. Desktop wrapper (Tauri) if local integrations required
5. Android companion (capture + nightly check-in) once loop is stable

## Dependencies & Risks

- Node <=20 tooling must run before lint; current shell was Node 24, so lint surfaced AJV failure.
- SIS must exist locally or be mocked (`~/.starlight` or `.arcanea/sis/summary.md`).
- Markdown imports rely on project structure remaining under `prompts/` and `.arcanea/`.
- Any upstream Arcanea routing changes need re-sync (e.g., new planning files, mode sets).

## Next Action Suggestions

1. Build `/session` route with ritual steps + reflection capture.
2. Add SIS append integration to write reflections back automatically.
3. Unlock `pnpm --dir apps/vibe-os lint` by targeting Node 20 and fixing the AJV runtime error before relying on ESLint results.
