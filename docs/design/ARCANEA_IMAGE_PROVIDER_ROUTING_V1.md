# Arcanea image-provider routing v1

> Capability research verified 2026-08-24 and revalidated 2026-08-25 against first-party documentation. Provider capabilities change; exact model selection remains a runtime decision recorded in the generation receipt.

## Decision

Arcanea owns an engine-neutral identity and prompt contract. Providers are execution lanes, not sources of truth. A provider may interpret a contract, but it cannot change canon state, open identity variables, reference rights, review requirements, evaluation floors, or release eligibility.

Use one provider, exact model, output-quality tier, and reference policy for all ten candidates inside a controlled round. Round 01 also holds machine-declared aspect ratio and intended surface constant because it compares styles directly on two anchors. Later portfolio rounds may contain contracted dossier, workflow, world, or regression surfaces with different geometry; each job's output contract is authoritative and stays fixed across its revisions and declared comparisons. Switching engines inside a style comparison introduces a second variable and invalidates the experiment. A provider comparison belongs in a separately declared campaign.

## Current execution lanes

| Lane                    | Best use                                                                               | Current first-party evidence                                                                                                                                                                                                                                   | Arcanea rule                                                                                                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Codex imagegen          | Available governed tool lane for one contracted image at a time                        | Installed local skill controls how new images and edits receive references                                                                                                                                                                                     | One call per job; use local reference paths when available; record the returned provider evidence without inventing a model name                                          |
| OpenAI GPT Image family | High-fidelity reference workflows, exact output controls, iterative edits              | [OpenAI image-generation guide](https://developers.openai.com/api/docs/guides/image-generation) documents multi-turn editing, multiple image inputs, automatic high-fidelity reference processing for `gpt-image-2`, and explicit size/quality/format controls | Strong primary API lane when exact request and response receipts are available; use medium quality for controlled studies and high quality only for selected refinements  |
| Gemini native image     | Multi-reference character/object consistency, complex reasoning, 2K/4K production      | [Gemini image-generation guide](https://ai.google.dev/gemini-api/docs/image-generation) documents typed multi-reference workflows, explicit aspect ratios, 1K–4K output, multi-turn editing, and model-specific reference limits                               | Strong secondary consistency lane; discover current model limits at runtime; do not use the up-to-24-hour batch path inside a same-session ten-image adaptive loop        |
| FLUX.2                  | Adversarial interpretation, materials, controlled composition, multi-reference editing | [BFL FLUX.2 prompting guide](https://docs.bfl.ai/guides/prompting_guide_flux2) documents subject-first ordering, multi-reference editing, optional prompt upsampling, and the absence of a negative-prompt channel                                             | Use a positive-language adapter, disable prompt upsampling during controlled comparisons, and record output-size-dependent reference limits at execution time             |
| Midjourney              | Manual inspiration and mood exploration                                                | [Midjourney reference documentation](https://docs.midjourney.com/hc/en-us/articles/32162917505293-Character-Reference) states that references guide rather than copy exactly and that V7 uses Omni Reference                                                   | Exploratory only unless a reproducible request, rights record, exact version, and retrievable generation receipt can be attached; never the sole identity-master evidence |

## Provider-packet invariant

`scripts/compile-arcanea-provider-packets.mjs` compiles four provider-specific packets from the same hash-bound round pack:

- `openai-gpt-image`: natural-language prompt plus exact controlled-study output hints;
- `gemini-native-image`: image-only, 4:5, 2K same-loop execution hints for Round 01;
- `flux-2`: subject-first prompt with the avoid contract translated into positive desired qualities, no negative-prompt field, and ratio-exact dimensions divisible by 16 inside the documented recommended working range;
- `codex-imagegen`: one-call tool packet with the smallest-sufficient-reference rule.

Provider Prompt Compiler v2.1 treats `promptContract.output.aspectRatio` as authoritative, fails closed when it conflicts with the human-readable composition, and carries asset count, intended surface, delivery role, crop safety, and generated-text policy as inspectable request controls. It partitions every constraint and exclusion before execution. The image-facing channel contains only the subject, observable action and consequence, output geometry, intended surface, crop safety, composition, rendering system, light, controlled variation boundary, visible acceptance checks, and visual failure modes. Delivery governance, canon status, identity-master language, approval, release eligibility, reference-acceptance instructions, and specialist-review requirements remain beside the prompt as governance metadata. The packet records the counts and SHA-256 hashes of withheld items, and compilation fails if an operational term leaks back into the image-facing channel.

OpenAI, Gemini, and Codex receive identical image-facing semantics in a controlled round. Only provider request controls differ. FLUX receives the same semantic order but translates exclusions into positive desired qualities because its execution surface has no negative-prompt channel. This makes provider adaptation inspectable without allowing four silently different creative briefs.

Every execution prompt has its own SHA-256 hash. The live provider packet may update its generated-count/status fields, so it is not used as immutable generation evidence. Provider Prompt Compiler v2 also writes a content-addressed `arcanea.provider_execution_manifest.v1` containing only the stable contract set, provider profile, exact prompts, request controls, reference plan, and governance boundary. A result receipt must bind that manifest path/hash, campaign version, job id, prompt-contract hash, execution-prompt hash, exact provider and provider-exposed model, model policy, runtime parameters, exact reference hashes and roles, provider request id, machine-preflight path/hash, execution-grant path/hash, spend approval, fully decoded dimensions, declared ratio, measured ratio error, and output SHA-256. The recorder then fully decodes the internal stored copy and proves its format, dimensions, byte count, and hash exactly match the decoded ingest source before writing the receipt. Provider rounding is accepted only inside the shared 1.5% tolerance; a square result cannot pass a 4:5 contract. A tool-managed lane may record a null model only when the current manifest explicitly declares tool-managed model selection; it never invents a hidden model name.

`execution-manifests/index.json` is the mutable pointer over immutable lineage. It marks the exact packet-selected manifests as `current-active`, retains replaced drafts as `historical-unbound`, and preserves any replaced manifest with output receipts as `historical-bound`. The index is hash-valid but is not authority: execution still needs a fresh narrow grant. Both readiness and output recording reject a historical manifest even when its campaign version and job contract still happen to match.

## Reference architecture

References have roles, not vibes:

1. **Identity** — accepted subject anatomy, silhouette, face, or instrument geometry.
2. **Composition** — pose, camera, or spatial arrangement only.
3. **Material** — surface, wear, construction, or ecological behavior only.
4. **Lighting** — direction, contrast, atmosphere, or active-phenomenon behavior only.

One file may serve more than one role only when that is explicit. Every reference must be owned or licensed and stored by hash. A style reference is not permission to imitate a living creator or franchise.

For an initial source-complete character study, generate text-only unless an approved reference is intentionally assigned. Reference maturity has four distinct states:

1. A raw hash or provider input proves nothing about acceptance.
2. `arcanea.visual_reference_receipt.v1` binds one exact approved image, its output/evaluation/release chain, rights gate, role, and bounded regression coverage. It is useful but cannot establish cross-view likeness.
3. `arcanea.visual_identity_reference_set.v1` requires at least eight distinct approved image hashes covering close portrait, full-body action, grayscale silhouette, small avatar, wide environment, object/anatomy detail, two-character relation, and ensemble stability, plus a human identity-lock attestation.
4. `arcanea.visual_reference_assignment.v1` chooses one to five smallest-sufficient views from that qualified set for one exact prompt-contract hash. The provider execution manifest and output receipt bind the assignment.

Only stage 4 permits a critic to award 5/5 identity continuity. For continuity or regression, stop when this chain is absent. Open-identity discovery images may be compared internally, but they cannot become bounded references until a new human-approved identity contract supersedes them.

## Quality and cost ladder

The campaign counts 100 contracted jobs. Revisions are receipt-linked revisions, not hidden extra jobs.

1. Run the ten candidates in a round at one controlled, reviewable quality.
2. Decode and hash every binary before aesthetic review.
3. Score all ten at full resolution against the 10×5 rubric and hard floors.
4. Reject anatomy, canon, identity, or count failures even when the image is beautiful.
5. Select at most the candidates worth a high-quality edit or rerender.
6. Preserve both the failed evidence and the accepted supersession lineage internally.
7. Publish only the exact approved bytes after canon, identity, rights, brand, sensitivity, and human release gates.

Retry only an identical request that the provider identifies as transient and that returned no decodable image. A user-correctable, safety, prompt, or input failure stops the current manifest: revise the contract explicitly, compile a new content-addressed manifest, and obtain renewed authority before another call. Never spend the retry budget repeating a provider-declared invalid request.

## Runtime routing gate

Before each round, the Visual Director records:

- fresh machine preflight with independent performance and storage posture;
- provider availability, current model id, reference limits, output controls, latency, and estimated spend;
- the single provider/model/configuration used for the round;
- reference files with hashes, roles, rights, and approval state;
- the exact provider packet and execution-prompt hashes;
- the human who approved spend and the maximum revision budget.

If any field is absent, the round remains compiled but not executable.

After the quick Starlight storage sensor, `pnpm arcanea:visual:preflight -- --write <authority-path>` runs the actual conservative overnight PP gate, preserves the complete raw performance plan and hash, binds a privacy-minimized snapshot of the fresh storage plan and its raw hash, and wraps both in a 5–30 minute `arcanea.machine_preflight_receipt.v2`. Performance and storage are independent gates; either can force HOLD, media requires at least 15% free space, and a held receipt exits nonzero and remains unusable. `pnpm arcanea:visual:readiness -- --round <n> --provider <profile> --json` then reconstructs state from current contracts and receipts. `--template` prints the manifest-bound grant body for only the missing jobs. `pnpm arcanea:visual:grant` writes that grant only from explicit confirmed human spend, rights, parameter, and stop-time inputs and refuses held or stale evidence. Immediately before a call, `--preflight <receipt> --grant <grant> --require-ready` validates the preflight and `arcanea.visual_execution_grant.v1`, their hashes and expiry, storage admission, one-call concurrency, exact provider lane, call/revision ceiling, rights attestation, specialist evidence, output boundary, and stop time. It returns `round-running` only when the entire chain is current; otherwise it reports the exact blocker or `review-frozen` state.
