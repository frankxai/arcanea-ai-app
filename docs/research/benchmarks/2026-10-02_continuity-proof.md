---
title: "A continuity repair for The Gate of Foundation"
date: 2026-10-02
type: benchmark
domain: [continuity, authoring]
gate_connections: [Voice]
guardian_connections: [Alera]
relevance_score: 8
confidence: low
source_url: "https://github.com/frankxai/arcanea-ai-app/issues/282"
author: "Codex"
---

# A continuity repair for The Gate of Foundation

An author can read and edit [the complete two-chapter proposal](continuity-proof-2026-10-02/edited-manuscript.md), inspect [four exact replacements](continuity-proof-2026-10-02/revision.patch), and compare [the general-editor output](continuity-proof-2026-10-02/baseline-manuscript.md). The originals remain authoritative. This is an internal editorial proof, not a selected release manuscript.

## Question and source

Does a source-aware continuity pass produce a smaller usable repair without turning uncertain background into new biography? Inputs are the first two chapters of _The Gate of Foundation_, full locked canon and the candidate continuity skill at `fcad9bf92db5932e7093fcabe0fa3b934beea6d3`. [The manifest](continuity-proof-2026-10-02/manifest.json) pins every source blob/hash. No source chapter, locked canon, passport or ready status changed.

## The repair

Maret's visit moves from day four to day three so the next-morning emissaries arrive four days after the storm. Chapter two's second arrival moves from midday to later that morning, agreeing with its subsequent scenes. Its retrospective two days of emissary agendas becomes a morning. The casualty sentence says the three were not found that night, preserving the later one recovered/two never recovered and the 26 aboard/23 saved/3 lost.

Kael's grief, pronouns, rescue, collapse, colors, choices and powers remain. Maret still remembers the mother's eyes. Sirvaine's six Gates still mean Master; elemental manifestations do not manufacture a rank or a Gate count. The reader sees the same scene with four local repairs. These are proposals, not accepted prose.

## Same-input alternative and refinement

The alternative was one strong Claude Code general editor, claude-sonnet-5-5/high, given the same complete chapters and locked canon without the two Arcanea continuity procedures. It produced five concrete replacements in 79.77s at provider-list reported $0.228300. [Its complete findings and edits](continuity-proof-2026-10-02/baseline.json) remain unchanged. It found the three timeline issues and noted the casualty ambiguity.

The baseline also changes Maret's mother memory into a memory of Kael and narrows a week of lost sleep to days. Its claim that Maret could not have seen the mother's newborn eyes is an inference: the source does not establish the mother's birthplace or that Maret never knew her elsewhere. The nineteen-year doubt still deserves an author answer. Houses and Academies have no supplied exclusive mapping. Treat these as questions before spending an edit on new biography.

The first Codex proposal contained three timeline edits. After seeing the baseline, the lead added the supported casualty wording repair. Both versions remain in the evidence. This unblinded refinement cannot measure the causal benefit of a skill, an extra agent or a model. Codex end-to-end time/cost, founder repair minutes and human acceptance were not measured. No speed, price or quality superiority is claimed. The independent comparison is recorded on [#282](https://github.com/frankxai/arcanea-ai-app/issues/282) at the exact committed source.

## Export, recovery and failure behavior

The existing shared AuthorOS `compileManuscriptMarkdown` exported both actual outputs using Node24.14.0. Its source is `30d90432d84c526315985d806cd938c726b4271d`, from the current preview checkout. This is component reuse, not acceptance of that product branch. Export preserves the scene text before Markdown formatting; the final formatted word stream is checked. AuthorOS embeds an export timestamp, so byte-deterministic exports are not claimed. No EPUB or PDF is produced.

Each exact-context patch passes read-only `git apply --check --cached`. Reversing its replacements recovers the exact original strings. An altered source excerpt is rejected before any in-memory replacement, preserving the stale input. A restarted export uses the preserved project and original source. These checks do not prove crash-safe replacement, concurrent filesystem behavior or a deployed release adapter. Do not apply either patch to the authoritative chapters without an author's decision.

The first local integration failed because Windows converted patch LF bytes to CRLF, then because an absolute ESM import needed a file URL. Both failures are preserved; corrected patches and native export pass. No source/index/shared-exporter writes occurred. The existing AuthorOS tic/passive checker passes the original and both proposals, demonstrating that its heuristic result does not test narrative continuity.

## Environment and limits

Local Windows; Node24.14.0 for the shared component; cloud Claude inference with no tools/MCP and a 300s owned-process deadline. One coherent serial workload under bounded machine admission; no local model/GPU generation, install, new worktree or server. Reproducible scope is pinned inputs, exact replacements and Markdown export; provider wording and timestamps vary.

Only two chapters were reviewed. Existing canon's Heart table/log conflict remains untouched. First Siege/sealing dates and character testimony remain unresolved where the sources do not decide them. No rights clearance, paid customer result or community-demand evidence exists here. The approximately20-task, 1/3/5-cell and human disposition requirements of #282 remain open; #280 still requires Frank's release selection.

## Recommendation

Give the author the four-replacement proposal and both full outputs for accept/revise/reject feedback. Preserve uncertainty as a decision rather than changing family history to make a report look clean. Add this observed false-positive case to subsequent continuity evaluation; keep the skill a candidate until independent and human evidence supports promotion.
