# Prompt Books Registry Sync - 2026-06-26

## Change Contract

- Scope: Bridge the canonical `prompt-library` registry into Arcanea Prompt Books as a generated, typed metadata registry.
- Owner: Frank / Starlight, with Arcanea app as the first consumer.
- Files:
  - `scripts/sync-prompt-library-registry.mjs`
  - `apps/web/lib/prompt-books/public-registry.generated.json`
  - `apps/web/lib/prompt-books/public-registry.ts`
  - `apps/web/lib/prompt-books/index.ts`
- Non-goals:
  - No backend migration in this slice.
  - No public bundling of full prompt bodies until publish/visibility rules are defined.
  - No rewrite of the dirty Prompt Books UI page in this slice.
- Acceptance:
  - Arcanea can import a generated registry from sibling `prompt-library`.
  - Registry supports Starlight, Arcanea, general, and FrankX scopes.
  - Typed helpers can list, get, count, and search public registry entries.
- Verification:
  - Run `node scripts/sync-prompt-library-registry.mjs`.
  - Confirm counts in `apps/web/lib/prompt-books/public-registry.generated.json`.
  - Run `git diff --check`.
- Rollback:
  - Remove the generated JSON, helper file, sync script, and exports from `apps/web/lib/prompt-books/index.ts`.

## Source Patterns Reviewed

- Fabric: Git-native prompt patterns organized by real-world tasks and usable from preferred tools or CLI. Source: https://github.com/danielmiessler/fabric
- Promptfoo: prompt, model, agent, and RAG evals with red teaming and CI/CD integration. Source: https://github.com/promptfoo/promptfoo
- Langfuse prompt management: centralized storage, versioning, retrieval, deployment labels, and client-side caching. Source: https://langfuse.com/docs/prompt-management/overview
- AI Primitives Hub: multi-source prompt marketplace with search, filters, install, version tracking, and profiles. Source: https://github.com/AmadeusITGroup/ai-primitives-hub
- Prompt Optimizer: prompt optimization, iterative improvement, analysis, compare evaluation, and multi-surface access through web, desktop, extension, and Docker. Source: https://github.com/linshenkx/prompt-optimizer

## Architecture Decision

Use a four-layer system:

1. `prompt-library` is the Git-native canonical source of reviewed prompt patterns, prompt books, eval scaffolds, red-team status, provenance, and ranking.
2. `prompt-library/registry/index.json` is the generated source registry for agents, apps, docs, MCP, and future publishing.
3. `arcanea-ai-app/apps/web/lib/prompt-books/public-registry.generated.json` is the app-safe generated metadata mirror.
4. Arcanea Prompt Books UI/PWA handles capture, search, save, import, mobile retrieval, private user collections, and public/community browsing.

This keeps prompt authoring and review in Git, while the app becomes the daily mobile-friendly retrieval and capture surface.

## Scope Split

- Starlight Prompt Books: general swarms, project leadership, repo execution, SIS governance, MCP/tool retrieval, evidence, ranking, and prompt-library operations.
- Arcanea Prompt Books: worldbuilding, lore, canon, characters, factions, mythic systems, Arcanean Prompt Language, media prompts, and creative studio workflows.
- General Prompt Library: portable prompts with no brand/world assumptions.
- FrankX Prompt Books: business, creator products, content, revenue, partnerships, and public education.

## Current Registry Counts

After sync on 2026-06-26:

- Total prompts: 104
- Total books: 4
- Starlight: 10 prompts, 2 books
- Arcanea: 1 prompt, 1 book
- General: 73 prompts, 1 book
- FrankX: 20 prompts, 0 books

## Mobile And Capture Path

Arcanea already has the right user surface:

- PWA manifest with share target at `/prompt-books/share`.
- Share route that redirects shared content into `/prompt-books?capture=...`.
- Quick capture modal/store for saving raw prompt text.

The next mobile slice is to add a registry browser/import panel:

- Search registry by keyword and scope.
- Filter to Starlight, Arcanea, general, or FrankX.
- Show rank, source, attribution, eval, and red-team status.
- Save selected registry entry into a personal collection.
- Keep raw user capture and optimized prompt version together.

## MCP And Agent Path

Expose prompt-library through a small MCP surface:

- `prompt.search(query, scope, tags)`
- `prompt.get(id)`
- `prompt.save(raw, scope, collection)`
- `prompt.optimize(raw, targetModel, useCase)`
- `prompt.evaluate(id, fixture)`
- `prompt.rank(scope)`
- `prompt.compile(id, variables)`
- `prompt.publish(id, destination)`

The MCP should read from the canonical `prompt-library`, not from Arcanea's generated app bundle. Arcanea is the user product surface; prompt-library remains the source of truth.

## Ranking And Quality Gates

Ranking should combine:

- Eval score and test count.
- Red-team status.
- Provenance completeness and license.
- Recency.
- Editor pick or usage signal.
- Save/import/use count once Arcanea app telemetry exists.

No prompt should become a public/community pack without:

- Purpose.
- Input contract.
- Output contract.
- Failure modes.
- Eval rubric.
- Attribution/license.
- Red-team status.
- Scope.
- Version.

## Next Execution Slices

1. Add Prompt Books UI registry panel using `searchPublicRegistry`, `listPublicRegistryPrompts`, and `getPublicRegistryScopeCounts`.
2. Add "save to my Prompt Books" action that converts a registry entry into the existing `CreatePromptInput` shape.
3. Add a prompt-library MCP server for agent retrieval and save/optimize commands.
4. Add promptfoo CI for new prompt patterns and rank updates.
5. Add a public/community publish gate that allows prompt bodies only after visibility and license checks pass.
