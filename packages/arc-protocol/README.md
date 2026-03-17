# @arcanea/arc

The Arc Protocol -- a creation genome format for tracking AI-human co-creation.

## The Problem

Every AI generation is a throwaway. You prompt, you get output, it vanishes into your chat history. There is no standard way to track what was created, how it evolved, which models shaped it, or how creations connect to each other.

The Arc Protocol fixes this. Every creation gets a `.arc` file -- a lightweight YAML+markdown document that records its full lifecycle, from first spark to evolved form.

## The Five Stages

Every creation follows The Arc:

```
Potential --> Manifestation --> Experience --> Dissolution --> Evolved Potential
  (spark)      (generated)       (shared)      (reflected)     (new seed)
```

The cycle repeats. An evolved creation becomes the potential for something new.

## Install

```bash
npm install @arcanea/arc
```

## Quick Start

```typescript
import {
  createArc, advanceStage, bond,
  toAgentContext, serialize, parse, validate,
} from '@arcanea/arc';

// 1. Create an arc
const arc = createArc({
  type: 'character',
  creator: 'your-username',
  spark: 'A king who eats dinner alone and sets a place for his dead wife every night',
  palette: 'tide',
  sharpen: ['noble king mourning nobly', 'dramatic monologue about loss'],
});

// 2. Advance through the lifecycle
const manifested = advanceStage(arc, {
  at: new Date().toISOString(),
  model: 'claude-opus-4.6',
  quality: 92,
  note: 'Generated full story with the wine-pouring detail',
});

// 3. Bond creations together
const bonded = bond(manifested, {
  target: 'arc_queens_lament',
  relation: 'soundtrack',
  note: 'The music that plays during the dinner scene',
});

// 4. Generate context for any AI agent
const context = toAgentContext(bonded);
// => [ARC CONTEXT -- character: arc_x8k2m9n1]
//    Stage: manifestation
//    SPARK: A king who eats dinner alone...
//    PALETTE: TIDE
//    SHARPEN: NOT noble king mourning nobly. NOT dramatic monologue about loss

// 5. Save as a .arc file
const fileContent = serialize(bonded);
// => ---
//    arc: "1.0"
//    id: "arc_x8k2m9n1"
//    type: "character"
//    ...
//    ---

// 6. Parse a .arc file back
const restored = parse(fileContent);

// 7. Validate
const result = validate(restored);
// => { valid: true, errors: [], warnings: [] }
```

## The .arc File Format

A `.arc` file is YAML frontmatter + optional markdown body:

```yaml
---
arc: "1.0"
id: "arc_lonely_king"
type: "character"
stage: "experience"
created: "2026-03-14T10:00:00Z"
creator: "frankx"

apl:
  spark: "A king who eats dinner alone and sets a place for his dead wife every night"
  palette: "tide"
  sharpen:
    - "noble king mourning nobly"
    - "dramatic monologue about loss"

history:
  - stage: "potential"
    at: "2026-03-14T10:00:00Z"
    input: "Write a story about a lonely king"
  - stage: "manifestation"
    at: "2026-03-14T10:05:00Z"
    model: "claude-opus-4.6"
    quality: 92

bonds:
  - target: "arc_queens_lament"
    relation: "soundtrack"

agent:
  context: "The detail that makes it work is the POURING -- not just setting a place, but filling the glass"
  next_step: "Write from the servant's perspective"
  constraints:
    - "He never speaks to the empty chair"
    - "The wine is always the same vintage"

tags:
  - "character"
  - "grief"
gate: 2
element: "water"
---

# Development Notes

The wine detail is what makes this work. Not that he sets a place -- that's expected grief.
That he pours the wine -- that's the specific, irrational, human detail that makes it real.
```

## API Reference

### `createArc(options): Arc`

Create a new arc in the `potential` stage.

