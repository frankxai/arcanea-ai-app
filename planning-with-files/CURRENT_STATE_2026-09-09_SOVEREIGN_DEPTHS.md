# Sovereign Depths production slice

Date: 2026-09-09. Source inspected at `c1510841af245e9d4958b31580856ec331c93904`.

Scope: Adult cinematic boss/dungeon collection, public gallery and structured proposal retrieval.
Owner: Arcanea production integration, under Frank's explicit gallery/GitHub/production request.
Files: `apps/web/app/gallery/sovereign-depths/`, `apps/web/lib/visual-encyclopedia/sovereign-depths*`, `apps/web/app/api/lore/sovereign-depths/`, collection assets, the existing MCP server registration and the canonical creative skill with its plugin adapter.
Non-goals: Locked-canon edits, creator authentication changes, existing registry receipt fabrication, game-engine implementation, unrelated repository consolidation.
Acceptance criteria: 24 bosses and 12 dungeons with separate delivered images; reciprocal links; mobile gallery/detail routes; explicit STAGING retrieval; validated publication and repository gates.
Verification: Collection schema/tests, API retrieval tests, MCP opt-in/fail-closed tests, scoped lint/typecheck/build, full repository CI and preview verification before production promotion.
Rollback: Revert the final runtime integration PR to restore prior gallery navigation and remove new public retrieval; independently merged inert assets and staged documentation remain reviewable. The creator-world gateway and locked lore remain intact.

## Verified starting state

- `arcanea.ai` is deployed from private `frankxai/arcanea-ai-app`, project `prj_90OIWsAmfeswv8IG8WxqEAFefTOV`, not the older public `frankxai/arcanea` monorepo.
- Production deployment `dpl_HQw1cr3ddXrbexQCuMRNZa9Pv3ok` is READY at the source commit above.
- Browser inspection of `https://www.arcanea.ai/gallery` shows 130 records, 130 approved masters and zero registry-published images. Cards display `Visual pending`.
- Existing encyclopedia schema requires one Gate/Guardian per record, fixed batch counts, and a prompt-wide cosmic-dark/teal/gold material treatment. Sovereign Depths keeps shared navigation, visual-library placement and tokens while allowing independent geography, ecology, disposition and encounter role.
- Existing `/api/mcp` serves an authenticated creator-world gateway. It remains unchanged. Public collection retrieval is a separate read-only API consumed by a new tool registered in the existing stdio MCP server.
- The plugin already discovers `.claude/skills/`; the adapter delegates to `.arcanea/skills/creative/sovereign-depths/SKILL.md`.

## Publication semantics

Public artwork delivery and locked-canon approval are separate states. This collection is publicly viewable worldbuilding concept art with STAGING lore, proposed books and authored encounter designs. It does not imply a published novel or implemented game. Checked-in asset provenance must identify original masters, renditions, prompts and actual reviews; it must not claim registration in a registry that was not contacted.

## Validation boundary

The authoring environment uses a connector-backed patch workspace because direct Git authentication is unavailable. Matching dependencies are installed in a separate validation fixture, never in repository manifests. This provides scoped verification, not a full-monorepo build claim. GitHub CI and deployment checks remain the final repository-wide evidence.

## Promotion checkpoint

- Original combined PR #361 was closed and superseded by bounded review slices, following the exact-head review size gate.
- Assets/data part A merged through #362 at `752f1ef86e6f148f1a4f756cb821e8be5950427d`.
- Data part B merged through #363 at `a07d4abdcf8269423b27cc020faf4ed42bf44e1b`; its exact head passed build, typecheck, lint, CI Status and AI Exact-Head Review.
- The final runtime integration consumes those four typed data parts and adds real built-app desktop/375px/reduced-motion CI evidence. Repository-wide CI and live production validation remain pending until the runtime PR completes.
- npm publication is pending: this production repository has no configured publish workflow; the existing npm distribution originates from a different repository. A source merge does not publish or update an installed plugin.
