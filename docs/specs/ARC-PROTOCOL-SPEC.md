# Arc Protocol Specification v1.0

> *"Every creation has an arc. Every arc has a genome. Every genome can be read by any intelligence."*

## Overview

The Arc Protocol defines two file formats for tracking the lifecycle of AI-human co-creations:

- **`.arc`** — The creation genome. Tracks a creation's full journey from potential to evolved potential.
- **`.nea`** — The value crystallization. Proof of creative achievement, portable and composable.

Both formats use YAML with optional markdown body. They are human-readable, git-diffable, agent-readable, and model-agnostic.

## The Arc Cycle

Every creation moves through five stages:

```
potential → manifestation → experience → dissolution → evolved
  (spark)    (made real)    (shared)    (reflected on)  (new seed)
```

## .arc File Format

### Required Fields

```yaml
arc: "1.0"                    # Protocol version
id: "arc_<nanoid>"            # Unique identifier
type: character               # See Type enum below
stage: manifestation          # Current arc stage
created: "2026-03-17T10:00Z"  # ISO 8601
creator: "frankx"             # Creator identifier
```

### Type Enum

`character` | `world` | `location` | `creature` | `artifact` | `scene` | `story` | `image` | `music` | `video` | `code` | `agent` | `system` | `collection`

### Stage Enum

`potential` | `manifestation` | `experience` | `dissolution` | `evolved`

### APL Block (Optional)

```yaml
apl:
  spark: "A warrior whose armor is covered in children's handprints"
  palette: forge
  palette_secondary: null
  sharpen:
    - clean fantasy armor
    - battle pose
    - symmetrical composition
```

### History Block (Optional)

```yaml
history:
  - stage: potential
    at: "2026-03-17T10:00Z"
    input: "Create a fire warrior"
    model: null

  - stage: manifestation
    at: "2026-03-17T10:05Z"
    input: "SPARK: A warrior whose armor is covered in children's handprints..."
    model: "grok-imagine"
    output: "images/forge-guardian-v1.webp"
    output_hash: "sha256:a1b2c3..."
    quality: 87
```

### Bonds Block (Optional)

```yaml
bonds:
  - target: "arc_8k2m1p"
    relation: inhabits        # See Relation enum
    note: "Lives in this world"

  - target: "arc_3n5j7w"
    relation: soundtrack
```

#### Relation Enum

`inhabits` | `creates` | `opposes` | `evolves_from` | `soundtrack` | `illustrates` | `teaches` | `forks` | `collection_of` | `inspired_by`

### Agent Block (Optional)

```yaml
agent:
  context: "This character guards the Fire Gate."
  instructions: "When continuing this creation, maintain the forge palette."
  next_step: "Write the scene where she returns from battle"
  constraints:
    - "Never resolve her moral ambiguity"
    - "The handprints are from specific children she knows by name"
```

### Provenance Block (Optional)

```yaml
provenance:
  models_used:
    - id: "grok-imagine"
      role: "image generation"
    - id: "claude-opus-4.6"
      role: "narrative development"
  license: "CC-BY-4.0"
  chain: null                 # On-chain reference (future)
```

### Tags and Metadata

```yaml
tags: [fire, guardian, warrior, forge-palette]
gate: 3                       # Arcanea gate (1-10, optional)
element: fire                 # Arcanea element (optional)
```

### Markdown Body

After the YAML frontmatter, an .arc file can contain a markdown body with extended notes, drafts, or documentation:

```markdown
---
arc: "1.0"
id: arc_7f3k9x
type: character
stage: manifestation
...
---

# Extended Notes

The handprint detail came from watching my daughter press her palm
against the window when I left for work. That gesture — small hand,
big trust — became the emotional core of this character.

## Draft Fragments

"She counted them sometimes, on nights when the fire wouldn't sleep..."
```

## .nea File Format

### Required Fields

```yaml
nea: "1.0"
id: "nea_9p2k4m"
type: badge                   # badge | certificate | collectible | license
name: "Fire Gate Opened"
```

### Criteria Block

```yaml
criteria:
  description: "Created 10 works using the Forge palette"
  arcs_required: 10
  palette: forge
  min_quality: 70
  gate: 3
```

### Holder Block

```yaml
holder:
  id: "frankx"
  earned: "2026-03-17T14:00Z"
  arcs:                       # The arcs that earned this
    - arc_7f3k9x
    - arc_2m4n8p
```

### Grants Block (Optional)

```yaml
grants:
  - feature: "forge_palette_advanced"
  - feature: "luminor_forge_access"
  - unlock: "Gate 3 courses"
```

## Complete Example

```yaml
---
arc: "1.0"
id: arc_demo_lonely_king
type: character
stage: experience
created: "2026-03-17T10:00Z"
creator: frankx

apl:
  spark: "A king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine"
  palette: tide
  sharpen:
    - noble king mourning nobly
    - dramatic monologue about loss
    - resolution where he learns to move on

history:
  - stage: potential
    at: "2026-03-17T10:00Z"
    input: "Write a story about a lonely king"
    model: null

  - stage: manifestation
    at: "2026-03-17T10:02Z"
    input: "SPARK: A king who eats dinner alone..."
    model: claude-opus-4.6
    quality: 92

  - stage: experience
    at: "2026-03-17T12:00Z"
    shared: true
    views: 340
    reactions: 42
    forks: 3

bonds:
  - target: arc_tide_kingdom
    relation: inhabits
  - target: arc_queens_lament
    relation: soundtrack

agent:
  context: "This king is pathetic and knows it. He pours the wine anyway."
  next_step: "Write from the servant's perspective — what does she think watching this every night?"
  constraints:
    - "He never speaks to the empty chair"
    - "The wine is always the same vintage — her favorite"

provenance:
  models_used:
    - id: claude-opus-4.6
      role: narrative
  license: CC-BY-4.0

tags: [character, king, grief, tide-palette, royalty]
gate: 2
element: water
---

# The Lonely King — Development Notes

The wine detail is what makes this work. Not that he sets a place —
that's expected grief. That he pours the wine — that's the specific,
irrational, human detail that makes it real.
```

## Agent Integration

### Reading an .arc file (Claude Code / OpenCode / Cursor)

Any AI coding agent can read an .arc file and continue the creation:

1. Parse the YAML frontmatter
2. Load the `apl` block as creative constraints
3. Read the `agent` block for context and next steps
4. Check `bonds` for related creations to load as context
5. Continue the creation respecting the palette and sharpen constraints

### CLI Usage

```bash
# Create a new arc
arc init --type character --palette forge

# Advance the stage
arc stage manifestation --model claude-opus-4.6

# Bond two arcs
arc bond arc_7f3k9x --to arc_8k2m1p --relation inhabits

# Search arcs
arc search --palette tide --stage manifestation

# Export for sharing
arc export arc_7f3k9x --format json

# View the creation graph
arc graph --root arc_7f3k9x
```

## Design Principles

1. **Human-readable first** — YAML + markdown, not binary
2. **Git-native** — every arc change is a diffable commit
3. **Agent-agnostic** — works with Claude, GPT, Gemini, any AI
4. **Model-agnostic** — tracks which model was used, doesn't require any specific one
5. **Composable** — arcs bond to form graphs, .nea references .arc
6. **Progressive** — start with just `type` and `spark`, add complexity as needed
7. **Provenance-native** — who made what, with which AI, always tracked
