# Chat Archive Routing Guide

Where extracted ideas from the claude.ai export go, once `process_export.py` has produced
`markdown/<YYYY-MM>/*.md` and `triage/INDEX.md`.

This isn't a new decision — it's `REPO_PLACEMENT.md` (repo root, authored 2026-05-22)
applied to chat-derived content specifically.

| Content type | Destination | Why |
|---|---|---|
| Canon facts (factions, magic systems, characters, timeline) | `.arcanea/lore/` (already has `CANON_LOCKED.md`, `FACTIONS.md`, `STELLARIS.md`, etc.) | Shared intelligence substrate, nested — not a separate repo per `REPO_PLACEMENT.md` table |
| Story/prose drafts tied to a specific book collection | `book/<collection-slug>/` (17 collections exist, e.g. `chronicles-of-arcanea`, `starbound`, `void-ascending`) | Part of the monorepo, no separate repo per book |
| New collection ideas that don't fit an existing book/ slug | `.arcanea/lore/canon-drift/` first, promote to `book/` once canon-locked | `canon-drift/` exists for exactly this staging purpose |
| Skill/agent/prompt-system ideas (APL, Luminor skill patterns, agent definitions) | `oss/` (staged) → extracts to top-level `arcanea` repo per Q1 of the decision tree | Ships publicly under `github.com/frankxai/arcanea`, npm `arcanea` package — separate release cadence, separate audience |
| Product/engineering ideas (features, architecture, growth) | `docs/`, `AGENTS.md`, `planning-with-files/` | Operational, not narrative |
| Strategy / business / brand ideas | `.arcanea/strategy/`, `.arcanea/voice/` | Existing substrate folders |
| Anything genuinely undecided | `triage/INDEX.md` stays the parking lot — leave unrouted rather than guess wrong | Cheaper to re-triage later than to pollute canon with a bad guess |

## Open gap worth closing

`arcanea-ecosystem/repos.json` describes `github.com/frankxai/arcanea` as "Main Arcanea
platform and control plane" (branch `integration/agent-control-plane-unification`).
`arcanea-ai-app/oss/README.md` describes what's staged for that same repo as a public
npm package (`arcanea`) — a skill/agent/prompt system for AI coding tools ("Transform
any AI coding tool into a creation machine"), not a control plane.

Those are two different products claiming the same repo. Before more chat-derived
ideas get routed into `oss/`, resolve which one `github.com/frankxai/arcanea` actually
is — or split them (e.g. control plane stays `arcanea`, skill product ships as
`arcanea-skills` or similar, matching the `arcanea-skills-opensource/` folder name
already sitting in this monorepo).

## Never route to `oss/` or any public repo

Anything from `.arcanea/lore/CANON_LOCKED.md`, `FLAGSHIP_TEAM.md`,
`STARLIGHT_CORPS_CODEX.md`, character bibles, or unreleased book chapters. That's the
IP moat. Public surface = the *system* for creating (APL, skills, agent patterns), not
the *output* (the actual Arcanea universe canon).
