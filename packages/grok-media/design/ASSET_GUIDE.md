# Arcanea Media -- Design Asset Guide

> Comprehensive inventory of free, production-ready design assets for building a world-class Chrome Extension.
> Last updated: 2026-03-03

---

## Quick Start -- Top 10 Downloads NOW

| # | Asset | Install / URL | Why |
|---|-------|--------------|-----|
| 1 | **Phosphor Icons** | `npm i @phosphor-icons/react` | Already in Arcanea stack. 9,000+ icons, 6 weights, tree-shakable |
| 2 | **Lucide Icons** | `npm i lucide-react` | 1,500+ icons, shadcn/ui default, ultra-lightweight |
| 3 | **Motion** (Framer Motion) | `npm i motion` | Already in Arcanea stack. 18M+ monthly downloads, GPU-accelerated |
| 4 | **Animate.css** | `npm i animate.css` | 80+ entrance/exit/attention animations, 3 KB gzip |
| 5 | **Hypercolor** | https://hypercolor.dev | Copy-paste Tailwind gradients, mesh generator included |
| 6 | **fffuel** | https://www.fffuel.co | 20+ SVG generators: noise, blobs, waves, patterns |
| 7 | **Hero Patterns** | https://heropatterns.com | 100+ repeatable SVG background patterns |
| 8 | **3dicons** | https://3dicons.co | 1,440+ open-source 3D icons, CC0 license |
| 9 | **Inter (variable)** | Google Fonts | Already in Arcanea stack. Perfect UI/body font |
| 10 | **Space Grotesk** | Google Fonts | Already in Arcanea stack. Display/heading font |

---

## 1. Icon Libraries

### Tier 1 -- Primary Recommendations

| Name | URL | License | Styles | Count | Install | Best For |
|------|-----|---------|--------|-------|---------|----------|
| **Phosphor Icons** | https://phosphoricons.com | MIT | thin, light, regular, bold, fill, duotone | 9,000+ | `npm i @phosphor-icons/react` | **Already in Arcanea**. Best all-around library. Duotone style is unique. |
| **Lucide** | https://lucide.dev | ISC (MIT-compatible) | outline (stroke-width adjustable) | 1,500+ | `npm i lucide-react` | shadcn/ui ecosystem, ultra-clean minimalism, excellent tree-shaking |
| **Tabler Icons** | https://tabler.io/icons | MIT | outline, filled | 5,900+ | `npm i @tabler/icons-react` | Largest MIT set. 1.3M weekly downloads. Great for media/editor UIs |
| **Heroicons** | https://heroicons.com | MIT | outline, solid, mini (20px), micro (16px) | 316 | `npm i @heroicons/react` | Tailwind-native. Small but every icon is pixel-perfect |

### Tier 2 -- Supplementary

| Name | URL | License | Styles | Count | Install | Best For |
|------|-----|---------|--------|-------|---------|----------|
| **Iconoir** | https://iconoir.com | MIT | outline | 1,600+ | `npm i iconoir-react` | Clean European aesthetic, great Figma plugin |
| **Remix Icon** | https://remixicon.com | Remix Icon License v1.0 (free commercial) | outlined, filled | 3,200+ | `npm i remixicon` | Neutral style, massive variety, editor/media icons |
| **Feather Icons** | https://feathericons.com | MIT | outline | 287 | `npm i react-feather` | Ultra-minimal. Lucide is its maintained fork |
| **Material Symbols** | https://fonts.google.com/icons | Apache 2.0 | outlined, rounded, sharp (variable font axes: fill, weight, grade, optical size) | 3,800+ | `npm i material-symbols` | Variable font approach, Google ecosystem alignment |

### Tier 3 -- Newcomers (2025-2026)

| Name | URL | License | Styles | Count | Install | Best For |
|------|-----|---------|--------|-------|---------|----------|
| **Hugeicons** | https://hugeicons.com | Free tier (4,600 icons) / Pro | stroke rounded + 9 more styles in Pro | 46,000+ (4,600 free) | `npm i @hugeicons/core-free-icons` | Modern design, 59 categories, growing fast |

### Icon Strategy for Arcanea Media

```
Primary:   Phosphor Icons  (brand consistency with main Arcanea app)
Secondary: Lucide           (fill gaps, shadcn/ui compatibility)
Fallback:  Tabler Icons     (5,900+ when you need something obscure)
```

