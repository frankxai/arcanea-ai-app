# Round 01 visual acceptance matrix — paired anchor benchmark

Status: `prepared-not-authority`; all media calls held  
Prepared: 2026-08-25 Europe/Amsterdam  
Campaign: `arcanea-living-constellation-100` v1.10.0  
Provider lane: `codex-imagegen` / `codex-imagegen-tool` / tool-managed model selection / `{}` parameters / no image references  
Experiment: one source-complete human and one non-human morphology proposal across five visual systems

## Decision this matrix protects

Round 01 does not choose the most spectacular isolated picture. It asks which visual system can express both a grounded human character and a countable Godbeast proposal while preserving Arcanea's story law, material truth, mature editorial tone, and evidence boundary.

Each style receives a paired test:

| Style system     | Draconis | Kael    | Primary stress test                                            |
| ---------------- | -------- | ------- | -------------------------------------------------------------- |
| Living Codex     | ACV-001  | ACV-002 | field-plate restraint without parchment cosplay                |
| Prism Realism    | ACV-003  | ACV-004 | cinematic naturalism without poster spectacle                  |
| Luminous Atelier | ACV-005  | ACV-006 | painterly intelligence without decorative sameness             |
| Ritual Brutalism | ACV-007  | ACV-008 | monumentality without unreadable anatomy or oppressive fantasy |
| Mature Feature   | ACV-009  | ACV-010 | stylized 3D maturity without toy, mascot, or house-style drift |

A style is ineligible to win if either paired anchor fails its entity gate, style gate, identity floor, canon floor, or human review. This prevents creature-only or human-only performance from masquerading as an Arcanea-wide system.

## Immutable experiment binding

The current immutable Codex manifest is `planning-with-files/arcanea-visual-campaign/execution-manifests/round-01-codex-imagegen-2f1084f77ec50413.json`.

- Manifest hash: `2f1084f77ec50413d4d6b94f5d0863c6810638a3fc65d3fad54238e881e78fdb`
- Source-contract-set hash: `be2c4504bbc0366d717658b9993021ca6f49dee6e815c6ec29b0beaf2aa41e13`
- Prompt compiler: `2.1.3`
- Provider-packet hash: `4d3b2c5747cf8c813f1b0982fc37a411fa00c9a9a6165640e8dabb92d9cf7c5d`
- Manifest-index hash when prepared: `6d99a5537e0b3232f001f430fb0e9e0b5810d27ff7ff1ff94dc9007b74bcde4e`

Every value below is a prepared snapshot. The current manifest index and readiness report outrank this matrix. Any hash drift requires a new matrix; do not patch a live provider prompt with review feedback.

