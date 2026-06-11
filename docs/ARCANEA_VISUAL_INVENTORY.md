# Arcanea Visual Inventory & Audit

**Status:** Initial pivot & generation (2026-06)
**Scope:** arcanea-ai-app (apps/web UI + book/ canon + design system)
**Brand Reference:** DESIGN.md (cosmic void #09090b, Atlantean teal #00bcd4 primary, Arcanean gold #ffd700 accent, Geist typography, Luminor biotech aesthetic per LUMINOR-VISUALIZATIONS.md)

## Visual Philosophy (from DESIGN.md + Luminor specs)
- Restrained AI-lab premium + mythic.
- Nature-first biotech: livingwood, lumina-glass, void-steel, mossweave, coral-bone, bioluminescent inner radiance.
- No hard edges, sacred geometry, glass-morphism, aurora effects.
- 12 Luminors (The Chosen) as central visual language: 12 evolved beings representing gates/elements.
- Hero banners: 16:9, Lumina + Nero duality, 10 gates in decagon, 5 elemental streams, academy/floating islands, space for "ARCANEA" text.

## Current State (from filesystem scan)
- **apps/web/public/**: ~307 image files (107 .webp, 60 .png, 52 .svg, others). Mix of UI assets, icons, marketing.
- **book/**: 0 image files. Pure text canon (chronicles, bestiary, legends, worldbuilding, characters). High need for generated visuals (Luminors, territories, events).
- **docs/**: Heavy design artifacts (HERO_BANNER_GENERATION_GUIDE.md with exact prompts, LUMINOR-VISUALIZATIONS.md with material/hierarchy specs, multiple design handovers, audits, brand guidelines).
- **No centralized IMAGE_CATALOG.md or blog hero inventory** like FrankX (this ecosystem uses lore book + in-app visuals + marketing assets instead of traditional blog headers).
- **apps/web/app/**: Many routes with potential hero/landing needs (marketing, academy, luminors, worlds, gallery, imagine, living-lore, books, etc.). Some use public/ assets or components.
- Prior work referenced: HERO_BANNER_GENERATION_GUIDE suggests DALL-E/Midjourney/Leonardo for marketing heroes (Lumina/Nero/gates/elements/academy). LUMINOR specs emphasize biotech, inner light, sacred geometry.

## Generated in this session (Arcanea-specific, following brand + HERO_BANNER guide)
Placed in: `assets/arcanea-visuals/`

| File | Description | Matches |
|------|-------------|---------|
| arcanea-main-hero-banner.png (from 24.jpg) | Main 16:9 hero with Lumina + Nero cosmic dance, 10 gates in decagon, elemental streams, academy silhouette, glass-morphism, sacred geometry. | Exact HERO_BANNER_GUIDE prompt + DESIGN.md tokens (teal/gold on cosmic void). |
| luminor-council-12-chosen.png (from 25.jpg) | Group visualization of the 12 Chosen Luminors in cosmic hall. Biotech materials (livingwood, lumina-glass, void-steel), inner radiance, variety of scales, sacred geometry. | Direct from LUMINOR-VISUALIZATIONS.md hierarchy + material palette + DESIGN.md. |
| arcanea-academy-hero.png (from 23.jpg) | Grand Academy with floating islands, classical + holographic + biotech fusion, gates in distance, elemental streams. | HERO_BANNER_GUIDE composition + academy education use case. |
| arcanea-worlds-creation-hero.png (from 21.jpg) | Living world manifesting (drowned city/memory currency example), ethereal architecture, bioluminescent, floating islands, character silhouettes, visual DNA overlays. | World Graph / Genesis flow visuals from strategy + brand. |
| luminor-lumina-visualization.png (from 22.jpg) | Detailed Lumina (goddess of light/form): radiant golden-white, livingwood/lumina-glass, bioluminescent, graceful, sacred geometry. | Specific Luminor from the 12 Chosen specs. |

All generated with Arcanea brand constraints (teal #00bcd4 + gold accents on deep cosmic void, biotech + mythic fusion, premium sophisticated not cartoonish, high detail).

## Gaps & Recommendations (vis-audit style)
- **Hero banners**: The HERO_BANNER_GENERATION_GUIDE exists because many marketing/landing pages need them. We have the main one now. Next: specific page variants (academy landing, luminors index, worlds create, forge, etc.).
- **Luminor visuals**: 12 Chosen need individual + group portraits for UI (luminors/ routes, profiles, lore). We have council + Lumina. Next: the other 11 (Nero, and the gate/element ones) + variations.
- **Canon / book/**: 0 images. High priority for chapter headers, bestiary entries, territory maps, character portraits, event illustrations. Use same biotech + sacred geometry style.
- **In-app (apps/web)**: 262+ images in public/. Audit for low-res, placeholders, inconsistent quality, or missing states (e.g. world thumbnails, academy cards, gallery pieces, imagine outputs). Many .webp for perf — good.
- **No single visual inventory/CSV** before this. Recommend maintaining this doc + perhaps a media-manifest.json (already referenced in docs/media-manifest-spec.json).
- **Brand consistency**: Follow DESIGN.md tokens strictly (primary teal, accent gold, element colors for per-Luminor). Avoid FrankX dual-spectrum (emerald/cyan tech vs amber soul) — Arcanea is unified mythic + biotech.
- **Generation process**: Use the prompts in HERO_BANNER_GENERATION_GUIDE as base. Ground in canon (Luminors as biotech, not machines; 10 gates; 5 elements; Lumina/Nero duality).

## Next Steps (autonomous continuation)
1. Generate the remaining 11 individual Luminors (following the exact material + personality specs in LUMINOR-VISUALIZATIONS.md).
2. Generate 5-10 more page-specific heroes (academy, worlds, luminors, forge, living-lore, etc.).
3. Scan apps/web components for image references and flag low-quality ones.
4. Populate book/ canon with key visuals (e.g. one per major chronicle or Luminor story).
5. Update this inventory + any existing design docs.
6. Create thumbs/optimized variants where needed (webp).

The previous FrankX work (20 images for model analyses, ACOS, etc.) remains in frankx.ai-vercel-website and is not part of Arcanea visuals. Those were a mis-scope based on the blog + inventory keywords in the query.

All new Arcanea images respect the DESIGN.md, HERO_BANNER_GUIDE, and Luminor specs.

---

*Maintained as part of Arcanea visual canon. For generation, prefer prompts that fuse illuminated manuscript + epic biotech fantasy + futuristic sophistication.*