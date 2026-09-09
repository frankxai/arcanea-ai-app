# MCP reference data and real canon checks

Scope: correct the runtime's gate frequencies and Godbeast associations to match
the unchanged `.arcanea/lore/CANON_LOCKED.md`, Tier 2. Preserve its locked table.
Owner: capability delivery task, `codex/arcanea-mcp-canon-data-20260909`.

Files: registration reference data and generator schemas, generator implementation,
`tests/canon.test.mjs` and this record. Base: integrated runtime candidate862c1a8.

The gate resource exposed ten frequency ranges instead of the ten exact locked
values, and returned no companion for Source. The generator table stopped at nine
companions, so magic/story gate10 used Kyuro and character gate10 returned null.
Veloura and Laeylinn had forms contradicting the locked approval log. The correction
adds Source, selects the requested gate and uses Phoenix-Serpent/Worldtree Deer.
Source's profile explicitly leaves its physical form pending; the output is null.
Other existing form suggestions are preserved and labelled Draft, not canon.
Generated scaffolds are labelled drafts. Integer schemas reject fractional gates.

The former16 canon tests asserted constants declared in their own test file,
including an obsolete31-tool/seven-resource inventory. They did not read the
runtime. The replacement17 tests use the actual SDK: resource reads, discovery,
input schemas and generated outputs. The preserved b992 installed package fails
six of these checks, including the concrete frequency, companion and form defects.
No test-only data is treated as observed runtime output.

Acceptance: all17 real runtime checks pass; existing package tests and TypeScript
remain green; canonical source remains byte-identical. Preserve the older immutable
archive and its genuine persistence evidence. A new package needs a new consumer
receipt; do not transfer the old archive's identity to this correction.

Not certified here: other legacy gate context fields, all generated biographies,
every lore claim in other modules, standalone library packaging or publication.
This changes dependent application data, not locked canon or brand identity.
Independent review and normal repository gates remain required before release.

Verification: TypeScript passes. All396 source-layout package tests pass with
zero failures or skips, including17 real SDK canon checks. The source fixture
includes the verified repository book directory; this is not standalone library
packaging evidence. The preserved installed b992 archive fails six new checks.
Changed-file formatting, whitespace and staged secret checks are required at commit.
No global installation or npm publication. Rollback is the scoped source revert, preserving saved world IDs.
