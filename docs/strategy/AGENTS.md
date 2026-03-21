# Repository Guidelines

## Project Structure & Module Organization
Arcanea is a Turbo + pnpm workspace.
- `apps/web`: primary Next.js app.
- `apps/premium-web`: premium web frontend package.
- `packages/*`: shared libraries and product modules (for example `ai-core`, `ai-provider`, `arcanea-mcp`, `swarm-coordinator`).
- `tests/`: Python/integration test suites.
- `docs/`, `assets/`, `public/`, `scripts/`: documentation, static assets, public files, and automation scripts.

Prefer adding new product logic in `packages/` and wiring it into apps rather than duplicating code per app.

## Build, Test, and Development Commands
Use Node `>=20.9.0` and pnpm `>=8`.
- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run all workspace dev tasks through Turbo.
- `pnpm dev:web`: run only the web app pipeline.
- `pnpm build`: build all packages/apps (`turbo run build`).
- `pnpm lint`: run lint tasks across the workspace.
- `pnpm type-check`: run TypeScript checks.
- `pnpm test`: run workspace test tasks.
- `pnpm test:quick`: run fast Node test subsets in key packages.
- `pytest`: run Python tests using `pytest.ini` settings.

## Coding Style & Naming Conventions
- Follow `.editorconfig`: spaces, 2-space indent by default, 4 for Python, LF endings.
- Use TypeScript for packages/apps; keep strict, explicit types on public APIs.
- Formatting: `pnpm format` (Prettier); verify with `pnpm format:check`.
- Naming:
  - React components: `PascalCase.tsx`
  - utilities/hooks: `camelCase.ts` (hooks as `useX.ts`)
  - tests: `*.test.mjs`, `*.spec.js`, or `test_*.py` by framework.

## Testing Guidelines
- JavaScript package tests commonly use Node’s built-in runner (`node --test`).
- Jest is configured for unit/integration JS tests with global coverage thresholds (lines/statements 80%, functions/branches 70%).
- Cypress specs live under `src/__tests__/cypress/**`.
- Pytest enforces markers and minimum 70% coverage (`--cov-fail-under=70`).

Run targeted tests before PRs (for example `pnpm test:quick` and affected package/app tests).

## Commit & Pull Request Guidelines
- Use Conventional Commits with scope when useful: `feat(web): ...`, `fix(ai-core): ...`, `docs: ...`.
- Branch naming: `feature/...`, `fix/...`, `docs/...`.
- PRs should include:
  - clear summary and rationale,
  - linked issue(s),
  - test evidence (commands run),
  - screenshots/video for UI changes,
  - docs updates when behavior or APIs change.
