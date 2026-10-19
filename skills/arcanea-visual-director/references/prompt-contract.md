# Arcanea visual prompt contract v1

The prompt contract is an engine-neutral specification. Provider prose is a compiled view, not the source of truth.

## Required fields

```yaml
schema: arcanea.visual_prompt_contract.v1
intent: why this asset exists and where it will be used
subject:
  stableId: immutable entity id
  displayName: approved display name
  kind: guardian | godbeast | dyad | agent | book-character | world | workflow | regression
  identityLock: exact physical, narrative, and morphological invariants
  evidenceState: source-complete | source-partial | review-gated | conflicting
  openIdentityVariables: every physical or cultural trait the source has not fixed
  allowedVariation: what camera, pose, expression, and environment may change
storyBeat: one observable action, pressure, or choice
composition: human-readable hierarchy, camera, negative space, and primary-frame behavior
output:
  assetCount: exactly one image per generation call
  aspectRatio: explicit machine-readable primary geometry
  intendedSurface: exact dossier, atlas, teaching, or regression surface
  deliveryRole: the contracted use of this asset in the campaign
  cropSafety: protected subjects, evidence, and permitted peripheral loss
  generatedTextPolicy: no-generated-text
designSystem:
  styleMode: selected Arcanea system, never a provider or artist name
  direction: material, rendering, and editorial behavior
  colorLaw: 70 / 20 / 8 / 2
  escalation: dormant | resonant | manifest | transcendent
  materialLaw: physical construction and wear
  typography: usually no generated text
light: motivated light and exact exceptional behavior
references:
  sourceRefs: canon, manuscript, identity, and research sources
  imageRefs: path, hash, rights state, and identity/composition/material/light role
constraints: positive acceptance conditions
avoid: concrete failure modes, appropriation risks, drift patterns, and imitation bans
provider:
  adapter: runtime-discovered
  preferredCapabilities: reference fidelity, editing, continuity, receipt
  model: set only at execution time
  seed: optional and provider-dependent
  providerParameters: explicit execution parameters
verification:
  deterministicChecks: full decode, declared/measured aspect ratio within 1.5%, dimensions, hash, receipt, text policy
  rubric: arcanea_visual_quality_v1_10x5
  passThreshold: 42
  identityFloor: 4
  canonFloor: 4
  humanApprovalRequired: true
governance:
  releaseEligibility: candidate-after-human-gates | internal-only-until-identity-lock
  sensitivityReviewRequired: boolean
  reviewRequirements: exact named human review prerequisites
contractHash: SHA-256 of every field above except contractHash
```

## Compile order

Compile the generic inspectable round prose in this order:

1. output geometry, medium, and intended use;
2. stable subject identity and countable anatomy;
3. observable story beat;
4. composition and camera;
5. selected Arcanea design system;
6. materials and motivated light;
7. positive constraints;
8. avoid contract;
9. reference roles;
10. verification requirements.

Do not bury identity locks in adjectives. Repeat the two or three easiest-to-drift facts near both the subject and constraint sections when the provider benefits from redundancy.

Then compile a provider execution packet. The image-facing prompt contains the subject, action, composition, visual system, light, variation boundary, and visible acceptance conditions. Keep canon-status commentary, identity-master language, release eligibility, rights state, reference-acceptance instructions, review requirements, spend, and publication governance beside the prompt as execution metadata; do not ask the image model to render or reason about those operational phrases. Provider Prompt Compiler v2 must record the count and hash of every withheld constraint/exclusion and fail closed if an operational term leaks into the image-facing prompt.

- Treat `output.aspectRatio` as authoritative and fail closed when the same ratio is missing from or conflicts with `composition`.
- Hold provider, exact model, quality tier, and reference policy constant within one ten-image controlled round.
- In a direct style comparison such as Round 01, also hold aspect ratio and intended surface constant. In later portfolio rounds, bind geometry to each job's intended surface and keep it unchanged across that job's revisions or declared comparisons; cross-subject portability evidence is not a same-subject aspect-ratio experiment.
- Hold the same source-complete or explicitly proposed anchor facts across every style. Do not use an entity with open body, face, age, or cultural embodiment as a pure style control.
- When no accepted image-reference hash exists, label the benchmark text-conditioned and treat between-style likeness variance as noise; style selection cannot double as identity approval.
- Hash the exact execution prompt separately from the engine-neutral contract and generic round pack.
- Keep subject → action → composition → visual system → light → variation boundary → visible checks ordering. OpenAI, Gemini, and Codex controlled lanes receive identical semantics; provider request parameters stay outside the prose prompt.
- For FLUX.2, translate the avoid contract into positive desired qualities and emit no negative-prompt field.
- Disable automatic prompt expansion during controlled comparisons unless prompt expansion itself is the declared variable.
- For reference-capable providers, attach only the smallest sufficient approved set and declare each file's identity, composition, material, or lighting role.

