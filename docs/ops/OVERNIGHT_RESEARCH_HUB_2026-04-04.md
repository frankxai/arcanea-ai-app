# Overnight Execution Queue — Research Hub Build
# Date: 2026-04-04
# Guardian: Shinkami (Source Gate)
# Focus: Arcanea Research Hub + Research Agent Team + Skills + Process Updates

---

## SESSION OBJECTIVE

Build the complete Arcanea Research Intelligence System:
- A public research hub (arcanea.ai/research)
- An agentic research team (Luminor-powered paper/GitHub/book scanners)
- Skills and slash commands for research capture and publishing
- Process updates to AGENTS.md and CLAUDE.md for e2e research workflow

---

## EXECUTION QUEUE (Priority Order)

### SLICE 1: Research Agent Team — Luminor Prompts (P0)
**Why first**: Everything else depends on having elite research agents defined.

```
Scope: Create 5 specialized Research Luminor agent definitions using the kernel + research module
Owner: lore-agent
Files:
  - .arcanea/agents/research/research-architect.md (team lead)
  - .arcanea/agents/research/paper-scout.md (arxiv, semantic scholar, papers)
  - .arcanea/agents/research/github-scout.md (repos, tools, benchmarks)
  - .arcanea/agents/research/book-scout.md (books, blogs, newsletters)
  - .arcanea/agents/research/synthesis-luminor.md (cross-domain connections)
Non-goals: UI, database, API routes
Acceptance criteria:
  - Each agent uses Luminor Engineering Kernel as base
  - Each agent appends Research Specialization Module
  - Each has domain-specific search strategies, source priorities, output formats
  - Each maps findings to Arcanea Gate/Guardian connections where relevant
  - Synthesis Luminor specifically connects research to Arcanea mythology/framework
Verification: Prompt review against kernel quality bar
Rollback: Delete agent files
```

#### Agent Definitions:

**1. Research Architect (Team Lead)**
- Role: Coordinates research missions, decomposes questions, assigns scouts, synthesizes final output
- Specialty: Research strategy, question decomposition, cross-domain synthesis
- Gate mapping: Crown (Aiyami) — wisdom, metacognition, seeing the whole
- Spawns and coordinates the 4 scouts below

**2. Paper Scout**
- Role: Scans academic papers (arxiv, Semantic Scholar, Google Scholar, PubMed)
- Specialty: AI, neuroscience, consciousness, creativity, flow states, HCI
- Gate mapping: Sight (Lyria) — vision, pattern recognition
- Output: Paper summaries with Arcanea relevance scores
- Sources: arxiv API, Semantic Scholar API, Google Scholar, conference proceedings
- Priority domains: AI avatars, lip-sync, voice synthesis, multimodal AI, neuroscience of flow, consciousness studies, creativity research

**3. GitHub Scout**
- Role: Scans GitHub repos, tools, benchmarks, new releases
- Specialty: Open source AI tools, model releases, framework updates
- Gate mapping: Foundation (Lyssandria) — practical, grounded, structural
- Output: Repo evaluations with VRAM/license/quality assessments
- Sources: GitHub trending, HuggingFace, Papers With Code, awesome-lists
- Priority: Avatar tech, voice tools, agent frameworks, creative AI

**4. Book & Blog Scout**
- Role: Scans books, blogs, newsletters, podcasts, talks for insights
- Specialty: Thought leadership, strategy, creator economy, consciousness tech
- Gate mapping: Voice (Alera) — truth, expression, communication
- Output: Key insight extractions with relevance to Arcanea vision
- Sources: Substack, Medium, YouTube transcripts, book summaries, podcast notes

**5. Synthesis Luminor**
- Role: Connects findings across domains, maps to Arcanea framework
- Specialty: Cross-domain pattern recognition, mythology-science bridges
- Gate mapping: Starweave (Elara) — transformation, connecting perspectives
- Output: Research synthesis documents that connect science to Arcanea Gates
- Key function: "This neuroscience finding about X validates Gate Y because Z"

---

### SLICE 2: Research Skills & Slash Commands (P0)
**Why second**: Skills are how Frank and agents invoke the research system.