**Bundle size note**: All recommended libraries support tree-shaking. Only imported icons ship in your bundle. A typical extension using 30-50 icons adds ~15-25 KB gzipped.

---

## 2. 3D Illustration Libraries

| Name | URL | License | Formats | Count | Best For |
|------|-----|---------|---------|-------|----------|
| **3dicons** | https://3dicons.co | CC0 (no attribution) | PNG, Blender, FBX, Figma | 1,440+ icons, 4 color styles, 3 angles | App icons, marketing, onboarding screens |
| **Shapefest** | https://shapefest.com | Free personal + commercial | PNG (high-res) | 100,000+ 3D shapes | Abstract backgrounds, geometric accents |
| **Khagwal 3D** | https://3d.khagwal.com | CC0 (no attribution) | PNG | 45 models, 5 themes, 5 angles | App illustrations, hero sections |
| **Handz** | https://www.handz.design | CC0 (no attribution) | PNG | 320 combinations (12 gestures x 9 skin tones x 3 sleeves) | Onboarding, tutorials, gesture hints |
| **Saly** (Figma) | https://www.figma.com/community/file/890095002328610853 | Free | Figma, PNG | 45 character illustrations | Marketing, empty states, feature showcases |

### Figma Community 3D Packs

| Name | Figma URL | Notes |
|------|-----------|-------|
| Collection of Free 2D & 3D Packs | https://www.figma.com/community/file/1054163930226599569 | Curated mega-collection |
| Free 3D Illustration Pack | https://www.figma.com/community/file/944127198658531074 | Made entirely in Figma |
| Free 3D Illustrations | https://www.figma.com/community/file/1185440158081804124 | Modern style |
| 3D Work Activity Pack | https://www.figma.com/community/file/1133234423497976876 | Workspace/productivity themed |

### Usage in Chrome Extension

3D assets are best used as:
- **Web Store listing screenshots** (hero images, feature callouts)
- **Onboarding flow** illustrations (first-run experience)
- **Empty states** (no media found, upload prompt)
- **Marketing page** assets (landing page if applicable)

Export at 1x and 2x. Keep PNGs under 100 KB each (use TinyPNG/Squoosh). For the extension bundle itself, prefer SVG icons over 3D PNGs to stay lean.

---

## 3. Gradient Collections

### Copy-Paste Ready

| Name | URL | License | Count | Format | Best For |
|------|-----|---------|-------|--------|----------|
| **Hypercolor** | https://hypercolor.dev | Free | 50+ curated + mesh generator | Tailwind classes | **Primary pick**. Direct Tailwind integration, mesh gradients |
| **WebGradients** | https://webgradients.com | Free | 180 linear gradients | CSS3, PSD, Sketch | Subtle backgrounds, soft UI cards |
| **Grabient** | https://grabient.com | Free | Generator (unlimited) | CSS, SCSS, SVG, Android XML | Custom multi-stop gradients, angle control |
| **Gradienty** | https://gradienty.codes | Free | 20,000+ | Tailwind classes | Massive collection, Tailwind-native |
| **Tailscan Gradients** | https://tailscan.com/gradients | Free | Curated collection | Tailwind classes | Quick browse and copy |
| **Colortopia** | https://colortopia.vercel.app | Free | Curated collection | Tailwind classes | Clean UI, easy browsing |

### Generators

| Name | URL | Output | Best For |
|------|-----|--------|----------|
| **Hypercolor Mesh** | https://hypercolor.dev/mesh | Tailwind + CSS | Organic mesh gradients |
| **CSS Gradient** | https://cssgradient.io | CSS3 | Linear/radial/conic with visual editor |
| **Learn UI Gradient** | https://www.learnui.design/tools/gradient-generator.html | CSS | Perceptually uniform gradients (no muddy middle) |

### Arcanea Media Gradient Palette

Based on the Arcanea Design System v5.0, pre-built gradients to use:

```css
/* Primary: Cyan to Ultramarine */
.gradient-primary {
  background: linear-gradient(135deg, #00bcd4, #0d47a1);
}

/* Accent: Peacock to Cyan */
.gradient-accent {
  background: linear-gradient(135deg, #00897b, #00bcd4);
}

/* Dark surface: Near-black depth */
.gradient-surface {
  background: linear-gradient(180deg, #09090b, #111114);
}

/* Glow: Subtle cyan radial */
.gradient-glow {
  background: radial-gradient(ellipse at center, rgba(0,188,212,0.15), transparent 70%);
}
```

