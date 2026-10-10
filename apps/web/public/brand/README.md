# Arcanea Brand Assets

This directory contains static brand assets that are version-controlled with the codebase.

## Directory Structure

```
brand/
├── logos/           # Arcanea logos (SVG, PNG variants)
├── icons/           # App icons and favicons
├── backgrounds/     # Hero backgrounds and patterns
├── ui-elements/     # Design system elements
├── characters/      # Brand character illustrations
└── mockups/         # Marketing and showcase mockups
```

## Production 2026-06-16 Update (Visual Ecosystem Overhaul)
New subdirs populated from .arcanea/visual-assets/ (source of truth + MANIFEST):
- heroes/ — site + github 16:9 (worlds living engine, arcanea main per VISUAL_ECOSYSTEM prompt, onchain web3, guardian variants etc)
- factions/ — 8 Academy Houses + Starlight Corps cards/lineups (VISUAL_DOCTRINE grammar + franchise eq)
- stellaris/ — mascot solos + contexts (exact STELLARIS.md prompts + full profile)
- godbeasts/full/ — 10+ godbeast variants (v2 base + new per lore + VISUAL)
- diagrams/ — ecosystem constellation, SIS network, web3/web4 graphs, living worlds (Ethereum-style partner + multi-lab + agentic OS luminous)
- icons/custom/ — 40-60+ SVG (Gates, Elements, MCPs, Origins, features; token colors, sacred geometry, no emoji per TASTE)

All assets: next/image + sizes/WebP, non-orphan (archivedPath in .arcanea/visual-assets/ + public copy), god-mode quality (full TASTE 7 gates + DESIGN tokens + VISUAL_DOCTRINE franchise/faction/origin + 48px silhouette where applicable). Brand kit "arcanea" active for arcanea.ai (see packages/design-system/src/brand-kits.ts). See root plan for full matrix/wiring/MCP github updates.

Usage example remains; import from new subdirs as needed. All tracked in .arcanea/visual-assets/MANIFEST.json with verbatim prompts + qualityNotes.

## Asset Guidelines

### Logos
- Use SVG format for scalability
- Provide PNG fallbacks in multiple sizes
- Include light/dark variants

### Icons
- 16x16, 32x32, 180x180, 512x512 sizes
- SVG and PNG formats
- Follow app icon guidelines

### Backgrounds
- High resolution (2x for retina)
- WebP format preferred for web
- Include dark mode variants

## Usage

Import assets in components:
```tsx
import Arcanea from '/brand/logos/arcanea.svg'
```

Reference in HTML:
```html
<img src="/brand/logos/arcanea-logo.png" alt="Arcanea" />
```