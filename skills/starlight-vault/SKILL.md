# Starlight Vault — Continuous Learning v1

> *"Every session leaves a Starlight Fragment. Enough fragments form a constellation."*

The Starlight Vault is Arcanea's continuous learning system. It observes your creative patterns,
captures them as **Starlight Fragments** (atomic learned behaviors), and evolves them into
constellations of reusable knowledge.

## Concepts

| Arcanean Term | Technical Term | Description |
|---------------|---------------|-------------|
| **Starlight Fragment** | Instinct | One trigger → one action, confidence-weighted |
| **Constellation** | Evolved Skill | Cluster of related fragments that form a skill |
| **Starlight Vault** | Instinct Store | Per-project + global storage |
| **Fragment Gathering** | Observation | Captured tool use events |
| **Crystallization** | Promotion | Fragment proven across 2+ projects → global |

## Fragment Structure

Fragments are stored as YAML files with frontmatter:

```yaml
---
id: prefer-server-components
trigger: "when creating new React components"
confidence: 0.7
domain: "code-style"
source: "session-observation"
scope: project
project_id: "arcanea-web"
project_name: "Arcanea"
---

# Prefer Server Components

## Action
Use Server Components by default. Only add 'use client' when state or effects are needed.

## Evidence
- Observed 8 instances of server-first pattern
- User corrected client component to server on 2026-03-10
```

## Confidence Scoring

| Observations | Confidence | Level |
|---|---|---|
| 1-2 | 0.3 | Tentative (dim fragment) |
| 3-5 | 0.5 | Moderate (glowing fragment) |
| 6-10 | 0.7 | Strong (bright fragment) |
| 11+ | 0.85 | Very strong (radiant fragment) |

Adjustments:
- +0.05 per confirming observation
- -0.1 per contradicting observation
- -0.02 per week without observation (fade)

## Storage Layout

```
.arcanea/starlight-vault/
  vault.json                    # Registry metadata
  observations.jsonl            # Raw gathered fragments
  fragments/
    personal/                   # Auto-learned from sessions
    inherited/                  # Imported from others
    arcanean/                   # Arcanea-specific defaults
  constellations/
    skills/                     # Evolved into full skills
    commands/                   # Evolved into commands
```

## Commands

- `/instinct-status` — Show all fragments with confidence levels
- `/instinct-export` — Export fragments for sharing
- `/instinct-import` — Import fragments from another vault

## Integration

The Starlight Vault connects to Arcanea's SIS memory layer. Fragments with
confidence >= 0.8 are automatically surfaced in relevant sessions.
