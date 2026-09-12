# Arcanea visual evaluation protocol v1

Score every candidate from 1–5 on ten dimensions. Record evidence in the image, not taste adjectives.

| Dimension                  | 5 means                                                                                                              | Hard floor |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------: |
| Prompt adherence           | Every requested subject, action, crop, and constraint is visibly satisfied                                           |          — |
| Source and canon fidelity  | Locked facts are correct; proposals are not presented as canon; no visible unresolved conflict                       |          4 |
| Identity continuity        | Face, age, body, posture, instrument, and approved references remain recognizably the same                           |          4 |
| Silhouette legibility      | Identity survives grayscale, thumbnail, and edge-only reading                                                        |          — |
| Anatomy and count accuracy | Hands, limbs, clade, Chords, and countable structures are coherent and exact                                         |          4 |
| Material specificity       | Surfaces show plausible construction, weight, wear, and environmental response                                       |          — |
| Composition and hierarchy  | The eye finds the story action; negative space and crop safety serve the intended surface                            |          — |
| Emotional story truth      | Posture, relation, and moment express the character's contradiction rather than a generic mood                       |          — |
| Arcanea distinctiveness    | The result expresses Arcanea laws without borrowed franchise, sacred, or provider-default shorthand                  |          — |
| Release readiness          | Technical quality, rights state, source record, accessibility plan, and crop family are ready for the stated release |          — |

## Decision bands

- `46–50`: exceptional candidate; still requires human identity and release approval.
- `42–45`: pass candidate; address any concentrated weakness before release.
- `36–41`: revise with a narrow, evidence-based edit contract.
- `<36`: reject or rebuild from the identity contract.
- Any hard-floor score below 4: automatic revise or reject regardless of total.

## Independent review

Use two review passes for every executable candidate set:

1. Admit a candidate to review only after the recorder has fully decoded it, matched its bytes and SHA-256 to the receipt, and verified its measured width-to-height ratio against the prompt contract within the fixed 1.5% provider-rounding tolerance. A media-gate failure stops the job; critics never score a structurally invalid asset.
2. After all output receipts are recorded, run `pnpm arcanea:visual:blind-review -- --round N`. It creates opaque candidate IDs and storage-safe hard links inside the ignored blind-review workspace; it does not duplicate image bytes.
3. Give critics only `critic-packet.json` and the scorecard for their role. The packet withholds job ids, style labels, and the team's preferred hypothesis while retaining the source-fact brief needed to judge fidelity.
4. The production critic and an independent critic complete separate scorecards before either sees the private unblinding key. Each must attest this ordering; the independent critic must be independent from generation.
5. Run `pnpm arcanea:visual:reconcile -- --round N`. It seals both scorecards as hash-linked records, verifies different judge identities, then creates the unblinded evaluation draft.
6. Add candidate-level human verdicts and the round decision to that draft. Only then run `pnpm arcanea:visual:score -- --round N`.

Record disagreement rather than averaging it away. A two-point disagreement on a hard-floor dimension triggers focused human inspection.

Round 01 may select a primary style or secondary mode only when both controlled anchors in that style clear every hard floor, reach the 42/50 reconciled threshold, and receive an explicit human-approved candidate verdict. A single beautiful anchor is not enough evidence for a system decision.

## Adaptive style allocation

- Round 01 is the controlled benchmark: five render hypotheses × the same two anchors. It compares rendering behavior while explicitly refusing to claim likeness continuity without accepted image references.
- Rounds 02–10 allocate the selected primary system to eight of ten executable jobs and the selected secondary mode to two deterministic portability probes. If a round has fewer executable jobs, reserve up to two probes while always leaving at least one primary job.
- Probe ids are derived from the prior accepted reflection hash, round number, and executable job ids. Recompiling the same evidence must produce the same allocation and packet hash.
- A portability probe asks whether the secondary mode preserves this subject's contract under a new task. Because later jobs usually depict different subjects, it is not a controlled head-to-head style comparison.
- Never promote or retire a mode from one portability probe. Make style decisions from accumulated hard-floor evidence, repeated failure patterns, both-critic review, and an explicit human verdict.
- The provider, exact model, request parameters, and reference policy remain constant inside the round. Only the receipt-bound style allocation changes.

