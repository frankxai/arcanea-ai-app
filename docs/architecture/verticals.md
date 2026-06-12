# Arcanea Verticals

Generated: 2026-06-12
Status: current capability map and buildout contract

## Summary

Arcanea verticals are product domains built on the same OS substrate: projects,
memory, provenance, workflows, agents, and graph context. A vertical should not
fork the operating model; it should add domain-specific workflows and surfaces.

## Vertical Map

| Vertical           | Current Center                            | OS Capabilities Needed                                        |
| :----------------- | :---------------------------------------- | :------------------------------------------------------------ |
| Books              | `book/`, publishing packages, app library | canon, drafts, edits, covers, provenance, print/export        |
| Media              | image/video/audio workflows               | prompts, models, assets, rights, revisions, generation limits |
| Voice              | Jarvis, voice packages, SIS bridge        | live session state, tools, transcription, memory writes       |
| Research           | `docs/research`, research agents          | sources, synthesis, citations, task decomposition             |
| Academy            | learning routes and canon                 | curriculum, progress, assessment, certification               |
| Marketplace        | skills, MCPs, plugins                     | curation, install metadata, runtime adapters                  |
| Community          | creator/social surfaces                   | profiles, sharing, collaboration, moderation                  |
| Developer Platform | packages, MCP, CLI                        | install, docs, examples, tests, release discipline            |

## Build Contract For Each Vertical

Each vertical must define:

- primary user
- core workflow
- data owners
- agent roles
- provenance events
- public/private boundaries
- verification command
- rollback path

## Capability Levels

| Level | Meaning                                               |
| :---- | :---------------------------------------------------- |
| L0    | Concept only                                          |
| L1    | Docs and static content                               |
| L2    | Working UI with local/mock data                       |
| L3    | Persisted workflow with provenance                    |
| L4    | Agent-assisted workflow with memory                   |
| L5    | Repeatable product loop with metrics and distribution |

## 2026 Priority

1. Stabilize main and branch hygiene.
2. Make public README, `llms.txt`, and community files match the real product.
3. Reconcile SIS memory and vault paths.
4. Bring project graph and provenance into the active workspace loop.
5. Build palace rooms only where the backing data and actions are ready.
6. Promote verticals from static pages to OS-backed workflows one at a time.

## Acceptance Criteria

A vertical is top-notch when:

- a creator can start, resume, and finish a meaningful workflow
- agents can inspect and continue the work
- provenance survives export, publishing, or sharing
- memory improves future sessions
- public docs accurately describe what is shipped
