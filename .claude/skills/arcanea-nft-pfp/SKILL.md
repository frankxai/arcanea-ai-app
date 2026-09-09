---
name: arcanea-nft-pfp
description: Design coherent profile-art collections with a visual identity brief, trait compatibility rules, grounded image prompts, and reviewable sample assets. Use for NFT or avatar artwork, collection art direction, trait planning, contact-sheet review, and preparing a verified production handoff.
---

# Arcanea profile-art collections

Build a collection that reads as one world while giving each character a distinct
identity. Deliver a convincing sample and a repeatable production brief before
expanding the batch.

This skill supplies a creative procedure and references. It does not install a
generation engine, train a model, guarantee thousands of unique images, provide
automated scoring, upload assets, or deploy contracts. Verify any connected
implementation before using it.

## Establish the job

1. Read the requested outcome, existing brand tokens, approved references and
   current project state. Reuse decisions the user already made.
2. Distinguish a creator-owned collection from official Arcanea work. Creator-owned
   work keeps its own world. For official work, load the authorized locked canon
   and visual doctrine from the verified product repository.
3. Identify the immediate deliverable: one avatar, an exploratory contact sheet,
   a consistent sample set, a trait plan, or a release preparation packet.
4. Select the installed image tool from the host's actual capabilities. Follow a
   provider explicitly requested by the user. Do not invent an MCP tool, endpoint,
   checkpoint, seed control, LoRA or training capability.
5. Keep generation within the task's authorized scope and budget. With no usable
   image tool, deliver the complete brief and prompts, and name the missing
   capability. Do not fabricate rendered images or a storage receipt.

## Define the visual identity

Read [the visual identity specification](references/style-dna-spec.md). Establish
subject framing, silhouette, palette, lighting, material behavior, expression,
background and variation rules.

A tight head-and-shoulders crop, clear silhouette and quiet background are useful
starting points for small avatars. They are design choices, not universal laws.
Test the actual destination's square and circular crops. A face, accessory or
distinctive mark should remain recognizable at the intended display size.

Translate visual inspiration into concrete properties. Use approved or owned
reference images where identity matters. Do not use another collection's
characters, logos, signature marks or a living artist's name as a style shortcut.
A historical Arcanea design note does not establish current locked canon.

## Plan traits and exceptions

Create a small trait table before generating:

| Field         | Record                                                                      |
| ------------- | --------------------------------------------------------------------------- |
| Category      | Hair, expression, outfit, accessory, background, or another meaningful axis |
| Choice        | Stable id, display name and a visual description                            |
| Compatibility | Required companions, forbidden combinations and occlusion risks             |
| Frequency     | Proposed relative weight; label it as a design decision                     |
| Identity      | Which features remain invariant across the collection                       |
| Review        | A visible acceptance condition for this trait                               |

Check the possible compatible combinations against the requested sample size.
Unique trait combinations do not guarantee visually unique images. Avoid
claiming rarity, supply or scarcity until the final inventory has been produced
and checked.

## Produce and refine

1. Write one baseline prompt tied to the identity brief: subject, framing, visible
   traits, light, materials, background and specific things to avoid.
2. Produce the authorized sample using the selected tool. Supply actual reference
   assets through its supported mechanism; a filename in prompt prose does not
   attach an image.
3. Inspect every returned image at useful resolution and at the destination's
   thumbnail size. Compare the set in a contact sheet when several images exist.
4. Identify the largest visible defect or inconsistency. Revise a specific
   instruction or conditioning input, then evaluate the new result.
5. Record selected and rejected candidates, trait ids, prompt revision, reference
   provenance, model/tool identity and supported generation settings.
6. Expand only after a sample demonstrates the required coherence. Derive batch
   size and cost from observed output and actual provider limits. No fixed
   success rate, training duration or universal similarity threshold is promised.

For an existing ComfyUI installation, use
[the workflow integration procedure](references/comfyui-workflows.md). It
requires a workflow exported from the actual installation and a verified sample;
this folder does not contain executable workflow templates.

## Review the collection

| Question                                                        | Evidence                                                       |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| Does each avatar read at its destination size?                  | Inspect square/circular thumbnails and clipping                |
| Does the collection share one identity?                         | Compare framing, light, palette and rendering behavior         |
| Are the selected traits visible and compatible?                 | Match images to the trait table                                |
| Are there defects, duplicate-looking outputs or identity drift? | Inspect originals and compare the set                          |
| Can another operator reproduce the next sample?                 | Complete brief, actual references and tool/settings receipt    |
| Is release preparation honest?                                  | Actual files, provenance, unresolved rights and approval state |

Automated scores are supplementary only when a real scorer and its calibration
are available. Do not describe perceptual distance as a hash, or imply that a
model score proves originality, rights, quality or market value.

## Handoff

Return the brief, trait plan, actual sample assets if generated, review findings,
the strongest revision and one next production step. Separate draft, generated,
reviewed, approved and released states.

Uploading public assets, changing storage permissions, creating a mint page,
deploying a contract, configuring prices or moving funds are separate actions.
Do not infer them from a request for artwork. Prepare exact files and a reviewable
release packet before requesting any approval that the task still requires.

## Historical material

The following files preserve earlier concept work. Their examples, numerical
claims and proposed architecture require fresh verification; they are not
current canon, installed software, price quotes or audited deployment guidance.

- [Art-direction study](references/art-direction-bible.md)
- [Taste research notes](references/taste-engineering.md)
- [Deployment concept](references/deployment-guide.md)
