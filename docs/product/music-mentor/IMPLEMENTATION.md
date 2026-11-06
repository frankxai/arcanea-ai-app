# Music Mentor — implementation handoff and tracking

## Repository boundaries
- frankxai/arcanea-ai-app: Academy experience, practice route, user flow, exercise library, evaluation fixtures and local integration.
- frankxai/arcanea-academy: inspect prior standalone Academy implementation and consolidate only proven reusable components; do not create a parallel learner identity.
- frankxai/gencreator.ai: optional future music creation export, not a v1 dependency. Existing studio agent is browser BYOK.
- frankxai/starlightintelligence.ai: agent runtime and portable tool interface governed by estate registry; no new runtime without approved registry change.
- frankxai/agentic-ops: canonical strategy, technology decisions, WIP and release governance.

## Work breakdown
P0: confirm Academy route ownership, auth, storage and Luminor canon; P1: define reference exercise and DSP baseline; P2: implement private attempt capture, upload, job and observation API; P3: mentor feedback grounded in observations; P4: retry comparison and learner progress; P5: evaluation, security and UX review; P6: approved preview pilot.

## Tracking and evidence
Reviewed PRD/ADR/contracts in GitHub are normative. GitHub issues/PRs are execution evidence. Notion Digital Product Foundry is the human roadmap projection, not competing source of truth. Store test runs, latency, costs and measured pilot outcomes in an evidence ledger linked to the release record. Record decision changes via ADR and estate registry; do not silently rewrite approved architecture.

## Agent execution brief
Read agentic-ops STRATEGY.md and registry/projections/AGENT_BRIEF.md, repo AGENTS.md, Academy plan and Luminor config. Audit current routes and contracts. Implement one bounded vertical slice behind a feature flag. Do not merge, deploy, change billing, or publish assets. Open a separate draft implementation PR with tests, screenshots, migration plan and explicit review gates. Report blockers with paths and evidence.
