# Skill installer delivery

Source: Codex task `01a086b7-f24a-7d40-98d3-f94d9f6a2ba9`, active Arcanea capability
goal. Owner: this task on `codex/arcanea-skills-installer-20260909`, based on main
`141ad072132597f741979eee58671b3bd4e26a88` in the existing cost-heal worktree.
Earlier source-skill and MCP branches remain preserved.

Scope: the `@arcanea/skills` package installer, catalog, package metadata, delivery
guide and regression checks. No global installation, skill-body rewrite, hook,
MCP activation, production promotion or npm release is included.

Observed: the existing recursive copy silently overwrote custom destination files,
followed links, ignored unknown CLI options and installed everything by default.
Its catalog advertised 97 ecosystem skills while this artifact contains 20. npm
reported public version 1.0.0 on 2026-09-09; this is a 1.1.0 source candidate.

Acceptance: named or explicit-all installation; pure dry-run; complete preflight;
no overwrite of existing full skills or links; accurate counts and hashes; real
entrypoint-last file delivery; byte-idempotent repeat; bounded rollback on failure;
portable installed-artifact proof. Preserve every unrelated working file.

Verification: Node 22 built-in fixture tests cover conflicts, junctions, malformed
options, complete references, no-op timestamps, write failures and concurrent
arrivals. Syntax checks and an external pnpm consumer verify package entrypoints.
Evidence is private under the existing capability-delivery objective record.

All 15 tests and syntax checks pass under Node 22.23.2. pnpm 8.15.0 packed the
85,817-byte candidate; its SHA-256 is
`e252e0b38db0878e2c7f29319640106cde96c190db398dee8c0a77e7269fa500`.
The isolated consumer installed offline with lifecycle scripts disabled. All 26
package files matched the archive; its real CLI installed all 20 skills into an
isolated registry, verified every file hash, then made zero changes on a repeat.
The packaged TypeScript declarations passed a strict consumer typecheck including
negative type assertions. This does not certify the legacy skill bodies.

Rollback: revert this bounded package commit; no global installed skill is changed.
Independent review remains pending under machine admission. The old
`scripts/sync-claude-codex.sh` also needs a separate repair: it removes existing
skill directories and appends global MCP configuration. Do not execute that script
as an installation workaround.
