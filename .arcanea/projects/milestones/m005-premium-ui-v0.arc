---
milestone: M005
title: Premium UI Overhaul via v0
guardian: Leyla
gate: Flow
priority: P0
progress: 55%
updated: 2026-03-30
---

# M005: Premium UI Overhaul via v0

## Status: 55%

## Completed Tasks
- [x] v0 Chat generation — Studio UI: `kAvqGXxPRym` (pre-2026-03-01)
- [x] v0 Chat generation — Onboarding: `sOnFGuExkoy` (pre-2026-03-01)
- [x] v0 Chat generation — Gallery: `hJWNhFkicaR` (pre-2026-03-01)
- [x] v0 Chat generation — Settings: `nlNsLw1Dtlz` (pre-2026-03-01)
- [x] v0 Chat generation — Chat: `kWa3haHToWu` (pre-2026-03-01)
- [x] Studio extraction: 8 components (sidebar, right-panel, bottom-bar, 5 tabs) (2026-03-01)
- [x] Gallery extraction: 3 new + 5 existing (masonry, skeletons, gallery-page, data) (2026-03-01)
- [x] Onboarding extraction: 6 components (welcome, step2-5, orchestrator) in components/arcanea/ (2026-03-01)
- [x] Chat extraction: 8 components (page, sidebar, messages, input, guardian-info, empty, types, data) (2026-03-01)
- [x] Settings extraction: sidebar component (2026-03-01)
- [x] All 8 pages upgraded to premium (Studio, Settings, Onboarding, Gallery, Chat, Academy, Community, Pricing) (2026-03-01)
- [x] Academy rewritten: 376 lines, Ten Gates grid, Houses, Ranks (2026-03-01)
- [x] Pricing reviewed: 509 lines, complete (2026-03-01)

## Remaining Tasks
- [ ] Wire Studio v0 UI to Supabase backend (replace mock data)
  - **Blocked by**: M001 auth completion
  - **Owner**: agent (Backend + Frontend)
  - **Estimate**: 4-6 hours
- [ ] Wire Gallery v0 UI to Supabase backend (replace mock data)
  - **Blocked by**: M001 auth completion
  - **Owner**: agent (Backend + Frontend)
  - **Estimate**: 3-4 hours
- [ ] Integrate v0 Settings page to Supabase persistence
  - **Blocked by**: M001 auth completion
  - **Owner**: agent (Backend + Frontend)
  - **Estimate**: 2-3 hours

## Dependencies
- Depends on: M001 (Auth — needed for backend wiring)
- Blocks: M008 (Onboarding uses v0 components)

## Key Files
- `apps/web/components/arcanea/` — v0-extracted onboarding components
- `apps/web/app/studio/` — Studio page
- `apps/web/app/gallery/` — Gallery page
- `apps/web/app/settings/` — Settings page
- `apps/web/app/chat/` — Chat page

## v0 Chat References
| Page | v0 Chat ID | URL |
|------|-----------|-----|
| Studio | kAvqGXxPRym | [v0.app/chat/kAvqGXxPRym](https://v0.app/chat/kAvqGXxPRym) |
| Onboarding | sOnFGuExkoy | [v0.app/chat/sOnFGuExkoy](https://v0.app/chat/sOnFGuExkoy) |
| Gallery | hJWNhFkicaR | [v0.app/chat/hJWNhFkicaR](https://v0.app/chat/hJWNhFkicaR) |
| Settings | nlNsLw1Dtlz | [v0.app/chat/nlNsLw1Dtlz](https://v0.app/chat/nlNsLw1Dtlz) |
| Chat | kWa3haHToWu | [v0.app/chat/kWa3haHToWu](https://v0.app/chat/kWa3haHToWu) |

## Notes
All v0 component extractions are complete and build-verified. The remaining work is connecting these premium UIs to the live Supabase backend, which is blocked on M001 auth dashboard configuration. The visual/UX layer is done; it is purely a data integration task.
