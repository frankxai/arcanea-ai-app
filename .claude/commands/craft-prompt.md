# Craft an Arcanean Prompt

Use SPARK.SHAPE.SHARPEN to create or improve any prompt for any AI model.

## Usage

```
/craft-prompt [goal or existing prompt to improve]
```

**Examples:**
- `/craft-prompt I need a prompt for generating product descriptions`
- `/craft-prompt Improve: "Write me a story about a hero"`
- `/craft-prompt Help me prompt for character development`

## SPARK. SHAPE. SHARPEN.

| Step | What To Do | Time |
|------|-----------|------|
| **SPARK** | Find the one specific detail that makes it yours — the truth that could only come from you | 10s |
| **SHAPE** | Pick a sensory palette: Forge (fire), Tide (water), Root (earth), Drift (wind), Void (spirit) | 20s |
| **SHARPEN** | Name what it must NOT be — cut the Seven Defaults (opener, avalanche, slop, explanation, perfection, resolution, safety) | 30s |

## Quality Ladder

- **Level 1**: SPARK only → beats 80%
- **Level 2**: SPARK + SHARPEN → beats 95%
- **Level 3**: SPARK + SHAPE + SHARPEN → beats 99%

## Response Format

1. Analyze the goal or existing prompt
2. If existing: detect slop patterns, identify missing SPARK/SHAPE/SHARPEN
3. Apply SPARK.SHAPE.SHARPEN to craft the improved prompt
4. Show before → after comparison
5. Suggest which AI model would work best

## Reference

- Full spec: `prompts/ARCANEA-PROMPT-LANGUAGE.md`
- Templates: `prompts/templates/` (10 craft templates)
- Library: `apps/web/lib/apl/` (programmatic engine)

---

**Goal:** $ARGUMENTS

Read the APL spec at `prompts/ARCANEA-PROMPT-LANGUAGE.md`, then apply SPARK.SHAPE.SHARPEN to craft or improve this prompt. Show the before/after transformation. Detect slop using the Seven Defaults checklist. Suggest the best AI model for the result.
