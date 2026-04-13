# Arcanea Flow Ownership & Handoff

## Context
Arcanea now owns the `arcanea-flow` identity and the associated CLI surface. The repo merges upstream `ruvnet/claude-flow` changes as a migration so the naming never snaps back to `claude-flow`.

## Collaboration
1. Before pulling or merging upstream changes from `ruvnet/claude-flow`, rerun the rename steps so the CLI, packages, and workflows keep referencing `@arcanea-flow`.
2. Open a joint issue or PR in `ruvnet/claude-flow` describing the rename, linking back to this repo so RuvNet can decide whether to adopt the new identity or sync to Arcanea's branch.
3. Mention this handoff file when coordinating contributions so other agents know to keep the release names aligned and to map `arcanea-flow` to the new bin path.
4. Keep `repo-constellation.json` (under `.arcanea/projects/`) in sync with the rename so builds, releases, and CLI references resolve the same package identity.

## Verification guidance
- `pnpm -r run build --if-present`
- `pnpm --dir arcanea-flow/v3/@arcanea-flow/cli run build`
- `pnpm --dir arcanea-flow/v3/@arcanea-flow/cli run lint`
- Ensure `.github/workflows/` no longer mention `claude-flow`
