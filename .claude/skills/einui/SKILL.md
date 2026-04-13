---
name: einui
description: This skill should be used when the user asks to "add Ein UI components", "install glass card", "use liquid glass UI", "add frosted glass components", "set up Ein UI", "configure glass morphism", mentions "einui", "@einui", "glass-card", "glass-button", or discusses React/Next.js frosted glass component styling. Provides guidance for Ein UI library integration.
version: 2.0.0
---

# Ein UI Component Library Integration

Guide for adding liquid glass morphism components to React/Next.js projects using Ein UI, built on Shadcn/Radix UI primitives with Tailwind CSS v4.

## Overview

Ein UI provides frosted glass styled components with:
- Full TypeScript support
- Dark mode with CSS variables
- Accessibility via Radix UI primitives
- Tailwind CSS v4 integration
- Shadcn CLI installation (registry-based)

**Official Site:** https://ui.eindev.ir
**GitHub:** https://github.com/ehsanghaffar/einui
**Registry:** https://ui.eindev.ir/r/

## Prerequisites

Before installing Ein UI components, verify the project has:

1. **Next.js 14+** (App Router recommended)
2. **Tailwind CSS v4** configured
3. **Shadcn UI initialized** (`npx shadcn@latest init` if not present)

Check prerequisites:
```bash
# Verify package.json has required dependencies
cat package.json | grep -E '"next"|"tailwindcss"|"@radix-ui"'

# Check for shadcn configuration
ls components.json 2>/dev/null || echo "Shadcn not initialized"
```

## Installation

### Single Component (Registry URL)
```bash
npx shadcn@latest add "https://ui.eindev.ir/r/glass-card.json"
```

### Multiple Components
```bash
npx shadcn@latest add "https://ui.eindev.ir/r/glass-card.json" "https://ui.eindev.ir/r/glass-button.json" "https://ui.eindev.ir/r/glass-input.json"
```

### Install All Core Components
```bash
npx shadcn@latest add \
  "https://ui.eindev.ir/r/glass-card.json" \
  "https://ui.eindev.ir/r/glass-button.json" \
  "https://ui.eindev.ir/r/glass-input.json" \
  "https://ui.eindev.ir/r/glass-dialog.json" \
  "https://ui.eindev.ir/r/glass-tabs.json" \
  "https://ui.eindev.ir/r/glass-select.json" \
  "https://ui.eindev.ir/r/glass-badge.json" \
  "https://ui.eindev.ir/r/glass-avatar.json"
```

## Component Categories

### Liquid Glass Core (23 components)
| Component | Install Command |
|-----------|-----------------|
| glass-card | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-card.json"` |
| glass-button | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-button.json"` |
| glass-input | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-input.json"` |
| glass-dialog | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-dialog.json"` |
| glass-tabs | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-tabs.json"` |
| glass-select | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-select.json"` |
| glass-badge | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-badge.json"` |
| glass-avatar | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-avatar.json"` |
| glass-progress | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-progress.json"` |
| glass-switch | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-switch.json"` |
| glass-slider | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-slider.json"` |
| glass-tooltip | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-tooltip.json"` |
| glass-textarea | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-textarea.json"` |
| glass-checkbox | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-checkbox.json"` |
| glass-radio | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-radio.json"` |
| glass-skeleton | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-skeleton.json"` |
| glass-table | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-table.json"` |
| glass-breadcrumb | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-breadcrumb.json"` |
| glass-sheet | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-sheet.json"` |
| glass-popover | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-popover.json"` |
| glass-alert-dialog | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-alert-dialog.json"` |
| glass-separator | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-separator.json"` |
| glass-scroll-area | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-scroll-area.json"` |

### Innovative Components (8)
| Component | Install Command |
|-----------|-----------------|
| glass-command-palette | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-command-palette.json"` |
| glass-notification | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-notification.json"` |
| glass-dock | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-dock.json"` |
| glass-gauge | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-gauge.json"` |
| glass-morph-card | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-morph-card.json"` |
| glass-ripple | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-ripple.json"` |
| glass-spotlight | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-spotlight.json"` |
| glass-timeline | `npx shadcn@latest add "https://ui.eindev.ir/r/glass-timeline.json"` |

