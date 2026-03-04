# Arcanea Design Operating Model

> How a billion-dollar brand runs design when Claude is the design team.
> This is not theory. This is the process that runs before every page ships.

---

## The Problem We're Solving

There is no human designer in the loop. No Figma review. No design director
saying "this is AI slop, try again." Claude is the designer, the engineer,
AND the quality gate. Without a rigorous operating model, every page defaults
to the same failure mode: decoration instead of design.

The operating model compensates for the absence of a human eye by making
every design decision explicit, measurable, and benchmarked against the best
products in the world.

---

## The Six-Step Design Pipeline

Every screen, component, or feature flows through this pipeline.
No step is optional. Skipping a step produces slop.

### Step 1: Reference (Before Any Pixels)

**What**: Find 3-5 best-in-class examples of the exact thing being built.
Not "inspiration" — direct competitors and category leaders doing this
exact interaction.

**How**: Search the Design Knowledge Base first. If the pattern isn't there,
research it. Screenshot. Annotate what works and why.

**Output**: A list of references with specific callouts:
- "Suno's creation input: one field, 80% viewport width, centered"
- "Linear's empty state: illustration + one sentence + one CTA"
- "Vercel's loading: 200ms delay, skeleton, no spinner"

**Gate**: Cannot proceed to Step 2 without 3+ references.

### Step 2: Structure (Information Architecture)

**What**: Define what appears on the page, in what order, at what prominence.
No visual decisions yet — just hierarchy.

**How**: List every element. Rank by importance (1 = most important).
The #1 element gets the most visual weight. Everything else serves it.

**Output**: A numbered hierarchy:
1. Creation input (hero)
2. Recent creations (secondary)
3. Explore CTA (tertiary)
4. Navigation (invisible until needed)

**Gate**: The #1 element must be the user's creation or the path to creating.
If it's not, the structure is wrong.

### Step 3: Design (Pixel Decisions)

**What**: Make specific visual decisions using the Design System constraints.

