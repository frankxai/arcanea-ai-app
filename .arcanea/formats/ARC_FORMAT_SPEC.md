# .arc Format Specification v0.1

> "Every creation has an Arc. This format captures it."

## What is an .arc file?

An `.arc` file is a **creative journey with a machine-readable lifecycle**. It uses YAML frontmatter for structured metadata and markdown body for the creative content itself. Unlike plain `.md`, the frontmatter follows a strict schema that tools and agents use to understand *where you are in the creative process* and *what kind of help you need*.

The file extension is not cosmetic. It signals:
1. **To agents**: "Parse my frontmatter. My `arc_phase` tells you how to help me."
2. **To tools**: "Validate my schema. Enforce my lifecycle transitions."
3. **To humans**: "This is a living creative work, not a static document."

## The Arc Lifecycle

Every `.arc` file moves through five phases:

```
potential → manifestation → experience → dissolution → evolved
    ↑                                                      │
    └──────────────────────────────────────────────────────┘
```

| Phase | Creative meaning | Agent behavior | Code meaning |
|-------|-----------------|----------------|--------------|
| `potential` | Raw ideas, sparks, "what if" | Divergent: brainstorm, connect, expand | Spec, design, architecture |
| `manifestation` | Building, writing, making | Generative: draft, implement, produce | Writing code, building features |
| `experience` | Testing, sharing, getting feedback | Critical: review, test, challenge | Testing, staging, user feedback |
| `dissolution` | Reflecting, learning, letting go | Retrospective: summarize, extract, archive | Retrospective, post-mortem |
| `evolved` | Carrying forward what was learned | Synthetic: connect to next arc, seed new work | Next sprint, improved patterns |

### Transition Rules

Not all transitions are valid. The Arc has a direction:

```
VALID:
  potential → manifestation       (start building)
  manifestation → experience      (start testing/sharing)
  experience → dissolution        (start reflecting)
  dissolution → evolved           (extract learnings)
  evolved → potential             (begin new arc)
  any → potential                 (restart/pivot)

INVALID:
  experience → potential          (can't un-test)
  dissolution → manifestation    (can't un-reflect — start new arc instead)
  evolved → manifestation        (must go through potential first)
```

A parser MUST reject invalid transitions and suggest the correct path.

## Schema

### Required Fields

```yaml
---
# Identity
id: string                    # Unique within project scope
type: enum                    # See Type System below

# Lifecycle
arc_phase: enum               # potential | manifestation | experience | dissolution | evolved
created: date                 # ISO 8601

# Creative Context
title: string                 # Human name for this arc
---
```

### Optional Fields

```yaml
---
# Arcanea Alignment (optional but meaningful)
gate: number                  # 1-10, maps to creative maturity / project phase
guardian: string              # Which Guardian energy applies
element: enum                 # fire | water | earth | wind | void

# Relationships
parent: string                # ID of parent arc (for nesting)
children: string[]            # IDs of child arcs
depends_on: string[]          # Arcs that must reach a phase before this one can progress
feeds_into: string[]          # Arcs that this one's learnings seed

# Progress (for trackable arcs)
progress: number              # 0-100, derived or manual
status: enum                  # pending | active | blocked | done | archived

# Collaboration
author: string                # Primary creator
contributors: string[]        # Others involved
assigned_agents: string[]     # AI agents working on this

# Temporal
updated: date
started: date                 # When it entered manifestation
completed: date               # When it entered dissolution
due: date                     # Target date (optional)

# Tagging
tags: string[]
priority: enum                # luminor | archmage | master | mage | apprentice
effort: number                # Story points or hours estimate
---
```

## Type System

The `type` field determines which optional fields are expected and how tools render the arc.

### Creative Types

| Type | Purpose | Key fields |
|------|---------|-----------|
| `story` | Fiction, narrative, lore | characters, setting, conflict, themes |
| `song` | Musical composition | key, bpm, mood, instruments |
| `visual` | Art, design, illustration | medium, palette, dimensions |
| `world` | Worldbuilding document | geography, cultures, rules |
| `idea` | Raw brainstorm or concept | sparks (list of fragments) |

### Technical Types

| Type | Purpose | Key fields |
|------|---------|-----------|
| `feature` | Software feature arc | spec, tasks (inline), acceptance_criteria |
| `bug` | Bug investigation arc | symptoms, root_cause, fix |
| `spike` | Research/exploration | question, findings, recommendation |
| `refactor` | Code improvement arc | before_state, after_state, risk |

### Meta Types

| Type | Purpose | Key fields |
|------|---------|-----------|
| `project` | Container for other arcs | milestones, team, links |
| `milestone` | Collection of arcs toward a goal | tasks, target, exit_criteria |
| `sprint` | Time-boxed arc cycle | capacity, planned_arcs, burndown |
| `retro` | Retrospective document | went_well, improve, actions |

### Custom Types

Any string is valid for `type`. Unknown types get generic handling. This allows the format to grow organically.

## Agent Integration Protocol

### How Agents Read .arc Files

When an agent encounters a `.arc` file (or is asked to work on one), it MUST:

