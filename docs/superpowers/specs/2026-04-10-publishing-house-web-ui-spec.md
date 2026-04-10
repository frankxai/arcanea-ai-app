# Publishing House Web UI — Design & Excellence Spec

**Goal:** Design the public-facing `/publishing-house` page and creator dashboard that meet the 7 Gates of Excellence.

**Status:** SPEC — not yet implemented. Guides future UI work in `apps/web/app/publishing-house/`.

---

## Gate 1: First Principles

**Why does this page exist?** One question only: *"Can I see my content become a published book in under 60 seconds?"*

If a visitor can't answer yes within 3 seconds of landing, the page has failed.

**What to delete:**
- Feature grids (show the product working, don't list what it does)
- Testimonial carousels without real names/faces
- "How it works" with 7 steps (show 3: Write → Score → Publish)
- Pricing tables with 12 rows (show 3 tiers, big numbers)

## Gate 2: Brand Voice

**Hero headline options** (pick one after testing):
- "Your books, published by their Guardians."
- "Write. Score. Ship. The Claws handle the rest."
- "288 chapters. 8 languages. Zero servers. One command."

**What NOT to write:**
- ~~"AI-powered publishing platform"~~
- ~~"Unlock your creative potential"~~
- ~~"Seamlessly distribute to all platforms"~~
- ~~"Transform your writing workflow"~~

**Voice tests to pass:**
- `/voice-check` on every visible string
- `/canon-check` on every Guardian reference

## Gate 3: Design System

### Layout
- Hero section: **full viewport height, centered**, with a live TASTE gate demo
- Below: the 5 Claws displayed as glass cards with Guardian badges
- Below: the pipeline visualization (animated SVG showing content flow)
- Below: pricing (3 cards — Free / Pro / Fleet)
- Footer: one CTA → `Clone the engine` (GitHub link)

### Design Atoms (NO deviation)
```css
/* Colors — NEVER introduce new ones */
--primary:     #00bcd4;  /* Atlantean Teal */
--secondary:   #0d47a1;  /* Cosmic Blue */
--accent:      #ffd700;  /* Gold */
--bg:          #09090b;

/* Fonts */
--font-display: 'Space Grotesk';  /* NEVER Cinzel */
--font-body:    'Inter';
--font-mono:    'JetBrains Mono';

/* Glass cards */
.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
}

/* Motion */
--ease:     cubic-bezier(0.4, 0, 0.2, 1);
--dur-fast:    150ms;
--dur-standard: 300ms;
--dur-slow:    500ms;
```

### Claw Card Template
Each of the 5 Claw cards must follow this exact structure:

```tsx
<Card className="p-6 space-y-4">
  <div className="flex items-center gap-3">
    <GuardianGlyph guardian={guardian} />
    <div>
      <h3 className="font-display text-xl">{clawName}</h3>
      <p className="text-xs text-white/60">
        Channeled by {guardian} · {gate} Gate
      </p>
    </div>
  </div>
  <p className="text-sm text-white/80">{shortDescription}</p>
  <div className="flex flex-wrap gap-2">
    {capabilities.map(cap => (
      <Badge key={cap}>{cap}</Badge>
    ))}
  </div>
</Card>
```

### The 5 Claw Cards

| Claw | Guardian | Gate | Short Description |
|------|----------|------|------------------|
| Media | Lyria | Sight | Sees every asset. Classifies, scores, processes. |
| Forge | Ismael | Fire | Summons NFTs from the World Graph. Mints with consent. |
| Herald | Alera | Voice | Carries your words across platforms without flattening them. |
| Scout | Lyssandria | Earth | Watches markets and communities. Reports in three bullets. |
| Scribe | Shinkami | Source | Formats, distributes, translates. Never ships a broken book. |

## Gate 4: Performance

**Hard targets** (non-negotiable):
| Metric | Target |
|--------|--------|
| LCP | < 2.0s |
| CLS | < 0.05 |
| First-load JS | < 150 KB |
| Lighthouse | ≥ 95 |

**Required patterns:**
- All cards are **Server Components** by default
- The live TASTE demo is a **client island** with Suspense
- Pricing data fetched via `unstable_cache` (revalidate: 3600)
- Glyphs use inline SVG (no icon font)
- Cover previews use `next/image` with `priority` on hero
- Route: `apps/web/app/publishing-house/page.tsx` — static by default

## Gate 5: User Journey

Five beats, no more:

1. **Land** → see the headline + live TASTE gate running on a sample chapter
2. **Understand** → scroll once, see 5 Guardian Claws with clear roles
3. **Believe** → scroll again, see the pipeline animation (IMAGINE → PUBLISH)
4. **Choose** → see 3 pricing cards with clear differences
5. **Act** → click one CTA: *Clone the engine* or *Start Pro trial*

**Zero dead ends.** Every link goes somewhere meaningful. No "Learn more →" anchors that scroll to vague content.

## Gate 6: Engineering

**File structure:**
```
apps/web/app/publishing-house/
├── page.tsx              # Server component, static
├── loading.tsx           # Skeleton with design atoms
├── error.tsx             # Error boundary with retry
├── _components/
│   ├── Hero.tsx          # Server
│   ├── LiveTasteDemo.tsx # Client island (Suspense)
│   ├── ClawGrid.tsx      # Server
│   ├── ClawCard.tsx      # Server
│   ├── PipelineViz.tsx   # Client island (motion)
│   └── PricingCards.tsx  # Server
└── _data/
    └── claws.ts          # Static claw metadata
```

**Constraints:**
- Every file under 200 lines
- Zero `useEffect` for data (use Server Components)
- Zero client components without explicit justification
- Metadata: proper `generateMetadata()` with OG image

## Gate 7: Strategic Coherence

**Creator journey advancement:**
- IMAGINE → the live demo shows the creator *seeing* their content scored
- BUILD → the 5 Claw cards show *what gets built for them*
- CREATE → the pipeline shows *how creation flows*
- PUBLISH → this is the core — pricing makes publishing real
- EARN → pricing cards show the revenue model (own your work, 70/30 split)
- EXPAND → the footer shows `Clone the engine` (open-core seeds community)

**Amazon press release test** (written BEFORE building):
> "FrankX today announced Arcanea Publishing House, the first autonomous publishing system where five specialized AI agents — each channeled by one of Arcanea's 16 Luminors — handle the entire pipeline from manuscript to multi-platform distribution. Creators bring their writing; the Guardian Claws handle format, quality scoring, cover art, social marketing, translation into 8 languages, and distribution to Kindle, Leanpub, arcanea.ai, and NFT marketplaces. The engine is open source under MIT; the intelligence layer runs on Claude Managed Agents with pricing starting at $29/mo. First release today with 34 source files and zero proprietary lock-in."

If this press release doesn't feel exciting, don't build the page.

---

## Checklist Before Shipping the UI

- [ ] Page passes `/voice-check` and `/canon-check`
- [ ] Lighthouse 95+ on all 4 categories
- [ ] No Cinzel anywhere
- [ ] 5 Claw cards show Guardian + Gate
- [ ] Live TASTE demo runs on a real book chapter
- [ ] Three pricing cards, nothing more
- [ ] Mobile 375px pixel-perfect before desktop work begins
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Open-core CTA visible above the fold