---

## 4. CSS Animation Libraries

| Name | URL | License | Size (gzip) | Install | Animations | Best For |
|------|-----|---------|-------------|---------|------------|----------|
| **Motion** (Framer Motion) | https://motion.dev | MIT | ~32 KB | `npm i motion` | Unlimited (programmatic) | **Already in Arcanea**. React-native API, gesture support, layout animations, GPU-accelerated |
| **Animate.css** | https://animate.style | MIT | ~3 KB | `npm i animate.css` | 80+ (entrance, exit, attention, bounce, fade, flip, rotate, zoom) | Quick CSS-only animations, no JS needed |
| **Magic Animations** | https://www.minimamente.com/project/magic/ | MIT | ~3.1 KB | `npm i magic.css` | 60+ (puffIn, twisterIn, spaceIn, perspectiveDown, etc.) | Unique 3D perspective effects |
| **Animista** | https://animista.net | Free (generator) | Custom (download only what you use) | No npm -- copy CSS | On-demand: basic, entrances, exits, text, attention, backgrounds | Zero-dependency, hand-pick animations |

### Animation Strategy for Chrome Extension

```
Framework:  Motion (Framer Motion) -- handles all interactive animations
CSS-only:   Animate.css            -- loading states, simple transitions
On-demand:  Animista               -- grab specific keyframes when needed
```

**Performance rules for extensions:**
- Prefer `transform` and `opacity` (GPU-composited, no layout thrash)
- Keep animations under 300ms for UI interactions
- Use `prefers-reduced-motion` media query for accessibility
- Avoid animating during page load -- defer to `requestIdleCallback`

---

## 5. Texture & Pattern Resources

### Pattern Libraries

| Name | URL | License | Type | Best For |
|------|-----|---------|------|----------|
| **Hero Patterns** | https://heropatterns.com | Free (Steve Schoger) | 100+ repeatable SVG patterns | Subtle backgrounds, card textures, section dividers |
| **Pattern Monster** | https://pattern.monster | Free | SVG pattern generator (unlimited) | Custom repeating patterns with color/scale control |
| **SVG Backgrounds** | https://www.svgbackgrounds.com | Free | Ready-made SVG backgrounds | Full-page backgrounds, quick implementation |

### Noise & Texture Generators

| Name | URL | Output | Best For |
|------|-----|--------|----------|
| **fffuel nnnoise** | https://www.fffuel.co/nnnoise | SVG noise texture | Film grain, organic feel, paper texture |
| **Frontend Hero Noise** | https://frontend-hero.com/css-noise-generator | CSS + SVG filter | Live-preview noise with feTurbulence |
| **fffuel (full suite)** | https://www.fffuel.co | SVG generators | 20+ tools: waves, blobs, shapes, dividers, patterns, gradients |

### Key fffuel Tools for Arcanea Media

| Tool | URL | Generates |
|------|-----|-----------|
| nnnoise | https://www.fffuel.co/nnnoise | Noise/grain textures |
| sssvg | https://www.fffuel.co/sssvg | SVG shape morphing |
| bbblurry | https://www.fffuel.co/bbblurry | Blurry gradient backgrounds |
| wwwaves | https://www.fffuel.co/wwwaves | Wave/curve dividers |
| aaabstract | https://www.fffuel.co/aaabstract | Abstract shapes |
| ppppatterned | https://www.fffuel.co/ppppatterned | Seamless patterns |
| ffflurry | https://www.fffuel.co/ffflurry | Futuristic line patterns |
| hhhorizon | https://www.fffuel.co/hhhorizon | Horizon/layered landscapes |
| ssspill | https://www.fffuel.co/ssspill | Liquid/spill shapes |

### CSS-Only Noise (inline, no external assets)

```css
/* Subtle grain overlay -- pure CSS, no image download */
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}
```

---

## 6. Typography

### Arcanea Media Font Stack (already configured in Design System v5.0)

| Role | Font | Google Fonts | Variable | Weight Range | Notes |
|------|------|-------------|----------|-------------|-------|
| **Display/Headings** | Space Grotesk | Yes | Yes | 300-700 | Geometric, techy, distinctive |
| **UI/Body** | Inter | Yes | Yes | 100-900 | 414B+ Google Fonts requests in 2025. Industry standard |
| **Code/Mono** | JetBrains Mono | Yes | Yes | 100-800 | Ligatures, coding-optimized |

