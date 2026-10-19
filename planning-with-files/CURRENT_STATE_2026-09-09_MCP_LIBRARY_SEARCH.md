# Explicit local library search

Scope: make the dormant library helper available through the real MCP server and
remove its dependency on an accidental ancestor book directory.
Owner: capability delivery task, codex/arcanea-mcp-library-search-20260909.
Base: canon correction0654c146, draft PR392.

The old helper was never registered. Its integration tests imported it directly,
searched a checkout-dependent book directory and often accepted empty results.
The new search_library tool searches only ARCANEA_LIBRARY_DIR, chosen by the
operator as an absolute dedicated folder. It returns configuration errors without
host paths, bounded excerpts with relative provenance, and incomplete-scan status.
No corpus is bundled, uploaded, downloaded or implicitly selected. Source text is
reference material and cannot approve canon or issue agent instructions.

Files: library helper/registration, entrypoint, library and integration tests,
canon inventory count, package scripts, README and this record.
Acceptance: real SDK discovery/calls, isolated corpus behavior outside a checkout,
explicit configuration failures, bounded scans and unchanged other package tests.
Verification: strict TypeScript, source package tests and changed-file hygiene;
new packed consumer evidence is required before any release claim.
Non-goals: public corpus licensing/publication, remote indexes, semantic embeddings,
OS access-control enforcement or concurrent hostile filesystem mutation isolation.
Rollback: scoped revert; existing saved world IDs and archives remain untouched.

Verification completed: strict TypeScript and all396 package tests pass without
a repository book directory. Thirteen self-declared tool/resource inventory tests
were removed; real SDK discovery checks cover the exposed surface. The prior409
test run is retained as evidence, not inflated into396 additional checks. Updated
legacy integration tests also validate the configured memory directory and use an
explicit synthetic corpus. The thirteen library-specific tests exercise real MCP
calls, literal/OR search, bounded excerpts, exclusions, depth/file/byte limits and
explicit configuration failures. All44 prepublication checks and9 entrypoints pass.

The real pack lifecycle produced238 files,204415 bytes, SHA256
36cd03be4003823d123f4b85a48928453e725121b1932ee871edc88299dbe5ac.
All installed archive files match byte-for-byte in a fresh script-disabled pnpm
consumer. Two closed CLI sessions verify unconfigured/configured library behavior,
Source canon and fractional-input rejection; separate runtime-delivery checks
verify CLI modes and saved-world restoration after restart. The base factory has
55 tools; the CLI adds the two existing collection tools for57. No provider calls,
global activation or npm publication. Independent review/integration remains open.
