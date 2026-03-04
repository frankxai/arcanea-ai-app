---
name: "Arcanea Design Arena"
description: "Launch a design competition between guardian-themed AI teams. Each creates a complete design entry, evaluated by council."
---

# Arcanea Design Arena

> "Competition produces outliers. Collaboration produces averages.
> In creative work, you need the outlier."

## What This Does

Launches a multi-agent design competition where 5 guardian-themed teams
each create a complete, standalone design entry for a given brief.
A research scout gathers competitive intelligence. Results are evaluated
by the Arcanea Council against 7 criteria.

## The Competition Framework

### Phase 1: Intelligence Gathering

Deploy a Research Scout agent to analyze:
- Direct competitors doing the same thing
- Top-tier products in adjacent categories
- Latest CSS/design techniques relevant to the brief
- Current design trends (2026+)

Output: `RESEARCH.md` with specific, actionable findings.

### Phase 2: Team Deployment

Deploy 5 guardian teams simultaneously, each with:
- **The same brief** (what to build, constraints, requirements)
- **A unique creative direction** (aesthetic, color palette, typography, mood)
- **Zero knowledge** of other teams' work
- **Complete creative freedom** within their direction

#### The Five Guardians

| Team | Direction | Aesthetic |
|------|-----------|-----------|
| **Draconia** (Fire) | "The Forge" | Dark obsidian, molten gold, volcanic glass, metallic luxury |
| **Lyria** (Sight) | "The Prism" | Iridescent crystal, prismatic light, holographic rainbow |
| **Leyla** (Water) | "The Deep" | Ocean depth, bioluminescent, flowing liquid surfaces |
| **Shinkami** (Source) | "The Cosmos" | Nebula, starlight metallic, cosmic depth, ultra-clean |
| **Maylinn** (Heart) | "The Bloom" | Rose gold bubble-glass, warm lavender, organic warmth |

Each team creates a complete standalone HTML file with embedded CSS.

### Phase 3: Council Evaluation

Evaluate each entry against 7 criteria (score 1-5):

1. **Hierarchy** — Is the most important thing most prominent?
2. **Glass Quality** — Does the liquid glass feel premium, not decorative?
3. **Creation Focus** — Is the creation input the hero of the page?
4. **Typography** — Is every text element doing work?
5. **Motion** — Do animations communicate, not decorate?
6. **Time-to-Value** — Can a new user understand in 3 seconds?
7. **Magic Factor** — Does it feel magical without being slop?

Minimum average: 4.0/5.0 to advance.

### Phase 4: Synthesis

- Identify winning design(s)
- Extract the best elements from each entry
- Synthesize into a production design direction
- Update design system tokens based on winner

## How to Run

### Quick Launch (5 teams + research)

```
/design-arena homepage
```

### Custom Brief

```
/design-arena --brief "Design the Explore page for arcanea.ai" --teams 5
```

### With Specific Directions

```
/design-arena --brief "Landing page" --directions "minimal,maximal,organic,geometric,retro"
```

## Output Location

All entries are written to:
```
apps/web/public/design-lab/
├── RESEARCH.md           (scout findings)
├── team-draconia.html    (fire team entry)
├── team-lyria.html       (sight team entry)
├── team-leyla.html       (water team entry)
├── team-shinkami.html     (source team entry)
├── team-maylinn.html      (heart team entry)
└── ARENA_BLOG_POST.md    (competition writeup)
```

Gallery page: `/design-lab` (Next.js route)

## Agent Configuration

Each design team agent should be:
- Type: `general-purpose`
- Model: `sonnet` (fast + creative)
- Background: `true`
- Isolation: none (unique filenames prevent conflicts)
- Max turns: 20-30 (enough for one complete design)

Research scout:
- Type: `general-purpose`
- Model: `sonnet`
- Background: `true`
- Max turns: 30 (needs many web fetches)

## The Science Behind It

The Arena model is based on:
- **Evolutionary search**: diverse populations explore different solution regions
- **Tournament selection**: competition produces extremes, not averages
- **Diverge-then-converge**: explore first, synthesize second
- **Anti-mode-collapse**: forced diversity prevents all agents finding the same local maximum

This is NOT ensemble methods (which average to reduce variance).
This is diverse search (which increases variance to find outliers).

## When to Use This

- Homepage redesigns
- Feature page designs
- Component explorations
- Brand direction pivots
- Any design decision where multiple valid approaches exist

## Reference

- Blog post: `apps/web/public/design-lab/ARENA_BLOG_POST.md`
- Design Knowledge Base: `.arcanea/design/DESIGN_KNOWLEDGE_BASE.md`
- Operating Model: `.arcanea/design/DESIGN_OPERATING_MODEL.md`