## Output storage contract

- One generation call produces one fully decoded file in `planning-with-files/arcanea-visual-assets/`, plus a hash-linked output receipt containing the declared ratio, measured ratio, relative error, fixed 1.5% provider-rounding tolerance, dimensions, byte count, and SHA-256. Before the receipt is written, fully decode the stored internal copy and prove its format, dimensions, byte count, and hash exactly match the decoded ingest source.
- Review and rejected outputs have `publicUrl: null` and never enter `apps/web/public`.
- Independent scoring reads the internal file named by `storagePath` and verifies its bytes against the output receipt.
- Discovery-only studies remain internal even when their craft score passes; approval requires a new versioned contract after open identity variables are resolved.
- When specialist review is named, the approval receipt must cite specific evidence; `none`, `N/A`, or `not required` cannot satisfy the gate.
- Only an explicit human approval with passing evaluation and all release gates may copy those exact bytes into the versioned public campaign tree.
- Publication remains a separate evidence receipt and deployment decision.

## Character identity packet

First assign one readiness state:

- `source-complete`: no silent physical variables in the manuscript record;
- `source-complete-review-required`: physically specific enough to explore, with named specialist approval evidence still required;
- `discovery-only`: known facts plus explicit open variables; technically barred from approval and public staging;
- `blocked`: no generation until the named conflict or prerequisite is resolved.

Before the first hero image, create:

- neutral 3/4 identity portrait;
- front and profile face references;
- full-body silhouette and proportion plate;
- hands, maintained object, instrument, and material details;
- one dormant and one resonant state;
- expression range tied to story, not generic emotion labels;
- canonical wardrobe baseline and approved variant rules;
- identity hash linking accepted reference images.

Do not use an ensemble image as the first identity lock. Do not accept a face because it is beautiful if the body, age, posture, ethnicity, anatomy, or story function drifted.

## World identity packet

Contract one bounded environmental action. `source-complete` means the cited records support that plate; it does not grant permission to invent uncited regions, cultures, institutions, or cosmology elsewhere in the world.

Record:

- navigable geography and the relation among foreground, midground, and distance;
- water, energy, climate, ecology, food, labor, transport, waste, maintenance, and material supply;
- architecture as a consequence of those systems rather than an ornamental style;
- one ordinary action carrying social organization and one distant ecological consequence;
- exact exceptional behavior and its physical limit;
- cultural and linguistic review boundaries;
- deliberate absences, unnamed places, open maps, and canon resources that must not be spent accidentally.

Reject empty skylines, decorative megacities, portal-only worlds, and one-costume monocultures. Block generation when a qualified cultural review is non-negotiable or when direct depiction would collapse a deliberately preserved absence. Current examples are Van Linh's Vietnamese-reader protocol and Aurevalde's pure-absence canon.

## Godbeast identity packet

First separate five evidence layers:

1. locked relation: name, Gate, bond, and accepted canon facts;
2. locally grounded function: cited abilities, material behavior, and story consequence;
3. locally grounded base form, when present;
4. tested morphology candidate from a separately labeled proposal;
5. open physical identity and any blocking contradiction.

Do not call a proposal's body plan `identityLock`. During an internal controlled study, put it in `subject.identityLock` only as an explicitly named **tested candidate**, set `identityState` to proposal, keep `releaseEligibility` internal, and say in `allowedVariation` that holding the candidate steady implies no canon acceptance.

Record base clade, limb count, face and sensory architecture, Chord count and terminal morphology, silhouette, scale evidence, locomotion, ecology, material, one active behavior, and every banned generic-animal shortcut. Chords must be countable in silhouette, functionally distinct, and connected to coherent locomotion anatomy.

Before a public identity master, require this sequence:

- grayscale silhouette comparison;
- front, side, top, and three-quarter anatomy sheet;
- countable Chord and limb audit;
- material and functional-phenomenon study;
- locomotion and habitat study;
- bonded-dyad consent scene;
- accepted reference set with hashes;
- human canon reconciliation and identity-lock receipt.

If topology, limb count, ontology, or the relation between a Guardian and Godbeast conflicts, generation is blocked. Sol's proposed four-limb body versus proposed six-limb clade law and Source-as-creature versus Source-as-convergence are current examples, not creative invitations for the model to compromise.

## Revision contract

An edit request names:

- the accepted parent asset hash;
- exactly what must remain unchanged;
- exactly one prioritized change set;
- expected visible evidence;
- failure conditions;
- new revision id and parent link.

When several fundamentals failed, return to the identity contract instead of stacking edits on a weak parent.
