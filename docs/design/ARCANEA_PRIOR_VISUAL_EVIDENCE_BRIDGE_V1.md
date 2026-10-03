# Arcanea prior visual evidence bridge v1

Status: internal evidence bridge  
Verified: 2026-08-25  
Release verdict: hold  
Import verdict: no assets imported

## Purpose

Arcanea already has a substantial local visual collection. This bridge makes that work inspectable by the new Living Constellation system without silently treating an older generated collection as current canon, an identity master, a style winner, or a publishable asset library.

The source locator is [design-loop-evidence.json](../../planning-with-files/design-loop-evidence.json). Personal machine paths remain in that internal evidence record and do not enter public constellation data or prompt contracts.

## Verified collection

The read-only verifier confirms:

- 100 Wave-02 PNG masters;
- 100 Wave-02 SVG dossiers;
- one Hundredfold Atlas with 100 image nodes;
- one 130-record intake packet spanning 30 Wave-01 and 100 Wave-02 assets;
- 320,204,312 source bytes across all 130 packet records;
- 130 unique visual ids, client asset ids, and source hashes;
- all 130 referenced PNG sources present with their declared byte sizes;
- all 130 dossier files present when the legacy Wave-01 collection-root fallback is applied;
- all 130 records still at `rights=pending-human-clearance` and `publication=not-authorized`.

Current lightweight verification checks structure and source byte sizes. Full 130-file SHA-256 verification is available with `--deep`, but should run only after the machine gate returns OPEN or an explicitly bounded plan permits the additional I/O.

Evidence anchors:

- intake packet SHA-256: `a719ad85a91ce743d84192b12cd522894cd73e3683dcf0e5928bf60c9b2d7f67`;
- atlas SHA-256: `3778769c35c36ccaa2256da0fa5fd5004e116efb44dac00b123a9692e22a2709`;
- prior design-loop result: 27/30, decision `iterate`, context test incomplete.

## Repair requirement

Thirty Wave-01 dossier references in the intake packet are written as if their `infographics/` directory were inside `wave-02/`. Their files actually live in the parent collection's `infographics/` directory. The verifier resolves this known legacy layout only to prove that the evidence exists. The packet must be regenerated with correct relative paths before ingest, release review, or publication.

This is not merely cosmetic. A publication packet must be relocatable and must resolve every source and evidence path without a private fallback rule.

## Truth boundary

| Question                                                          | Current answer                                                                      |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Do the prior files exist?                                         | Yes; structurally verified.                                                         |
| Were 100 new campaign images generated in this workstream?        | No; 0/100.                                                                          |
| Are the prior images outputs of the new 100-job campaign?         | No.                                                                                 |
| Are they Arcanea locked canon?                                    | No; packet records classify them as proposals.                                      |
| Are they approved identity references?                            | No; none entered the reference registry.                                            |
| Do they prove Living Codex or Prism Realism is the winning style? | No; the controlled Round-01 comparison has not run.                                 |
| May the gallery publish them now?                                 | No; rights, independent review, media ingest, and publication evidence remain open. |

## What should carry forward

The prior collection is valuable as a research corpus for:

- tactile, material-specific beings instead of generic fantasy gloss;
- story roles expressed through posture, maintained objects, and visible work;
- Gate-balanced portfolio planning;
- paired master-and-dossier information architecture;
- atlas-scale navigation and provenance-aware catalog design;
- evidence that a large collection benefits from per-item state, source, and quality receipts.

It should not dictate the new visual system. The earlier tactile 3D language is one historical lineage beside the controlled Living Codex, Prism Realism, Luminous Atelier, Ritual Brutalism, and Mature Feature hypotheses. Its 27/30 internal score cannot replace the new blind two-critic protocol or browser context test.

## Governed convergence plan

1. **Keep the collection external and read-only.** Do not copy binaries into the repository or public tree.
2. **Regenerate the intake packet.** Correct the 30 Wave-01 dossier paths and re-run its independent validator.
3. **Resolve rights and provenance.** Confirm generation terms, source/reference rights, and allowed Arcanea surfaces for each proposed import.
4. **Build a Gate-balanced bridge set.** After rights review, nominate one representative asset per Gate. Nomination is not approval.
5. **Compare after Round 01.** Add the ten nominated prior assets as a separately labeled historical reference row in the blind reflection—not as competitors inside the controlled ten-job experiment.
6. **Register exact accepted views.** If a prior asset is useful for continuity, register its exact hash and bounded role through the identity-reference chain. Never bulk-promote the collection.
7. **Ingest through Media Fabric.** Require corrected paths, immutable rendition receipts, rights evidence, independent publication review, and a same-origin registry receipt.
8. **Expose provenance in the gallery.** Present approved prior work as a distinct “Resonant Kinforms — historical studies” collection with proposal status and story context. Do not merge its ids with the 100 new campaign jobs.

## Gallery treatment

The Living Constellation should teach the distinction between four things:

1. an entity dossier that explains what is known;
2. a prompt contract that states what may be tested;
3. a generated candidate that records what a provider returned;
4. a published work that carries human approvals and canonical evidence.

Prior Kinforms currently occupy the third category only as historical proposal assets. Until their gates clear, the public experience may describe the existence of the research collection but must not render private machine paths, thumbnails, or implied publication status.

## Verification

```powershell
# Lightweight, safe under a constrained machine posture.
pnpm arcanea:visual:prior-evidence -- --json

# Only after an OPEN/bounded machine receipt permits full source reads.
pnpm arcanea:visual:prior-evidence -- --deep --json
```

The verifier is read-only. It does not copy, ingest, approve, publish, or modify any prior asset.
