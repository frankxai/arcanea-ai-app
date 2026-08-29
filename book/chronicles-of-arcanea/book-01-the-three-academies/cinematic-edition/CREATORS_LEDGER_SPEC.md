---
title: Creator's Ledger product and provenance specification
edition: book-01-cinematic
visibility: private-production
status: working-spec
---

# Creator's Ledger

The Creator's Ledger is a secondary benefit for paid readers who want to understand how the edition was made. It must never interrupt the story, replace craft with novelty, expose protected reasoning or private infrastructure, or imply that tool disclosure makes weak fiction valuable.

## Product position

Primary promise: an excellent finished story and cinematic reading experience.

Secondary promise: an unusually honest, useful record of the human decisions, sources, tools, prompts, revisions, and rights behind that finished edition.

The public sales page may mention the Ledger once in the edition contents. It does not lead the hero, book description, chapter opening, or checkout copy.

## Access boundary

- Book landing page: a short sample showing the categories of information recorded.
- Free chapters: optional compact “making this edition” note after Chapter 4, collapsed by default.
- Paid edition: chapter-level ledger entries and edition-wide production notes.
- Production team: private packets with internal paths, full review notes, and operational metadata.

Public and paid views never reveal chain-of-thought, hidden system instructions, private filesystem paths, credentials, private messages, unpublished personal data, or third-party prompt text without permission.

## Edition-level record

- Story premise, reader promise, governing question, and approved positioning.
- Canon sources and the boundary between locked, staging, and legacy material.
- Legacy manuscript lineage and a plain-language account of what was retained, transformed, or rejected.
- Editorial roles, their responsibilities, and verdict dates.
- Model, tool, and named workflow versions used materially in the released edition.
- Cover and art direction brief, identity sheets, generation/edit history, provenance, rights, and crop approvals.
- Accessibility, performance, device, and release checks.
- Material changes after publication with version date and reason.

## Chapter-level record

Each entry should answer five reader questions in plain language:

1. What human story decision shaped this chapter?
2. Which canon and source materials were actually consulted?
3. Where did generative tools contribute materially?
4. What did editors change or reject, and why?
5. What art and rights record belongs to the chapter?

### Public schema

| Field | Purpose |
|---|---|
| Chapter / edition revision | Connect the record to released text |
| Human decisions | Preserve authorship and intentionality |
| Sources consulted | Make lineage inspectable |
| Models and material roles | State what generated, analyzed, or critiqued |
| Owned prompt summary | Explain the task without leaking protected reasoning |
| Skills and workflows | Name material orchestration methods |
| Editorial interventions | Show what judgment changed the work |
| Rejected directions | Demonstrate selection without publishing unusable drafts |
| Art provenance | Connect final plates to prompt, model, edits, rights, and identity lock |
| Known limits | Admit uncertainty, staging lore, or unresolved provenance |

## Prompt disclosure policy

Publish an owned, reader-safe task prompt or faithful prompt summary only when Arcanea has the right to disclose it. A useful disclosure includes role, objective, relevant supplied context, constraints, requested output, and model/version.

Do not publish:

- system or developer instructions supplied by a platform;
- hidden reasoning, scratch work, chain-of-thought, or internal deliberation;
- secrets, tokens, customer data, private paths, or infrastructure details;
- verbatim third-party prompts, manuscripts, or proprietary evaluation sets;
- raw outputs that were rejected for quality, safety, privacy, or rights concerns unless a short transformed excerpt is necessary to explain an editorial decision.

## Model contribution vocabulary

Use precise labels rather than “AI-made” or “human-made”:

- **Generated:** produced a draft passage, prompt, or image candidate.
- **Expanded:** developed an approved human beat into alternatives.
- **Analyzed:** inspected continuity, structure, character, originality, or style.
- **Critiqued:** returned a verdict without editing the artifact.
- **Transformed:** revised supplied material under explicit constraints.
- **Selected by editorial team:** human-led or orchestrated judgment chose among candidates.
- **Rejected:** output did not enter the released work.

## Reader interface

- Ledger opens outside the prose rail from a clearly labeled edition menu.
- Default view is a concise timeline of decisions, not a wall of prompts.
- Chapter entries are deep links from the chapter-end apparatus, never overlays inside reading text.
- Filters: Story decisions, Sources, Models and prompts, Editorial changes, Art provenance, Release checks.
- A glossary explains canon status, material contribution, and provenance.
- Mobile uses stacked disclosure cards; desktop may use a two-column decision/source view.
- All evidence remains navigable without animation and with reduced motion.

## Trust rules

- Never claim full transparency when protected or private inputs are intentionally excluded; call it a documented production record.
- Never imply that a model is an author, legal rights holder, conscious collaborator, or source of canon authority.
- Never use model counts, token counts, prompt length, or production time as a proxy for quality.
- Never expose a person's private correspondence or feedback without permission.
- Never publish a model/provider claim unless the recorded run metadata supports it.
- Correct the Ledger when the edition changes; keep prior release records immutable and dated.

## Release gate

The Ledger ships only when its claims reconcile with private chapter packets, model run receipts, source records, and art provenance. Missing evidence is shown as missing, not reconstructed from memory.
