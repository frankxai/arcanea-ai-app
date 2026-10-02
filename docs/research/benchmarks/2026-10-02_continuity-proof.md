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

An author can read and edit [the complete two-chapter proposal](continuity-proof-2026-10-02/edited-manuscript.md), inspect [three exact replacements](continuity-proof-2026-10-02/revision.patch), and compare [the general-editor output](continuity-proof-2026-10-02/baseline-manuscript.md). The originals remain authoritative. This is an internal editorial proof, not a selected release manuscript.

## Question and source

What does each workflow propose on this source, and which edits depend on an author decision? Usability and quality remain for human assessment. Inputs are the first two chapters of _The Gate of Foundation_, full locked canon and the candidate continuity skill at `fcad9bf92db5932e7093fcabe0fa3b934beea6d3`. [The manifest](continuity-proof-2026-10-02/manifest.json) pins every source blob/hash. No source chapter, locked canon, passport or ready status changed.

## The repair

Chapter two's second arrival moves from midday to later that morning, agreeing with its subsequent scenes. Its retrospective two days of emissary agendas becomes a morning. The casualty sentence says the three were not found that night, preserving the later one recovered/two never recovered and the stated 26 aboard/23 saved/3 lost. The ship's identity remains an author question.

Kael's grief, pronouns, rescue, collapse, colors, choices and powers remain. Maret still remembers the mother's eyes. Sirvaine's six Gates still mean Master; elemental manifestations do not manufacture a rank or a Gate count. The reader sees the same scene with three local repairs. These are proposals, not accepted prose.

## Same-input alternative and refinement

The alternative was a Claude Code editorial baseline, claude-sonnet-5-5/high, given the same complete chapters and locked canon. It also ran under the pinned public Luminor Engineering Kernel with a read-only editorial override, without the continuity-check or Canon Guardian procedures. The lead context differed, so this is not a clean with/without-skill experiment. Its exact task header and pinned input hashes are in baseline.json: maximum six edits and 1600 response words. The full user-prompt hash covers the exact task header plus serialized source evidence, excluding the separately supplied system prompt. The frozen response contains 964 whitespace-delimited tokens including JSON formatting, excluding hidden reasoning; baseline.json records the counting method and response hash. The lead had no preset edit/word cap beyond the smallest-local-repair scope. A3 received iterative review and B did not; the count comparison is descriptive only, not repair size or quality. The casualty repair credits baseline F5. It produced five concrete replacements in 79.77s at provider-list reported $0.228300. [Its complete findings and edits](continuity-proof-2026-10-02/baseline.json) remain unchanged. It proposed three timeline changes and noted the casualty ambiguity. Independent review found the shared Maret-day change depends on an unchosen counting convention; the final lead proposal withdraws it.

The baseline also changes Maret's mother memory into a memory of Kael and narrows a week of lost sleep to days. Its claim that Maret could not have seen the mother's newborn eyes is an inference: the source does not establish the mother's birthplace or that Maret never knew her elsewhere. The mother coming/settling here and nineteen-year doubt support a real unresolved tension. Neither the original reading nor the baseline birth rewrite is accepted. [The proposal ledger](continuity-proof-2026-10-02/edits.json) gives three explicit choices: retain the original with its unresolved interval; use the baseline Kael-newborn reading with effects on Not again/suppression; or remove birth/date details with the loss of those clues. Houses and Academies have no supplied exclusive mapping. Treat these as questions before spending an edit on new biography.

The first Codex proposal contained three timeline edits. After seeing the baseline, the lead added the supported casualty wording repair. A1's initial three-edit list was initially private and is now included as history in edits.json; its order is lead-reported, not independently established. A2 remains at c642d556 in Git; independent review returned REVISE. A3 withdraws the Maret-day change, leaving three replacements. This unblinded refinement cannot measure the causal benefit of a skill, an extra agent or a model. Codex end-to-end time/cost, founder repair minutes and human acceptance were not measured. No speed, price or quality superiority is claimed. At this assembly checkpoint the completed review of record is REVISE at `c8e78e66` (following REVISE at `2b42c2e7` and `c642d556`). The narrative repair was confirmed; evidence/index corrections remained. A review of the final corrected bytes is pending. Consult [#282](https://github.com/frankxai/arcanea-ai-app/issues/282) and match the recorded head hash; this file asserts no final-head sign-off.

