# ACV-001 launch packet — Draconis / Living Codex

Status: `prepared-not-authority`; media call held  
Prepared: 2026-08-25 Europe/Amsterdam  
Workspace: `C:\Users\frank\starlight\repos\arcanea-ai-app\.worktrees\main-clean`  
Branch: `codex/arcanea-living-constellation-v1`  
Release boundary: internal identity-discovery study only  
Call boundary: exactly one new image, no revision call, no image references

## Stop/go gate

Do not call an image provider from this packet unless all of the following are true at the same time:

- the latest storage sensor reports at least 15% free on the governed volume;
- a fresh `arcanea.machine_preflight_receipt.v2` returns `allowed` or `bounded`, remains unexpired, and permits at least one parallel call;
- a fresh, hash-valid execution grant names only `ACV-001`, the current manifest, one maximum call, zero revision calls, the exact runtime parameters, and the approved spend/rights humans;
- the manifest-bound readiness check passes with `--require-ready` immediately before the call;
- the current manifest and prompt hashes still equal the values below.

The latest audit receipt is evidence of a stop, not authority to execute:

| Field                          | Latest evidence                                                                                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Receipt                        | `planning-with-files/arcanea-visual-authority/round-01-preflight-user-resume-2-2026-08-25.json`                                                  |
| Receipt hash                   | `6edd0df24ac87e96790fb28c934df6035b36a75f667bfa9bba6cceedb7fa90cf`                                                                               |
| Verdict                        | `hold`                                                                                                                                           |
| Expired                        | 2026-08-25 18:59 Europe/Amsterdam                                                                                                                |
| Storage in receipt             | 78.2 GiB / 8.2% free; approximately 64.5 GiB below the 15% media-admission boundary                                                              |
| Newer storage-only observation | plan `storage_20260825_190704_c2e32d83`: 77.7 GiB / 8.2% free at 19:07; approximately 65.0 GiB below the boundary; still not execution authority |
| Other blockers                 | 7,130 MB free RAM versus 10,240 MB required; 23 Codex runtimes versus 6 allowed; one dev server                                                  |

## Immutable execution identity

| Field                             | Required value                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Campaign                          | `arcanea-living-constellation-100`                                                                              |
| Campaign version                  | `1.10.0`                                                                                                        |
| Round / job                       | `1` / `ACV-001`                                                                                                 |
| Provider profile                  | `codex-imagegen`                                                                                                |
| Provider                          | `codex-imagegen-tool`                                                                                           |
| Model policy                      | `tool-managed-model-selection`                                                                                  |
| Runtime parameters                | `{}`                                                                                                            |
| Runtime-parameters hash           | `44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a`                                              |
| Contract                          | `apps/web/public/downloads/arcanea-constellation/prompts/acv-001.json`                                          |
| Contract hash                     | `54d45c53f641a486eab97a067892184f69f86ef4dbee81bfde75d1692bc5b803`                                              |
| Provider packet                   | `planning-with-files/arcanea-visual-campaign/round-01-codex-imagegen-provider-pack.json`                        |
| Provider-packet hash              | `4d3b2c5747cf8c813f1b0982fc37a411fa00c9a9a6165640e8dabb92d9cf7c5d`                                              |
| Manifest                          | `planning-with-files/arcanea-visual-campaign/execution-manifests/round-01-codex-imagegen-2f1084f77ec50413.json` |
| Manifest hash                     | `2f1084f77ec50413d4d6b94f5d0863c6810638a3fc65d3fad54238e881e78fdb`                                              |
| Manifest-index hash when prepared | `6d99a5537e0b3232f001f430fb0e9e0b5810d27ff7ff1ff94dc9007b74bcde4e`                                              |
| Contract-set hash                 | `be2c4504bbc0366d717658b9993021ca6f49dee6e815c6ec29b0beaf2aa41e13`                                              |
| Execution-prompt hash             | `58a18b1c633e739b88ebd12c94aac8c3ade969d01caf36fdb4193ac201a79bac`                                              |
| Output geometry                   | one 4:5 vertical image                                                                                          |
| Reference plan                    | text-only; no image references                                                                                  |
| Governed output                   | `planning-with-files/arcanea-visual-assets/v1/round-01/acv-001-r1.<decoded-extension>`                          |
| Governed receipt                  | `planning-with-files/arcanea-visual-results/acv-001-r1.json`                                                    |
| Rights/release state              | internal draft; source review and creator identity decision required                                            |

