# Lore + Living Lore QA

Date: 2026-03-28
Owner: Codex
Scope: `/lore`, `/living-lore`, and related shared content/components only

## Navigation consistency

- Result: the repo already uses one global navbar and one global footer through [`apps/web/app/layout.tsx`](/C:/Users/frank/Arcanea/apps/web/app/layout.tsx).
- Result: [`apps/web/app/lore/layout.tsx`](/C:/Users/frank/Arcanea/apps/web/app/lore/layout.tsx) does not inject a separate navbar or footer.
- Result: [`apps/web/app/living-lore/layout.tsx`](/C:/Users/frank/Arcanea/apps/web/app/living-lore/layout.tsx) does not inject a separate navbar or footer.
- Conclusion: no nested lore-only shell exists in the current repo snapshot. The visible inconsistency was content-level, not a second app layout.

## Living Lore route check

### `/living-lore`

- Status: renders real content.
- Evidence: hero, crew section, chronicle map, quick access, and CTA all render from live components.
- Boundary status: route-level loading and error boundaries exist and are wired.
- Hydration risk: low from static review; no obvious client boundary mismatch in the route shell.

### `/living-lore/meet`

- Status: renders real interactive onboarding.
- Evidence: uses [`CrewOnboarding`](/C:/Users/frank/Arcanea/apps/web/components/living-lore/crew-onboarding.tsx) and routes into the Chronicle on completion.
- Boundary status: inherits parent loading/error handling.
- Hydration risk: low after fallback-operator repair.

### `/living-lore/chronicle`

- Status: renders real content.
- Evidence: loads acts with fallback to empty array and renders [`ChronicleContent`](/C:/Users/frank/Arcanea/apps/web/app/living-lore/chronicle/chronicle-content.tsx).
- Boundary status: parent loading/error handling applies.
- Hydration risk: low from code review; no shell-only placeholder.

### `/living-lore/encounter`

- Status: route did not exist as a stable landing page before this pass.
- Fix: added [`apps/web/app/living-lore/encounter/page.tsx`](/C:/Users/frank/Arcanea/apps/web/app/living-lore/encounter/page.tsx) with clear guidance into the Chronicle or crew onboarding.
- Result: no dead-end route anymore.

### `/living-lore/book`

- Status: renders real content backed by the book markdown source.
- Evidence: reads book metadata and chapters from the living-lore manuscript directory and renders chapter links.
- Boundary status: parent loading/error handling applies.
- Risk: depends on book source files remaining present in the expected relative path.

## Lore Hz verification

- `/lore/guardians`: kept Hz visible and added explicit Hz display in guardian cards.
- `/lore/gates`: kept Hz visible and added explicit Hz display in gate cards.
- `/lore` overview: removed Hz from overview preview cards and marketing copy.
- Canonical Hz set verified in code:
  - 174
  - 285
  - 396
  - 417
  - 528
  - 639
  - 741
  - 852
  - 963
  - 1111
- Crown Gate check: 741 Hz remains correct. No 714 override introduced in this pass.

## Lore content quality

- Fixed visible encoding artifacts in scoped lore/living-lore files touched during this pass.
- Fixed overview copy so it no longer markets the Hz ladder on `/lore`.
- No canonical-name contradiction introduced in the touched files.

## Verification

- Recommended command set for this slice:
  - `pnpm --dir apps/web exec eslint app/lore app/living-lore components/lore components/living-lore`
  - `pnpm --dir apps/web build`
- Note: this QA pass was executed under a protected scope that excludes chat, imagine, homepage, middleware, and API routes.
