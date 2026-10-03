# Arcanea Academy Media and Visual Continuity

> **Status:** proposed repository policy  
> **Applies to:** Academy product, books, launches, campaigns, teacher agents,
> Guardian projections, and portfolio media

## Context boundary

Every asset declares one context:

- `lore` — depicts or defines fictional Arcanea canon;
- `product` — explains or supports the living Academy experience;
- `campaign` — promotes a release without defining canon;
- `learner` — creator-owned work displayed with permission.

Product and campaign visuals never become lore by repetition. Learner work never
becomes Arcanea canon without an explicit editorial promotion in
`frankxai/arcanea-ai-app`.

## Guardians are not the faculty

The Ten Guardians are fixed canonical entities. They are not shorthand for a
generic group of teachers. Academy faculty—authors, editors, artists,
designers, developers, marketers, human guests, and specialist agents—are a
separate extensible class.

No Guardian ensemble enters production unless every visible Guardian maps to
an approved `entity_id` and `visual_spec_id`. Each specification must lock:

- name, pronouns, gender/presentation, species, apparent age, scale, and body
  proportions;
- face geometry, hair silhouette, distinctive marks, costume construction,
  materials, palette, symbol, and Godbeast relationship;
- front, three-quarter, profile, back, portrait, expression, and action views;
- permitted variation, required invariants, and common generation failures.

The locked canon currently does not declare Guardian gender. Supporting prose
strongly presents nine Guardians as feminine; Shinkami is contradictory across
the current profile, a sync mirror, and a visual-generation script. Therefore
no image may claim a definitive mixed or all-feminine roster until Frank records
an explicit identity decision. Do not solve this ambiguity by quota, name
inference, or random prompt variation.

Do not infer gender or appearance from names. Do not use an old narrative,
synced derivative, prompt, or generated ensemble as a reference sheet. Until
the roster's visual specifications are approved, group art is `PROVISIONAL`
and may not establish canon.

## Media fabric

- **GitHub:** canon, lore, visual specifications, prompts, policy, receipts,
  and semantic references.
- **Vercel Blob:** private generation sources, immutable masters, and approved
  renditions.
- **Vercel Image:** responsive web delivery from approved renditions.
- **Supabase:** IDs, rights, provenance, lineage, approval events, and
  placements; never a per-image render dependency.
- **Google Drive:** proofs and collaborator handoff only.
- **Notion:** briefs, decisions, and approval discussion only.

Cloudinary and Cloudflare media products require a measured exception and an
architecture decision. Components use `asset_id` or placement keys—never hard
coded provider URLs.

## Identity and lifecycle

Keep these records separate:

| Record | Stable key example |
|---|---|
| Entity | `ent_arcanea_guardian_lyssandria` |
| Visual specification | `vspec_guardian_lyssandria_v1` |
| Asset | `ast_*` |
| Version | `ver_*` |
| Rendition | `rnd_*` |
| Placement | `arcanea.academy.home.hero.desktop` |

Lifecycle:

`draft -> quarantined/review -> approved -> published -> superseded -> archived`

Approved binaries are immutable. A pixel, crop, embedded-text, rights, or canon
change creates a new version or rendition and requires approval.

## Resolution and finish

Preserve the largest native source privately. A production flagship needs a
reviewed lossless master at:

- landscape: `3840 × 2160` minimum;
- portrait: `2160 × 3840` minimum;
- square: `3840 × 3840` minimum;
- print: edition-specific dimensions at 300 PPI.

When native 4K generation is unavailable, use a documented high-quality
super-resolution stage from an inspected 2K-or-better source. Never relabel a
browser-scaled or visibly soft image as a master.

Inspect the full frame and 100% crops for faces, eyes, hands, anatomy, garment
construction, symbols, repeated figures, architecture, texture, edge integrity,
and accidental text. A Guardian ensemble also requires a roster count, identity
match, Gate/frequency/Godbeast check, and silhouette comparison.

Generate the illustration layer without readable copy, UI, diagrams, logos, or
publisher marks. Add typography and exact information deterministically in
HTML/SVG or post-production. Produce art-directed desktop and mobile masters;
do not rely on one center crop.

## Approval and receipt

Production requires independent sign-off for canon/roster, art direction,
rights/provenance, and technical/accessibility quality. The producer may not
approve all four.

Every approved asset records:

```json
{
  "asset_id": "ast_*",
  "version_id": "ver_*",
  "context": "lore|product|campaign|learner",
  "placement_key": "arcanea.academy.home.hero.desktop",
  "entities": [
    { "entity_id": "ent_*", "visual_spec_id": "vspec_*" }
  ],
  "source": {
    "tool": "",
    "model": "",
    "prompt": "",
    "reference_asset_ids": []
  },
  "master": {
    "checksum": "sha256:*",
    "width": 3840,
    "height": 2160
  },
  "reviews": {
    "canon": "approved",
    "art": "approved",
    "rights": "approved",
    "technical": "approved"
  },
  "renditions": []
}
```

The earlier Guardian ensemble is `REJECTED_CANON`: it has no entity-bound
reference pack and its master does not meet the flagship evidence contract.
Its feminine presentation is consistent with much of the supporting prose, but
that does not make the image canonical because gender and visual identity are
not locked. It may remain as concept exploration, but it may not ship as the
definitive Academy or Guardian image.
