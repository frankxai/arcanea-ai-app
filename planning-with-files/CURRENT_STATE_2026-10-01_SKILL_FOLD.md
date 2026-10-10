# Skill donor reconciliation

Source task: `01a0f74f-8bad-7db1-ab06-fd89b5faec84`.
Owner: Codex, `agent/codex/arcanea-source-consolidation-20261001`.
Issue: [#276](https://github.com/frankxai/arcanea-ai-app/issues/276).
Base: `b48f6ccf94f276a7df3eb03d48f4bf2119dfda2c`.
State: evidence and proposed fold decisions; full ecosystem objective active.

Scope: reconcile prior app packs and distilled/legacy skill sources at pinned revisions;
capture recognized support files and distinguish intentional adapters from variants.
Files: two existing audit scripts, `docs/strategy/arcanea-skill-survivors-2026-10-01.json`,
its Markdown decision map, and this record.
Non-goals: source moves/deletions, licensing, canon edits, private operator publication,
plugin replacement, archives, installs, production changes and new repo creation.
Acceptance: source/path/blob identities, exact recognized support-file hashes, bounded
reference traversal, working-edit exclusion, explicit scope gaps and review dispositions.
Verification: Node 22.23.2. Three audit tests pass, including a new fixture for shared
references, cycles, Unicode paths, support files, escapes, Git symlinks and immutable bytes.
The catalog/installer tests remain relevant regression checks; full app CI and independent
review are still required before promotion.
All eleven local tests pass (three audit, eight installer/catalog). Prettier formatted
the five deliverables. Counts/resource identities were checked against the pinned local
Git trees; legacy metadata retains its separate inspection limit. Secret hooks stay enabled.
Rollback: revert these five files only; source repositories and installed consumers are
untouched. No dependency installation, servers, workers, new worktree or media run.
Budget: ordinary reads, text changes and small tests under one lead; no fanout.

## Findings that change the next step

- The local distilled checkout is an unmerged fork, not main. Main is pinned at
  `e4530e9fba35043996ca588f9641755f8db669f4`; fork at
  `8bd8f50ae140132319ce69a145b45d5f6780e186`. Preserve fork-only installation/runtime work.
- Distilled main's registry says `UNLICENSED`. Legacy root reserves rights by default
  while its pack metadata still says MIT. No rights clearance is inferred.
- The map covers 122 source entries and 192 file identities across four snapshots.
  Legacy 23 skill entries have complete subtree metadata but unreviewed bodies/references.
- Worldbuilder has six recognized external support files; copying a skill folder alone
  would lose them. Runtime imports and implicit references require separate review.
- The existing sovereign-depths adapter is intentional. Font/token variants and differing
  persona headings need authority review; no source is chosen by first-match discovery.
- The four current candidates cannot replace story generation, all specialties or private
  operator work. Keep those jobs and ownership visible during subtraction.

Highest evidenced environment: local read-only Git snapshots, remote pinned legacy tree,
root notice and package metadata, plus local Node fixtures. No live creator/harness proof,
legal clearance, rendered visual evaluation, full app checks or independent sign-off.

Next: inspect retained world/continuity resources, select licensed changes, evaluate pinned
candidate bytes independently, then prove self-contained installs. Launcher origin/ownership,
rights/Heart rulings, consumer migration and community/revenue validation remain open.