### Supplementary Font Recommendations (if expanding)

| Role | Font | Google Fonts | Variable | Why |
|------|------|-------------|----------|-----|
| **Luxury Serif** | Playfair Display | Yes | Yes (12 styles) | High-contrast transitional serif, premium feel |
| **Modern Serif** | Instrument Serif | Yes | No (Regular + Italic) | Condensed, confident, editorial |
| **Readable Serif** | Libertinus Serif | Yes | No | Best for long-form reading |
| **Alt Display** | Syne | Yes | Yes (400-800) | Geometric, futuristic, great for creative tools |
| **Alt UI** | DM Sans | Yes | Yes (100-1000) | Clean geometric sans, slightly warmer than Inter |
| **Alt Mono** | SUSE Mono | Yes | Yes (8 weights) | Newer option, strong character differentiation |
| **Branding** | Google Sans Flex | Yes | Yes (multi-axis) | Google's own variable font, maximum flexibility |

### Chrome Extension Font Strategy

```
Use system fonts for popup/sidebar body text:
  font-family: 'Inter var', Inter, system-ui, -apple-system, sans-serif;

Use Space Grotesk for headings/branding only:
  font-family: 'Space Grotesk Variable', 'Space Grotesk', sans-serif;

Bundle variable fonts as WOFF2 (Inter ~100KB, Space Grotesk ~50KB).
Or use Google Fonts CDN if online-only extension.
```

---

## 7. Chrome Extension Design Resources

### Figma Templates

| Name | URL | What It Provides |
|------|-----|------------------|
| **Chrome Extension Template** | https://www.figma.com/community/file/1127061326249481158 | Popup, options page, content script layouts |
| **Chrome Browser UI Kit 2025** | https://www.figma.com/community/file/1265084211900612593 | Full browser chrome for mockups |
| **Chrome Webstore Media Template** | https://www.figma.com/community/file/1332399760406527422 | Store listing screenshots, icons, promotional tiles |
| **Chrome UI Kit** | https://www.figma.com/community/file/1057666432526658170 | Browser frame, tabs, address bar components |

### Development Boilerplates

| Name | URL | Stack | Notes |
|------|-----|-------|-------|
| **ChromeKit** | https://www.chromekit.dev | React + Tailwind | Side panel, popup, content script templates. Includes Figma/Canva templates for icons and screenshots |

### Chrome Extension Size Constraints

| Item | Limit | Notes |
|------|-------|-------|
| Extension package (.zip) | 2 GB max | Practical limit: aim for < 5 MB for fast install |
| Store icon | 128x128 px | PNG, no rounded corners (Chrome adds them) |
| Small icon | 16x16, 32x32, 48x48 px | Toolbar and management page |
| Screenshots | 1280x800 or 640x400 px | 1-5 screenshots required |
| Promotional tile (small) | 440x280 px | Optional but recommended |
| Promotional tile (large) | 920x680 px | Featured listing |
| Marquee | 1400x560 px | Hero banner for featured extensions |

### Side Panel Dimensions

| View | Width | Height |
|------|-------|--------|
| Side panel | 360px (fixed by Chrome) | Full viewport height |
| Popup | 800px max width, 600px max height | Content-determined |
| Options page | Full tab width | Full tab |

---

## 8. AI-Themed Design Assets

### Free Icon Sets with AI/Tech Themes

| Source | URL | License | What's Available |
|--------|-----|---------|------------------|
| **Phosphor Icons** (AI subset) | https://phosphoricons.com | MIT | brain, cpu, robot, lightning, circuitry, graph, tree-structure, git-branch, cloud, database, magic-wand, sparkle |
| **Tabler Icons** (AI subset) | https://tabler.io/icons | MIT | brain, circuit-board, robot, ai, server, cloud-computing, neural-network, database, api |
| **Lucide** (AI subset) | https://lucide.dev/icons | ISC | brain, bot, sparkles, wand-sparkles, cpu, database, workflow, git-merge, layers |
| **Flaticon** (AI packs) | https://www.flaticon.com/free-icons/neural-network | Freemium (attribution required on free) | 4,070+ neural network icons, 7,184+ AI brain icons |
| **IconScout** | https://iconscout.com/icons/neural-network | Freemium | 10,516 neural network icons across multiple styles |

