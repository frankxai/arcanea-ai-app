# Arcanea Durable Workflow Readiness Packet

Generated: 2026-07-05T06:16:23.884Z
Decision: runtime-blocked-packet-ready
Implementation ready: false
Runtime code allowed: false

## Current Checks

- WARN workflow-dependency-present: Workflow dependency is not installed; do not write Vercel Workflow runtime code yet.
- WARN workflow-docs-present: Workflow bundled docs are absent; read installed docs before writing workflow code.
- WARN eve-dependency-present: Eve dependency is not installed; do not write Eve runtime code yet.
- WARN eve-docs-present: Eve bundled docs are absent; read installed Eve docs before writing Eve code.
- PASS genesis-proof-run-specified: Durable Genesis proof workflow candidate and safety boundaries are specified.
- PASS genesis-workflow-contract-ready: Dependency-free Genesis proof workflow contract and redaction test are present.

## Target Workflow

Name: genesisProofRun
Type: Vercel Workflow first, Eve internal operator second

Contract files:
- apps/web/lib/genesis/workflow-contract.ts
- apps/web/lib/genesis/__tests__/workflow-contract.test.ts

Files:
- apps/web/lib/workflows/genesis-proof-run.ts
- apps/web/app/api/genesis/workflow/route.ts
- apps/web/lib/workflows/__tests__/genesis-proof-run.test.ts

Steps:
- intake: receive intent, drift face, mission lane, source route
- gift: generate bounded Gift Object and persist step output
- world_seed: generate laws, characters, visual DNA, first proof
- right_use_review: check source, commercial, and canon boundaries
- artifact_export: produce Markdown/JSON export packet
- metrics: emit safe activation events without prompt text

## Next Actions

### install-workflow-docs-first

Command: `pnpm add workflow --filter @arcanea/web`
Approval required: true

Evidence:
- package manifest and lockfile intentionally updated
- node_modules/workflow/docs/README.md read before writing code

### read-installed-workflow-docs

Command: `Get-Content -Raw node_modules/workflow/docs/README.md`
Approval required: false

Evidence:
- Relevant Workflow setup/start/step/test docs summarized in planning-with-files

### install-or-scaffold-eve-docs-before-eve-code

Command: `pnpm add eve --filter @arcanea/web`
Approval required: true

Evidence:
- node_modules/eve/docs/README.md read before writing Eve instructions/tools/schedules

### implement-genesis-proof-run-only-after-docs

Command: `Create the firstImplementationFiles listed in targetWorkflow`
Approval required: false

Evidence:
- workflow integration test passes
- no raw prompt or provider secret in workflow payload
- release-readiness gate still passes non-Vercel internal checks

## Guardrails

- Do not write Eve runtime code until node_modules/eve/docs/README.md has been read.
- Do not write Vercel Workflow runtime code until the installed workflow docs have been read.
- Do not add package dependencies inside the God Mode release slice unless Frank explicitly approves the dependency change.
- Do not send raw prompts, API keys, wallet addresses, transaction hashes, or generated proof bodies through workflow metrics.
- Keep Eve as an internal/operator lane until process, secrets, persistence, and deployment boundary are explicit.

## Sources

- Vercel Workflows install and TypeScript durable workflow directives: https://vercel.com/docs/workflows
- Vercel Workflow concepts and use step directive: https://vercel.com/docs/workflows/concepts
- Eve skill source-of-truth rule: C:/Users/frank/.agents/skills/eve/SKILL.md