## Export, recovery and failure behavior

The existing shared AuthorOS `compileManuscriptMarkdown` exported both actual outputs using Node24.14.0. Its source is `30d90432d84c526315985d806cd938c726b4271d`, from the current preview checkout. This is component reuse, not acceptance of that product branch. The export is a reading derivative, not a source-faithful layout copy. AuthorOS removes per-chapter book headers and Chapter One/Two labels, supplies its own chapter headings and timestamp; Prettier normalizes whitespace and emphasis markers. The patch is the authoritative exact change record. Comparison rows separately identify private pre-format exports and committed post-format outputs; the prose stream is checked. Raw files and projects remain private, so their export hashes are not independently reproducible from this report alone. Committed output hashes and patch checks can be reproduced. AuthorOS embeds an export timestamp, so byte-deterministic exports are not claimed. No EPUB or PDF is produced.

Each exact-context patch passes read-only `git apply --check --cached`. In-memory inverse replacement checks recover the exact original strings; this is separate from the patch-file check. An altered source excerpt is rejected before any in-memory replacement, preserving the stale input. No restarted-export test or receipt is claimed. These checks do not prove crash-safe replacement, concurrent filesystem behavior or a deployed release adapter. Do not apply either patch to the authoritative chapters without an author's decision.

Three local integrations failed: Windows converted patch LF bytes to CRLF; an absolute ESM import needed a file URL; then staged diff checks flagged literal blank context prefixes inside the patch files. All failures are preserved. Final patches use two context lines and bare empty context lines accepted by Git; strict third-party patch consumers are untested. The final committed patch bytes and inverse/stale recovery checks were rerun. Corrected patches and native export pass. No source/index/shared-exporter writes occurred. The existing AuthorOS tic/passive checker passes the original and both proposals, demonstrating that its heuristic result does not test narrative continuity.

## Environment and limits

Local Windows; Node24.14.0 for the shared component; cloud Claude inference with no tools/MCP and a 300s owned-process deadline. One coherent serial workload under bounded machine admission; no local model/GPU generation, install, new worktree or server. Reproducible scope is pinned inputs, exact replacements and Markdown export; provider wording and timestamps vary.

Only two chapters were reviewed. The initial date contradiction was overcalled by both lead and baseline. Colloquial four days ago can describe the original timing under an ordinary counting convention; moving Maret earlier also squeezes the three days of reflection. Leave it unchanged or let the author select a precise time origin before changing repeated dates. Existing canon's Heart table/log conflict remains untouched. First Siege/sealing dates and character testimony remain unresolved where the sources do not decide them. No rights clearance, paid customer result or community-demand evidence exists here. The approximately 20-task, 1/3/5-cell and human disposition requirements of #282 remain open; #280 still requires Frank's release selection.

## Recommendation

Give the author the three-replacement proposal and both full outputs for accept/revise/reject feedback. Preserve uncertainty as a decision rather than changing family history to make a report look clean. Add this observed false-positive case to subsequent continuity evaluation; keep the skill a candidate until independent and human evidence supports promotion.

The second review caught a UTF-8 encoding regression in the shared benchmark index and stale receipt wording. The original index prose and UTF-8 em dashes are restored from the pinned base; the new entry plus Markdown emphasis and blank-line normalization satisfy the native CI changed-file ratchet, and baseline constraints, review asymmetry and final-source status are explicit. No source prose changed in this evidence correction.

The third review confirmed the narrative proposal and requested method/report corrections. The kernel context, full prompt-hash coverage and measured response word count are explicit; the unsupported restarted-export sentence is removed; PROLEPSIS appears in the author ledger. Original manuscript and both reading outputs remain unchanged.
