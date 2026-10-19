# Arcanea visual contract suite

Public-safe machine contracts for implementing Arcanea's evidence-to-image protocol. These schemas describe structure; they do not grant authority, certify a human identity, or turn a generated image into canon.

## Contract chain

1. **Visual prompt contract** — engine-neutral identity evidence, observable story action, explicit one-asset geometry, intended surface, delivery role, crop safety, composition, design laws, visible constraints, exclusions, reference policy, verification floors, and governance boundary.
2. **Machine preflight receipt** — one short-lived overnight PP plan plus a hash-bound, privacy-minimized storage snapshot. Performance and storage are independent gates; either can hold media execution.
3. **Execution grant** — one current immutable manifest, explicit human spend and rights attestations, exact job ids, model policy, runtime parameters, call cap, fresh machine-preflight hash, and stop time.
4. **Output receipt** — one fully decoded internal image bound to the exact prompt, manifest, grant, preflight, provider response, references, declared and measured aspect ratio within the fixed 1.5% provider-rounding tolerance, dimensions, and byte hash; the stored copy is decoded again and must exactly match the ingest source before the receipt is written.
5. **Evaluation and release records** — deliberately separate. An output receipt proves generation lineage, not quality, identity approval, or publication.

## Schemas

- [arcanea.machine_preflight_receipt.v2.schema.json](./arcanea.machine_preflight_receipt.v2.schema.json)
- [arcanea.visual_prompt_contract.v1.schema.json](./arcanea.visual_prompt_contract.v1.schema.json)
- [arcanea.visual_execution_grant.v1.schema.json](./arcanea.visual_execution_grant.v1.schema.json)
- [arcanea.visual_output_receipt.v1.schema.json](./arcanea.visual_output_receipt.v1.schema.json)

## Implementation rule

Keep the provider's image-facing prompt smaller than the full contract. Send only subject, action and consequence, authoritative output geometry, intended surface, crop safety, composition, visual system, light, variation boundary, visible checks, and visual exclusions to the image model. Keep delivery governance, canon state, approval, release, human authority, and specialist-review instructions beside the prompt as machine governance.

Validate structure first, then hashes, current-manifest status, time bounds, rights, references, deterministic media checks, blind evaluation, and human release decisions. Repository hashes preserve integrity and supersession lineage; they are not bearer credentials or proof that the named human personally signed a record.
