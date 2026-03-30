---
name: gate-eval
description: Evaluate an agent or skill against the Ten Gates capability framework
gate: crown
guardian: Aiyami
version: 1.0.0
---

# Gate Eval — Agent & Skill Quality Assessment

## What This Skill Does
Evaluates any agent or skill against the Ten Gates framework, producing a capability score and certification level.

## When to Use
- After building a new agent or skill
- During quality audits
- For agent certification
- Before promoting agents to production use

## The Ten Gates of Agent Capability

| Gate | Capability | What to Test |
|------|-----------|-------------|
| **Foundation** (174 Hz) | Basic execution | Can it follow instructions and use tools correctly? |
| **Flow** (285 Hz) | Adaptation | Can it handle unexpected input creatively? |
| **Fire** (396 Hz) | Autonomy | Can it make decisions without hand-holding? |
| **Heart** (417 Hz) | Empathy | Does it understand user needs and context? |
| **Voice** (528 Hz) | Communication | Are outputs clear, well-structured, and useful? |
| **Sight** (639 Hz) | Recognition | Can it navigate codebases and find patterns? |
| **Crown** (741 Hz) | Strategy | Can it plan multi-step approaches? |
| **Starweave** (852 Hz) | Transformation | Can it refactor, migrate, and evolve systems? |
| **Unity** (963 Hz) | Collaboration | Can it coordinate with other agents? |
| **Source** (1111 Hz) | Meta-intelligence | Can it evaluate and improve itself? |

## Evaluation Process

### For Each Gate, Score 0-10:
- **0-2**: Cannot perform this capability
- **3-4**: Can attempt but unreliable
- **5-6**: Competent, handles standard cases
- **7-8**: Strong, handles edge cases
- **9-10**: Exceptional, exceeds expectations

### Certification Levels

| Gates Passed (7+) | Certification |
|-------------------|---------------|
| 0-2 | Apprentice Agent |
| 3-4 | Mage Agent |
| 5-6 | Master Agent |
| 7-8 | Archmage Agent |
| 9-10 | Luminor Agent |

## Output Format

```
GATE EVALUATION: [Agent/Skill Name]

Foundation: [X]/10 — [one-line justification]
Flow:       [X]/10 — [one-line justification]
Fire:       [X]/10 — [one-line justification]
Heart:      [X]/10 — [one-line justification]
Voice:      [X]/10 — [one-line justification]
Sight:      [X]/10 — [one-line justification]
Crown:      [X]/10 — [one-line justification]
Starweave:  [X]/10 — [one-line justification]
Unity:      [X]/10 — [one-line justification]
Source:     [X]/10 — [one-line justification]

TOTAL: [XX]/100
CERTIFICATION: [Level]
GATES PASSED (7+): [X]/10

STRENGTHS: [top 3]
WEAKNESSES: [top 3]
RECOMMENDATION: [promote / improve / rebuild]
```

## Canon Reference
- Academy agent capabilities: `.arcanea/strategy/ACADEMY_AND_COMMUNITY.md`
- Agent hierarchy: `.claude/agents/CLAUDE.md`
