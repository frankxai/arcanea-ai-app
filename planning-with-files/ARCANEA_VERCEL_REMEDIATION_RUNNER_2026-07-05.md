# Arcanea Vercel Remediation Runner

Generated: 2026-07-05T07:01:17.048Z
Decision: dry-run-ready
Mode: dry-run
Non-mutating: true

## Summary

- Checks: 6 pass, 1 warn, 0 blockers
- VERCEL_TOKEN present: no
- Project settings apply requested: no
- Domain apply requested: no
- Remote verify requested: no

## Operations

- PASS patch-project-framework-and-node: dry-run
- PASS attach-production-domain: dry-run

## Checks

- PASS [safety/remediation-packet-loaded] Vercel remediation packet loaded.
- PASS [vercel-release/project-settings-operation-ready] Project framework/node patch operation is defined.
- PASS [vercel-release/domain-operation-ready] Domain attachment operation is defined but requires explicit domain confirmation.
- WARN [safety/vercel-token-present] VERCEL_TOKEN is not present. Dry-run evidence can still be generated.
- PASS [safety/project-confirmation] No remote mutation requested; project confirmation not required.
- PASS [safety/domain-confirmation] Domain attachment not requested.
- PASS [vercel-release/remote-verification] Remote verification not requested.

## Operator Commands

```text
node scripts/arcanea-vercel-remediation-runner.mjs --write --strict
node scripts/arcanea-vercel-remediation-runner.mjs --verify-remote --confirm-project=arcanea-ai-app --write --strict
node scripts/arcanea-vercel-remediation-runner.mjs --apply-project-settings --confirm-project=arcanea-ai-app --write --strict
node scripts/arcanea-vercel-remediation-runner.mjs --apply-domain --confirm-project=arcanea-ai-app --confirm-domain=arcanea.ai --write --strict
```

## Guardrails

- Dry-run mode is the default and performs no remote mutation.
- Remote mutation requires VERCEL_TOKEN in the process environment; token values are never printed.
- Project settings mutation requires --apply-project-settings and --confirm-project=arcanea-ai-app.
- Domain attachment requires --apply-domain, --confirm-project=arcanea-ai-app, and --confirm-domain=arcanea.ai.
- Do not promote production until node scripts/arcanea-release-readiness.mjs --strict exits 0 after connector evidence refresh.