| Job     | Subject / style             | Contract hash                                                      | Execution-prompt hash                                              | Release boundary            |
| ------- | --------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ | --------------------------- |
| ACV-001 | Draconis / Living Codex     | `54d45c53f641a486eab97a067892184f69f86ef4dbee81bfde75d1692bc5b803` | `58a18b1c633e739b88ebd12c94aac8c3ade969d01caf36fdb4193ac201a79bac` | internal identity discovery |
| ACV-002 | Kael / Living Codex         | `0780fb9cae5163a89981ec20822807bd405910795071550efcc6177978491cdf` | `b6b8b421ff3b60bc0a80864112f35432b695e9ffe03216705c0288e14206c1dd` | candidate after human gates |
| ACV-003 | Draconis / Prism Realism    | `3ca00f0af4cc2325b28c6f5d34fc5ec5557b2d1be1ae4c29fa0795e152bde0d7` | `70ac0160fb2a11dd7d02c3cc71412b777361bb3fa89295d6dce2216b657605e3` | internal identity discovery |
| ACV-004 | Kael / Prism Realism        | `8d2f2b46a1fee8861441c853f31dfa1f524817910ffd620907ca4ebed1e70a70` | `d723d69825db5d75abcf8005fb7b12834279fcc5d01482011167dff882ee0194` | candidate after human gates |
| ACV-005 | Draconis / Luminous Atelier | `48a7df8258cd5f8f312d7eb02cde825ff05a1a16c1ef663f4ec94abbb4426313` | `d4c727af5af8043d1c4891c5aacad9db1b48b226c35c21338d8484b3edb4feb7` | internal identity discovery |
| ACV-006 | Kael / Luminous Atelier     | `a45803914cb4acaed9e1b4289accc93c97ed02eb554d7609db5efaa4f69f2aac` | `d7c92045b9af853f1bbe222f65400e44774c6d2c33656b38f41de05a19bac09f` | candidate after human gates |
| ACV-007 | Draconis / Ritual Brutalism | `d91ac9cebcbe339a2c3d6c72bd6750c4ecb4d71be7fb2c60b7a878ae42eb2570` | `94e1dd58a55356fc41c1f4933d7bb5fda944e1278bb2a579b2c8e459bf760279` | internal identity discovery |
| ACV-008 | Kael / Ritual Brutalism     | `42f9a7d99cbf1bcac66f1bf4ad222c2afdd95dac9f5936e93fefa5f5a411ce8d` | `0e49e89013d32635755319b69b9fd4e5ee692cae4136afc8147bbcd4dc4941eb` | candidate after human gates |
| ACV-009 | Draconis / Mature Feature   | `9c4cd76c353d9869ba9beb75ac3a22fb6270dbdf5c47e608c127a6597dd92be6` | `0439a4b44a701101e41edb4fbb65cfda270d3d8afd0a09dfa91bc0b14b75212a` | internal identity discovery |
| ACV-010 | Kael / Mature Feature       | `b43abff9532de78ad39580e9ab7c1acfb9f5868552e077618dcf2d32147d7955` | `040da8ee9c89b5df97f20ea7b3645aecb03ea419648d4d271fddb9f6c965926f` | candidate after human gates |

## Stage 1 — deterministic admission for every call

Record the result only when all deterministic recorder conditions pass:

- [ ] exactly one provider call was made under a fresh one-job, one-call, zero-revision grant;
- [ ] the provider/tool returned exactly one local PNG, JPEG, or WebP plus a unique real request/generation receipt;
- [ ] the source fully decodes and is at least 64 px in each dimension;
- [ ] measured geometry is within 1.5% of the declared 4:5 ratio;
- [ ] provider, model policy, runtime parameters, manifest, prompt, reference set, preflight, grant, and approver exactly match the current immutable lane;
- [ ] the governed stored copy fully decodes and exactly matches the source bytes, dimensions, and SHA-256;
- [ ] no second call is made under the consumed grant.

A decodable, ratio-valid image that later fails semantics is still a consumed benchmark result. Record it, reject it honestly during evaluation, and do not erase the evidence with an automatic retry.

## Stage 2A — shared composition and Arcanea gate

Apply to all ten recorded candidates:

- [ ] full 4:5 subject silhouette and all identity-bearing anatomy remain uncropped;
- [ ] the single decisive evidence object remains inside the crop and visually subordinate to the subject;
- [ ] useful blank marginal space exists for off-image dossier annotation;
- [ ] grayscale silhouette stays identifiable; color is never the only identity signal;
- [ ] materials show wear, weight, construction, and local environmental response;
- [ ] motivated directional light and one localized impossible behavior preserve physical legibility;
- [ ] the phenomenon serves one story consequence instead of becoming decorative magic or spectacle;
- [ ] palette reads approximately 70% ecological/material neutral, 20% identity family, 8% phenomenon, and 2% relational accent;
- [ ] adult premium editorial gravity replaces mascot, game-card, generic fantasy, or collectible-creature energy;
- [ ] no franchise/living-artist imitation or appropriated sacred clothing, gesture, symbol, or shrine language appears;
- [ ] no text, letters, captions, pseudo-glyphs, logo, watermark, border, or trading-card frame appears.

## Stage 2B — Draconis entity gate

Apply to ACV-001, ACV-003, ACV-005, ACV-007, and ACV-009:

