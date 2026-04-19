---
name: design-imagery
description: Use when a page needs hero imagery, section illustrations, or editorial visuals. Generates via Fal (FLUX Pro for editorial), Gemini NB2 (fast iteration, Arcanea default), or Replicate (Frank's fine-tuned models + Wan video). Produces 3 options per request, optimizes for next/image, places in correct path.
---

# Design Imagery

You generate bespoke imagery. Never use stock photography. Never settle for one option.

## Required MCPs

- `fal` — `FAL_KEY` via setx
- `gemini` — `GEMINI_API_KEY` via setx
- `replicate` — `REPLICATE_API_TOKEN` via setx (for Frank's fine-tuned + Wan)

If any missing, tell user which `setx` to run and stop.

## When to use which model

| Need | Model | Why |
|---|---|---|
| Editorial hero, photoreal, premium | Fal FLUX Pro | Fastest FLUX hosting, best quality per dollar |
| Quick iteration, brand exploration | Gemini NB2 (`gemini-3.1-flash-image-preview`) | Arcanea default per `feedback_nb2_default.md` |
| Frank's custom-trained look | Replicate | Only place the fine-tuned model lives |
| Video hero (Week 4+) | Replicate Wan | Long-form, stylized |
| Iconography, diagrams | Gemini NB2 | Cheap, fast for non-photoreal |

## Prompt engineering

Always include:
- **Arcanea brand context:** "cosmic dark aesthetic, aquamarine teal accents, gold highlights, premium AI creative platform"
- **Style anchor:** a reference to a specific aesthetic (e.g. "Blade Runner 2049 interior lighting", "Teenage Engineering product photography", "editorial magazine spread")
- **Negative prompt:** "no text overlays, no watermarks, no generic AI aesthetic, no purple gradients"
- **Resolution:** match the target (hero: 2560x1440, card: 1200x800, avatar: 512x512)

## Workflow

### 1. Read the brief

From `design-architect`. Note the aesthetic extreme — this drives the imagery style.

### 2. Generate 3 options

Run the same prompt 3 times with different seeds. Present to user as a grid.

### 3. User picks

Wait for selection. Do NOT proceed to production without user pick.

### 4. Optimize

- Export as WebP (quality 85) or AVIF if the target supports it
- Dimensions: match exactly the `next/image` sizes prop
- Place in `public/brand/<brand-kit>/<page>-<section>.webp` OR `public/imagery/<name>.webp`
- Add alt text (descriptive, not marketing copy)

### 5. Wire it

Update the component to use the new image. Prefer `next/image` with `priority` on hero imagery, `loading="lazy"` on below-fold.

## Anti-patterns

- Stock photos (Unsplash, Pexels, Shutterstock)
- "AI art" aesthetic (purple gradients, corporate memphis, stylized hands)
- Over-filtered / over-saturated
- Text embedded in the image
- Aspect ratios that don't match the design grid
- Uncompressed images >500KB for hero, >150KB for cards

## Hand-off

Next agent: `design-verifier`.
