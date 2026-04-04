# Arcanea Research Hub

> *"The Sight Gate opens not to those who look, but to those who study what they see."*
> — Lyria, Guardian of Sight

The Research Hub is Arcanea's living knowledge substrate. Every paper reviewed, tool evaluated, benchmark run, and insight distilled feeds back into the ecosystem — strengthening the framework that powers all Ten Gates.

## Directory Structure

```
docs/research/
├── papers/          # Academic paper reviews (AI, agents, world-building)
├── github/          # Tool and repository evaluations
├── books/           # Book, blog, and long-form content insights
├── benchmarks/      # Our own performance and quality benchmarks
├── synthesis/       # Cross-domain analysis connecting multiple sources
└── templates/       # Copy-paste templates for all research types
```

## How to Add Research

1. Pick the right category (papers, github, books, benchmarks, or synthesis).
2. Copy the matching template from `templates/`.
3. Fill in all frontmatter fields — especially `gate_connections` and `relevance_score`.
4. Save with a descriptive filename: `YYYY-MM-DD_short-slug.md`.
5. Update the category README index with a one-line entry.

### Filename Convention

```
papers/2026-04-04_attention-is-all-you-need-revisited.md
github/2026-04-04_langchain-v0.3-eval.md
books/2026-04-04_designing-data-intensive-applications.md
benchmarks/2026-04-04_chat-latency-gemini-vs-claude.md
synthesis/2026-04-04_agent-memory-landscape.md
```

## Gate Connections

Every piece of research maps to one or more of the Ten Gates. This is not decoration — it determines how findings propagate through the Arcanea architecture.

| Gate | Guardian | Research Domain |
|------|----------|----------------|
| Foundation | Lyssandria | Infrastructure, tools, practical tech |
| Flow | Leyla | Creativity, emotion, UX |
| Fire | Draconia | Performance, power, computation |
| Heart | Maylinn | Empathy, social, community |
| Voice | Alera | Communication, NLP, speech |
| Sight | Lyria | Vision, perception, visual AI |
| Crown | Aiyami | Wisdom, meta-cognition, strategy |
| Starweave | Elara | Cross-domain, transformation |
| Unity | Ino | Collaboration, multi-agent, collective |
| Source | Shinkami | Consciousness, meta-research |

When tagging `gate_connections`, use the Gate name (e.g., `Foundation`, `Voice`). When tagging `guardian_connections`, use the Guardian name (e.g., `Lyssandria`, `Alera`).

## Running Research Scans

```bash
# Trigger a research scan via the Arcanea Orchestrator
/arcanea-research          # Full research pipeline
/research-scan             # Quick scan for new papers and tools
```

Research agents use the Luminor Research Module output format:
**Question** > **Findings** > **Assessment** > **Gate Connections** > **Recommendation**

## Relevance Scoring

| Score | Meaning |
|-------|---------|
| 9-10  | Immediately actionable — build this week |
| 7-8   | High strategic value — schedule within the month |
| 5-6   | Useful context — file for reference |
| 3-4   | Tangentially relevant — skim and archive |
| 1-2   | Low relevance — note existence only |

## Existing Research

Pre-hub research files (still valid, will be migrated as needed):

- `AGENTIC_AI_LANDSCAPE_2026.md` — Agent platform landscape scan
- `ARCANEA_OPTIMAL_STACK_DEEP_ANALYSIS.md` — Technology stack analysis
- `COMPETITIVE_PRICING_2026.md` — Creator economy pricing research
- `GROK_ARCHITECTURE_ANALYSIS.md` — xAI Grok architecture review