```typescript
createArc({
  type: 'character',     // Required: ArcType
  creator: 'username',   // Required: who created this
  spark: 'A dragon...',  // Optional: the creative seed (APL)
  palette: 'forge',      // Optional: tonal palette
  sharpen: ['generic'],  // Optional: what to avoid
  tags: ['fantasy'],     // Optional: metadata tags
  gate: 3,               // Optional: 1-10 (Arcanea gate)
  element: 'fire',       // Optional: elemental alignment
})
```

### `advanceStage(arc, entry): Arc`

Move an arc to the next lifecycle stage. Returns a new arc (immutable).

Cycle: `potential` -> `manifestation` -> `experience` -> `dissolution` -> `evolved` -> `potential` (repeats)

```typescript
advanceStage(arc, {
  at: new Date().toISOString(),  // Required: timestamp
  model: 'claude-opus-4.6',     // Optional: AI model used
  input: 'the prompt',          // Optional: what was asked
  output: 'path/to/file',       // Optional: what was produced
  output_hash: 'sha256...',     // Optional: content hash
  quality: 85,                  // Optional: 0-100 score
  note: 'human note',           // Optional: annotation
})
```

### `bond(arc, bond): Arc`

Connect two arcs with a typed relationship. Prevents duplicates.

```typescript
bond(arc, {
  target: 'arc_other_id',   // Required: target arc ID
  relation: 'inhabits',     // Required: relationship type
  note: 'context',          // Optional: why this bond exists
})
```

**Relation types:** `inhabits`, `creates`, `opposes`, `evolves_from`, `soundtrack`, `illustrates`, `teaches`, `forks`, `collection_of`, `inspired_by`

### `toAgentContext(arc): string`

Generate a prompt-ready context block from an arc. Any AI agent can use this to continue the creation with full awareness of what came before.

### `serialize(arc): string`

Convert an arc to a `.arc` file string (YAML frontmatter + markdown body).

### `parse(content): Arc`

Parse a `.arc` file string back into an Arc object. Throws if no valid frontmatter found.

### `validate(arc): ValidationResult`

Validate an arc object. Returns `{ valid, errors, warnings }`.

### `createId(prefix?): string`

Generate a unique ID with `arc_` or `nea_` prefix.

## Types

```typescript
// 14 creation types
type ArcType =
  | 'character' | 'world' | 'location' | 'creature' | 'artifact'
  | 'scene' | 'story' | 'image' | 'music' | 'video'
  | 'code' | 'agent' | 'system' | 'collection';

// 5 lifecycle stages
type ArcStage = 'potential' | 'manifestation' | 'experience' | 'dissolution' | 'evolved';

// 10 relationship types
type Relation =
  | 'inhabits' | 'creates' | 'opposes' | 'evolves_from'
  | 'soundtrack' | 'illustrates' | 'teaches' | 'forks'
  | 'collection_of' | 'inspired_by';

// 5 tonal palettes (from APL)
type Palette = 'forge' | 'tide' | 'root' | 'drift' | 'void';
```

## All Exports

```typescript
// Functions
export { createArc, createId, advanceStage, bond, toAgentContext, serialize, parse, validate };

// Types
export type {
  Arc, ArcType, ArcStage, ArcAPL, ArcHistoryEntry, ArcBond,
  ArcAgent, ArcProvenance, Palette, Relation,
  Nea, NeaType,
  CreateArcOptions, ValidationResult,
};
```

## Zero Dependencies

The Arc Protocol has no runtime dependencies. The YAML serializer is built in and handles the subset of YAML that `.arc` files use. Works in Node.js, browsers, and any JavaScript runtime.

## Part of Arcanea

The Arc Protocol is the creation genome format for [Arcanea](https://arcanea.ai) -- the creative multiverse where creators chat with AI, build worlds, and share what they make.

The five stages of The Arc (Potential -> Manifestation -> Experience -> Dissolution -> Evolved Potential) mirror the fundamental creative cycle. Every creation in the Arcanea ecosystem carries an `.arc` file as its DNA.

Read the full specification at [arcanea.ai](https://arcanea.ai).
