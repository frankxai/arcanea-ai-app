# Grimoire generation containment — 18 October 2026

Owner: existing #655 metered-execution repair; #642 retains creator-journey acceptance and #511 retains billing.
Source base: e522758481404ec95f53cd35241c09545d070b8c. Receiving main was8942f25d at pickup; this is not receiving-main or production acceptance.

## Decision and availability
The existing Grimoire ingress reaches the legacy orchestrator/executor without actor-bound reservation or a cumulative cost cap. Caller tier selects4/8/13 section plans; missing declared-provider credentials fall through to another provider. Temporarily return uniform503 before body reads or generation imports. This deliberately removes managed Grimoire generation availability; it does not implement qualified billing, successful generation, durable recovery or customer acceptance. Existing source libraries remain unchanged. Do not enable via an environment flag alone.

## Task contract
Scope: generate/route.ts and adjacent generate-containment* native fixtures only. No UI, lore, pricing, database, provider, credentials or production changes.
Acceptance: zero request-property reads, dependency imports, SDK calls or network attempts for disabled/unset flags, forged actor/reservation, premium escalation, malformed/oversized/aborted bodies and missing declared provider.
Rollback: revert the containment source commit through normal review; no history rewrite. Reopening this ingress requires actor/tenant-bound admission, atomic reservation/settlement, explicit model/cumulative caps and independent release gates first.

## Reproducible offline proof
Run Node24 (the.nvmrc pin):
```sh
node --test apps/web/lib/agents/grimoire/__tests__/generate-containment.test.mjs
```
Fourteen containment tests run with child-process synthetic environments. Host keys are never forwarded. Outbound fetch is replaced by a denying recorder. SDK/provider, catalog/gateway data and formatting/safeguard leaves are fixtures; actual route, orchestrator and executor source is not rewritten in the baseline.

Optional pinned baseline control: in a separate checkout of the source base, set GRIMOIRE_BASELINE_WEB_ROOT to its absolute apps/web directory while running the same test command from the candidate. Three exact Git blobs are checked before baseline controls: route9df64f787d33cb18a92637171996e08da7726c90, orchestrator9ebe6f45cb454ff19ebbaa83d23449aad00f5381, executor29dd2a76610203a1a7a9c41d6cace8162c348bec. Five additional controls record4/8/13 synthetic SDK calls,8192output-token request caps and premium→Google fallthrough. No live provider, auth, DB, Redis or SDK transport is exercised.

## Verification and remaining gates
Original13 containment cases failed before repair. Current14containment+5pinned baseline controls pass locally. Independent source review must bind exact final bytes separately; passing fixtures do not satisfy different-provider approval.
Full app build was attempted from the bounded fixture and reports missing package manifest/dependency checkout; it did not run. Standalone TypeScript compiler is unavailable. The unchanged estate-guard scanner checked12bounded fixture files, reporting0critical/high/medium and1low (CSP configuration absent from the partial fixture); this is not an estate-wide scan or a real-app CSP finding. Full lint/typecheck/build, estate-wide scan, hosted checks, receiving-main conflict resolution, required separate-provider review, preview and exact production acceptance remain held. No production deployment or source-mirror transfer is authorized by this record. Production acceptance is outside this fixture.