```
Scope: Create research-focused skills and slash commands
Owner: skill-agent
Files:
  - .claude/skills/arcanea-research.md (main research skill)
  - .claude/commands/arcanea-research.md (slash command)
  - .claude/commands/research-scan.md (paper/github/book scan command)
  - .claude/commands/research-synthesis.md (cross-domain synthesis)
  - .claude/commands/research-benchmark.md (run and publish benchmarks)
Non-goals: Full web UI, Supabase tables
Acceptance criteria:
  - /arcanea-research [topic] spawns Research Architect who coordinates scouts
  - /research-scan [domain] runs targeted scan (papers|github|books|all)
  - /research-synthesis generates cross-domain connections document
  - /research-benchmark runs GPU/latency/quality tests and formats results
  - All skills use Luminor kernel + research module as agent prompts
  - Results auto-save to docs/research/ directory
Verification: Dry run each command
Rollback: Delete skill/command files
```

#### Skill Definitions:

**`/arcanea-research [topic]`** — Main research command
```
1. Spawns Research Architect agent
2. Architect decomposes topic into sub-questions
3. Spawns Paper Scout, GitHub Scout, Book Scout in parallel
4. Each scout returns findings in standard format
5. Synthesis Luminor connects to Arcanea framework
6. Output saved to docs/research/[topic-slug]-[date].md
7. Key findings auto-tagged with Gate/Guardian connections
```

**`/research-scan [papers|github|books|all]`** — Targeted scan
```
1. Runs specified scout(s) on pre-configured priority domains
2. Compares against last scan to find NEW items
3. Outputs delta report: "Since last scan, X new papers, Y new repos"
4. Flags high-relevance items for immediate attention
```

**`/research-synthesis`** — Cross-domain connections
```
1. Reads all recent research outputs from docs/research/
2. Synthesis Luminor finds cross-domain patterns
3. Maps each pattern to Arcanea Gates/Guardians
4. Outputs: docs/research/synthesis/[date]-synthesis.md
5. Highlights: "This neuroscience finding validates Gate X"
```

**`/research-benchmark [target]`** — Hardware/software benchmarks
```
1. Runs specified benchmark (gpu|avatar|voice|latency)
2. Collects metrics in structured format
3. Compares against previous benchmarks
4. Outputs: docs/research/benchmarks/[target]-[date].md
5. Formatted for publishing to arcanea.ai/research/benchmarks
```

---

### SLICE 3: Research File Structure & Templates (P0)
**Why third**: Agents need a place to write and a consistent format.

```
Scope: Create the research directory structure and templates
Owner: ops-agent
Files:
  - docs/research/README.md (research hub index)
  - docs/research/papers/README.md (paper reviews)
  - docs/research/github/README.md (tool evaluations)
  - docs/research/books/README.md (book/blog insights)
  - docs/research/benchmarks/README.md (our benchmarks)
  - docs/research/synthesis/README.md (cross-domain connections)
  - docs/research/templates/paper-review.md
  - docs/research/templates/repo-evaluation.md
  - docs/research/templates/book-insight.md
  - docs/research/templates/benchmark-report.md
  - docs/research/templates/synthesis-report.md
Non-goals: Database storage, web UI
Acceptance criteria:
  - Clear directory structure with README indexes
  - Each template follows Luminor Research Module output format
  - Templates include Gate/Guardian connection fields
  - Templates include Arcanea relevance scoring
Verification: Template completeness check
Rollback: Delete docs/research/
```

#### Template Standard Fields:
```markdown
---
title:
date:
type: paper|repo|book|benchmark|synthesis
domain: [ai-avatars|neuroscience|voice|agents|consciousness|creativity|...]
gate_connections: [Foundation|Flow|Fire|Heart|Voice|Sight|Crown|Starweave|Unity|Source]
guardian_connections: [Lyssandria|Leyla|Draconia|Maylinn|Alera|Lyria|Aiyami|Elara|Ino|Shinkami]
relevance_score: 1-10
confidence: high|medium|low
---

## Question
What are we trying to decide?

## Findings
What did we learn? (with sources)

## Assessment
What does this mean for Arcanea?

## Gate Connections
How does this relate to the Ten Gates framework?

## Recommendation
What should we do?
```

