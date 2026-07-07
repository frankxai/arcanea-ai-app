# Conductor Oversight - 2026-07-06

## Current Decision

The conductor run is **iterate** overall. It produced two strong approved-staging assets and one iterate asset, but public shipping is blocked until Mamoru's canon status is decided or the images are regenerated without Mamoru.

## Asset Decisions

- `arc-conductor-001`: 24/30, iterate. Strong team setup, but hand/anatomy risk and teal dominance reduce public confidence.
- `arc-conductor-002`: 27/30, approved-staging. Strongest vertical social hook. Mamoru approval required before canon publish.
- `arc-conductor-003`: 28/30, approved-staging. Best emotional/storybook candidate. Mamoru approval required before canon publish.

## Production Rules

- Do not overwrite dirty Gallery files during this loop.
- Do not run `scripts/log-generated-images.js` until deletion behavior is changed.
- Do not use generated-image text. Add platform copy through code/Figma/Canva/Remotion.
- Do not promote Mamoru assets into locked canon without Frank.
- Use VIS sidecars before registry, DB, chain, or web3 logging.

## Next Best Move

Create a manifest adapter for approved/staging visual assets, then wire only approved non-staging assets into `/gallery`. Use approved-staging assets for internal story direction, pitch decks, or Frank review.