The immutable execution manifest and its current-active entry in the manifest index are authoritative. Every value in this packet is a prepared snapshot. If a rebuild changes any current hash, or the index no longer names this manifest as current, stop and regenerate this packet before making a provider call.

## Human-readable provider-prompt snapshot

The text below is a convenience snapshot for human review. It has been byte-compared with the manifest-bound prompt recorded above, but it is not a second source of truth. At execution time, load `jobs[id=ACV-001].executionPrompt` from the current validated immutable manifest and submit that value unchanged.

```text
Create exactly one 4:5 Arcanea visual study.

Draconis. Tested morphology candidate — the Solar Crucible: a wingless, six-limbed, ceramic-plated draconic progenitor with a recessed mask-face, furnace ribcage, and exactly three functionally distinct temper vanes. The local record grounds will amplification, sacred forging flame, material tempering, and draconic sovereignty; use the described body as one coherent comparison candidate.

Action and story consequence: Beside a flawless blade that shattered before use, Draconis breathes once through its furnace ribs until the old fracture line glows white; the three temper vanes register the brittleness that existed before the break, exposing material truth rather than attacking.

Composition: 4:5 vertical field portrait, full silhouette readable, one foreground evidence object, generous negative space for a future dossier caption outside the image.

Intended surface: godbeast dossier and morphology atlas. Crop safety: Protect the complete subject silhouette, hands or countable limbs, and decisive evidence object from edge loss; no alternate crop is authorized by this contract.

Visual direction: museum field plate, restrained vellum-like ground, blank marginal breathing room reserved for off-image annotation, tactile painted realism, crisp silhouette, material truth, one localized impossible behavior. 70% ecological/material neutral, 20% identity family, 8% active phenomenon, 2% relational accent. Tactile, specific materials with wear, weight, construction, and local environmental response.

Light: Motivated directional light plus one localized Arcanean working signal; preserve skin, material, and atmospheric truth.

Identity variation boundary: Use this morphology as the single controlled body proposal for this comparative plate. Hold its topology and exactly 3 Chord terminals constant inside this plate for a clean comparison; vary only the explicitly open detail variables. Keep the Gate relation and grounded functional phenomena fixed.

Required visible result: Grayscale silhouette remains identifiable. Limbs, Chords, face architecture, locomotion anatomy, and scale evidence remain coherent. Visible phenomenon serves one story law. Adult premium editorial finish with mature editorial gravity. Exactly 3 countable Chord terminals in silhouette. Sovereign ecology, never pet, mount, or visual effect. Draconis remains wingless with exactly six limbs and exactly three temper vanes. The flawless broken blade and its visible old fracture line remain the single evidence object.

Keep the image free of: generic fantasy concept art; rainbow galaxy effects; permanent flame crystal or waterfall hair; franchise or living-artist style imitation; appropriated sacred clothing symbols gestures or shrine architecture; illegible pseudo-text; sexualized or childlike treatment; color as the only identity signal; aged parchment cosplay; fantasy trading-card clutter; ornamental borders; sepia wash; generic dragon; generic spirit animal.

Return image content only. Do not place captions, labels, logos, borders, watermarks, or pseudo-glyphs inside the image.
```

## Provider call contract

Use the built-in Imagegen lane with the exact prompt loaded from the validated manifest:

- request exactly one image;
- omit both `referenced_image_paths` and `num_last_images_to_include`;
- do not add provider-specific prose, style names, reference art, or a seed outside the manifest;
- preserve the provider generation receipt/output identifier;
- place the returned project-bound image in a temporary local source path before running the recorder;
- do not publish, register as an identity master, or use it as a future identity reference before human review.

## Two-stage acceptance gate

Stage 1 is deterministic admission: the tool returned exactly one local PNG/JPEG/WebP, the unique provider receipt exists, the grant is still live, the image fully decodes, and its measured ratio is within the recorder's 1.5% tolerance of 4:5. Run the recorder dry-run, then record any deterministically admissible output so the consumed provider call remains auditable.

