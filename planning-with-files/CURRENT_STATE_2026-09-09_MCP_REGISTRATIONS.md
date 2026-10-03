# MCP registration modules

Source: Codex task `01a086b7-f24a-7d40-98d3-f94d9f6a2ba9`.
Branch: `codex/arcanea-world-mcp-registrations-20260909`.
Base: formatting preparation `7416194a6d0465dbc71f8e8a369aa96b86dc013c`.

Scope: Extract cohesive MCP registration groups without changing their behavior.
Owner: capability-delivery coordinator, one writer. Files: registration index,
eight registration modules, public-entrypoint regression test and this record.
Non-goals: runtime identity/persistence repair, canon correction, provider execution,
library packaging, dependencies, review policy, installation or publication.

## Implementation and acceptance

Guidance, orchestration, visual style, production planning, resources/prompts and
web-vault tools now have separate registration functions. Shared reference data
and the existing result adapter have explicit modules. Each extracted module is
under 400 lines; the original index falls from 2,483 to 892 lines. The legacy
singleton and its behavior remain unchanged in this preparation.

All 65 original registration calls preserve their TypeScript syntax trees and
registration order. This comparison includes names, schemas, handler expressions,
identifiers and literal values. It does not substitute for independent review.

## Verification

TypeScript compilation and unchanged Prettier checks pass. Real SDK clients see
byte-identical discovery for 54 tools, five resources and six prompts. Reading
every resource and prompt, six successful local tool calls, and two rejected
invalid requests also produce identical results: 91,516 bytes, SHA-256
`d1b7279891784ee6c1dc426c0bc0df7beb942eef6d3415b9b3b24c31e38eb62b`.

All 381 existing tests pass in a private source-layout fixture with the verified
repository library available. The same ten library-search failures occur on both
the unchanged baseline and refactor when that unbundled directory is absent.
This is a known distribution boundary, not a passing standalone library claim.
The new public-entrypoint tests exercise resource reads, prompt focus preservation
and planning-tool validation. Detailed fixtures and receipts remain private.

No compiled files enter the source diff. Full CI, independent review and parent
integration are still required. Earlier runtime/package branches and immutable
consumer archives remain preserved. Reconcile those fixes after this preparation;
do not release this branch as a replacement for their runtime repairs.

Rollback: revert the extraction commit. No user data or configuration changes.
