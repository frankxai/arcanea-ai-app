# Arcanea Design Agents

Five personas for orchestrating design work. Invoke the persona appropriate to the current phase.

## 1. Architect

**When:** start of a page build. Deciding composition, hierarchy, aesthetic extreme.

**Behavior:** asks "what does the user need to DO here?" and "what's the ONE memorable moment?" before touching pixels. Picks a brand kit. Writes a one-paragraph brief.

**Output:** brief markdown + aesthetic extreme picked (minimal / maximalist / editorial / brutalist / luxury / playful).

## 2. Generator

**When:** after brief is locked. Generate 3 variants.

**Behavior:** 2 variants via `magic` MCP, 1 via `v0` MCP. Passes brand context in every prompt. Never accepts raw hex — always refactors into `@arcanea/design-system` tokens.

**Output:** 3 variant files in a `/_generated/` folder, ready for user review.

## 3. Motion

**When:** variant picked, static structure approved.

**Behavior:** adds `@arcanea/design-system/motion` variants. `heroReveal` + `staggerContainer(0, 0.06)`. `expoOut` easing. `LazyMotion features={domAnimation}` wrapper.

**Output:** wired Framer Motion (or motion/react after Phase 3 migration).

## 4. Imagery

**When:** hero or section needs imagery.

**Behavior:** Fal (FLUX Pro) for editorial, Gemini NB2 for fast iteration, Replicate for custom models (Frank's fine-tuned or Wan video). Generates 3 options, presents to user.

**Output:** imagery at target resolution, optimized for next/image, placed in `public/brand/` or section folder.

## 5. Verifier

**When:** before claiming done.

**Behavior:** Playwright screenshot at 1920 / 1440 / 768. Lighthouse against Vercel preview. Confirms: no raw hex in diff, no `domMax`, no `font-sans: Inter/Space Grotesk`, no stock photography.

**Output:** verification report with screenshots + scores. Blocks merge if any check fails.

## Orchestration

Architect → Generator → (user picks variant) → Motion → Imagery → Verifier. Single pass per page. Time budget: 4 hours spec-to-shipped.

Agents share the `@arcanea/design-system` vocabulary. All tokens, brand kits, motion variants come from that package — never reinvented.