Stage 2 is semantic acceptance. Check the recorded candidate against every item below:

- [ ] exactly one Draconis subject;
- [ ] wingless silhouette;
- [ ] exactly six anatomical limbs are separately countable; do not assume or retroactively label a specific limb arrangement;
- [ ] exactly three non-limb temper vanes / Chord terminals are separately countable and visually distinct from the six limbs;
- [ ] the three vanes are materially/functionally differentiated enough to read as three distinct tempering instruments rather than repeated decoration;
- [ ] ceramic/mineral plating reads as constructed, weighted material rather than generic scales;
- [ ] recessed mask-face and furnace ribcage are both visible and coherent; avoid a conventional expressive dragon muzzle;
- [ ] the broken blade is the only foreground evidence object;
- [ ] one old fracture line in the blade glows white;
- [ ] the event reads as diagnosis/material truth, not attack, weapon discharge, or spectacle;
- [ ] full silhouette, all countable anatomy, and blade survive the 4:5 crop;
- [ ] restrained museum field-plate composition leaves useful blank marginal space;
- [ ] no letters, captions, pseudo-glyphs, logo, watermark, card frame, or ornamental border;
- [ ] no mascot, pet, mount, generic dragon, franchise, or game-concept-art reading.

Any semantic failure makes the candidate ineligible for approval and style-winning evidence, but does not erase the recorded call. Do not silently retry or repair it. After all ten Round 01 calls are recorded, the opaque two-critic review may score the existing 10 × 5 Arcanea rubric; this candidate still requires at least 42/50, identity ≥4/5, canon ≥4/5, and human approval. Passing this study does not lock Draconis's identity; it makes the candidate eligible for creator accept/amend/reject review.

Independent pre-execution review returned **PASS WITH NOTES** for exactly one internal discovery image and **FAIL by design** for public/canonical identity use. It scored the prompt contract 47/50 and found no blocking contract revision. Optional future improvements—explicitly naming the Fire Gate/Draconia relationship and replacing generic working-light language with the white diagnostic seam—must wait for a deliberate contract revision, new hashes, a new immutable manifest, and renewed authority; do not inject them into the current provider call.

## Exact gate sequence after cleanup

Run from `C:\Users\frank\starlight\repos\arcanea-ai-app\.worktrees\main-clean`. Use new timestamped receipt paths every time; authority files are write-once and an existing path will reject different content.

1. Define unique paths, capture a new storage plan, and capture a fresh machine receipt. A nonzero preflight exit is an immediate stop:

```powershell
$arcaneaStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$arcaneaPreflight = "planning-with-files/arcanea-visual-authority/round-01-preflight-acv-001-$arcaneaStamp.json"
$arcaneaGrant = "planning-with-files/arcanea-visual-authority/round-01-grant-acv-001-$arcaneaStamp.json"
pwsh -NoProfile -File C:\Users\frank\starlight\repos\starlight-agent-config\core\tools\Invoke-StarlightStorageIntelligence.ps1 -Mode Quick
pnpm arcanea:visual:preflight -- --ttl-minutes 15 --storage-input C:\Users\frank\.starlight\storage-intelligence\latest.json --write $arcaneaPreflight
```

2. Confirm that the current index, manifest, and preflight are internally valid before asking for a grant:

```powershell
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --preflight $arcaneaPreflight --json
```

The expected state is execution awaiting a grant. Any manifest drift, HOLD posture, expiry, or validation failure is a stop.

3. Issue a one-job, one-call, zero-revision grant. Replace every angle-bracket field with the exact human decision record; do not infer rights or spend authority. Keep the approver string because the recorder must byte-match it:

