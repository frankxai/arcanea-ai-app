# Arcanea brand fidelity review — 29 October 2026

## Task contract

Scope: repair logo geometry, asset recommendations and supporting hero contrast.
Owner: Frank Riemer. Implementation: Codex.
User job: recognise Arcanea and understand the first creation action.
Base: `a42ddc8d3f6a3426feecbf646bc762d863bb77fe`.
Non-goals: new canonical symbol, palette/font migration, lore, commerce or media infrastructure.
Acceptance: square marks; undistorted icons; existing brand-kit primary URL; readable hero copy; scoped lint, typecheck, build and real preview checks.
Rollback: revert this change; source artwork and historical asset URLs are retained.

## Inspected sources

Shared Arcanea pack, reached through `frankxai/starlight-design-intelligence`,
commit `851a11be31a0640df64baabcf2b1fc1afb9ce849`. The provider redirects that
repository name; its checkout was readable. Product AGENTS, TASTE, DESIGN,
token package and latest homepage decision were inspected at the base above.

Production: https://www.arcanea.ai/ , Vercel deployment
`dpl_E3hH2JfPfDPvEBL9sHLDKrKNA2cb`, bound to the same base commit.
Live desktop DOM: homepage mark 44 × 66 px; prompt mark 28 × 42 px;
shared navigation mark 22 × 22 px with cover fit. Icon source assigned portrait
art to square dimensions without a fitting rule.

Figma review projection: https://www.figma.com/design/zRheday2Jer3ZxWsUWVKyq

No canonical Arcanea Figma file key was found in the inspected product/shared-pack
sources. The connector supports file-specific reads, not a complete account-file
inventory. This new review projection does not assert that historical Figma
files were all inspected or replace an existing approved library.

## Keep, repair, evolve

| Area            | Judgment                                                          | Action                                                            |
| --------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| Crystalline A   | Distinctive; portrait composition is not a vector master          | Preserve bytes; reuse established square cover application        |
| Interface type  | Geist suits restrained creator-tool chrome                        | Preserve families and hierarchy                                   |
| Hero art        | Strong material character; bright detail competes with faint copy | Use existing primary text token; inspect actual preview           |
| Historical SVGs | Angular logo and rounded-arch wordmark disagree                   | Retain files; label historical; remove wordmark recommendation    |
| Brand-kit URL   | Primary referenced an absent public file                          | Use existing `/apple-icon` application                            |
| App icons       | Square dimensions alone can distort the portrait                  | Add cover fit to both routes                                      |
| Foundations     | DESIGN, TASTE and package backgrounds disagree                    | Preserve runtime values; no silent palette migration              |
| Provenance      | Historical rights/generation records incomplete                   | Preserve unknowns; require sidecars on new assets                 |
| Narrative       | Technical metaphors and unsupported capability claims remain      | Separate product/editorial review; this slice changes no promises |

## Direction selection

The install manifest also referenced a separate flat-A icon and a missing
`/icon-512.png`, and used CSS variables as JSON colour values. This change
routes both declared install sizes and shortcuts to `/brand-icon/192` and
`/brand-icon/512`, rendering the same existing artwork with cover fit, and
serializes literal colours from runtime tokens. The historical icon remains.
The regression check decodes each declared PNG, checks its actual dimensions,
and verifies that unsupported sizes fail without allocating an image.

1. **Living atlas — selected for the next art cycle.** Original inhabited worlds,
   readable geography, mineral depth and one luminous signal; neutral controls.
2. **Cinematic relic — supporting art.** Retain the current chamber for material
   craft; control central highlights behind product instructions.
3. **Editorial workshop — future tool surface.** Prompts, drafts and finished
   artifacts supply proof; use this for workspace onboarding.

These are recommendations, not three released redesigns. This repair preserves
the established composition and adds no motion.

## Next-generation briefs

### Editable identity family

Reconstruct the selected angular crystalline A as an original editable vector
study. Preserve its peaked silhouette, triangular counter and curved bridge.
Separate symbol and wordmark. Produce optical 16/24/32 px versions;
primary/reverse/monochrome; 180/192/512 px and mask-safe icon specimens.
Show geometry and clear space. Keep studies marked candidate for named-owner
review. Draw vectors deterministically and use exact typography; do not generate
lettering or substitute the unrelated rounded-arch SVG.

### Living atlas image prompt

Use case: stylized-concept. Candidate world plate, 16:9.
An original inhabited Arcanea world seen from a high stone terrace: readable
districts, water routes and distant terrain; one small maker reviews a physical
world atlas in the foreground. Layered mineral materials, crafted architecture,
blue-black shadows, restrained teal light and warm reflections. Natural asymmetry,
believable scale, quiet discovery. Keep the central copy region dark and
low-detail; let the world unfold around it. No lettering, logos, UI, floating
dashboards, purple fog, generic glowing portals or borrowed franchise motifs.
Exploratory environment art only; introduce no named Guardian, Godbeast or
canonical location.

### Reflection and release

Inspect full exports and 375/768/1440 crops. Reject loss of subject on mobile,
competition with the primary action, franchise imitation, fabricated text or
missing provenance. Compare with retained art before another generation.
Only selected immutable renditions enter existing delivery. Generation is not
release approval; no historical rights or approval has been invented here.