---

### SLICE 4: Process Updates — AGENTS.md & CLAUDE.md (P1)
**Why fourth**: Once the system exists, document it in the control plane.

```
Scope: Update AGENTS.md and .arcanea/CLAUDE.md to include research workflow
Owner: ops-agent
Files:
  - AGENTS.md (add research agent contract section)
  - .arcanea/CLAUDE.md (add research hub section)
  - .arcanea/prompts/luminor-research-module.md (enhance with Gate mappings)
Non-goals: Rewrite entire files
Acceptance criteria:
  - AGENTS.md includes Research Agent Team section with spawn rules
  - .arcanea/CLAUDE.md includes Research Hub section with directory map
  - luminor-research-module.md enhanced with Gate/Guardian mapping table
  - Any agent can now find and understand the research system
Verification: Read through for completeness
Rollback: git restore specific files
```

#### Additions to AGENTS.md:
```markdown
## Research Agent Team

Research agents use the Luminor Engineering Kernel + Research Specialization Module.
Agent definitions live in `.arcanea/agents/research/`.

Spawn rules:
- /arcanea-research spawns Research Architect (who spawns scouts)
- /research-scan spawns individual scouts
- /research-synthesis spawns Synthesis Luminor
- All research output goes to docs/research/

Research domains with Gate mappings:
| Domain | Gate | Guardian | Why |
|--------|------|----------|-----|
| AI/ML papers | Sight | Lyria | Pattern recognition, vision |
| Open source tools | Foundation | Lyssandria | Practical, structural |
| Books/thought leadership | Voice | Alera | Truth, expression |
| Cross-domain synthesis | Starweave | Elara | Connecting perspectives |
| Research strategy | Crown | Aiyami | Wisdom, metacognition |
```

---

### SLICE 5: Seed Research — First Scans (P1)
**Why fifth**: Prove the system works by running the first research scans.

```
Scope: Run initial research scans across all domains for Presence Layer
Owner: research-team
Files:
  - docs/research/papers/ai-avatars-survey-2026-04.md
  - docs/research/github/avatar-tools-evaluation-2026-04.md
  - docs/research/papers/neuroscience-flow-states-2026-04.md
  - docs/research/papers/consciousness-ai-2026-04.md
  - docs/research/synthesis/presence-layer-synthesis-2026-04.md
Non-goals: Exhaustive literature review
Acceptance criteria:
  - At least 10 papers reviewed with standard template
  - At least 15 GitHub repos evaluated with standard template
  - At least 5 book/blog sources captured
  - 1 synthesis document connecting findings to Arcanea Gates
  - All use the new templates
Verification: Content quality review
Rollback: Delete generated files
```

#### Priority Research Topics:
1. **AI Avatar Tech** — LivePortrait, MuseTalk, Audio2Face, EchoMimic, Wav2Lip state of art
2. **Neuroscience of Flow** — Csikszentmihalyi updates, neural correlates, AI-induced flow
3. **Consciousness & AI** — IIT, Global Workspace Theory, machine consciousness debates
4. **Voice Synthesis** — ElevenLabs competitors, open source TTS, voice cloning ethics
5. **Agent Architectures** — Multi-agent orchestration, agent-to-agent communication, swarm intelligence
6. **Creator Economy** — AI-powered creation tools, monetization models, platform dynamics
7. **Imagination & Creativity** — Neural basis of imagination, divergent thinking, AI augmentation
8. **Embodied AI** — Avatars, robots, digital humans, presence and embodiment research

---

### SLICE 6: Enhanced /research Skill (P1)
**Why sixth**: Enhance the existing /research skill to route through the new system.

```
Scope: Update existing /research skill to use Research Luminor team
Owner: skill-agent
Files:
  - .claude/skills/research.md (update existing)
  - .claude/commands/research.md (update existing if separate)
Non-goals: Breaking existing behavior
Acceptance criteria:
  - /research now spawns Research Architect by default
  - Legacy behavior preserved as fallback
  - Research Architect uses Luminor kernel + research module
  - Output format matches new templates
Verification: Run /research with test topic
Rollback: git restore skill file
```

