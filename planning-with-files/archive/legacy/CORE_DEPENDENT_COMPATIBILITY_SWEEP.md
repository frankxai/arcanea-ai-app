# Core Dependent Compatibility Sweep

Date: 2026-03-29
Status: Draft execution plan
Base: current `main` verification + March 28 package audit

## Purpose

`@arcanea/core` is healthy again, but a ring of dependent packages is still failing because their contracts drifted away from current core exports and types.

This sweep defines what should be fixed together and in what order.

## Target Packages

Primary dependent ring:

- `packages/auth`
- `packages/cli`
- `packages/claude-arcanea`
- `packages/overlay-chatgpt`
- `packages/overlay-claude`
- `packages/overlay-copilot`
- `packages/overlay-cursor`
- `packages/overlay-gemini`

Adjacent package:

- `packages/arcanea-mcp`

## Failure Themes

### 1. Stale `@arcanea/core` exports

Seen in:

- `auth`
- `cli`
- `overlay-*`

Examples:

- `ProviderType`
- `AuthSession`
- `AuthAdapter`
- `Keystore`
- `OverlayConfig`
- `OverlayManifest`
- `ToolDetection`
- `InstallResult`
- `InstallPreview`
- `generateLoreSection*`
- `generateDesignTokensSection`
- `generateStackSection`
- token helpers like `toTailwindConfig`, `tokensToJSON`, `COLORS`

Interpretation:

- these packages still assume an older `core` surface
- either the exports need to be restored intentionally or dependents need to be migrated

### 2. `Guardian` shape drift

Seen in:

- `overlay-chatgpt`
- `overlay-claude`
- `overlay-cursor`
- `overlay-gemini`

Missing fields assumed by overlays:

- `codingStyle`
- `helpPatterns`
- `vibe`
- `signOff`
- `metaphorDomain`
- `role`

Interpretation:

- overlays are coupled to an older Guardian authoring model
- this is one migration family, not five separate bugs

### 3. Missing local entrypoints

Seen in:

- `claude-arcanea`
  - missing `./intelligence.js`
- `arcanea-mcp`
  - missing `./data/guardian-swarm/index.js`

Interpretation:

- these are packaging/entrypoint integrity issues, not type-design questions

## Sweep Strategy

### Phase 1: Decide source of truth

For each missing core export, choose one:

- restore in `@arcanea/core`
- replace in dependent package
- deprecate and remove usage entirely

Do not mix all three patterns casually.

### Phase 2: Stabilize shared types

Handle once for the whole ring:

- Guardian overlay-facing type
- auth/provider/keystore contract
- token/design helper ownership

Output should be a single compatibility map, not ad hoc per-package edits.

### Phase 3: Fix package-local integrity

Package-local fixes:

- `claude-arcanea` entrypoint/module path
- `arcanea-mcp` missing data entrypoint

### Phase 4: Rebuild the ring

Verification order:

1. `packages/core`
2. `packages/auth`
3. `packages/cli`
4. overlay family
5. `packages/claude-arcanea`
6. `packages/arcanea-mcp`

## Recommended Execution Order

1. `auth`
   - highest leverage because it defines provider/session contract
2. `cli`
   - clarifies whether token/design helpers still belong in `core`
3. overlay family as one batch
   - same Guardian/type drift, should be solved together
4. `claude-arcanea`
   - fix entrypoint after shared contracts settle
5. `arcanea-mcp`
   - restore/remove missing `guardian-swarm` path

## Decision Questions Before Code Changes

1. Does `@arcanea/core` still intend to be the home of auth/provider primitives?
2. Are overlay prompt/template helpers still strategic, or should they move out of `core` ownership?
3. Is Guardian still meant to expose authoring/personality fields like `codingStyle` and `signOff`, or have overlays outgrown the canonical type?
4. Should `claude-arcanea` and `arcanea-mcp` depend on generated local files, or should those be build-time artifacts with guaranteed generation?

## Success Criteria

- every primary dependent package builds
- no package relies on mystery exports from older `core`
- overlay family shares one current Guardian contract
- entrypoint integrity issues are removed
- package health report can move these packages out of `NEEDS_FIX`

## Not In Scope

- `/chat`
- `/imagine`
- homepage / `v3`
- `middleware.ts`
- app-level web build blockers unrelated to package compatibility

Those surfaces should be stabilized separately under the protected-surface verification flow.