### Widget Components (6)
| Component | Install Command |
|-----------|-----------------|
| base-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/base-widget.json"` |
| calendar-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/calendar-widget.json"` |
| clock-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/clock-widget.json"` |
| weather-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/weather-widget.json"` |
| stats-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/stats-widget.json"` |
| stock-widget | `npx shadcn@latest add "https://ui.eindev.ir/r/stock-widget.json"` |

### Pre-built Blocks (5)
| Block | Install Command | Target |
|-------|-----------------|--------|
| admin-panel | `npx shadcn@latest add "https://ui.eindev.ir/r/admin-panel.json"` | `app/admin/page.tsx` |
| login-page | `npx shadcn@latest add "https://ui.eindev.ir/r/login-page.json"` | `app/auth/login/page.tsx` |
| signup-page | `npx shadcn@latest add "https://ui.eindev.ir/r/signup-page.json"` | `app/auth/signup/page.tsx` |
| forgot-password-page | `npx shadcn@latest add "https://ui.eindev.ir/r/forgot-password-page.json"` | `app/auth/forgot-password/page.tsx` |
| pricing-page | `npx shadcn@latest add "https://ui.eindev.ir/r/pricing-page.json"` | `app/pricing/page.tsx` |

See `references/components-catalog.md` for the complete component list with usage examples.

## Required Dependencies

Many Ein UI components require these peer dependencies:

```bash
# Core dependencies (install as needed)
npm install framer-motion lucide-react class-variance-authority

# Radix UI primitives (installed automatically by shadcn)
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-select
```

| Dependency | Required By |
|------------|-------------|
| `framer-motion` | glass-tabs, glass-textarea, glass-checkbox, glass-radio, glass-skeleton, base-widget |
| `lucide-react` | glass-dialog, glass-select, glass-checkbox, glass-breadcrumb, glass-sheet, glass-command-palette, glass-notification, all widgets, all blocks |
| `class-variance-authority` | glass-badge, glass-button, glass-sheet |

## CRITICAL: Collect Anchor Color BEFORE Any Design Work

**BEFORE designing any UI, layout, or component, you MUST ask the user for their brand/anchor color.**

1. Ask: "What is your brand's primary color?" Accept hex, rgb, color name, or OKLCH values
2. If the user has no preference, ask them to describe their brand personality or aesthetic (warm, cool, bold, muted, earthy, etc.) and pick an anchor color for them
3. **NEVER** proceed with UI design until you have an anchor color
4. **NEVER** fall back to cyan, purple, or blue — those are the hallmarks of generic AI design

## Theming with OKLCH Color Palette (MANDATORY)

Every Ein UI project uses a **7-color OKLCH palette** derived from the user's anchor color. There are NO default themes. Every project gets a unique palette.

### Step 1: Generate the 7-Color Palette from Anchor

Given an anchor color, convert it to OKLCH format: `oklch(L_anchor C_anchor H_anchor)`.

