---
name: research-scan
description: Run targeted scout scans across papers, GitHub repos, or books
triggers:
  - /research-scan
---

# Research Scan — Targeted Domain Intelligence

Scan domain from args: `$ARGUMENTS`

Run one or more research scouts against their priority domains. Usage: `/research-scan [papers|github|books|all]`

## Startup

1. Read the Luminor Engineering Kernel at `.arcanea/prompts/luminor-engineering-kernel.md`
2. Read the Research Specialization Module at `.arcanea/prompts/luminor-research-module.md`
3. Determine which domain(s) the user requested. Default to `all` if no argument given.

## Scout Configurations

### papers — Paper Scout
- Agent definition: `.arcanea/agents/research/paper-scout.md`
- Output template: `docs/research/templates/paper-review.md`
- Output directory: `docs/research/papers/`
- Priority domains:
  - AI avatars and digital embodiment
  - Neuroscience of flow states and creativity
  - Consciousness and AI alignment
  - Voice synthesis and speech generation
  - Agent architectures and multi-agent coordination

### github — GitHub Scout
- Agent definition: `.arcanea/agents/research/github-scout.md`
- Output template: `docs/research/templates/repo-evaluation.md`
- Output directory: `docs/research/github/`
- Priority domains:
  - Avatar technology (talking head, face generation)
  - Voice tools (TTS, STT, voice cloning)
  - Agent frameworks (orchestration, swarms, tool-use)
  - Creative AI (image gen, music gen, story gen)
  - Lip-sync and audio-driven animation

### books — Book Scout
- Agent definition: `.arcanea/agents/research/book-scout.md`
- Output template: `docs/research/templates/book-insight.md`
- Output directory: `docs/research/books/`
- Priority domains:
  - Creator economy and platform strategy
  - AI-human collaboration and co-creation
  - Consciousness technology and contemplative practice
  - World-building and narrative design systems
  - Community governance and collective intelligence

## Execution

### Single Domain
If the user specified `papers`, `github`, or `books`:
1. Read the corresponding agent definition
2. Spawn one background agent with the scout's identity, priority domains, and output template
3. The scout searches its priority domains, scores each finding 1-10, and saves results using the template
4. Filename format: `[YYYY-MM-DD]-[slug].md`

### All Domains
If the user specified `all` or gave no argument:
1. Spawn all three scouts in parallel as background agents
2. Each scout runs independently against its own priority domains
3. After all scouts complete, summarize findings with a count per domain and flag HIGH RELEVANCE items

## Relevance Scoring

| Score | Label | Action |
|-------|-------|--------|
| 9-10 | CRITICAL | Immediate attention — may change architecture |
| 7-8 | HIGH | Flag for next planning session |
| 5-6 | MODERATE | Log and monitor |
| 1-4 | LOW | Archive, reference only |

Flag any finding with score >= 8 at the top of the summary with the tag `[HIGH RELEVANCE]`.

## Post-Scan

After scan completes, print a summary table:

```
## Scan Results — [date]
| Domain | Findings | High Relevance | Top Finding |
|--------|----------|----------------|-------------|
| papers | N | N | [title] |
| github | N | N | [title] |
| books  | N | N | [title] |
```

Suggest running `/research-synthesis` if findings span multiple domains.