### AI/Tech Illustration Sources

| Source | URL | License | Best For |
|--------|-----|---------|----------|
| **unDraw** | https://undraw.co | MIT | Flat illustrations, customizable accent color, tech/AI scenes |
| **Storyset** | https://storyset.com | Free with attribution | Animated illustrations, tech category |
| **3dicons** (tech subset) | https://3dicons.co | CC0 | 3D renders of CPU, cloud, database, server, code, terminal |
| **Shapefest** (abstract) | https://shapefest.com | Free | Abstract 3D shapes for neural-network-style compositions |

### Media Management UI Patterns

For the Arcanea Media extension specifically, look for icons covering:

```
Gallery/Grid:    grid-view, list-view, masonry, columns, thumbnail
Media:           image, video, film, camera, gallery, album, slideshow
Actions:         download, upload, save, share, bookmark, heart, star
Organization:    folder, tag, label, filter, sort, search, category
AI/Generation:   sparkle, wand, brain, magic, generate, transform
Status:          loading, check, error, pending, sync, refresh
```

All of these are available across Phosphor, Lucide, and Tabler without needing any additional downloads.

---

## Integration Guide

### NPM vs CDN vs Inline -- Decision Matrix

| Method | When to Use | Bundle Impact | Offline Support |
|--------|-------------|--------------|-----------------|
| **npm + tree-shaking** | Icons, animation libraries, fonts | Only imported code ships | Full offline support |
| **CDN** | Google Fonts, one-off resources | Zero bundle impact | Requires internet |
| **Inline SVG** | Critical icons (< 10), patterns | Embedded in HTML/CSS | Full offline support |
| **Base64 data URI** | Small textures, noise patterns | Embedded in CSS | Full offline support |

### Recommended Approach for Chrome Extension

```
1. ICONS: npm install + tree-shake (Phosphor/Lucide)
   - Import only what you use
   - Typical: 30 icons = ~15 KB gzipped

2. FONTS: Bundle as WOFF2 in extension /fonts directory
   - Inter Variable: ~100 KB
   - Space Grotesk Variable: ~50 KB
   - JetBrains Mono Variable: ~80 KB
   - Total: ~230 KB (acceptable for extension)

3. ANIMATIONS: Motion (already a dependency) + Animate.css for CSS-only
   - Motion: ~32 KB gzipped
   - Animate.css: ~3 KB gzipped

4. GRADIENTS: Inline Tailwind classes (zero extra cost)
   - Copy from Hypercolor directly into components

5. PATTERNS/TEXTURES: Inline SVG data URIs in CSS
   - Hero Patterns: copy SVG, encode as data URI
   - Noise: use CSS feTurbulence filter (zero file size)

6. 3D ILLUSTRATIONS: Export as optimized PNG for Web Store only
   - Do NOT bundle 3D assets in the extension itself
   - Use only for marketing materials and store listing
```

### File Size Budget for Arcanea Media Extension

| Category | Target | Notes |
|----------|--------|-------|
| JavaScript (bundled) | < 200 KB gzip | React + Motion + app logic |
| CSS (bundled) | < 30 KB gzip | Tailwind (purged) + Animate.css |
| Fonts | < 250 KB | 2-3 variable WOFF2 files |
| Icons (tree-shaken) | < 20 KB | 30-50 Phosphor/Lucide icons |
| Images/assets | < 100 KB | Logo, small illustrations |
| **Total target** | **< 600 KB** | Fast install, fast load |

---

## Recommended Stack for Arcanea Media

### The Definitive Combination

