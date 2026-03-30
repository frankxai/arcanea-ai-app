# AI Lab Next Slice Audit

Date: 2026-03-30
Branch: `testing/chat-project-workspaces`

## Current State

The project graph rollout is no longer a concept branch. It now has:
- first-class project tables and graph edges in Supabase migrations
- project-aware chat/session persistence
- project-aware creation and memory provenance
- project workspace APIs
- a `/projects/[id]` workspace page
- trace and enrichment helpers
- focused unit coverage for continuity and graph behavior
- an activation runbook and plan script for the real Supabase apply step

That is enough to call the backend graph architecture real. The next high-value slice is no longer more graph structure. It is end-to-end verification of the user-visible continuity loop.

## Highest-Value Next Slice

Add a browser-level project continuity harness.

Why this is the top slice:
- It verifies the system the way users experience it, not just through unit tests.
- It closes the gap between strong backend architecture and actual interactive behavior.
- It is the first place regressions will show up when UI, local storage, and cloud sync drift.
- It creates a reusable pattern for future flows: projects, studio saves, creations, and memory links.

Why it is not already done:
- `apps/web` currently has no first-class Playwright config or E2E scripts.
- The repo lockfile references Playwright, but the app package does not expose a runnable browser test harness yet.
- Browser testing would need stable selectors or route-level test hooks on the project surfaces.

## Recommended Execution Order

1. Add Playwright scaffolding in `apps/web`.
2. Add one smoke spec for project continuity.
3. Seed or mock the auth/session/project state so the flow can run deterministically.
4. Add one graph/provenance assertion for the workspace page.
5. Keep the test small and stable rather than trying to automate the entire product at once.

## Exact Target Flow

The first browser test should cover:
- create or select a project
- open the project workspace
- verify the project page renders a workspace summary
- verify the active project is reflected in chat state
- verify a saved creation or memory can be associated with the project

## Files That Should Be Touched Next

- `apps/web/playwright.config.ts`
- `apps/web/e2e/project-continuity.spec.ts`
- `apps/web/package.json`
- optional stable selectors in `apps/web/app/projects/[id]/page.tsx` or `apps/web/components/chat/history-sidebar.tsx`

## What Not To Do Yet

- Do not expand into a full browser suite before the first continuity smoke test is green.
- Do not change `/chat`, `/imagine`, homepage, or `middleware.ts` just to make the browser test pass unless a selector is truly impossible without it.
- Do not conflate browser automation with Supabase activation. They are separate gates.

## Secondary Slice After E2E

Once the first browser smoke test is in place, the next highest-value work is:
- observability for project graph enrichment
- graph API hardening
- richer project workspace presentation
- cost/routing policy for the project and save flows

## Bottom Line

The backend graph is now solid enough that the next lab-grade move is not more schema. It is browser-level confidence. That is where the repo will start to feel operationally complete instead of structurally complete.
