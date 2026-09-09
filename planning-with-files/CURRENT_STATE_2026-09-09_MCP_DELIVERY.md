# Worldbuilding MCP delivery repair

Status: implementation candidate, not published. Source baseline:
`141ad072132597f741979eee58671b3bd4e26a88`.

## Task contract

- Scope: installable worldbuilding MCP artifact, consistent version discovery,
  functioning local HTTP sessions, portable local state and real consumer checks.
- Owner: Codex capability delivery. The existing cost-heal checkout was clean and
  its PR #293 was verified merged before creating this new branch. Other worktrees
  and the previous branch are preserved.
- Files: `packages/arcanea-mcp` runtime metadata, CLI, transport, persistence,
  package scripts, documentation and focused tests; this task record. Generated
  output is verified as part of the package build.
- Non-goals: change canon, model assignments, provider credentials, Gateway
  authorization, global MCP registration, repository visibility or production.
- Acceptance: package and actual handshake versions agree; help/version do not
  start the server; CLI rejects malformed options; two HTTP clients work without
  replacing one another; HTTP binds loopback and rejects foreign Host/Origin;
  request/session resources are bounded; world saves use an explicit user data
  directory and do not silently turn corrupt data into an empty world; a packed
  artifact installs in a fresh consumer and performs useful offline tool calls.
- Verification: Node 22 and CI-pinned pnpm 8.15.0; frozen filtered install; package
  build and focused tests; packed-file checks; isolated consumer stdio tests with
  no provider credentials. Independent review before merge/publication.
- Rollback: revert the bounded source commits. No existing world files are moved,
  deleted or rewritten. Existing repo-local worlds remain accessible by explicitly
  setting the data directory to that repository's `.arcanea` directory.

## Observed failures

The public `@arcanea/mcp-server@0.7.0` artifact declares a `workspace:*` dependency
and fails an isolated consumer install. Current canonical source no longer has
that dependency, but declares package version 1.0.0 while the server and HTTP
health response hardcode 0.3.0. Health also hardcodes a stale tool count.

The CLI accepts partial numeric ports and starts before validating all arguments.
`createServer()` returns one singleton; HTTP reconnects it for each session and
stores session ids before the transport initializes them. HTTP listens on every
interface and accepts every browser origin. World persistence walks out of the
package path, which is not a stable data directory in a consumer installation.

The old master plan and May backlog remain historical references. They cannot
prove today's tool count, installability or publication status. This record keeps
the new repair separate from the two September gallery releases and their tools.

## Release posture

Machine admission is bounded to one workload with no new agents. The artifact
must remain a draft until independent review and the full package evidence pass.
No npm publication or production promotion is authorized by a green unit suite.

## Verification and review split

The Node 22 build and all 389 MCP tests passed. A final storage refinement also
prevents overwriting a corrupt snapshot or a different id that collides on a
case-insensitive filesystem; all eight delivery checks passed after refinement.
The tarball installed outside the workspace with lifecycle scripts disabled.
All 178 installed files exactly matched the archive, and the installed CLI passed
real protocol discovery plus save, process restart, load and graph-count checks.

Artifact SHA-256:
`e1c3763bc2a2d3f3c1d9a0c398d5630063d68fe2beb82f6cb4cf362081b23cc6`.
Detailed machine paths and test receipts stay in the private objective ledger.

To respect review bounds, runtime repairs and package delivery documentation are
separate stacked changes. Generated `dist` is verified in the tarball; rebuilding
is mandatory before running source or creating a release. Existing tracked build
output is not treated as release evidence or included as generated diff noise.

Independent provider review is still pending under the machine admission hold on
new parallel agents. These changes are draft review material, not a published npm
release or a production deployment. The CLI tests are local because the artifact
is a local process and loopback transport, not a web page.

## Next bounded work

- Obtain independent runtime and package review before merging or publishing.
- Verify the authorized public-source release path; the canonical app repository
  is private and the public mirror contains older package source.
- Address timestamp-only creation ids, which can collide during fast generation.
- Make repository-dependent library, vault and media lookup explicit at runtime;
  the current package guide documents that their assets are not bundled.
- Review the larger installed skill and plugin estate without enabling dormant
  global MCP processes or changing canon as a side effect.
