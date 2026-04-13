# Honest Glass Component Comparison — 2026-04-13

## Our LiquidGlass vs Ein UI GlassMorphCard

### Ein UI GlassMorphCard — What They Do Better

**1. 3D tilt is built-in, not separate**
Ein UI composes `perspective: 1000px` + `rotateX/rotateY` directly in the glass card. We split this across two components (LiquidGlass + TiltCard) which means extra wrapper divs and potentially double event handlers.
**Lesson:** Consider a combined `GlassCard3D` that merges tilt + glass in one component.

**2. Outer glow ring**
Ein UI has a `-inset-2 blur-xl` glow layer OUTSIDE the card that grows on hover. This gives a "floating" depth effect our LiquidGlass doesn't have — we only have inset shadows.
**Lesson:** Add an outer glow layer option.

**3. `translateZ(20px)` on content**
Their content sits at `translateZ(20px)` in 3D space, creating real parallax between the glass surface and the text. Our content is flat `relative z-10`.
**Lesson:** Adding a small translateZ to content would increase perceived depth.

**4. Glass highlight gradient**
They have `from-white/20 to-transparent` top-to-bottom gradient for the "light catching from above" effect. We have a single 1px top edge line. Their approach is more visible and more realistic.
**Lesson:** Replace our 1px edge with a gradient overlay.

**5. forwardRef pattern**
They use React.forwardRef which allows parent components to pass refs. Ours doesn't — limits composability.
**Lesson:** Always use forwardRef for primitives.

### What We Do Better

**1. SVG fractalNoise texture**
Our noise overlay uses real SVG turbulence for organic texture. Ein UI has no noise layer — their glass is smooth/clean. Both approaches are valid, but noise adds realism at near-zero cost.

**2. Saturation boost via backdrop-filter**
We use `saturate(180%)` in the backdrop-filter which makes colors behind the glass pop. Ein UI just uses `backdrop-blur-xl` without saturation. Our glass is more "alive."

**3. Configurable tint color**
We accept any `tint` hex color, making the glass themeable per-context (teal for worlds, gold for academy, etc.). Ein UI has preset glow colors (cyan/purple/blue/pink/green) which is less flexible.

**4. Brightness transition on hover**
We animate `brightness(1.08)` on hover via backdrop-filter. Ein UI doesn't modify backdrop-filter on hover — only the glow and reflections change.

**5. Configurable intensity**
`subtle | standard | heavy` with pre-tuned blur/sat/bg values. Ein UI has a single `intensity` number prop for tilt only, not for glass density.

### What Motion Primitives (ibelick) Offers We Don't Have

Based on research — their library focuses on:
- **TextEffect** — more advanced than SplitText (supports word-level, line-level, not just character)
- **InView** — composable `whileInView` wrapper (similar to our Reveal but more configurable)
- **Transition panels** — morphing between states (we don't have this)
- **Cursor effects** — more variety than our CursorFollower
- **Background patterns** — animated dot/grid backgrounds (we have GradientMesh but not grids)

### What shadcn-glass-ui Offers (57 components)

Production-ready glassmorphism variants of EVERY shadcn component. We couldn't replicate this without substantial effort. However:
- It requires shadcn/ui as a base (we don't use shadcn)
- All 57 components follow ONE glass recipe — ours can vary per context
- No mouse-tracking effects — static glass only

## Recommendation: What to Absorb

### From Ein UI (High Priority)
1. **Outer glow ring** — `-inset-2 blur-xl` with color
2. **translateZ on content** — 20px depth separation
3. **Top-to-bottom highlight gradient** — replace our 1px line
4. **Combined tilt+glass** — new `GlassCard3D` that merges both
5. **forwardRef** — standard composability pattern

### From Motion Primitives (Medium Priority)
1. **TextEffect word-level splitting** — enhance our SplitText
2. **Background grid/dot patterns** — complement GradientMesh
3. **Transition panels** — new primitive for state morphing

### From shadcn-glass-ui (Low Priority — Arch Change)
1. Only relevant if we adopt shadcn/ui as base layer. Current custom system works.
2. Could adopt shadcn for FORM components (input, select, dialog) while keeping custom for cards/heroes.

## Action: Rebuild LiquidGlass v2

Merge the best of Ein UI's approach + our unique features:

```
LiquidGlass v2 = 
  Ein UI's outer glow + 3D content depth + gradient highlight
  + Our fractalNoise + saturation + tint flexibility + configurable intensity
  + forwardRef composability
```

This creates a glass primitive that is genuinely the best available — not just claimed, but proven by absorbing what's better from tested alternatives.
