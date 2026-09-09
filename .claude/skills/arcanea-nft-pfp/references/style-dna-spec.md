# Profile-art visual identity brief

Use this document to make a collection's visual choices inspectable. It is a
brief format, not a mathematical fingerprint, trained model or automated checker.
Keep it with the project's approved source and revise it when a sample reveals a
better direction.

## Required decisions

| Decision            | Describe it concretely                                                    |
| ------------------- | ------------------------------------------------------------------------- |
| Purpose             | Where the avatar appears and what the viewer should recognize             |
| World and authority | Creator-owned or official Arcanea; source references and canon state      |
| Subject             | Age presentation, silhouette, proportions and invariant identity features |
| Framing             | Camera direction, crop, headroom and circular-crop tolerance              |
| Palette             | Named roles with actual colors from the project; allowed variation        |
| Light               | Direction, softness and how each major material responds                  |
| Rendering           | Edges, texture, depth, detail density and shape language                  |
| Expression          | The emotional range that fits these characters                            |
| Background          | Contrast, depth and how it behaves behind the silhouette                  |
| Traits              | Variable categories, compatible choices and occlusion limits              |
| References          | Actual supplied assets, provenance and permitted uses                     |
| Review              | Visible acceptance criteria and the person or process that accepts them   |

Separate requirements from preferences. An invariant should protect a recognizable
identity, not merely freeze an arbitrary number. If the creator asks for front-on
faces, a textured background or a broad emotional range, design for that request
and test it instead of imposing a house template.

## Example brief

Illustrative creator-owned concept; not Arcanea canon or generated artwork:

```yaml
collection: Harbor portraits
state: draft
purpose: Recognizable community avatars at small display sizes
identity:
  subject: Adult harbor navigators with varied faces and a shared uniform cut
  framing: Head and shoulders, comfortable headroom, shoulders inside a circular crop
  palette:
    background: Warm pale gray
    clothing: Deep ink blue
    accent: Muted copper
  lighting: Soft upper-left key, enough fill to preserve facial detail
  rendering: Broad shapes, matte fabric, restrained metallic highlights
  expression: Curious, calm or amused; each face remains expressive
variation:
  hair: Three visibly different silhouettes
  outfit: Two collar forms with the same underlying uniform construction
  accessory: Small compass brooch or no brooch
  exclusions: No accessory obscures an eye or disappears under the collar
references: []
review:
  - Face and collar remain distinct in the destination crop
  - The brooch is visible when selected
  - The set shares lighting and material behavior without identical faces
release: Unreviewed; no release decision recorded
```

This example deliberately makes no claim about supply, rarity, price, ownership
verification or output count. Replace its choices with the actual creator brief.

## From brief to prompt

Write the prompt in this order: subject and identity, visible trait choices,
framing, rendering behavior, lighting, background and specific exclusions. Every
phrase should change something visible. Attach reference images through the
selected tool's real image-input mechanism.

For a revision, name the defect and preserve what already works. For example:
“Keep the face and lighting. Lower the collar so the compass brooch is fully
visible in the circular crop.” Do not regenerate every variable when one trait
needs repair.

## Evidence to retain

Save the brief revision, actual prompt, trait ids, supplied reference identities,
tool/model identity when available, returned output paths or ids and review notes.
Record unsupported settings as unavailable. A provider without seed control
cannot be made reproducible by inventing a seed in a receipt.

A file hash identifies bytes. A trait id identifies a planning choice. Neither
proves visual uniqueness, canon acceptance or permission to publish.