**Constraints** (non-negotiable):
- Colors: Background (#0a0a0f), Text (white at 100/60/40%),
  Teal (#7fffd4) for actions, Violet (#8b5cf6) for creations, grayscale for everything else
- Typography: 2 faces max. Display serif (Playfair) for headlines. Inter for UI.
- Spacing: 8px grid (8, 16, 24, 32, 48, 64, 80, 96). Nothing in between.
- Surfaces: 2 levels. Background and card. Card = subtle border, no blur, no glow.
- Animation: Only for state change. transform + opacity only. Honor prefers-reduced-motion.
- Border radius: 8px for cards, 4px for inputs, 24px for pills. Consistent.

**How**: Write the component/page code using these constraints. If you feel
the urge to add a glow, gradient, particle, or glass effect — stop. Ask:
"Would Linear ship this effect?" If no, delete it.

**Output**: Working code that follows all constraints.

### Step 4: Critique (Quality Gate)

**What**: Review the output against 7 specific criteria. Score each 1-5.
Must average 4.0+ to ship.

| # | Criterion | Question | Benchmark |
|---|-----------|----------|-----------|
| 1 | Hierarchy | Is the most important thing most prominent? | Linear's one-axis reading |
| 2 | Density | Is there enough breathing room? (48px+ between sections) | Vercel's generous spacing |
| 3 | Typography | Is every text element doing work? No decorative text? | Linear's weight-only hierarchy |
| 4 | Motion | Does every animation communicate a state change? | Vercel: transform + opacity only |
| 5 | Color | Is color used for meaning (action/state), not decoration? | Grok's monochrome discipline |
| 6 | Time-to-value | Can a new user understand this page in 3 seconds? | Suno's one-input home |
| 7 | Creation focus | Is the user's creation the most prominent thing? | Arc's content-fills-foreground |

**Scoring**:
- 5: Would survive a design critic's tweet
- 4: Professional. Ships at a top-tier startup.
- 3: Acceptable but not memorable
- 2: Generic. Looks like any other AI product.
- 1: AI slop. Decoration without purpose.

**Gate**: Average must be 4.0+. Any criterion scoring 1-2 must be fixed before shipping.

### Step 5: Build (Engineering)

**What**: Implement in production code with performance constraints.

**Performance constraints**:
- No layout-triggering animations (no animating width, height, top, left)
- Images: WebP/AVIF, lazy-loaded below fold, explicit width/height
- Fonts: 2 families max, preloaded, font-display: swap
- Bundle: Below-fold content lazy-loaded via dynamic imports
- Lighthouse: Target 90+ on Performance, Accessibility, Best Practices
- Loading states: 200ms delay before showing, 300ms minimum display

**Accessibility constraints**:
- APCA contrast ratios (not just WCAG 2)
- All interactive elements keyboard-accessible
- Semantic HTML (real links, real buttons, real headings)
- prefers-reduced-motion honored on all animations

**Output**: Production code that passes all constraints.

### Step 6: Validate (Final Check)

**What**: Compare the shipped page against the original references.
Would a user choose our version over the reference? If not, iterate.

**Validation questions**:
1. Put this next to the Suno/Linear/Vercel reference. Is it at least equal?
2. Show this to someone who's never heard of Arcanea. Do they understand
   in 3 seconds what they can do here?
3. Is the user's creation (or path to creation) the absolute star of the page?
4. Is there any element that's decorative rather than functional?
5. Would you bet your reputation on this page?

**Gate**: All 5 must be "yes" to ship.

---

## The Skills That Power This

### 1. Design Benchmark (reference library)

**Purpose**: Curated, annotated reference library of best-in-class design patterns.
Used in Step 1 of every design task.

**Contains**:
- Screenshots and annotations of Linear, Vercel, Suno, Grok, Arc, Raycast
- Specific patterns: empty states, creation flows, onboarding, navigation,
  loading states, error handling, settings pages
- Updated whenever a competitor ships something notable

**Location**: `.arcanea/design/DESIGN_KNOWLEDGE_BASE.md`

### 2. Design Critique (quality gate)

**Purpose**: The 7-criterion scoring system from Step 4.
Runs automatically before any page ships.

**Trigger**: Every time a page component is created or significantly modified.

**Output**: Score card with pass/fail + specific fixes needed.

### 3. Competitive Intelligence (market awareness)

**Purpose**: Track what Suno, Midjourney, Runway, Udio, Pika, v0, Cursor
are doing. What launched, what changed, what we can learn.

**Frequency**: On-demand when planning features.

**Output**: Brief with: what changed, why it matters, what Arcanea should consider.

### 4. User Journey Map (flow optimization)

**Purpose**: Map the 5 core user journeys. Measure friction at each step.
Track time-to-first-creation.

**Journeys**:
1. Land → Understand → First Creation (target: under 3 minutes)
2. Return → Create Again → Share
3. Discover → Get Inspired → Create Similar
4. Create → Improve → Master (progressive disclosure)
5. Use → Love → Invite (viral loop)

### 5. Visual QA (automated checks)

**Purpose**: Automated validation of design constraints.

**Checks**:
- [ ] Spacing follows 8px grid
- [ ] Only 2 typefaces used
- [ ] Color used for meaning only (teal=action, violet=creation, gray=chrome)
- [ ] No ambient animations
- [ ] No glassmorphism/blur/glow effects on core screens
- [ ] Loading states have delay + minimum display
- [ ] All interactive elements have focus states
- [ ] prefers-reduced-motion honored

---

## Weekly Design Cadence

### Monday: Competitive Scan
- Check what competitors shipped last week
- Update Design Knowledge Base if relevant
- Adjust priorities based on market movement

### Tuesday-Thursday: Build + Critique
- Every page goes through the 6-step pipeline
- No page ships without a 4.0+ critique score
- Iterate until it passes

### Friday: Retrospective
- What shipped this week?
- What's the average critique score?
- What patterns worked? What failed?
- Update the Design Knowledge Base with learnings

---

## The Anti-Slop Checklist

Before any commit that touches UI, run through this:

- [ ] **No glass effects** on functional surfaces
- [ ] **No particle systems** on core screens
- [ ] **No aurora gradients** that don't communicate state
- [ ] **No decorative text** (every word does work)
- [ ] **No more than 2 typefaces** visible
- [ ] **No layout-triggering animations**
- [ ] **No color used for decoration** (only meaning)
- [ ] **No mythology on first contact** (value first)
- [ ] **Creation is the most prominent element** on every creation-related page
- [ ] **Spacing follows 8px grid** exactly
- [ ] **Would Linear ship this?** (honest answer)

If any box is unchecked, the commit should not happen.

---

## How This Differs From What We Had

| Before | Now |
|--------|-----|
| No references. Design from imagination. | 3+ references before any pixel work. |
| No critique protocol. Ship when "done." | 7-criterion scoring. Must pass 4.0+. |
| Decoration-first (glass, glow, particles) | Function-first. Decoration is earned. |
| 4 typefaces | 2 typefaces |
| 7 surface levels | 2 surface levels |
| Color for vibes | Color for meaning |
| Build → maybe review | Reference → Structure → Design → Critique → Build → Validate |
| No competitive awareness | Benchmarked against best in class |
| "Does it look cool?" | "Would a designer at Vercel approve this?" |
