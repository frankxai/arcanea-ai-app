# Arcanea Living Codex + Creature Forge — Task Contract

**Date:** 2026-07-17  
**Branch:** `agent/hermes/living-codex-forge`

## Scope

Implement a production-shaped vertical slice that converts the existing Godbeast archive into a searchable entity registry and adds an original-creature blueprint workflow.

## Owner

Hermes on Starlight Yogabook, Arcanea creative-worlds lane.

## Files

- `apps/web/app/codex/**`
- `apps/web/components/codex/**`
- `apps/web/lib/lore/living-codex.ts`
- `apps/web/app/sitemap.ts`
- `docs/strategy/ARCANEA_LIVING_CODEX_CREATURE_FORGE_2026-07-17.md`
- `docs/evidence/living-codex/**`

## Non-goals

- Do not edit `CANON_LOCKED.md`.
- Do not invent a new origin class or promote Forge output to canon.
- Do not replace `/lore/godbeasts`.
- Do not generate a media batch while storage is critical.
- Do not add external Pokémon assets, names, data, or card layouts.
- Do not commit, push, deploy, or publish without a separate request.

## Acceptance criteria

- `/codex` renders tracked Godbeast media, search, affinity filters, and clear canon status.
- `/codex/[slug]` statically generates ten indexable profiles with metadata and JSON-LD.
- `/codex/forge` creates a deterministic original blueprint in-browser.
- Forge can copy a media prompt and download valid JSON.
- Export states `private-draft` and `not-canon`.
- Sitemap includes index, Forge, and ten entity URLs.
- No new raw color constants in feature code.
- Typecheck and build pass for affected web app.
- Desktop and mobile screenshots are inspected.
- Design evidence manifest validates and scores at least 26/30.

## Verification

```bash
pnpm --dir apps/web run type-check
pnpm --dir apps/web run build
python C:/Users/frank/starlight/repos/design-agent-standards/scripts/validate_design_evidence.py docs/evidence/living-codex/design-loop-evidence.json
```

Then run a bounded local server, inspect `/codex`, `/codex/kaelith`, and `/codex/forge` at desktop/mobile widths, check browser console, and stop the server.

## Rollback

Remove the new `app/codex`, `components/codex`, `lib/lore/living-codex.ts`, strategy/evidence files, and revert only the Codex additions in `app/sitemap.ts`.

## Storage constraint

C: free space at kickoff: **31.97 GiB (CRITICAL)**. No new worktree, install, media generation, or cache expansion. Existing clean production worktree and installed dependencies only.