1. **Parse frontmatter** — extract `arc_phase`, `type`, `element`, `gate`, `guardian`
2. **Adjust behavior** based on `arc_phase`:

```
IF arc_phase == "potential":
  - Be generative, divergent, expansive
  - Ask "what if" questions
  - Don't critique structure yet
  - Suggest connections to other arcs
  - Match element energy (void = abstract, fire = passionate, water = flowing)

IF arc_phase == "manifestation":
  - Be productive, focused, constructive
  - Help build, write, code, compose
  - Maintain momentum — don't over-analyze
  - Suggest next concrete step
  - Match element energy (earth = methodical, fire = fast, wind = experimental)

IF arc_phase == "experience":
  - Be critical, honest, testing-focused
  - Find flaws, inconsistencies, gaps
  - Compare against acceptance criteria or artistic intent
  - Suggest improvements with specifics
  - Match element energy (water = empathetic feedback, fire = blunt truth)

IF arc_phase == "dissolution":
  - Be reflective, synthesizing
  - Extract patterns and learnings
  - Connect outcomes to initial intent
  - Identify what to carry forward
  - Match element energy (void = deep reflection, earth = practical takeaways)

IF arc_phase == "evolved":
  - Be forward-looking, seed-planting
  - Connect learnings to upcoming arcs
  - Suggest what's next based on what was learned
  - Help transition knowledge to new potential
```

3. **Respect the Gate** — higher gates mean more mature work:
   - Gates 1-2 (Foundation/Flow): Basic support, scaffolding, encouragement
   - Gates 3-4 (Fire/Heart): Challenge the creator, push for quality
   - Gates 5-6 (Voice/Sight): Focus on authenticity and vision
   - Gates 7-8 (Crown/Shift): Advanced techniques, perspective shifts
   - Gates 9-10 (Unity/Source): Meta-level guidance, system thinking

4. **Honor the Guardian** — each Guardian brings a different energy:
   - Lyssandria: Practical, grounded, "what's the foundation?"
   - Leyla: Emotional, flowing, "how does this feel?"
   - Draconia: Direct, powerful, "what's the core truth?"
   - Maylinn: Connecting, healing, "who does this serve?"
   - Alera: Expressive, truthful, "what's the authentic voice?"
   - Lyria: Visionary, intuitive, "what do you see?"
   - Aiyami: Enlightening, clarifying, "what's the deeper pattern?"
   - Elara: Shifting, challenging, "what if you looked at it differently?"
   - Ino: Unifying, partnering, "how does this connect to everything else?"
   - Shinkami: Transcendent, meta, "what's the system behind the system?"

### How Agents Write .arc Files

Agents SHOULD create `.arc` files when:
- A user starts a new creative project ("let's write a story about...")
- A coding task begins that has a clear lifecycle
- An idea emerges that deserves tracking

Agents MUST:
- Set `arc_phase: potential` for new arcs
- Never skip phases (no `potential → experience`)
- Update `arc_phase` when the work clearly transitions
- Add `updated` date on every modification

### .arc as Agent Communication

Multiple agents working on the same project can coordinate through `.arc` files:

```yaml
---
id: feature-auth
type: feature
arc_phase: manifestation
assigned_agents: [coder-alpha, tester-beta]
---

# Auth Feature

## Agent Notes

### coder-alpha (2026-02-27)
Upload API wired to Supabase. Moving to experience phase when tester-beta confirms.

### tester-beta (2026-02-27)
Waiting for env vars to be set before I can test. Blocked.
```

The `.arc` file becomes a shared workspace that agents read before acting.

## File Discovery

Tools find `.arc` files by:
1. Globbing `**/*.arc` from project root
2. Optionally reading `.arcanea/projects/index.arc` for a curated list
3. Using `parent`/`children` fields to build a tree

## Rendering

### Terminal
`.arc` files render as enhanced markdown with a status header:

```
┌─ feature-auth.arc ──────────────────────────┐
│ Phase: ◉ Manifestation  Gate: 1 Foundation   │
│ Guardian: Lyssandria     Element: Earth       │
│ Progress: ████████████░░░░░░░░ 60%           │
└──────────────────────────────────────────────┘

# Auth Feature
...
```

### Web
`.arc` files render with Gate progress rings, Guardian avatars, and phase-specific styling (potential = ethereal/translucent, manifestation = solid/glowing, etc.)

### VS Code Extension (future)
- Syntax highlighting for `.arc` frontmatter
- Phase indicator in gutter
- Schema validation with red squiggles
- "Advance Phase" command in command palette
- Gate progress ring in editor title bar

## Why Not Just .md?

1. **Schema enforcement** — a `.md` file with wrong YAML is still valid markdown. A `.arc` file with wrong YAML is invalid and tools reject it.
2. **Agent behavior switching** — agents treat `.arc` differently than `.md`. The extension is the signal.
3. **Lifecycle transitions** — `.md` has no lifecycle. `.arc` has enforced phase transitions.
4. **Discovery** — `**/*.arc` finds creative arcs. `**/*.md` finds everything.
5. **Ecosystem** — VS Code, GitHub Actions, web renderers, CLI tools all key on the extension.

The extension earns its name when tools treat it differently. This spec defines how.
