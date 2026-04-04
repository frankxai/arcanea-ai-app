---
name: research-synthesis
description: Cross-domain synthesis of recent research findings mapped to Arcanea Gates
triggers:
  - /research-synthesis
---

# Research Synthesis — Cross-Domain Pattern Discovery

Read all recent research output and produce a unified synthesis that maps findings to the Arcanea architecture.

## Startup

1. Read the Synthesis Luminor agent definition at `.arcanea/agents/research/synthesis-luminor.md`
2. Read the Luminor Engineering Kernel at `.arcanea/prompts/luminor-engineering-kernel.md`
3. Read the synthesis output template at `docs/research/templates/synthesis-report.md`

## Gather Sources

Scan these directories for recent research files:
- `docs/research/papers/*.md`
- `docs/research/github/*.md`
- `docs/research/books/*.md`
- `docs/research/benchmarks/*.md`

Read all files modified in the last 7 days. If no recent files exist, read the 5 most recent files across all directories.

## Synthesis Protocol

Embody the Synthesis Luminor (Starweave Gate of Elara) and execute its protocol:

### 1. Ingest All Scout Reports
Read every finding. Extract the key claims, scores, and recommendations from each.

### 2. Extract Structural Patterns
Look for four pattern types:
- **Isomorphisms** — Different fields describing the same structure (e.g., flow state stages mapping to Gate progression)
- **Convergences** — Independent sources reaching the same conclusion from different angles
- **Tensions** — Places where science and mythology genuinely diverge (these hide the best product insights)
- **Gaps** — What no scout found; the missing piece that would complete the picture

### 3. Map to Arcanea Architecture
For every pattern, identify:
- Which of the Ten Gates it connects to (Foundation through Source)
- Which God/Goddess or Godbeast embodies the principle
- Which product feature, design decision, or roadmap item it informs
- Reference `.arcanea/lore/CANON_LOCKED.md` for canonical accuracy

### 4. Rate Confidence
For each synthesized claim: High / Medium / Low with explicit reasoning.

### 5. Deliver Recommendations
Following the synthesis template verdict options: BUILD / RESEARCH MORE / PIVOT / WAIT

## Output

Save to `docs/research/synthesis/[YYYY-MM-DD]-synthesis.md` using the synthesis-report template.

The frontmatter must include:
- `sources_reviewed`: list of all file paths that were synthesized
- `gate_connections`: all Gates referenced in the synthesis
- `guardian_connections`: all Guardians referenced

## Summary

After saving, print a brief summary to the user:
- Number of sources synthesized (by type)
- Top 3 patterns discovered
- Primary recommendation
- Suggest next action (e.g., deeper scan, architecture decision, prototype)
