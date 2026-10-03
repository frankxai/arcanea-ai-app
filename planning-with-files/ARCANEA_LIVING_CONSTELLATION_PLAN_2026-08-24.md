# Arcanea Living Constellation and 100-image campaign plan

> Status: v1.10.0 foundation verified · media generation machine-gated
> Branch: `codex/arcanea-living-constellation-v1`
> Canonical repo: `arcanea-ai-app`

## Outcome

Build a governed visual foundation that can generate, compare, maintain, and publish Arcanea identities without losing canon, character continuity, rights, provenance, or human authority.

## Eight-hour execution program

The hours below begin when a fresh `pp preflight --workload overnight` returns an allowed state and spend authority is explicit. Text-system construction may continue while media remains gated.

| Time        | Work                                                                                                             | Exit evidence                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| 00:00–00:45 | Re-run machine/storage gate; select one immutable provider manifest; confirm ten individual generation calls     | preflight receipt, spend identity, manifest hash, ten exact prompt hashes                   |
| 00:45–02:00 | Generate Round 01: Kael Thornfield and Draconis across five controlled styles                                    | ten fully decoded files, manifest-bound receipts, hashes, dimensions, measured-ratio checks |
| 02:00–02:45 | Create opaque hard-linked review packet; complete two separate full-resolution 10×5 scorecards before unblinding | two sealed scorecards, failure map, human style decision, benchmark-limitation notes        |
| 02:45–03:45 | Apply reflection; compile and generate Round 02 Guardians                                                        | accepted Round 01 receipt, ten Guardian outputs                                             |
| 03:45–04:30 | Review Round 02; correct the identity grammar; compile Round 03                                                  | reflection receipt and revised contract version                                             |
| 04:30–05:30 | Generate Round 03 Godbeasts, excluding blocked Sol and Source jobs until canon resolution                        | eight outputs plus two explicit blockers; no silent substitutions                           |
| 05:30–06:15 | Anatomy/count review; provider comparison if repeat failures concentrate                                         | exact Chord/limb scorecard and route decision                                               |
| 06:15–07:15 | Generate the next allowed ten-image round, selected from agents or dyads based on learning value                 | ten outputs and receipts                                                                    |
| 07:15–08:00 | Reflect, update identity system and gallery data, prepare preview packet                                         | review receipt, updated manifests, preview-ready artifact list                              |

This is the first eight-hour media-production block after the machine and spend gates open, not permission to fake completion. The ledger contains 100 contracted jobs; 91 are currently executable and nine are truthfully blocked. Reaching 100 outputs requires resolving those named canon, identity, and sensitivity gates first.

## Ten rounds

1. Five styles × two controlled anchors.
2. Ten Guardians.
3. Ten Godbeasts.
4. Ten Guardian/Godbeast dyads.
5. First ten named product-agent identities.
6. Remaining six product-agent identities plus four governed workflow scenes.
7. First ten manuscript characters.
8. Second ten manuscript characters.
9. Ten worlds and places.
10. Portrait, action, badge, grayscale, crop, and ensemble regression tests.

Round 01 is the only five-style controlled comparison. Once its human-accepted reflection names a primary and distinct secondary mode, Rounds 02–10 use a deterministic 80/20 allocation over executable jobs: normally eight primary jobs and two secondary portability probes. The prior reflection hash selects the probe ids, preventing operator cherry-picking. Because later probes depict different subjects, they measure longitudinal portability rather than serving as direct A/B style comparisons; no single probe can promote or retire a mode.

## Hard gates already identified

- Sol: creator proposal says four limbs while its own draconic clade law says six.
- Source / Ten-Chorded: locked canon names a Source Godbeast while the proposal says Shinkami has no separate beast.
- Korvash: BIBLE/chapter pronoun conflict plus explicit disability and neurodivergence review.
- An and Van Linh: qualified Vietnamese sensitivity review required.
- Aurevalde: the source deliberately spends pure absence; depiction requires a creator canon-resource decision.
- The Guardian ensemble: blocked until all ten physical identities have accepted locks and reference sets.
- Identity, canon, rights, spend, and external release remain human decisions.

## Required commands

```powershell
pnpm arcanea:visual:source:verify -- --file <creator-source-path> --evidence-id <campaign-evidence-id>
pnpm arcanea:visual:prior-evidence -- --json
pnpm arcanea:visual:verify
pnpm arcanea:visual:tooling
pnpm arcanea:visual:provider-pack -- --round 1 --provider all
pnpm arcanea:visual:preflight -- --write planning-with-files/arcanea-visual-authority/round-01-preflight.json
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --json
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --template
pnpm arcanea:visual:grant -- --round 1 --provider codex-imagegen --preflight <preflight-json> --spend-approved-by <human> --spend-boundary <bounded-calls-or-cost> --rights-attested-by <human> --issued-by <human> --authority-evidence <decision-record> --human-attestation confirmed --parameters '{}' --write <grant-json>
pnpm arcanea:visual:record -- --job ACV-001 --source <image> --provider <provider> [--model <exact-provider-exposed-model>] --parameters <json> --execution-manifest <current-manifest> --execution-prompt-hash <sha256> --generation-receipt <provider-receipt> --preflight-receipt <preflight-json> --execution-grant <grant-json> --spend-approved-by <human>
pnpm arcanea:visual:blind-review -- --round 1
pnpm arcanea:visual:reconcile -- --round 1
pnpm arcanea:visual:score -- --round 1
```

The build command generates normalized data and public packs, compiles Round 01, and rebuilds the internal workbench before validation. The separate format command is optional for repository presentation and never changes contract meaning. The tooling audit proves that every detected provider-adjacent code surface is classified, rejects provider credentials placed in active web URLs, and keeps the Visual Director campaign as the single canonical identity-media lane; it does not authorize product or legacy callers. The recorder keeps review binaries in the ignored internal asset store; the scorer reads them there; only a human-approved decision may stage the exact bytes into `apps/web/public`.

Round 02 compilation must fail until `planning-with-files/arcanea-visual-reflections/round-01.json` binds both sealed blind scorecards, records the text-conditioned likeness limitation and cross-anchor portability, names an accepted primary and secondary style, carries the human verdict, and sets `nextRoundCompilationAllowed: true`.

## Identity-reference path

1. Human-approve one exact scored output through all five gates.
2. Register it as one bounded reference view; this is still capped at 4/5 continuity.
3. Accumulate eight distinct approved images covering the complete regression suite.
4. Human-qualify one versioned identity set with explicit identity-lock evidence.
5. Assign one to five smallest-sufficient views to one exact future job.
6. Bind that assignment in the immutable execution manifest and output receipt. Only this chain permits 5/5 identity continuity.

## Release path

Execute this path through `docs/design/ARCANEA_LIVING_CONSTELLATION_PREVIEW_GATE_V1.md`; its evidence fields and HOLD/preview/production verdicts are the release packet.

1. Local deterministic checks.
2. Typecheck and bounded web verification.
3. Independent evaluation plus human canon, identity, rights, brand, and sensitivity gates.
4. Hash-linked approval decision and exact-byte staging for web release.
5. Vercel preview for `/constellation`, every agent dossier, and `/gallery` linkage.
6. Desktop/mobile/accessibility inspection.
7. Publication evidence and provenance packet.
8. Human production promotion; domain or project changes remain separately approved.