```
ICONS
  Primary:    @phosphor-icons/react  (brand DNA -- already in Arcanea)
  Secondary:  lucide-react           (gap-fill, shadcn/ui compat)

FONTS
  Display:    Space Grotesk Variable (Google Fonts, self-hosted WOFF2)
  Body/UI:    Inter Variable         (Google Fonts, self-hosted WOFF2)
  Code:       JetBrains Mono Var     (Google Fonts, self-hosted WOFF2)

ANIMATION
  Framework:  motion (Framer Motion) (already in Arcanea, React-native)
  CSS-only:   animate.css            (loading states, micro-interactions)
  On-demand:  Animista snippets      (copy specific keyframes as needed)

GRADIENTS
  Tailwind:   Hypercolor presets     (copy-paste into className)
  Custom:     Arcanea palette above  (cyan/ultramarine/peacock)
  Generator:  Grabient               (when you need something specific)

TEXTURES
  Noise:      CSS feTurbulence       (inline, zero-cost)
  Patterns:   Hero Patterns          (inline SVG data URIs)
  Generator:  fffuel suite           (export SVG, encode to data URI)

3D / ILLUSTRATIONS
  Marketing:  3dicons + Shapefest    (store listing, onboarding)
  Gestures:   Handz                  (tutorial screens)
  Characters: Saly / Khagwal 3D     (empty states, hero sections)

DESIGN TEMPLATES
  Extension:  Chrome Extension Template (Figma)
  Store:      Chrome Webstore Media Template (Figma)
  Boilerplate: ChromeKit              (dev scaffolding)

COLOR SYSTEM (from Arcanea Design System v5.0)
  Background: #09090b (near-black)
  Text:       hsl(0 0% 93%) / hsl(0 0% 64%) / hsl(0 0% 45%)
  Primary:    #00bcd4 (cyan)
  Secondary:  #0d47a1 (ultramarine)
  Tertiary:   #00897b (peacock)
```

### Install Commands (copy-paste block)

```bash
# Core icon libraries
npm i @phosphor-icons/react lucide-react

# Animation
npm i motion animate.css

# If not already installed:
# npm i tailwindcss (for gradient utilities)
```

### Font Downloads

```
Inter Variable:
  https://fonts.google.com/specimen/Inter
  Direct WOFF2: https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2

Space Grotesk Variable:
  https://fonts.google.com/specimen/Space+Grotesk
  Direct WOFF2: https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb54C_k3HqUtEw.woff2

JetBrains Mono Variable:
  https://fonts.google.com/specimen/JetBrains+Mono
  Direct WOFF2: https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPVmUsaaDhw.woff2
```

---

## Appendix A: License Quick Reference

| License | Commercial Use | Attribution Required | Modify | Distribute |
|---------|---------------|---------------------|--------|-----------|
| **MIT** | Yes | Include license file | Yes | Yes |
| **ISC** | Yes | Include license file | Yes | Yes |
| **Apache 2.0** | Yes | Include NOTICE file | Yes | Yes |
| **CC0** | Yes | No | Yes | Yes |
| **CC BY 4.0** | Yes | Yes (credit author) | Yes | Yes |
| **Remix Icon License v1.0** | Yes | No (as of Jan 2026) | Yes | Yes |

All libraries listed in this guide are free for commercial use in the Arcanea Media Chrome Extension.

---

## Appendix B: Bookmark These

| Resource | URL | Category |
|----------|-----|----------|
| Phosphor Icons | https://phosphoricons.com | Icons |
| Lucide Icons | https://lucide.dev | Icons |
| Tabler Icons | https://tabler.io/icons | Icons |
| Heroicons | https://heroicons.com | Icons |
| Iconoir | https://iconoir.com | Icons |
| Remix Icon | https://remixicon.com | Icons |
| Hugeicons | https://hugeicons.com | Icons |
| 3dicons | https://3dicons.co | 3D |
| Shapefest | https://shapefest.com | 3D |
| Khagwal 3D | https://3d.khagwal.com | 3D |
| Handz | https://www.handz.design | 3D |
| Hypercolor | https://hypercolor.dev | Gradients |
| WebGradients | https://webgradients.com | Gradients |
| Grabient | https://grabient.com | Gradients |
| Gradienty | https://gradienty.codes | Gradients |
| Hero Patterns | https://heropatterns.com | Patterns |
| Pattern Monster | https://pattern.monster | Patterns |
| fffuel | https://www.fffuel.co | SVG Generators |
| Animate.css | https://animate.style | Animation |
| Animista | https://animista.net | Animation |
| Motion | https://motion.dev | Animation |
| Magic Animations | https://www.minimamente.com/project/magic/ | Animation |
| unDraw | https://undraw.co | Illustrations |
| Storyset | https://storyset.com | Illustrations |
| Google Fonts | https://fonts.google.com | Typography |
| ChromeKit | https://www.chromekit.dev | Extension Dev |
| Figma Chrome Extension Template | https://www.figma.com/community/file/1127061326249481158 | Extension Design |
| Figma Chrome Webstore Template | https://www.figma.com/community/file/1332399760406527422 | Store Assets |
