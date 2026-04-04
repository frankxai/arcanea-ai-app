# Notes, Board, and Capture Backlog — 2026-04-02

## 1. Notes / Docs System

Scope:
- add first-class project-linked notes/docs

Owner:
- next product slice

Files:
- `apps/web/app/projects/**`
- new docs routes and APIs
- project graph services

Non-goals:
- full collaborative editor on day one

Acceptance criteria:
- users can create and edit project docs
- docs are retrievable by project-aware chat
- docs participate in graph context

Verification:
- route tests
- browser flow for create/edit/open doc

## 2. Board MVP

Scope:
- add a lightweight project board surface

Owner:
- next product slice

Files:
- board routes/components
- board persistence tables
- project graph services

Non-goals:
- full Miro clone
- full infinite canvas engine

Acceptance criteria:
- users can place cards, notes, images, and links on a board
- boards are linked to projects
- board state can be retrieved by project-aware workflows

Verification:
- route tests
- browser flow for add/edit/move board item

## 3. Capture / Extension Ingest

Scope:
- import work from other AI tools and the browser into Arcanea projects

Owner:
- extension/capture slice

Files:
- extension repo/surface
- ingest APIs
- project assignment and provenance services

Non-goals:
- perfect cross-site automation on day one

Acceptance criteria:
- users can capture external AI output into a project
- Arcanea stores source and provenance
- imported content is summarized and tagged

Verification:
- ingest API tests
- browser capture smoke flow

## 4. Canvas Decision Revisit

Scope:
- revisit `tldraw` vs first-party board after initial board usage data

Owner:
- product/architecture

Files:
- `planning-with-files/CANVAS_EDITOR_DECISION_2026-04-02.md`

Non-goals:
- premature SDK lock-in

Acceptance criteria:
- decision is revisited with real user/product data
- commercial license cost is compared against product leverage

Verification:
- architecture review
