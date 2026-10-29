# Arcanea identity assets

The product-selected artwork is `apps/web/assets/brand/arcanea-mark.jpg`.
Use `ArcaneanMark` from `components/brand/arcanea-mark` for square interface placements. It preserves proportions with the established cover crop and fixes both rendered dimensions.

| Placement                      | Source                | Rendering                                                 |
| ------------------------------ | --------------------- | --------------------------------------------------------- |
| Navigation, footer, chat       | `ArcaneanMark`        | Square cover slot; existing inline WebP at or below 24 px |
| Homepage                       | `ArcaneanMark`, 44 px | Same construction as navigation                           |
| Homepage prompt box            | `ArcaneanMark`, 28 px | Same construction; decorative                             |
| Browser icon                   | `/icon`               | 32 × 32 PNG, cover crop                                   |
| Apple icon / brand-kit primary | `/apple-icon`         | 180 × 180 PNG, cover crop                                 |

The original 784 × 1168 image composes a symbol, wordmark and atmosphere. It is not an editable vector master. Square crops are interface applications, not a complete identity family.

## Historical SVGs

`arcanea-logo.svg` and `arcanea-wordmark.svg` remain historical references. Their symbols differ; the latter uses live system-font text and violet gradients. Neither is the current product wordmark. Do not introduce them into new placements. The runtime brand kit omits an optional wordmark until a coherent family has been reviewed.

`/brand/arcanea-mark.jpg` is not a public source path. Import the image inside the app or use the existing icon routes for external square applications.

## Media and provenance

The JPG hero/OG and premium PNG/MP4 files are existing media applications, not identity masters. Use responsive sizes, a static motion fallback and text that remains legible over artwork. File presence does not establish source rights, prompt history or approval; preserve unknown fields.

See `docs/design/BRAND_FIDELITY_REVIEW_2026-10-29.md` for source pins, findings, Figma review, generation briefs and release limits.
