# Core world tool registration modules

Source: Codex task `01a086b7-f24a-7d40-98d3-f94d9f6a2ba9`.
Branch: `codex/arcanea-world-mcp-core-registrations-20260909`.
Base: registration preparation `72bb0bfb612d0590b1ba77b573707b8481126412`.

Scope: Complete the extraction of registration groups from the MCP entrypoint.
Owner: capability-delivery coordinator, one writer. Files: entrypoint, generator,
world graph, world intelligence, persistence and visual-prompt registration
modules, plus this record. No runtime behavior, dependencies, canon, review policy,
installation, publication or production settings change.

The entrypoint now composes twelve registration functions in 65 lines. Five
additional modules contain the remaining 23 tool registrations; each stays below
300 lines. All registration modules, including the parent change, stay below 400
lines. The existing singleton remains in place until the separate runtime repair.

All moved registration syntax trees and their order match the parent. Real SDK
discovery and responses remain byte-identical to the original formatted baseline:
54 tools, five resources, six prompts, every resource and prompt read, six valid
tool calls and two rejected invalid requests. Evidence is 91,516 bytes, SHA-256
`d1b7279891784ee6c1dc426c0bc0df7beb942eef6d3415b9b3b24c31e38eb62b`.

TypeScript compilation and unchanged Prettier checks pass. All 384 tests pass with
zero failures or skips in the private source-layout fixture. That fixture includes
the verified repository library; it does not claim the library is bundled in the
published package. Test processes close, and compiled outputs remain outside Git.

This preparation depends on the prior formatting and registration changes.
Independent review, full CI against main, and parent integration remain required.
Reconcile the tested runtime and package fixes after this preparation; the small
entrypoint prevents factory indentation from overwhelming the semantic review.
Preserve prior candidate commits and immutable archives throughout integration.

Rollback: revert this extraction commit. No data migration is needed.
