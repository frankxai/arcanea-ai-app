---
title: Confluence Canon Swarm Handoff
status: ACTIVE
visibility: public
created: 2026-06-25
updated: 2026-06-25
work_item: arcanea-confluence-canon-kb
source_packet:
  - .arcanea/lore/GRAND_CONVERGENCE_CANON.md
  - .arcanea/lore/BENDING_CANON.md
  - .arcanea/lore/CONFLUENCE_CANON.md
  - .arcanea/lore/MAGIC_SYSTEMS_INDEX.md
  - .arcanea/lore/CHARACTER_CORE.md
  - .arcanea/lore/FACTION_COMPACT.md
  - .arcanea/lore/CONTINUITY_ALIAS_LEDGER.md
public_private: public
---

# Confluence Canon Swarm Handoff

Use this handoff for bounded parallel agents. Agents may expand staging docs, produce reports, or propose patches. They must not modify `CANON_LOCKED.md` without explicit Frank approval.

## Shared Rules

- Read `AGENTS.md`, newest `planning-with-files/`, `.arcanea/CLAUDE.md`, `.arcanea/MASTER_PLAN.md`, and `.arcanea/lore/CANON_LOCKED.md` before edits.
- Keep markdown as source of truth. Vectors, indexes, app pages, and world packages are derived.
- Treat `GRAND_CONVERGENCE_CANON.md` as the upstream staging frame for Avatars, bending, Origin Classes, creator philosophy, knowledgebase, product, and story expansion.
- Treat bending as canon and central. De-risk public language by making bending Arcanean through Five Elements, Ten Gates, Prisma, Synthesis, consent, cost, restoration, and Bending Realms.
- Use Arion/Mera forward names in new Confluence work.
- Treat Kael/Mira as migration aliases until a dedicated cast pass.
- Transform inspiration into Arcanea-native mechanics, names, costs, and institutions.
- Do not add new Origin Classes.
- Do not add paid services, model spend, deployments, or always-on workers without a separate cost gate.

## Agent Tasks

| Agent | Inputs | Output | Acceptance |
|---|---|---|---|
| Grand Canon Architect | `GRAND_CONVERGENCE_CANON.md`, `CANON_LOCKED.md`, strategy docs | grand-canon audit and lock proposal | Preserves big vision while separating public claims, staging lore, product architecture, and private strategy |
| Canon Auditor | Confluence packet, `CANON_LOCKED.md`, `CONTINUITY_AUDIT.md` | `docs/research/synthesis/confluence-canon-audit.md` | Lists contradictions, locks, staging risks, and exact fix recommendations |
| Bending Architect | `BENDING_CANON.md`, `MAGIC_SYSTEMS_INDEX.md`, Prism docs, Origin Classes, Materials | expanded bending diagrams or tables | Every bending domain has source, cost, limit, teacher, failure mode, and story pressure |
| Character Forge | `CHARACTER_CORE.md`, Master Series Bible, cast bible | character sheets for Arion, Mera, Emilia, Akamoto | Each sheet includes Character Diamond, desire, wound, vow, limit, first scene |
| Story Weave | Character sheets, Confluence canon, Malachar arc | novella/book outline centered on Arion/Mera/Emilia | No flat chosen-one arc; Malachar argument remains emotionally credible |
| IP/Derivative Risk | Confluence packet, Bending Canon, Prism docs, public copy | de-franchise report | Confirms bending is Arcanean, flags copied mechanics/phrasing/nations/state rules, and proposes original replacements |
| World Repo Ops | Confluence packet, World Repo Standard | proposed `world.arcanea.json` package plan | Does not place manifest in app root unless a separate world repo/package is created |
| Knowledge Indexer | all packet files | chunking/frontmatter plan | Chunks include canon status, visibility, source path, entities, tags, and no private content |
| Design L99 Critic | packet plus any future visual/codex output | design-loop evidence plan | Only needed when a visual/web surface begins |

## First Follow-On Package

Recommended first follow-on artifact:

`docs/research/synthesis/2026-06-25-confluence-canon-kb-audit.md`

It should answer:

1. Which existing files must be updated for Arion/Mera migration?
2. Which bending terms are canonical, which copied mechanics must be de-franchised, and which public phrases best explain Arcanean Bending?
3. Which Confluence claims should stay staging versus become locked proposals?
4. What vector chunk schema should be used?
5. What is the safest first Arcanea.ai codex surface?

## Stop Conditions

Pause and ask Frank before:

- changing `CANON_LOCKED.md`;
- deleting old Kael/Mira material;
- renaming a locked character, God, Godbeast, House, Gate, or Origin Class;
- publishing or deploying a public-facing page;
- creating or funding any new service, vector DB, model router, or always-on worker.
