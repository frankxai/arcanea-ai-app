# Arcanea visual-generation research and claims ledger

> Verified against official sources on 2026-08-24 and revalidated on 2026-08-25. Capabilities and model names are time-sensitive; rediscover them at execution time.

## Evidence-backed provider capabilities

| Provider          | Current official capability relevant to Arcanea                                                                                                                                                                                  | Arcanea routing implication                                                                                                                                                     | Source                                                                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| OpenAI            | GPT Image 2 is documented for high-quality generation/editing, automatic high-fidelity image inputs, and flexible output sizes whose edges are multiples of 16, ratio is at most 3:1, and total area is 655,360–8,294,400 pixels | Strong candidate for identity-reference and edit loops; compile an exact contract-ratio size inside current limits and capture each asset separately                            | [GPT Image 2 model documentation](https://developers.openai.com/api/docs/models/gpt-image-2), [image-output controls](https://developers.openai.com/api/docs/guides/image-generation#customize-image-output) |
| Google            | Gemini image generation documents explicit aspect-ratio controls including 4:5, 16:9, and 21:9, current 1K–4K output tables, and model-specific character/object reference limits                                                | Useful comparative lane for reference-driven characters and ensembles; bind ratio to the job, discover the current model at runtime, and never exceed its reference constraints | [Gemini image generation](https://ai.google.dev/gemini-api/docs/image-generation)                                                                                                                            |
| Black Forest Labs | FLUX.2 documents subject-first prompting, no negative-prompt channel, dimensions divisible by 16, a 4MP maximum, and a recommended working range up to roughly 2MP                                                               | Use positive exclusion translation, keep prompt upsampling off in controlled rounds, and compile provider-specific dimensions inside the recommended range                      | [FLUX.2 prompting guide](https://docs.bfl.ai/guides/prompting_guide_flux2)                                                                                                                                   |
| xAI               | Grok Imagine documents image generation and editing, including reference-image inputs                                                                                                                                            | Useful independent visual lane when current capability, cost, rights, and receipt requirements fit the job                                                                      | [xAI image generation](https://docs.x.ai/developers/tools/image-generation), [Imagine capabilities](https://docs.x.ai/developers/model-capabilities/imagine)                                                 |
| Runway            | Gen-4 Image References supports reference-led image creation; Runway’s API documentation defines programmatic generation surfaces                                                                                                | Useful for continuity and later motion handoff when owned references are available                                                                                              | [Runway API](https://docs.dev.runwayml.com/api/), [Gen-4 Image References](https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References)                                  |

The current [Gemini API reference](https://ai.google.dev/api) requires REST requests to carry the API key in the `x-goog-api-key` header. Arcanea's audited Worlds route now follows that contract instead of placing its server key in a query string. This is a transport hardening only; it does not establish authentication, spend control, abuse prevention, or media provenance for the product route.

## Provenance

C2PA Content Credentials provide a standard for tamper-evident provenance assertions and their verification. They are evidence about an asset’s recorded history; they are not proof that the depicted subject or claim is true. Arcanea therefore keeps source/canon state separate from media provenance. [C2PA specification 2.4](https://spec.c2pa.org/specifications/specifications/2.4/index.html)

## Copyright, likeness, and cultural review

- An image-generation provider’s technical ability does not establish Arcanea’s right to publish a reference, likeness, costume, mark, or derivative treatment.
- Character identity approval and rights clearance are separate gates.
- Prompts exclude requests to imitate living artists, studios, or franchises.
- Sacred symbols, ritual clothing, gestures, headdresses, shrine architecture, and living-practice objects may not be used as fantasy shorthand.
- Vietnamese-rooted _Song of Van Linh_ characters and environments require a qualified Vietnamese sensitivity review before generation or release.
- Culturally specific review is a named receipt with scope and reviewer qualification, not a generic “sensitivity checked” label.

## Model-routing conclusion

No provider owns the Arcanea style. The stable asset is the identity contract; models are replaceable execution adapters.

At execution time, choose a route from current official evidence:

1. identity-reference fidelity and editability;
2. required number and type of references;
3. aspect ratio and resolution;
4. receipt, seed, and parameter capture;
5. safety, data handling, rights, and publication terms;
6. cost and explicit spend authority;
7. output provenance support;
8. success on an Arcanea-controlled benchmark, not a provider demo.

Provider errors also belong to the runtime contract. Retry an identical request only when the provider classifies the failure as transient and no image bytes were returned. A user-correctable, safety, prompt, or input error requires a bounded contract revision, a newly compiled immutable manifest, and renewed authority; repeating the same invalid call is neither a revision nor useful evidence.

## Research claims that must not enter public copy

- Audio frequency does not have a scientifically “true” visible color.
- The Gate frequencies may be used as authored sonic sigils, leitmotifs, timing, and architectural response cues; they are not medical claims.
- Generated suggestions, campaign plans, and visual candidates are not student, product, publishing, or business outcomes.
- A public agent blueprint is not evidence of an autonomous deployed runtime.

## Local evidence reviewed

- `.arcanea/lore/CANON_LOCKED.md` — locked lore source of truth.
- Creator-supplied `ARCANEA_TENFOLD_CONSTITUTION_V1_0_LEVEL99.md` — proposal evidence; conflicts remain gated.
- `book/**/BIBLE.md` and `book/chronicles-of-arcanea/series-bible/CHARACTER_BIBLE.md` — manuscript identity sources.
- `apps/web/content/blog/luminor-intelligence-system.mdx` — existing public names for the sixteen product identities.
- `planning-with-files/design-loop-evidence.json` — evidence for the prior 100-image Resonant Kinforms wave and 130-asset publication packet.
- `docs/design/ARCANEA_PRIOR_VISUAL_EVIDENCE_BRIDGE_V1.md` plus its read-only verifier — current structural reconciliation of those files: exact Wave-02 packet/atlas coverage, 130 unresolved rights/publication holds, and 30 legacy Wave-01 dossier paths requiring packet regeneration.
- Starlight Intelligence Constellation implementation — reference for public-safe agent contracts, graph position, human gates, and downloadable blueprints; Arcanea adopts the governance pattern, not its visual skin.

## Open research questions

- Which current provider best preserves the same Arcanea face, body, and material identity over eight regression crops?
- Which provider most reliably renders exact nonstandard limb and Chord counts?
- Can Content Credentials survive the intended web optimization pipeline without losing the separate Arcanea receipt chain?
- What reviewer and source packet should authorize _Song of Van Linh_ visual development?
- Which generated style family wins blinded Arcanea distinctiveness without losing story truth?