```powershell
$arcaneaSpendApprover = '<NAMED_HUMAN>'
$arcaneaRightsAttester = '<NAMED_HUMAN>'
$arcaneaAuthorityEvidence = '<REAL_HUMAN_DECISION_RECORD_AT_LEAST_12_CHARACTERS>'
$arcaneaIssuer = '<OPERATOR_ID>'
pnpm arcanea:visual:grant -- --round 1 --provider codex-imagegen --jobs ACV-001 --max-revision-calls 0 --ttl-minutes 15 --stop-minutes 15 --parameters '{}' --specialist-evidence '[]' --preflight $arcaneaPreflight --human-attestation confirmed --authority-evidence $arcaneaAuthorityEvidence --spend-approved-by $arcaneaSpendApprover --spend-boundary 'one Codex Imagegen call for ACV-001; zero revision calls' --rights-attested-by $arcaneaRightsAttester --issued-by $arcaneaIssuer --write $arcaneaGrant
```

4. Demand manifest-bound readiness immediately before the provider call:

```powershell
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --preflight $arcaneaPreflight --grant $arcaneaGrant --json --require-ready
```

5. Read the exact execution prompt from the still-current manifest and verify the expected prompt hash before making exactly one built-in Imagegen call. Do not make a repair call under this grant:

```powershell
$arcaneaManifestPath = 'planning-with-files/arcanea-visual-campaign/execution-manifests/round-01-codex-imagegen-2f1084f77ec50413.json'
$arcaneaManifest = Get-Content $arcaneaManifestPath -Raw | ConvertFrom-Json
$arcaneaJob = $arcaneaManifest.jobs | Where-Object id -eq 'ACV-001'
if ($arcaneaJob.executionPromptHash -ne '58a18b1c633e739b88ebd12c94aac8c3ade969d01caf36fdb4193ac201a79bac') { throw 'ACV-001 execution prompt drifted; stop.' }
$arcaneaPrompt = $arcaneaJob.executionPrompt
```

6. Preserve the actual unique provider/tool request receipt. Decode and dry-run the recorder before it copies the accepted source into governed storage. For this tool-managed lane, omit `--model`, use `{}` parameters, and omit `--reference-hashes` because the manifest reference set is empty:

```powershell
pnpm arcanea:visual:record -- --dry-run --job ACV-001 --revision 1 --source '<ABSOLUTE_LOCAL_IMAGE_PATH>' --provider codex-imagegen-tool --parameters '{}' --generation-receipt '<UNIQUE_ACTUAL_PROVIDER_TOOL_RECEIPT>' --preflight-receipt $arcaneaPreflight --execution-grant $arcaneaGrant --spend-approved-by $arcaneaSpendApprover --execution-manifest $arcaneaManifestPath --execution-prompt-hash 58a18b1c633e739b88ebd12c94aac8c3ade969d01caf36fdb4193ac201a79bac --rights-state internal-draft-source-review-required
```

7. If deterministic admission passes, repeat the same recorder command without `--dry-run` even when the later semantic gate fails; this preserves the consumed-call evidence for evaluation. Then perform the semantic checklist, run full verification, and reconstruct the next state **without** the now-consumed one-job grant:

```powershell
pnpm arcanea:visual:verify
pnpm arcanea:visual:readiness -- --round 1 --provider codex-imagegen --json
```

The expected result is one recorded Round 01 image and `ACV-002` as the next missing job. Never pass the consumed ACV-001 grant to post-record readiness.

## Canon and decision boundary

Locked local evidence establishes Draconis as the Fire Gate Godbeast bonded to Draconia and grounds will amplification, sacred forging flame, material tempering, and draconic sovereignty. The six-limbed Solar Crucible body and three temper vanes are creator-supplied proposal evidence, not locked repo canon. Consequently:

- the output is a controlled identity-discovery plate, not “what Draconis canonically looks like”;
- vane placement, six-limb proportions/topology, face/sensory architecture, scale, ecology, and plate construction remain open variables;
- no accepted image reference exists yet, so no cross-image identity claim may be made;
- creator acceptance must precede an identity master, public gallery release, or continuity use.

## Abort conditions

Stop without another provider call when any receipt expires, a hash/index changes, the gate returns HOLD, an authority field is missing, the provider request receipt is unavailable, the tool returns more than one image, deterministic admission fails, semantic acceptance fails, or the first provider call completes. When deterministic admission succeeds, record the output before stopping even if semantic acceptance fails. A rejected first image is still a consumed call and requires a revised contract/manifest when the failure is user-correctable, safety-, prompt-, or input-related, plus a new preflight and explicit grant decision before any revision.