## Reference maturity and identity claims

Treat identity continuity as a claim whose ceiling depends on evidence:

| Reference state                          | What can be scored                                                                                      | Maximum identity-continuity score |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------: |
| `text-conditioned-no-image-reference`    | Stable source facts, age, anatomy, countable markers, posture, and evidence object inside this output   |                                 4 |
| `execution-reference-present-unverified` | The same facts plus visible response to a supplied reference; no claim that the reference was approved  |                                 4 |
| bounded approved reference receipt       | Response to one exact approved image with complete provenance; useful as one view, not cross-view proof |                                 4 |
| `qualified-accepted-reference-set`       | Cross-view likeness against a human-qualified set covering all eight regression views                   |                                 5 |

The runtime deliberately has no shortcut from “a reference hash was supplied” to “the reference was accepted.” `arcanea:visual:reference:register` binds one approved output as a bounded reference. `arcanea:visual:reference:qualify` requires eight distinct approved image hashes spanning the complete regression suite plus a human identity-lock attestation. `arcanea:visual:reference:assign` then chooses one to five smallest-sufficient views for one exact job. Only that set → assignment → immutable execution manifest → output receipt chain permits 5/5.

A structurally verified historical asset remains untrusted visual evidence. Collection presence, a prior quality score, or an intake-packet hash gives it no identity-continuity weight. It must first clear exact rights and source review, receive a current human approval for one bounded role, and enter the same reference register by its exact media hash; bulk promotion from a prior collection is forbidden.

Round 01 begins in the first state for all ten candidates. Its outcome may choose a rendering hypothesis, never lock Kael's or Draconis's likeness. Before unlocking Round 02, the human decision must acknowledge that boundary and record at least:

- what remained comparable across styles despite no accepted reference;
- which variations were identity noise rather than style quality;
- whether the selected style worked on both the source-complete human and the countable non-human anatomy anchor.

## Ten-image reflection receipt

After each round, write:

```yaml
round: 1
jobIds: [ten ids]
generated: 10
validFiles: 10
blocked: 0
scoreSummary:
  median: 0
  range: [0, 0]
  hardFloorFailures: []
topCandidates: []
failurePatterns: []
retainRules: []
reviseRules: []
retireRules: []
reconciliationNotes: ""
benchmarkReferenceState: text-conditioned-no-accepted-reference
benchmarkLimitationAcknowledged: false
identityComparabilityNotes: ""
crossAnchorPortabilityNotes: ""
primaryStyleDecision: pending | style-id
secondaryModeDecision: pending | style-id
humanVerdict: pending | accepted | revise
nextRoundCompilationAllowed: false
receiptHash: sha256
```

Never fill missing scores with zero for ranking. Missing evidence is `not-evaluated` and blocks the next-round decision.

## Release decision chain

Scoring does not approve or publish an image. Record each state transition as an append-only, hash-linked decision receipt:

1. A recorded output remains outside the web-public asset tree while it is in review or rejected.
2. `approved` must reference the exact output receipt and a hash-valid round reflection in which that candidate is `pass-candidate` and human-approved. The approval command may then stage those exact bytes in the web-public release tree.
3. Approval must carry explicit human records for canon, identity, rights, brand, and sensitivity. Use a reasoned `not-required` record when a gate genuinely does not apply.
4. `rejected` needs a reason and cannot coexist with approval for the same output revision. Create a new image revision instead of reversing history.
5. `published` must chain to the approval receipt and name external publication evidence. Recording the receipt does not itself deploy or publish.

The campaign may expose `approved` or `published` only after these hashes, image bytes, and decision links validate.

Local SHA-256 links provide integrity and lineage inside the versioned repository; they are not signatures and do not authenticate the person named in `decidedBy`. Preserve Git review evidence or a stronger signed approval system when identity assurance matters.

## Regression suite

An approved identity is not complete until it survives:

- close portrait;
- full-body action;
- grayscale silhouette;
- small avatar or badge;
- wide environment crop;
- maintained object or anatomy detail;
- two-character relation;
- ensemble without face or body drift.

Record which accepted reference hash each regression test used.

One attractive portrait is never an identity master. Qualification requires all eight rows above, at least eight distinct approved image hashes, and a separate human-attested assignment for every new job.
