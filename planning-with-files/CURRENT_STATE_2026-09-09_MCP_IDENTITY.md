# MCP creation and planning identities

Source: Codex task `01a086b7-f24a-7d40-98d3-f94d9f6a2ba9`, Arcanea capability
delivery. Base: package candidate `c358eee29070b758a193441921d3fcc109af8112`.
Branch: `codex/arcanea-world-mcp-identity-20260909`.

Scope: Prevent fast generation and planning calls from overwriting earlier
records when their timestamps match. Owner: coordinating capability task, one
writer. Files: runtime identifier helper, generator registrations, planner,
focused regression tests, package delivery commands, README and this record.
Non-goals: model execution, media scanning, canon changes, package publication,
production promotion or changes to the already-reviewed runtime PR380 head.

## Reproduction

The Node 22 build of the package candidate was tested through real MCP handlers
with the clock fixed. Twelve character/location/creature/artifact generations
left only one graph node. Repeated planning tasks and planning sessions received
identical ids, replacing the earlier entries in their maps. All three regression
tests failed for these specific identity collisions before the implementation.

## Acceptance and verification

- Generated identities do not depend on clock resolution or ordering.
- The four generator handlers preserve every creation and valid relationship.
- Saving and restoring the graph preserves those identities and edges.
- Same-clock planning tasks and sessions remain separately addressable.
- Existing saved ids are not rewritten and remain opaque strings to consumers.
- No provider calls, global MCP registrations or new local agents are required.

The fresh machine preflight admits one bounded build workload: one process at a
time, no new agents, 45-minute workload ceiling. Compilation is explicitly timed
out after two minutes. Required independent review and repository CI still apply.
All three regression tests now pass, and the complete Node 22 MCP suite passes
392 tests with no failures or skips. Compilation and package entrypoint checks
pass. The tests compare persisted JSON values, since optional undefined fields
are correctly omitted during JSON serialization.

The new tarball is 194,001 bytes and contains 182 installed files, all matching
the archive byte-for-byte. An offline consumer with lifecycle scripts disabled
ran the installed CLI at a frozen clock: twelve calls retained twelve creations
and 69 relationships through a real process restart. Two legacy numeric node ids
and their existing relationship survived loading and an additional generation.
All consumer processes closed. No provider credentials were passed.

Artifact SHA-256:
`c9244ab7422b8218706cfba44e55157002133bd58503b3f5555cfd1ed96a6e4f`.
The previous archive remains byte-identical. Machine-local paths and detailed
receipts remain in the private objective ledger.

## Release and rollback

The prior runtime review applies only to `2f7956d7...`; it does not approve this
new candidate. The older c358eee package archive remains unchanged for existing
consumers. A new artifact must receive separate hashes and consumer evidence.

Revert this bounded source change if necessary. Existing snapshots and world
directories require no migration or rollback. Do not rewrite persisted ids.
The current large registration file has pre-existing formatting/size debt that
must be resolved or explicitly reviewed before repository-wide promotion;
this task does not disable or narrow the formatter or review gate.
