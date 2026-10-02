# Arcanea native plugin isolation

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, `agent/codex/arcanea-plugin-isolation-20261002`.
Issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Base: `fcad9bf92db5932e7093fcabe0fa3b934beea6d3`, unmerged parent draft #487.

Scope: let creators receive catalog-ready skills with support files in a native
Claude plugin without developer imports, commands or operator MCP configuration.
Current public count is zero; release requires actual evidence and human approval.
Reuse the existing catalog's rights/evaluation/review/hash rules rather than a
parallel allowlist. Existing root plugin remains the development bundle.

Files: package `bin/plugin.js`, `scripts/plugin.cjs`, `tests/plugin.test.mjs`,
`package.json`, `README.md`, catalog validator/typing and this record.
Non-goals: rights/license decisions, candidate promotion, canon, archive, launcher,
root development plugin changes, public listing, install, merge or deployment.
Acceptance: only ready sources copied, byte/commit-bound inputs, no developer
components, zero-ready no writes, safe refusal of existing/linked destinations,
preserved partial failures and fresh-directory retry, deterministic transport.
Initial verification atf976ed30: Node22.23.2, all21 local tests pass with existing YAML2.9.0.
Opt-in Claude2.1.287 strict native manifest validation passes with no warnings;
its contents array is empty, so native discovery/installation is not established.
Native CI uses pinned YAML2.9.1; the native CLI opt-in test skips there when absent.
Corrected candidate precommit:29/29 tests pass including native manifest validation. Exact corrected commit rerun, independent review and pinned Linux native CI pending; terminal receipts belong in issue276/PR501.
Rollback: scoped revert of the eight files; retain failed/new outputs for inspection.

Alternative: explicit manifest paths into candidate package are insufficient
because native `skills` adds to default `skills/` discovery. A self-contained
generated transport artifact is chosen; canonical skill authoring stays in place.
Official docs checked October2: manifest reference and marketplace reference.
The generated directory is not committed or listed as a cleared public pack.

Budget: one lead, small text/tests, no new dependencies, worktrees or build fanout.
Fresh PP interactive admission bounded with RAM8750MiB, max parallelism1;
30 observed Codex runtimes exceed16. C free149604421632 bytes (~14.6%) bounded.
No other process/lock/cache changed. Independent provider review requires fresh
review admission; no parallel cells. Stop condition: reviewed exact-source build
and denial/retry evidence, or concrete review/native dependency; full goal active.

Policy loaded here is local instruction, not universal runtime enforcement.
Passports are declarations, not rights authentication. Public installation,
creator usefulness/demand, marketplace/launcher pinning and release remain open.

Initial test attempt passed13/20. Seven failures shared a fixture error: synthetic
ready visibility was changed while still validating as a candidate. The fixture
now computes the final file hash before adding synthetic passports. Existing
catalog validation was preserved; reruns pass20/20 and then21/21 with native
manifest validation. No source candidate, passport, lockfile or canon changed.

Independent review atf976ed30 returned REVISE (three MEDIUM/two LOW), correctly bound to six-file diffde6f60b7. First native CI37017948976 passed all four checks/frozen Install at that head; it does not clear review. Correcting commit-bound executing engines, recorded YAML, exact-source test receipts, normal HTTPS/SSH origin spelling and CRLF blob normalization, distinct plugin namespace/valid version, portable support names and executable/symlink Git modes.

Catalog validation now accepts an optional byte reader for compiler-pinned Git blobs; default installer/API filesystem validation remains. Source/generator bytes come from the commit with only ordinary text EOL conversion accepted in the checkout. No clean filters run. Remote identity is configured metadata, not authenticated provenance. Exact corrected source tests and independent review are required; prior failures/findings remain preserved. YAML2.9.0 local results and pinned2.9.1 Linux CI are separate environments, not equivalent dependency receipts.

Correction precommit run:25/27 passed; one assertion expected the older weaker content error but the new committed-mode check correctly refused an untracked file first. The Windows Git index refused a reserved CON name before compiler invocation; that portability test now checks the shared validator directly and uses a real case-colliding Git tree for integration. Git NTFS protection remains enabled. A separate formatter attempt used Babel for .cts and failed; the existing TypeScript formatter plugin is now selected. No check was disabled.

Corrected precommit tests29/29 pass with actual native strict manifest validation (contents[] empty), CLI dry-run/generation, dirty engine refusal, source EOL equivalence, usual origin spellings, real case-colliding Git tree, portable-name unit cases, executable mode and Git symlink-mode denial. Existing eleven catalog/installer tests pass with the new optional byte reader. Current real catalog still four candidates/zero ready.

Exact Windows rerun at5fa95e50 passed29/29 on Node22.23.2/YAML2.9.0, native strict manifest validation and actual zero-ready CLI exit2/no output. During lead inspection, output inside canonical skills/compiler directories was still permitted. Added a source-overlap refusal and a regression so generated transport cannot create another discovery root there. New exact source needs fresh results; 5fa's receipt remains historical.

Native CI37020305225 at3cf812d1: frozen Install, Lint and TypeScript passed; Build/CI Status failed. Linux Node22.23.3 package tests passed28, failed1, skipped1 native opt-in. The scratch CLI fixture had no YAML dependency path; local NODE_PATH had masked the omission. Correction reuses the already resolved package dependency through a child-process-only NODE_PATH. No dependency is installed, production fallback changed or assertion skipped. CLI test now reports actual Node/platform/YAML. Failed native log retained; new head requires native and independent review.