- [ ] one sovereign Draconis subject dominates the frame;
- [ ] the body is wingless, with no membrane or wing-like default dragon silhouette;
- [ ] exactly six true anatomical/locomotor limbs are separately countable and coherent;
- [ ] exactly three non-limb temper vanes are separately countable from the six limbs;
- [ ] those three vanes are the only three Chord terminals; no duplicate or extra terminal system appears;
- [ ] the three vanes differ enough in form/material behavior to suggest distinct tempering functions rather than repeated decoration;
- [ ] ceramic/mineral plating dominates the material system, with credible joints, weight, wear, and thermal response rather than generic reptilian scales;
- [ ] the face is recessed and mask-like, not a conventional expressive dragon muzzle;
- [ ] the furnace ribcage is structurally legible and visibly involved in the event;
- [ ] one flawless-but-broken blade is the only foreground evidence object; no competing weapon, anvil, treasure, enemy, or prop appears;
- [ ] the blade's old fracture line is visible and glows white;
- [ ] one breath through the furnace ribs reveals pre-existing brittleness; it does not attack or cause the original break;
- [ ] the phenomenon communicates material diagnosis/tempering rather than destructive power;
- [ ] face architecture, locomotion, silhouette, and scale evidence remain coherent;
- [ ] presence reads as Godbeast/progenitor—never pet, mount, mascot, spirit animal, or VFX creature.

Draconis's physical body remains a controlled creator-proposed Solar Crucible candidate. A perfect result is still internal and noncanonical until creator acceptance plus orthographic anatomy, silhouette, locomotion, habitat, bonded-dyad, and identity-lock review agree.

## Stage 2C — Kael Thornfield entity gate

Apply to ACV-002, ACV-004, ACV-006, ACV-008, and ACV-010:

- [ ] Kael is the sole dominant subject and his complete kneeling silhouette remains inside the crop;
- [ ] both hands, both bare feet, and the selected stone are visible, uncropped, and anatomically coherent;
- [ ] he reads as a nineteen-year-old six-foot young adult—not a child, older man, giant, or idealized hero;
- [ ] skin is warm deep brown and remains materially truthful under the style's light;
- [ ] broad shoulders coexist with a visibly compressed, space-minimizing posture;
- [ ] hair is close-cropped and eyes read dark, watchful, and attentive;
- [ ] hands are large and visibly calloused;
- [ ] one small white scar appears at the base of his anatomical left thumb, never the right;
- [ ] clothing is worn linen, not pristine student robes, armor, name-derived fantasy costume, or unsupported sacred signifier;
- [ ] both feet are bare;
- [ ] the Hollow Root reconstruction reads as Ironhold's ruined shop, not a generic temple, dungeon, or dream void;
- [ ] his father's silent ghost is present but quiet and visually subordinate, never an attacker or spectacle;
- [ ] exactly one reusable stone is visibly selected as the foreground evidence object; ambient rubble remains contextual and noncompetitive;
- [ ] Kael kneels and chooses what can endure instead of fleeing, fighting, collapsing, or performing triumphant magic;
- [ ] the emotional consequence reads as grief converted into practical rebuilding;
- [ ] face, hands, limbs, age, proportions, posture, and grayscale identity remain coherent.

The full-body/scar combination is a deliberate resolution stress test. If the left-thumb scar cannot be verified, record and reject the output; do not tighten this comparative crop. A separate hand-detail identity plate may follow only after human style selection.

## Stage 2D — style-expression gates

These checks measure whether the style hypothesis is actually present without violating the entity gates.

### Living Codex — ACV-001 / ACV-002

- [ ] reads as a museum field plate with tactile painted realism and a crisp countable silhouette;
- [ ] neutral vellum-like ground and blank marginal space feel contemporary and restrained;
- [ ] material/ecological evidence outranks ornament;
- [ ] no aged-paper cosplay, sepia wash, decorative border, annotation text, or fantasy-card clutter appears;
- [ ] the localized impossible event remains small enough to study rather than worship.

### Prism Realism — ACV-003 / ACV-004

- [ ] reads as cinematic tactile naturalism with physically plausible surfaces;
- [ ] controlled lens depth preserves all countable anatomy and the evidence object;
- [ ] shaped color appears only where story requires it;
- [ ] quiet emotional presence outranks spectacle;
- [ ] no movie-poster grade, excess bloom, neon cyberpunk, beauty retouching, or empty cinematic grandeur appears.

### Luminous Atelier — ACV-005 / ACV-006

