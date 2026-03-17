---
arc: "1.0"
id: "arc_lonely_king"
type: "character"
stage: "experience"
created: "2026-03-14T10:00:00Z"
creator: "frankx"

apl:
  spark: "A king who eats dinner alone and sets a place for his dead wife every night — including pouring her wine"
  palette: "tide"
  sharpen:
    - "noble king mourning nobly"
    - "dramatic monologue about loss"
    - "resolution where he learns to move on"

history:
  - stage: "potential"
    at: "2026-03-14T10:00:00Z"
    input: "Write a story about a lonely king"

  - stage: "manifestation"
    at: "2026-03-14T10:05:00Z"
    input: "SPARK: A king who eats dinner alone and sets a place for his dead wife..."
    model: "claude-opus-4.6"
    quality: 92

  - stage: "experience"
    at: "2026-03-15T12:00:00Z"
    note: "Published in APL showcase — used as primary before/after example"

bonds:
  - target: "arc_queens_lament"
    relation: "soundtrack"
    note: "The music that plays during the dinner scene"
  - target: "arc_tide_kingdom"
    relation: "inhabits"

agent:
  context: "This king is pathetic and he knows it. He pours the wine anyway. The detail that makes it work is the POURING — not just setting a place, but actively filling the glass of someone who will never drink it."
  next_step: "Write from the servant's perspective — what does she think watching this ritual every night for years?"
  constraints:
    - "He never speaks to the empty chair"
    - "The wine is always the same vintage — her favorite, a Tide Valley red"
    - "The servants have stopped finding it sad — it is simply what happens at 7pm"

provenance:
  models_used:
    - id: "claude-opus-4.6"
      role: "narrative development"
  license: "CC-BY-4.0"

tags:
  - "character"
  - "king"
  - "grief"
  - "tide-palette"
  - "royalty"
  - "apl-showcase"
gate: 2
element: "water"
---

# The Lonely King — Development Notes

The wine detail is what makes this work. Not that he sets a place — that's expected grief.
That he pours the wine — that's the specific, irrational, human detail that makes it real.

## Why This Arc Matters

This was the first APL example that proved SPARK.SHAPE.SHARPEN works. The generic prompt
("Write a story about a lonely king") produces forgettable medieval sadness. The sparked
version produces something that makes people stop scrolling.

The TIDE palette (silver, echo, rain) gives it the sensory world it needs.
The SHARPEN (not noble, not dramatic, not resolved) forces the AI past its defaults.

## Servant's Perspective (Next Arc)

She has been watching for three years. She no longer pities him. She no longer finds it
romantic. She finds it... precise. Every night at exactly 7pm, the same vintage, the same
glass, the same chair angle. She has started to wonder if this is how love actually works —
not grand gestures, but small rituals repeated until they become architecture.
