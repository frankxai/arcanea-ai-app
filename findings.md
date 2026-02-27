# Findings: Arcanea Wave 10

## Design System Audit — CRITICAL ISSUES

### 1. PRIMARY COLOR WRONG (globals.css:158)
- `--primary: var(--gold-bright)` → Should be violet #8b5cf6
- Affects ALL primary buttons, badges, UI elements across 95+ files

### 2. FONT SYSTEM WRONG (layout.tsx + tailwind.config.ts)
- Cinzel + Crimson Pro loaded instead of Inter
- layout.tsx lines 5, 9-13, 15-19: importing wrong fonts
- tailwind.config.ts:365: body font = Crimson Pro (should be Inter)
- 20+ files use `font-cinzel` class

### 3. GOLD AS CTA COLOR (46+ instances)
- `bg-gold-bright` used for CTA buttons (should be violet/teal)
- Key file: `components/lore/guardians/partnership-section.tsx:97`
- Also: academy pages, library, about, bestiary

### 4. HARDCODED HEX COLORS (95+ instances of #ffd700)
- Should use Tailwind design tokens instead
- Ecosystem diagram, academy assessment, gate-quiz all have inline colors

### 5. INCONSISTENT GLASS MORPHISM (707 backdrop-blur instances)
- No consistent tier system applied
- Mix of backdrop-blur-sm, -md, -xl across components

### Fix Priority
1. globals.css: `--primary` → violet
2. layout.tsx: Remove Cinzel/Crimson Pro, add Inter
3. tailwind.config.ts: body font → Inter
4. Replace `bg-gold-bright` CTAs → `bg-primary`
5. Replace `font-cinzel` → remove (use default Inter)

---

## Placeholder Content Audit — PENDING (scout running)
## Broken Pages Audit — PENDING (scout running)
