# Arc Protocol — Creation Lifecycle Management

Manage .arc creation genome files. Track the full lifecycle of AI-human co-creations.

## Usage

```
/arc [command] [arguments]
```

## Commands

- `/arc init [type]` — Create a new .arc file (character, world, image, music, story, agent, etc.)
- `/arc stage [arc_id]` — Advance an arc to the next lifecycle stage
- `/arc bond [arc_id] [target_id] [relation]` — Link two creations
- `/arc context [arc_id]` — Generate agent-readable context from an arc
- `/arc list` — List all .arc files in the project
- `/arc validate [path]` — Validate an .arc file

## The Arc Cycle

Every creation follows five stages:
1. **Potential** — The spark exists as an idea
2. **Manifestation** — Made real (generated, written, composed)
3. **Experience** — Shared and experienced by others
4. **Dissolution** — Reflected on, deconstructed
5. **Evolved** — Seeds a new creation

## APL Integration

Every .arc file can contain an APL block (SPARK.SHAPE.SHARPEN):
- `spark` — The unique detail that makes this creation yours
- `palette` — Sensory palette (forge/tide/root/drift/void)
- `sharpen` — What it must NOT be

## Agent Context

The `/arc context` command generates a prompt block that any AI agent can use to continue a creation. It includes the spark, palette, constraints, bonds, and next steps.

---

**Command:** $ARGUMENTS

Read the Arc Protocol spec at `docs/specs/ARC-PROTOCOL-SPEC.md` and the library at `packages/arc-protocol/src/`. Execute the requested command. For `init`, create a new .arc file in the current directory. For `context`, output the agent-readable prompt block. For `validate`, check the file against the spec.
