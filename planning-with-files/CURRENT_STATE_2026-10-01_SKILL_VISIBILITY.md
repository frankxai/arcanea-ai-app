# Curated skill discovery visibility

Scope: validate candidate visibility from parsed YAML rather than matching text.
Owner: Codex; program issue #276 and draft PR #487.
User job: review curated candidates without exposing an uncleared candidate through
default skills CLI discovery.
Base: `2ba6309aad2ead8225a8eab8ccf1cad0cdac5d7b`.
Files: package catalog validator, tests, dependency declaration, README, root
lockfile importer and this execution record.
Non-goals: workflow text, readiness, licences, lore, launcher ownership, donor
migration, archives and release.
Budget: text edits and small Node tests; no dependency installation, new worktree,
local build, servers or fanout. One admitted external review if resources permit.
Acceptance: a candidate with false/missing/string/nested `metadata.internal`
fails even when another value contains `internal: true`; valid inline/quoted YAML
works; duplicate keys and malformed YAML fail; ready hidden skills fail.
Verification: Node 22 catalog/installer regressions, unchanged workflow hashes,
explicit-file formatting and secret checks, frozen-lockfile CI at the new head.
Rollback: revert this validator/dependency/test slice while preserving prior
evaluation evidence and program provenance.

At the base revision, a temporary copy of `world-build` with
`metadata.internal: false` and `unrelated.internal: true` passed `validateSources`.
The official skills CLI at commit
`3694740352eeef5cdd689af694c485f1ff62eec3` parses YAML and compares
`metadata.internal === true`; an unrelated mapping does not hide the candidate.
Sources: `vercel-labs/skills` `src/frontmatter.ts` and `src/skills.ts`, retrieved
through GitHub's contents API at that immutable commit.

The validator now parses YAML with unique string keys, rejects parse warnings and
errors, checks actual identity/description types, and checks the metadata boolean.
The `yaml` dependency is pinned to 2.9.1, already resolved in the repository
lockfile. Only its workspace importer is added; no new package resolution or local
installation is needed for this text slice. All four workflow files and their
examples remain unchanged. Candidates remain internal and none are ready.

Local verification: all 11 catalog/installer tests passed on Node v22.23.2 using
the existing local `yaml` v2.9.0 through `NODE_PATH`; there was no installation.
The pinned v2.9.1 still requires verification in frozen-lockfile CI. Source
validation reports four candidates and zero ready; all four workflow/resource
hashes match the base. Formatting and diff checks passed. Independent review and
new-head CI remain pending; prior green checks belong to the base revision.
