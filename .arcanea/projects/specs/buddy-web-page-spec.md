# Buddy Web Page — arcanea.ai/buddy

## Quick Reference
- **Route**: `app/buddy/page.tsx`
- **Type**: Server + Client component hybrid
- **Data**: Supabase `buddy_state` + `godbeast_unlocks` tables
- **Design**: Glass morphism, peacock blue/aquamarine, NO Cinzel

## Page Sections
1. **Active Buddy Hero** — Large creature image, name, element badge, rarity glow
2. **Stats Card** — 5 horizontal bars (Arcana/Resonance/Forge/Sight/Unity)
3. **Evolution Progress** — Level badge, XP bar, Gates opened, Rank
4. **Godbeast Gallery** — 5x2 grid, locked/unlocked tiles with gate requirements
5. **Export/Share** — Export card as PNG (next/og), copy text

## Supabase Tables
- `buddy_state` — user_id, companion_id, name, element, rarity, level, xp, bond, gates, 5 stats
- `godbeast_unlocks` — user_id, godbeast_id, unlocked_at
- RLS: Users read/write only own data

## API Routes
- `GET/PUT /api/buddy` — CRUD for authenticated user's buddy
- `POST /api/buddy/sync` — Local state.json → Supabase migration

## Components
- `components/buddy/active-buddy-hero.tsx`
- `components/buddy/stats-card.tsx`
- `components/buddy/godbeast-gallery.tsx`
- `components/buddy/godbeast-tile.tsx`
- `components/buddy/evolution-progress.tsx`
- `components/buddy/buddy-export-button.tsx`

## Build Order
1. Schema + migration (Supabase SQL)
2. Types + queries (lib/buddy/)
3. API route (app/api/buddy/)
4. Components (stats-card first, then gallery)
5. Page assembly (app/buddy/page.tsx)
6. Sync endpoint (app/api/buddy/sync/)
7. Export route (OG-image generation)