- [ ] reads as restrained painterly realism with visible but disciplined brush intelligence;
- [ ] classical value structure supports a clear grayscale silhouette;
- [ ] contemporary subject specificity survives atmospheric edges;
- [ ] faces, hands, vanes, scar, and evidence object remain precise rather than dissolved by softness;
- [ ] no pre-Raphaelite imitation, ethereal sameness, soft-focus face, costume pastiche, or decorative magic appears.

### Ritual Brutalism — ACV-007 / ACV-008

- [ ] reads as monolithic sculptural composition with severe but intentional negative space;
- [ ] architectural light cuts remain motivated and do not erase anatomy or evidence;
- [ ] stone, ceramic, and metal carry tactile weight while human skin/linen and Godbeast anatomy remain materially distinct;
- [ ] the small evidence object supplies readable scale rather than disappearing inside a monument;
- [ ] no generic dark fantasy, oppressive monochrome, war-monument propaganda, unmotivated runes, or unreadable scale appears.

### Mature Feature — ACV-009 / ACV-010

- [ ] reads as mature stylized 3D with graphic planes, tactile materials, expressive posture, believable weight, and silhouette-first anatomy;
- [ ] sophisticated lighting preserves skin, ceramic, linen, rubble, and the localized phenomenon;
- [ ] proportions remain adult and identity-specific;
- [ ] material surfaces avoid plastic smoothness;
- [ ] no oversized eyes, toy proportion, comedic mascot energy, family-animation-house imitation, or generic 3D character render appears.

## Pair decision and scoring protocol

1. Execute in fixed job order ACV-001 through ACV-010. Adjacent Draconis/Kael pairs reduce temporal provider drift within a style.
2. Record every deterministically admissible output exactly once. No image reference, seed, runtime parameter, model hint, repair prose, or extra call may be added mid-round.
3. Apply the entity and style checklists as admission evidence, but do not expose style labels or job/style mapping to the two independent blind critics.
4. After ten recorded calls, generate opaque hard-linked review assets and sealed scorecards. Each job must reach at least 42/50, identity ≥4/5, and canon ≥4/5 to pass.
5. A style pair is viable only when both jobs pass hard gates and score floors. Rank viable pairs by the reconciled mean, then inspect the score spread so one anchor cannot conceal the other's weakness.
6. Human review chooses one primary style and one secondary mode only after unblinding. No automated score may lock brand identity, Draconis morphology, Kael identity, canon, rights, or public release.
7. Freeze the round after ten calls. Contract or prompt improvements discovered here belong to the next immutable campaign version, never as hidden mutations to Round 01.

## Known non-blocking risks to observe, not pre-fix

| Risk                                                                         | Jobs                | Honest treatment                                                               |
| ---------------------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------ |
| full-body framing makes Kael's thumb scar too small                          | 002/004/006/008/010 | record and reject; later create a dedicated hand-detail plate                  |
| vellum becomes parchment cosplay                                             | 001/002             | fail Living Codex style gate                                                   |
| cinematic light becomes poster bloom/spectacle                               | 003/004             | fail Prism Realism style gate                                                  |
| painterly edges dissolve identity details                                    | 005/006             | fail Luminous Atelier style and identity gates                                 |
| brutalist materials bleed into Kael's body/clothing or hide Draconis anatomy | 007/008             | fail entity/material gate; clarify environment scope only in a future contract |
| stylized 3D softens into toy/mascot language                                 | 009/010             | fail Mature Feature style gate                                                 |
| Draconis vanes become extra limbs or duplicated terminals                    | 001/003/005/007/009 | fail anatomy gate; never reinterpret the output to make the count fit          |
| Draconis breath appears to break/attack the blade                            | 001/003/005/007/009 | fail story-law gate; the prior flaw must be diagnosed, not caused              |

## Machine and authority boundary

This matrix proves prompt/canon/design readiness only. It grants no machine capacity, spend, likeness/rights, generation, identity, brand, or release authority. The next live action remains the ACV-001 sequence in `planning-with-files/arcanea-visual-authority/ACV-001_LAUNCH_PACKET_2026-08-25.md`: fresh storage sensor at or above 15% → fresh allowed/bounded v2 receipt → explicit one-job human grant → manifest-bound readiness → exactly one built-in Imagegen call.