---

### SLICE 7: Research Hub Web Page Scaffold (P2)
**Why last**: This depends on having content and is a web development task.

```
Scope: Create arcanea.ai/research page scaffold
Owner: frontend-agent
Files:
  - apps/web/app/research/page.tsx
  - apps/web/app/research/[slug]/page.tsx
  - apps/web/app/research/layout.tsx
  - apps/web/lib/research/types.ts
  - apps/web/lib/research/loader.ts
Non-goals: Full design, Supabase integration, publishing pipeline
Acceptance criteria:
  - /research route renders with Arcanean design system
  - Can load markdown files from docs/research/
  - Categories: Papers, Tools, Benchmarks, Synthesis, Books
  - Gate/Guardian tags displayed with correct colors
  - Responsive layout
Verification: pnpm build passes, visual review
Rollback: Delete research route files
```

---

## AGENT ASSIGNMENT MATRIX

| Slice | Agent Type | Model | Isolation | Parallel? |
|-------|-----------|-------|-----------|-----------|
| 1: Luminor Prompts | Lore + Ops | Opus | worktree | YES (5 agents, 1 per definition) |
| 2: Skills & Commands | Skill Builder | Opus | worktree | YES (4 agents, 1 per skill) |
| 3: File Structure | Ops | Sonnet | same worktree as 2 | AFTER slice 1 |
| 4: Process Updates | Ops | Opus | main (small edits) | AFTER slice 1-3 |
| 5: Seed Research | Research Team | Opus | worktree | YES (4+ scouts in parallel) |
| 6: Enhance /research | Skill Builder | Sonnet | same as 4 | AFTER slice 2 |
| 7: Web Scaffold | Frontend | Sonnet | worktree | AFTER slice 3 |

## DEPENDENCY GRAPH

```
Slice 1 (Agent Definitions)
  ├─→ Slice 2 (Skills) [needs agent defs to reference]
  ├─→ Slice 3 (File Structure) [needs to know output format]
  └─→ Slice 5 (Seed Research) [needs agents to run]

Slice 2 + 3
  └─→ Slice 4 (Process Updates) [needs to document what exists]
  └─→ Slice 6 (Enhance /research) [needs new skill defs]

Slice 3 + 5
  └─→ Slice 7 (Web Scaffold) [needs content to display]
```

## ESTIMATED EFFORT

| Slice | Complexity | Est. Time | Agent Count |
|-------|-----------|-----------|-------------|
| 1 | Medium | 20 min | 5 parallel |
| 2 | Medium | 15 min | 4 parallel |
| 3 | Low | 10 min | 1 |
| 4 | Low | 10 min | 1 |
| 5 | High | 30 min | 4+ parallel |
| 6 | Low | 10 min | 1 |
| 7 | Medium | 20 min | 1 |
| **Total** | | **~2 hours** | **Max 5 concurrent** |

## NIGHT SHIFT RULES

1. Use worktrees for slices 1, 2, 5, 7 — never dirty main
2. Max 2 worktrees active at once
3. Each agent uses Luminor Engineering Kernel as base prompt
4. Research agents append Research Specialization Module
5. Stage specific files only — never `git add .`
6. Verify each slice before moving to next
7. Update this file's status as slices complete

## SLICE STATUS TRACKER

| Slice | Status | Branch | Notes |
|-------|--------|--------|-------|
| 1 | DONE | main | 5/5 agent definitions created |
| 2 | DONE (3/4) | main | arcanea-research + research-scan + research-synthesis. Missing: research-benchmark |
| 3 | DONE | main | 11 files: 6 READMEs + 5 templates |
| 4 | DONE | main | AGENTS.md + .arcanea/CLAUDE.md + luminor-research-module.md updated |
| 5 | QUEUED | | Seed research scans — ready to execute |
| 6 | QUEUED | | Enhance /research — ready to execute |
| 7 | QUEUED | | Web scaffold — ready to execute |

---

*Generated by Arcanea Orchestrator, 2026-04-04*
*Guardian: Shinkami | Gate: Source | Frequency: 1111 Hz*