Use the [OKLCH Color Palette Generator](https://gloss-modern-smile.figma.site/) if a browser is available. Otherwise, generate algorithmically:

**The 7 lightness stops** (fixed):
`L = [0.95, 0.85, 0.73, 0.60, 0.48, 0.35, 0.20]`

**Hue**: Fixed at `H_anchor` for all 7 colors.

**Chroma MUST vary** — this is what separates professional palettes from AI slop. Constant chroma creates neon lights at high lightness and muddy darks at low lightness. Instead, taper chroma away from the anchor:

```
For each lightness stop L:
  distance = |L - L_anchor|
  max_distance = max(|0.20 - L_anchor|, |0.95 - L_anchor|)
  factor = 1 - (distance / max_distance) * 0.7
  C = C_anchor * factor
```

**Worked example** — anchor `oklch(0.60 0.15 280)` (a purple):

| Var | L | Distance | Factor | C | Result |
|-----|------|----------|--------|-------|--------|
| `--color-1` | 0.95 | 0.35 | 0.30 | 0.045 | `oklch(0.95 0.045 280)` |
| `--color-2` | 0.85 | 0.25 | 0.50 | 0.075 | `oklch(0.85 0.075 280)` |
| `--color-3` | 0.73 | 0.13 | 0.77 | 0.116 | `oklch(0.73 0.116 280)` |
| `--color-4` | 0.60 | 0.00 | 1.00 | 0.150 | `oklch(0.60 0.15 280)` ← anchor |
| `--color-5` | 0.48 | 0.12 | 0.79 | 0.119 | `oklch(0.48 0.119 280)` |
| `--color-6` | 0.35 | 0.25 | 0.56 | 0.084 | `oklch(0.35 0.084 280)` |
| `--color-7` | 0.20 | 0.40 | 0.30 | 0.045 | `oklch(0.20 0.045 280)` |

Notice how chroma peaks at the anchor (0.15) and tapers naturally toward the extremes (~0.045). This is what makes palettes look designed, not generated.

### Step 2: Set 7 Master Colors + Semantic Mappings in globals.css

```css
:root {
  /* === MASTER COLOR PALETTE (OKLCH) === */
  /* Replace these with YOUR generated values from Step 1 */
  --color-1: oklch(0.95 0.045 280);   /* Lightest */
  --color-2: oklch(0.85 0.075 280);   /* Light */
  --color-3: oklch(0.73 0.116 280);   /* Medium light */
  --color-4: oklch(0.60 0.15 280);    /* Anchor / Primary */
  --color-5: oklch(0.48 0.119 280);   /* Medium dark */
  --color-6: oklch(0.35 0.084 280);   /* Dark */
  --color-7: oklch(0.20 0.045 280);   /* Darkest */

  /* === SEMANTIC MAPPINGS (reference master colors only) === */
  --background: var(--color-7);
  --foreground: var(--color-1);
  --primary: var(--color-4);
  --primary-foreground: var(--color-1);
  --secondary: var(--color-6);
  --secondary-foreground: var(--color-2);
  --accent: var(--color-5);
  --accent-foreground: var(--color-1);
  --muted: var(--color-6);
  --muted-foreground: var(--color-3);
  --border: var(--color-6);
  --ring: var(--color-4);
  --card: var(--color-7);
  --card-foreground: var(--color-1);

  /* === SEMANTIC STATUS COLORS (fixed hues, match anchor lightness/chroma intensity) === */
  --destructive: oklch(0.55 0.22 27);
  --success: oklch(0.60 0.17 145);
  --warning: oklch(0.75 0.15 85);

  /* === GLASS EFFECTS (derived from master colors) === */
  --glass-bg: oklch(from var(--color-7) l c h / 0.4);
  --glass-border: oklch(from var(--color-3) l c h / 0.15);
  --glass-blur: 16px;
  --glow-primary: oklch(from var(--color-4) l c h / 0.3);
  --glow-secondary: oklch(from var(--color-5) l c h / 0.3);

  /* === TEXT (reference master colors) === */
  --text-primary: var(--color-1);
  --text-secondary: var(--color-2);
  --text-muted: var(--color-3);
}
```

### Step 3: Use ONLY Master Colors in Components

```tsx
// CORRECT — references master palette
<div className="bg-[var(--color-7)] text-[var(--color-1)]">
<GlassButton className="bg-[var(--color-4)] hover:bg-[var(--color-5)]">
<span className="text-[var(--destructive)]">Error message</span>
<span className="text-[var(--success)]">Success!</span>

// FORBIDDEN — hardcoded colors
<div className="bg-cyan-500">              // ❌ named Tailwind colors
<div className="text-purple-400">          // ❌ named Tailwind colors
<div style={{ color: '#3b82f6' }}>         // ❌ hex colors
<div className="from-slate-950 via-purple-900"> // ❌ generic gradients
```

### Background Gradients (derived from palette)

```tsx
// Page background — use darkest colors from YOUR palette
<div className="bg-gradient-to-br from-[var(--color-7)] via-[var(--color-6)] to-[var(--color-7)]">

// Decorative blur circles — use mid-palette colors
<div className="absolute rounded-full bg-[var(--color-4)]/30 blur-3xl" />
<div className="absolute rounded-full bg-[var(--color-5)]/30 blur-3xl" />
```

### Glow Effect Utility

```css
.glass-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg,
    var(--glow-primary),
    var(--glow-secondary)
  );
  border-radius: inherit;
  opacity: 0.7;
  z-index: -1;
  filter: blur(8px);
}
```

### Retheme the Entire App

To change the color scheme, recalculate the 7 OKLCH values from a new anchor color. Keep the same lightness stops, change hue and recalculate chroma with the taper formula. Every component updates automatically.

See `references/theming-guide.md` for complete theming documentation.

## Dark Mode

Ein UI components are designed for dark mode by default. Configure with next-themes:

### Install next-themes
```bash
npm install next-themes
```

### Next.js App Router Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Usage Pattern

After installation, import and use components:

```tsx
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent } from '@/components/liquid-glass/glass-card'
import { GlassButton } from '@/components/liquid-glass/glass-button'

export default function Page() {
  return (
    <GlassCard className="p-6">
      <GlassCardHeader>
        <GlassCardTitle>Welcome</GlassCardTitle>
      </GlassCardHeader>
      <GlassCardContent>
        <p className="text-white/70">Beautiful liquid glass effect</p>
        <GlassButton variant="primary" className="mt-4">
          Get Started
        </GlassButton>
      </GlassCardContent>
    </GlassCard>
  )
}
```

## Import Paths

Components install to these directories:

| Type | Install Path |
|------|--------------|
| Core components | `@/components/liquid-glass/` |
| Innovative components | `@/components/innovative/` |
| Widgets | `@/components/widgets/` |
| Blocks | `app/` directory (pages) |

## Color Schemes — BANNED DEFAULTS

**The following legacy themes are BANNED. Never use them:**
- ~~Ocean~~ (cyan/blue) — BANNED
- ~~Aurora~~ (purple/pink) — BANNED
- ~~Forest~~ (green/teal) — BANNED

**The following patterns are FORBIDDEN in all Ein UI code:**
- `--glow-cyan`, `--glow-purple`, `--glow-pink`, or any named glow color
- `rgba(...)` or `#hex` values in CSS variables — use `oklch()` only
- `bg-cyan-*`, `text-purple-*`, `from-slate-* via-purple-*`, or any hardcoded Tailwind color
- `from-slate-950 via-purple-900 to-slate-950` or similar generic gradients

**ALWAYS**: Generate a custom OKLCH palette from the user's anchor color. Use ONLY `var(--color-1)` through `var(--color-7)` and the semantic mappings.

## Implementation Workflow

When adding Ein UI to a project:

1. **Verify prerequisites** - Check Next.js, Tailwind v4, Shadcn
2. **Initialize Shadcn** if needed - `npx shadcn@latest init`
3. **Install peer dependencies** - `npm install framer-motion lucide-react class-variance-authority`
4. **Install components** - Use registry URL: `npx shadcn@latest add "https://ui.eindev.ir/r/[component].json"`
5. **Add CSS variables** - Configure theming in globals.css
6. **Set up dark mode** - Install next-themes, configure ThemeProvider
7. **Import and use** - Components available at their respective import paths

## Troubleshooting

### Component Not Found
Verify Shadcn is initialized and components.json exists. Use full registry URLs.

### Blur Effect Not Working
Ensure Tailwind CSS v4 is properly configured with backdrop-blur utilities.

### Dark Mode Not Switching
Check ThemeProvider wraps the application and `attribute="class"` is set.

### Missing Peer Dependencies
Many components need framer-motion, lucide-react, or class-variance-authority. Check console errors.

## Custom Themes from OKLCH Palettes

Create custom color themes using [OKLCH Color Palette Generator](https://gloss-modern-smile.figma.site/):

1. Generate a palette on the site (set anchor color, export JSON)
2. Run the converter: `npx ts-node scripts/palette-to-einui.ts palette.json > theme.css`
3. Import the generated CSS in your project

Or use the simple format with just a primary color:
```json
{ "name": "brand", "primary": "#6366f1" }
```

See `references/custom-themes.md` for full documentation.

## Additional Resources

### Reference Files
- **`references/components-catalog.md`** - Complete component documentation with all 42 components
- **`references/component-api.md`** - TypeScript interfaces and props reference
- **`references/theming-guide.md`** - CSS variables and customization
- **`references/custom-themes.md`** - OKLCH palette to Ein UI theme conversion
- **`references/installation-patterns.md`** - Project setup patterns
- **`references/blocks-guide.md`** - Pre-built page blocks documentation

### Scripts
- **`scripts/palette-to-einui.ts`** - Convert OKLCH palettes to Ein UI CSS variables

### Example Files
- **`examples/form-patterns.tsx`** - Complete form examples
- **`examples/dashboard-layout.tsx`** - Dashboard with widgets
- **`examples/command-palette-setup.tsx`** - Command palette integration
- **`examples/example-palette.json`** - Example OKLCH palette (7-color, chroma-varying)
- **`examples/dark-mode-setup.md`** - Dark mode configuration
