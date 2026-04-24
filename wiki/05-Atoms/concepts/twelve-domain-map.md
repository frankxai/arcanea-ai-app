---
title: Twelve-Domain Map
aliases: [domain map, 12 domains, life operating system]
tags: [atom, concept, meta, brain-atlas]
status: stable
domain: memory
created: 2026-04-21
links:
  - [[../frameworks/karpathy-llm-wiki]]
  - [[../frameworks/para]]
  - [[../../meta/arcanea-brain-atlas-architecture]]
  - [[../../00-MOCs/MOC-Second-Brain]]
  - [[../../00-MOCs/MOC-Patterns]]
---

# Twelve-Domain Map

The canonical life/work ontology for the Arcanea second brain. Twelve domains, each anchored to a brain region, a vault tag, and a primary Luminor. Every atom, project, surface, and Luminor is tagged into **exactly one** primary domain.

## The map

| # | Domain | Tag | Brain anchor | Primary Luminor | Why it matters |
|---|--------|-----|--------------|-----------------|----------------|
| 1 | Creator — expression, craft, aesthetic output | `creator` | left frontal | Syntaxa | The generative surface. If creator output stalls, identity rots. |
| 2 | Business & Career — companies, roles, income engines | `business` | dorsolateral PFC | Kinetix | Where agency buys time. Oracle exit → BV June 1 lives here. |
| 3 | Wealth — capital, portfolio, optionality | `wealth` | ventromedial PFC | Numeros | The compounding substrate. Houseboat, villas, autonomous EV are downstream. |
| 4 | Health — body, energy, longevity | `health` | hypothalamus + cerebellum | Vitalia | The carrier wave. Lumina 100-day streak, gym, cold plunge. |
| 5 | Relationships — family, partners, community | `relationships` | STS + TPJ | Harmonix | The bandwidth of being witnessed. Brother in Croatia hub, global co-creators. |
| 6 | Personal development & skills — growth, practice, identity | `growth` | basal ganglia + hippocampus | Meridian | The feedback loop on self. Journaling, Dispenza meditations. |
| 7 | Agentic systems — Luminors, orchestration, automation | `agents` | premotor + parietal | Lumina (queen) | The army. AMCAS, swarm planner, Council. |
| 8 | Memory & context — vault, notes, second brain | `memory` | hippocampal formation | Mnemosys | The ground truth of self over time. This atom lives here. |
| 9 | Prompt engineering — prompt craft, prompt OS, lineage | `prompts` | Broca + Wernicke | Syntaxa | The new literacy. Prompt OS v1.4.0, Library, DAG. |
| 10 | Software engineering — repos, SDLC/ADLC, shipping | `software` | left parietal + angular gyrus | Chronos | The execution substrate. Every surface is code. |
| 11 | Content · orgs · philanthropy | `purpose` | anterior cingulate | Sophia | The prosocial output. OSS, Atelier, philanthropy vehicles. |
| 12 | Research · frontier · biggest problems | `research` | PFC + default-mode network | Oracle | The horizon. Biotech-superintelligence, AI safety, governance. |

## Rules

- **Exactly one primary domain per atom.** Secondary domain allowed in frontmatter as `secondary_domain: {tag}` but only one primary.
- **Hard cap 12.** If a 13th is proposed, one of these merges or renames.
- **§12 absorbs frontier.** Biotech, climate, AI safety, governance — all nest inside Research.
- **Brain anchors are metaphorical honesty.** They inform visualization, not neuroscience claims.

## Use

- `/harvest` tags every promoted atom with its primary domain.
- `/vault-atlas` computes atom count per domain and flags imbalance (<2 atoms in any domain = warn; 0 for >30d = kill).
- The Brain Atlas (both Cowork artifact and 3D standalone) uses this table as the data model spine.
- MOC-Patterns keeps cluster seeds per domain.

## Counter-Coach objection

> *"Twelve is arbitrary. Real lives don't carve at twelve."*

They don't. But ontologies are tools, not truths. Twelve matches the MOC cap (Rule of 12), matches the six-role Council × two-cycle structure, and fits one screen at any reasonable resolution. Pick a smaller number and you lose granularity; pick a larger one and you lose coherence. Twelve is the compromise that compounds.

## Related
- [[../frameworks/karpathy-llm-wiki]] — atomic shape that lives *inside* a domain
- [[../frameworks/para]] — PARA folders cross-cut domains (a Project can touch any domain)
- [[../../meta/arcanea-brain-atlas-architecture]] — visual realization
