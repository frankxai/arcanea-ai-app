---
title: Knowledge Systems — Collected Templates & Patterns
domain: meta
created: 2026-04-10
updated: 2026-04-10
author: claude
status: growing
links: [knowledge-inventory, agent-protocol, ../business/overview]
---

# Knowledge Systems — Collected Templates & Patterns

What Frank has studied, collected, and built across personal knowledge management. This article synthesizes patterns from the full template library into actionable architecture decisions.

## Systems in the Vault

### 1. Legendary Brain (Frank's Own — Active)
**Notion ID:** 7947ce2d-6865-4d2b-96e7-39738aaa529f

Frank's primary custom personal brain. Not a purchased template — built from scratch and continuously evolved.

**Structure:**
- **Brain Gems** — Idea capture layer with Idea Backlog Funnel DB (collection://e233c01d-6ec7-4cb4-bb38-57599877354f). Synced block from a master capture page.
- **PRAP** — Pre-Release Action Plan (or similar process planning model)
- **Project Hub** — Active project tracking
- **Goals** — Intentions, life goals, question-based goal setting ("How can I live at the ocean every day of my life?")
- **Focus / Questions** — Deep work prompts and life frame questions
- **Archive** — Completed work
- **Areas & Resources** — PARA-adjacent organization
- **Daily Dashboard** — Morning operating view
- **Calendar** — Scheduling layer
- **Content** — Content creation pipeline
- **Quick Links** — Navigation shortcuts
- **Notes** / **Notes to improve** — Capture + refinement

**Key insight:** Frank's system is goal/question-driven, not task-driven. The framing "How can I...?" rather than "Do X" shapes intention vs. execution.

---

### 2. Ultimate Brain for Notion (Thomas J. Frank — Collected, ×3 versions)
**Notion IDs:** 15e26ac2-b7f6-8039, 5160f71b-d7a0-4d59, 15e26ac2-b7f6-8075

Three versions collected (original + copies for study/adaptation).

**Structure:** Full GTD® implementation in Notion. Areas & Resources unified in one DB. Projects can inherit from Goals. Brain → Goals → Projects hierarchy. Plan view, Dashboard, Archive, Process center.

**What Frank uses from it:** The Areas & Resources single-DB pattern (vs. separate tables). The Goals → Projects hierarchy. Quick Links dashboard concept.

---

### 3. Second Brain (PARA — Tiago Forte inspired)
**Notion ID:** ecf31968-3dcc-416b-8aec-5eaa9b7cf88c

Full PARA structure: Projects, Areas, Resources, Archive. Linked views cross-referencing between sections.

**What Frank uses from it:** The four-category ontology for organizing reference material. Resources and Archive sections in the Legendary Brain map to PARA's R+A.

---

### 4. Knowledge Base Templates (×3 collected)
**Notion IDs:** fb2ac6c9, 6b1b93fd, 3d18f076

Three generic KB templates collected for reference. Used as inspiration for the FrankX Knowledge Base DB and the SIS vault structure.

---

### 5. Founder OS (External — Google Drive)
**Source:** matt@herb.co — shared Google Drive template

SOP and systems template for hire/manage/scale. Focus on operational checklists and delegation frameworks. Influences the SOP Library in Health OS and the Agent Protocol in this wiki.

---

### 6. Agentic Creator OS (Frank's Product — GitHub)
**Repo:** frankxai/agentic-creator-os (2★, TypeScript)

Not a knowledge *storage* system but a knowledge *activation* system. 75+ auto-activating domain knowledge modules (skills), 35+ slash commands, 38 agent personas, 5 safety hooks. The key architectural pattern: **knowledge lives in skills files, not in documents** — the AI loads the right knowledge contextually without explicit retrieval.

This is the operative version of the Karpathy LLM Wiki concept applied to executable workflows.

---

### 7. AI Architect Academy (Frank's Product — GitHub)
**Repo:** frankxai/ai-architect-academy (1★, HTML)

The teaching layer of Frank's knowledge. The CLAUDE.md functions as a Socratic instructor kernel. 3 interactive labs, 5 learning paths, 80+ skills. Pattern: **knowledge as curriculum** — structured by learning path, not by topic category.

---

## Pattern Synthesis: What Frank Actually Uses

| Pattern | Source | Frank's Implementation |
|---------|--------|----------------------|
| Goal-question framing | Legendary Brain | "How can I..." goals in Brain, north stars in domain wikis |
| GTD® processing center | TJF Ultimate Brain | Linear for task capture; Legendary Brain's daily dashboard |
| PARA reference organization | Forte / Second Brain | Areas & Resources DB in Legendary Brain |
| Skill-based knowledge activation | ACOS | `.claude/skills/` in Arcanea repo; auto-activating context |
| Curriculum-as-knowledge | AI Architect Academy | Learning paths > topic dumps |
| Idea funnel | Legendary Brain | Idea Backlog Funnel DB (e233c01d) — capture before organize |
| Wiki compounding | Karpathy (adapted) | This wiki — persistent MD files, agent-maintained |
| SOP library | Founder OS / Health OS | Health OS SOP Library (188366c0) |

---

## Architectural Decisions Made (Frank's Brain)

**Decision 1: GTD vs PARA**  
Frank uses GTD® at the task layer (Linear + TJF Ultimate Brain inspiration) and PARA at the reference layer (Areas & Resources). Not either/or — layered.

**Decision 2: Personal vs Team knowledge**  
Legendary Brain = personal (Frank's private thoughts, goals, ideas). Notion Hubs = team/agent-facing (shared context for collaboration). Wiki = agent-maintained (this repo — grows with the system).

**Decision 3: Knowledge activation over retrieval**  
Skills files (`.claude/skills/*.md`) outperform RAG for agent workflows. The AI doesn't search; it loads pre-structured context. This is the Karpathy insight operationalized.

**Decision 4: Idea capture before categorization**  
The Idea Backlog Funnel (Brain Gems section) captures raw ideas without forcing PARA category assignment up front. Triage happens weekly.

---

## Gaps & Open Questions

- [ ] **Legendary Brain → Wiki bridge**: Key insights from Legendary Brain's Brain Gems should flow into relevant wiki articles (decisions, frankx/products, etc.). Not yet automated.
- [ ] **Template graveyard**: 3× collected KB templates, 3× Ultimate Brain copies, Second Brain PARA page — not actively used. Consider archiving or noting which patterns were extracted.
- [ ] **ACOS ↔ Arcanea integration**: agentic-creator-os is a public FrankX product but its skill architecture directly mirrors what's in `.claude/skills/` inside arcanea-ai-app. Relationship needs explicit documentation.
- [ ] **AI Architect Academy ↔ FrankX monetization**: This repo is the content asset backing the Academy course product. Should be mapped in [[frankx/overview]] products section.

---

*Part of the [[meta/agent-protocol]] wiki maintenance system. Updated when new templates are collected or architectural decisions evolve.*
