# Alignment Board

## Program
Arcanea deployment stability and execution quality hardening.

## Phase A: Stop Deploy Breaks (active)

- [x] Fix Next.js deploy blocker in `3D-evolution` (`Points` ref typing mismatch).
- [x] Revert unsupported `@splinetool/react-spline` import path causing module export failure.
- [x] Resolve Supabase peer mismatch by updating package constraints + lockfile.
- [ ] Re-run Vercel deploy and confirm zero build-time TypeScript/module errors.

## Phase B: CI/CD Parity (active)

- [x] Move `deploy-apps.yml` to Node 20 + pnpm setup + frozen lockfile.
- [x] Move `mvp-deploy.yml` runtime baseline to Node 20 / pnpm 8.15.0.
- [x] Move `quality-gate.yml` from npm workflow to pnpm workspace workflow.
- [ ] Enforce one canonical required workflow for branch protection.

## Phase C: Code Quality and Slop Reduction (next)

- [ ] Add lint guard to reject new hardcoded raw color values outside token files.
- [ ] Add lint guard for high inline-style density in production components.
- [ ] Burn down known TS failures in v3/studio/gallery surfaces and lock with CI.

## Phase D: Agent Standards Enforcement (next)

- [ ] Add explicit Definition of Done for all agents in AGENTS.md.
- [ ] Require risk + verification + rollback in every PR body.
- [ ] Add ownership map for major domains (web, mcp, infra, design-system).
